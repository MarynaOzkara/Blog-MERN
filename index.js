import express from "express";
import mongoose from "mongoose";
import {
  registerValidation,
  loginValidation,
} from "./validations/authValidation.js";
import checkAuth from "./utils/checkAuth.js";
import { getMe, login, register } from "./controllers/auth.js";
import { create, getAll, getOne } from "./controllers/post.js";
import { postCreateValidation } from "./validations/postValidation.js";

mongoose
  .connect(
    "mongodb+srv://ozkaramaryna:8wbTGRU9P8JK6ZMQ@phonebook.d5kvzde.mongodb.net/db-blog"
  )
  .then(() => console.log("DB OK"))
  .catch((err) => console.log("DB ERR", err));

const app = express();
app.use(express.json());

app.post("/auth/register", registerValidation, register);
app.post("/auth/login", loginValidation, login);
app.get("/auth/me", checkAuth, getMe);

app.get("/posts", getAll);
app.get("/posts/:id", getOne);
app.post("/posts", checkAuth, postCreateValidation, create);
// app.delete("/posts/:id");
// app.patch("/posts");

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK!");
});
