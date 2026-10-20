import { app } from "./app";
import { env } from "./libs/env";

app.listen(env.PORT ?? 8080);

export default app;
