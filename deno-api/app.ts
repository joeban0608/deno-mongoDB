// https://deno.land/x/oak@v16.1.0
import { Application } from "https://deno.land/x/oak@v16.1.0/mod.ts";
import todoRoutes from "./routes/todoList.ts";
const app = new Application();

app.use(async (ctx, next) => {
  console.log("Middleware!!");
  await next();
});

// handle cors
app.use(async (ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  await next();
});

app.use(todoRoutes.routes());
app.use(todoRoutes.allowedMethods());

await app.listen({ port: 8000 });
