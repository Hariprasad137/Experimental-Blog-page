import express from "express";
import fs from "fs";
import { title } from "process";
const port = 3000;
const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  fs.readFile("posts.json", "utf-8", (err, data) => {
    if (err) throw err;
    const posts = JSON.parse(data);
    res.render("index.ejs", { posts });
  });
});
app.get("/newPost", (req, res) => {
  res.render("new.ejs");
});
app.post("/newPost", (req, res) => {
  const title = req.body["title"];
  const description = req.body["description"];
  fs.readFile("posts.json", "utf-8", (err, data) => {
    if (err) throw err;
    const posts = JSON.parse(data);
    posts.push({ id: Date.now(), title, description });
    fs.writeFile("posts.json", JSON.stringify(posts, null, 2), (err) => {
      if (err) throw err;
      res.redirect("/");
    });
  });
});
app.get("/edit/:id", (req, res) => {
  fs.readFile("posts.json", "utf-8", (err, data) => {
    if (err) throw err;
    const posts = JSON.parse(data);
    const id = parseInt(req.params.id);
    const post = posts.find((p) => p.id === id);
    if (!post) return res.send("Post not found");
    res.render("edit.ejs", { post });
  });
});
app.post("/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile("posts.json", "utf-8", (err, data) => {
    if (err) throw err;
    const posts = JSON.parse(data);
    const post = posts.find((p) => p.id === id);
    if (!post) return res.send("Post not found");
    post.title = req.body.titleChange;
    post.description = req.body.descriptionChange;
    fs.writeFile("posts.json", JSON.stringify(posts, null, 2), (err) => {
      if (err) throw err;
      res.redirect("/");
    });
  });
});
app.post("/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile("posts.json", "utf-8", (err, data) => {
    if (err) throw err;
    let posts = JSON.parse(data);
    posts = posts.filter((p) => p.id !== id);
    fs.writeFile("posts.json", JSON.stringify(posts, null, 2), (err) => {
      if (err) throw err;
      res.redirect("/");
    });
  });
});
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
