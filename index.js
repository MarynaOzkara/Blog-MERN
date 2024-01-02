import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { registerValidation } from "./validations/authValidation.js";
import { validationResult } from "express-validator";
import UserModel from "./models/user.js";

mongoose
  .connect(
    "mongodb+srv://ozkaramaryna:8wbTGRU9P8JK6ZMQ@phonebook.d5kvzde.mongodb.net/db-blog"
  )
  .then(() => console.log("DB OK"))
  .catch((err) => console.log("DB ERR", err));

const app = express();
app.use(express.json());

app.post("/auth/register", registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      { expiresIn: "23h" }
    );
    const { passwordHash, ...userData } = user._doc;
    res.status(201).json({ ...userData, token });
  } catch (error) {
    res.status(500).json({
      message: "Registration error",
    });
  }
});
app.post("/auth/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "Login or password not valid" });
    }
  } catch (error) {}
});
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK!");
});
