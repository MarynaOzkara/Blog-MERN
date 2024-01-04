import express from "express";
import mongoose from "mongoose";
import {
  registerValidation,
  loginValidation,
} from "./validations/authValidation.js";
import checkAuth from "./utils/checkAuth.js";
import { AuthController, PostController } from "./controllers/index.js";
import { postCreateValidation } from "./validations/postValidation.js";
import { upload } from "./utils/uplosd.js";
import hendleValidationErrors from "./utils/hendleValidationErrors.js";

mongoose
  .connect(
    "mongodb+srv://ozkaramaryna:8wbTGRU9P8JK6ZMQ@phonebook.d5kvzde.mongodb.net/db-blog"
  )
  .then(() => console.log("DB OK"))
  .catch((err) => console.log("DB ERR", err));

const app = express();
app.use(express.json());
app.use("/uploads", express.static("ulloads"));

app.post(
  "/auth/register",
  registerValidation,
  hendleValidationErrors,
  AuthController.register
);
app.post(
  "/auth/login",
  loginValidation,
  hendleValidationErrors,
  AuthController.login
);
app.get("/auth/me", checkAuth, AuthController.getMe);

app.post(
  "/upload",
  checkAuth,
  upload.single("image"),
  PostController.uploadImage
);

app.get("/posts", PostController.getAll);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  hendleValidationErrors,
  PostController.create
);
app.get("/posts/:id", PostController.getOne);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  hendleValidationErrors,
  PostController.update
);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK!");
});
