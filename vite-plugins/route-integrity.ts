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
      const result = spawnSync("node", [script], { stdio: "inherit" });
      if (result.status !== 0) {
        this.error("Route integrity check failed. See output above.");
      }
    },
  };
}
