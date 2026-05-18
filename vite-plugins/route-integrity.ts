import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import type { Plugin } from "vite";

/**
 * Vite plugin that runs the route integrity check during `vite build`.
 * Fails the build if any route or page is unreachable.
 */
export function routeIntegrityPlugin(): Plugin {
  return {
    name: "route-integrity",
    apply: "build",
    buildStart() {
      const script = resolve(process.cwd(), "scripts/check-route-integrity.mjs");
      const result = spawnSync(process.execPath, [script], {
        cwd: process.cwd(),
        encoding: "utf8",
      });

      if (result.stdout) process.stdout.write(result.stdout);
      if (result.stderr) process.stderr.write(result.stderr);

      if (result.error || result.status !== 0) {
        const details = [
          result.error ? `Execution error: ${result.error.message}` : null,
          `Exit status: ${result.status ?? "unknown"}`,
          result.signal ? `Signal: ${result.signal}` : null,
          result.stdout?.trim() ? `\nstdout:\n${result.stdout.trim()}` : null,
          result.stderr?.trim() ? `\nstderr:\n${result.stderr.trim()}` : null,
        ]
          .filter(Boolean)
          .join("\n");

        this.error(`Route integrity check failed.\n${details}`);
      }
    },
  };
}
