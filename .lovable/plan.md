

## Verify EIDETIC Autopilot End-to-End

You'll do the click; I'll verify the data. Here's the exact flow:

### Steps

1. **You**: Open `/admin/eidetic` (or wherever EIDETIC is mounted) → find the **Autopilot** card → click **Run Autopilot Now**.
2. **You**: Wait for the toast (`Autopilot processed N memories...`).
3. **Me**: Query `eidetic_autopilot_runs` to confirm the row, check `status`, `footprints_processed`, `footprints_changed`, `anomalies_detected`, and any `error_message`.
4. **Me**: Pull `eidetic-autopilot` edge function logs to confirm clean execution and surface any per-footprint errors.
5. **Me**: Spot-check `memory_footprints` for fresh `last_autopilot_at`, `ai_scored_at`, `embedded_at`, and populated `sentiment_trajectory`.
6. **Me**: Confirm `cron.job` row exists for `eidetic-autopilot-6h` so the 6h schedule is live.

### What I'll report back

- Row presence + status (completed / failed)
- Counts (processed / changed / anomalies)
- Any error_message or log-level errors
- Cron job active = true / next run time
- Whether footprint-level fields actually updated

### If issues surface

- Empty processed count → likely no active footprints due for recheck (cutoff = 6h). Fix: temporarily lower `RECHECK_HOURS` or null out `last_autopilot_at` on a test row.
- `failed` status → I'll read `error_message` and edge logs, then propose a targeted fix.
- Cron job missing → re-run the schedule SQL.

### Ready

Click the button now. Reply when the toast fires and I'll run the verification queries immediately.

