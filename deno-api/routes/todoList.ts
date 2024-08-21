import { getDb } from "../helpers/db_client.ts";
import { Router } from "https://deno.land/x/oak@v16.1.0/mod.ts";
import { Context } from "https://deno.land/x/oak@v16.1.0/context.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.33.0/mod.ts";

const router = new Router();

type Todo = {
  id?: string;
  text: string;
  createAt?: string;
  updateAt?: string;
};

let todoList: Todo[] = [];

const errorResMsg = (err: { message: any }, ctx: Context) => {
  if (err.message) {
    ctx.response.body = { error: err.message };
    return;
  }
  ctx.response.body = { error: "server error" };
};

router.get("/todoList", async (ctx) => {
  const getTodoList = await getDb().collection("todoList").find().toArray();
  // 将游标转换为数组
  ctx.response.body = { todoList: getTodoList };
});
router.post("/todoList", async (ctx) => {
  try {
    const body = await ctx.request.body;
    const data = await body.json();
    const newTodo: Todo = {
      createAt: new Date().toISOString(),
      text: data.text,
    };
    if (!data.text) {
      throw new Error("Did not got the todo text.");
    }

    const id = await getDb().collection("todoList").insertOne(newTodo);
    newTodo.id = id.$oid;

    // todoList.push(newTodo);
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
    const findArr = await getDb().collection("todoList").find({
      _id: new ObjectId(tid),
    })
      .toArray();
    if (!findArr.length) {
      throw new Error("Todo id not found");
    }

    // update todo text to db
    await getDb().collection("todoList").updateOne({
      _id: new ObjectId(tid),
    }, { $set: { text: data.text, updateAt: new Date().toISOString() } });

    ctx.response.body = { message: "Update todo!" };
  } catch (err) {
    errorResMsg(err, ctx);
  }
});

router.delete("/todoList/:todoId", async (ctx) => {
  try {
    const tid = ctx.params.todoId;
    const findArr = await getDb().collection("todoList").find({
      _id: new ObjectId(tid),
    }).toArray();
    if (!findArr.length) {
      throw new Error("Todo id not found");
    }

    // delete todo to db
    await getDb().collection("todoList").deleteOne({
      _id: new ObjectId(tid),
    });

    ctx.response.body = { message: "Deleted todo!" };
  } catch (err) {
    errorResMsg(err, ctx);
  }
});

export default router;
