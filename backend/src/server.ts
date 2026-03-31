import { createApp } from "./app.js";
import { startScheduler } from "./scheduler.js";
const app = createApp();

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
  startScheduler();
});
