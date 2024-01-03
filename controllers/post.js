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
