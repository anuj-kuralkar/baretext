import { app } from "./app";
import { env } from "./libs/env";

app.listen(env.PORT);

export default app;
