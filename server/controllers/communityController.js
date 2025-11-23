const db = require('../db');

exports.getPosts = (req, res) => {
  res.json(db.posts);
};

exports.createPost = (req, res) => {
  const post = req.body;
  db.posts.unshift(post);
  res.status(201).json({ success: true, post });
};

exports.likePost = (req, res) => {
  const { postId } = req.params;
  const { userHandle } = req.body;

  const post = db.posts.find(p => p.id === postId);
  if (post) {
      const hasLiked = post.likedBy.includes(userHandle);
      if (hasLiked) {
          post.likedBy = post.likedBy.filter(h => h !== userHandle);
      } else {
          post.likedBy.push(userHandle);
      }
      post.likes = post.likedBy.length;
      res.json({ success: true, post });
  } else {
      res.status(404).json({ success: false, message: "Post not found" });
  }
};

exports.addComment = (req, res) => {
    const { postId } = req.params;
    const comment = req.body;

    const post = db.posts.find(p => p.id === postId);
    if (post) {
        post.comments.push(comment);
        res.json({ success: true, post });
    } else {
        res.status(404).json({ success: false, message: "Post not found" });
    }
};