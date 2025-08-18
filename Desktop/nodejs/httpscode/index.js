// Import express
const express = require("express");
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Fake in-memory "database"
let posts = [
  { id: 1, title: "Hello World", body: "This is the first post." },
  { id: 2, title: "Another Post", body: "This is the second post." }
];

// ✅ GET - Read all posts
app.get("/posts", (req, res) => {
  res.json(posts);
});

// ✅ GET - Read one post by ID
app.get("/posts/:id", (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
});

// ✅ POST - Create a new post
app.post("/posts", (req, res) => {
  const newPost = {
    id: posts.length + 1,
    title: req.body.title,
    body: req.body.body
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});

// ✅ PUT - Update a post
app.put("/posts/:id", (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: "Post not found" });

  post.title = req.body.title || post.title;
  post.body = req.body.body || post.body;

  res.json(post);
});

// ✅ DELETE - Remove a post
app.delete("/posts/:id", (req, res) => {
  const postIndex = posts.findIndex(p => p.id === parseInt(req.params.id));
  if (postIndex === -1) return res.status(404).json({ message: "Post not found" });

  posts.splice(postIndex, 1);
  res.status(204).send();
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
