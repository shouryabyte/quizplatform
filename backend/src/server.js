import { env } from "./config/env.js";
import { connectDb } from "./db/connect.js";
import { createApp } from "./app.js";

async function main() {
  await connectDb(env.MONGODB_URI);

  const app = createApp();
  app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend listening on http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

