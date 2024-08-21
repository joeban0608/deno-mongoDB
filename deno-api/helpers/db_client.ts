import {
  Database,
  MongoClient,
} from "https://deno.land/x/mongo@v0.33.0/mod.ts";
const userName = "joeban";
const password = "123456";
const dbName = "mongo";

let db: Database;
export const connectDb = async () => {
  const client = new MongoClient();

  // Connecting to a Local Database
  // await client.connect("mongodb://127.0.0.1:27017");
  // Connect using local MongoDB with authentication
  await client.connect({
    db: dbName,
    tls: false, // Set to true if you are using TLS
    servers: [
      {
        host: "127.0.0.1",
        port: 27017,
      },
    ],
    credential: {
      username: userName,
      password: password,
      db: "admin", // The database where user credentials are stored
      mechanism: "SCRAM-SHA-1",
    },
  });
  // Connect using srv url
  // await client.connect(
  //   `mongodb+srv://joeanddaneil5:${password}@cluster0.8tvih.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
  // );
  db = client.database(dbName);
  db.createCollection("todoList");
};

export const getDb = () => {
  return db;
};

// Defining schema interface
// interface TodoSchema {
//   _id: ObjectId;
//   text: string;
// }

// const todoList = db.collection<TodoSchema>("todoList");
