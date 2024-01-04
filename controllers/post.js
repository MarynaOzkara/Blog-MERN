import PostModel from "../models/post.js";

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("author").exec();
    res.json(posts);
  } catch (error) {
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    // console.log(req.params);
    const postId = req.params.id;
    const post = await PostModel.findByIdAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      { new: true }
    );
    if (!post) {
      return res.status(404).json({
        message: "Статья не найдена",
      });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};
export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      author: req.userId,
    });

    const post = await doc.save();
    res.status(201).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось создать статью",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const { postId } = req.params;
    const result = await PostModel.findOneAndDelete(postId);
    if (!result) {
      return res.status(404).json({
        message: "Статья не найдена",
      });
    }
    res.json({ message: "Статья удалена" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось создать статью",
    });
  }
};

export const update = async (req, res) => {
  try {
    const { postId } = req.params;
    const body = req.body;
    const updatePost = await PostModel.findOneAndUpdate(postId, body, {
      new: true,
    });
    if (!updatePost) {
      return res.status(404).json({
        message: "Статья не найдена",
      });
    }
    res.json(updatePost);
  } catch (error) {
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};
export const uploadImage = (req, res) => {
  try {
    // console.log(req.file);
    res.json({
      url: `/uploads/${req.file.originalname}`,
    });
  } catch (error) {}
};
