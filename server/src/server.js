import app from "./app.js";
import { env } from "./config/env.js";
import { runExpiryCleanup } from "./jobs/expiryCleanup.job.js";

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});

setInterval(() => {
  runExpiryCleanup().catch(console.error);
}, 30 * 1000);
