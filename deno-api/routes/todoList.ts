import { Router } from "https://deno.land/x/oak@v16.1.0/mod.ts";
import { Context } from "https://deno.land/x/oak@v16.1.0/context.ts";

const router = new Router();

type Todo = {
  id: string;
  text: string;
};

let todoList: Todo[] = [];

const errorResMsg = (err: { message: any }, ctx: Context) => {
  if (err.message) {
    ctx.response.body = { error: err.message };
    return;
  }
  ctx.response.body = { error: "server error" };
};

router.get("/todoList", (ctx) => {
  ctx.response.body = { todoList: todoList };
});
router.post("/todoList", async (ctx) => {
  try {
    const body = await ctx.request.body;
    const data = await body.json();
    const newTodo: Todo = {
      id: new Date().toISOString(),
      text: data.text,
    };
    if (!data.text) {
      console.log("here");
      throw new Error("Did not got the todo text.");
    }

    todoList.push(newTodo);
    ctx.response.body = { message: "Create todo!", todo: newTodo };
  } catch (err) {
    errorResMsg(err, ctx);
  }
});

router.put("/todoList/:todoId", async (ctx) => {
  try {
    const tid = ctx.params.todoId;
    const body = await ctx.request.body;
    const data = await body.json();
    const todoIndex = todoList.findIndex((todo) => {
      return todo.id === tid;
    });
    if (todoIndex < 0) {
      throw new Error("Todo id not found");
    }
    todoList[todoIndex] = { id: todoList[todoIndex].id, text: data.text };
    ctx.response.body = { message: "Update todo!" };
  } catch (err) {
    errorResMsg(err, ctx);
  }
});

router.delete("/todoList/:todoId", (ctx) => {
  try {
    const tid = ctx.params.todoId;
    const todoIndex = todoList.findIndex((todo) => {
      return todo.id === tid;
    });
    if (todoIndex < 0) {
      throw new Error("Todo id not found");
    }
    todoList = todoList.filter((todo) => todo.id !== tid);
    ctx.response.body = { message: "Deleted todo!" };
  } catch (err) {
    errorResMsg(err, ctx);
  }
});

export default router;
