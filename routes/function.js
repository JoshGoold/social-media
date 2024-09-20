const User = require("../schemas/UserSchema");

const quickSort = require("../js/quickSort");
const multer = require("multer");
const path = require("path");

const express = require("express")

const functionRoutes = express.Router()



//user search endpoint
//finds users based off search query regex
functionRoutes.get("/user-search", async (req, res) => {
    const searchQuery = req.query.searchQuery;
    try {
      // Case-sensitive search /RegExp(...,'i') to make insensitive/
      //
      const contains = new RegExp(searchQuery);
      const result = await User.find({ username: { $regex: contains } })
        .limit(25)
        .skip(0)
        .select("username _id");
      res.status(200).send({ Message: "Success", list: result });
    } catch (error) {
      console.error(error.message);
      res.status(400).send({ Message: "Search Failed" });
    }
  });
  
  //follow endpoint
  functionRoutes.get("/follow", async (req, res) => {
    const { username } = req.query;
    if (req.session.userObject) {
      try {
        const user = await User.findOne({ username: username });
        const you = await User.findOne({
          username: req.session.userObject.username,
        });
  
        if (!user) {
          res.status(300).send("No users found.");
        }
  
        const existingFollower = user.followers.find(
          (follower) =>
            follower.id.equals(req.session.userObject.id) ||
            follower.username === req.session.userObject.username
        );
  
        if (existingFollower) {
          res.send("You cannot follow someone twice");
          return;
        }
  
        user.followers.push({ id: you._id, username: you.username });
        you.following.push({ id: user._id, username: user.username });
  
        await user.save();
        await you.save();
  
        res.status(200).send({
          Message: `You are now following ${user.username}`,
          Success: true,
        });
      } catch (error) {
        res.status(400).send("error occurred: ", error.message);
      }
    } else {
      res.status(401).send("You must be logged in to add a friend");
    }
  });
  
  functionRoutes.get("/user-profile", async (req, res) => {
    const { username } = req.query;
  
    try {
      if (req.session.userObject) {
        const user = await User.findOne({ username: username }).select(
          "username followers following id email profilepic letters posts"
        );
  
        if (!user) {
          res.status(404).send("No users found");
        }
        res.status(200).send({
          user: {
            username: user.username,
            email: user.email,
            _id: user._id,
            followers: user.followers,
            following: user.following,
            profilepic: user.profilepic,
            letters: user.letters,
            posts: user.posts,
          },
          Success: true,
        });
        console.log("user found: ", user.username);
      } else {
        res.status(401).send("You must be logged in to view an account");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send(`Internal server error --> ${error}`);
    }
  });
  
  functionRoutes.post("/delete-letter", async (req, res) => {
    const { id } = req.body;
  
    try {
      if (req.session.userObject) {
        const user = await User.findOne({
          username: req.session.userObject.username,
        });
  
        const letter = user.letters.find((letter) => letter._id.equals(id));
  
        if (!letter) {
          res.status(404).send({ Message: "no letters found", Success: false });
        }
  
        await letter.deleteOne();
  
        await user.save();
  
        res.send({ Message: "letter deleted successfully", Success: true });
      } else {
        res.status(400).send({ Message: "Unauthorized", Success: false });
      }
    } catch (error) {
      console.error(error);
      res.send(error.message);
    }
  });
  
  functionRoutes.post("/delete-post", async (req, res) => {
    const { id } = req.body;
  
    try {
      if (req.session.userObject) {
        const user = await User.findOne({
          username: req.session.userObject.username,
        });
  
        const post = user.posts.find((post) => post._id.equals(id));
  
        if (!letter) {
          res.status(404).send({ Message: "no posts found", Success: false });
        }
  
        await post.deleteOne();
  
        await user.save();
  
        res.send({ Message: "post deleted successfully", Success: true });
      } else {
        res.status(400).send({ Message: "Unauthorized", Success: false });
      }
    } catch (error) {
      console.error(error);
      res.send(error.message);
    }
  });
  
  functionRoutes.post("/edit-letter", async (req, res) => {
    const { id, content, title } = req.body;
    try {
      if (!req.session.userObject) {
        return res.status(400).send({ Message: "Unauthorized", Success: false });
      }
      const user = await User.findOne({
        username: req.session.userObject.username,
      });
  
      if (!user) {
        return res
          .status(404)
          .send({ Message: "No users found", Success: false });
      }
  
      const letter = user.letters.find((letter) => letter._id.equals(id));
  
      if (!letter) {
        return res
          .status(404)
          .send({ Message: "No letters found", Success: false });
      }
  
      letter.letterContent = content;
      letter.letterHead = title;
  
      await user.save();
  
      res.send({ Message: "Edit success", Success: true });
    } catch (error) {
      console.error(error);
      res.status(500).send({ Message: error.message, Success: false });
    }
  });
  
  functionRoutes.post("/new-letter", async (req, res) => {
    const { title, contents } = req.body;
  
    if (req.session.userObject) {
      try {
        const user = await User.findOne({
          username: req.session.userObject.username,
        }).select("letters");
  
        if (!user) {
          return res.status(404).send("No user found");
        }
  
        user.letters.push({ letterContent: contents, letterHead: title });
        await user.save();
  
        return res
          .status(200)
          .send({ Message: "Uploaded successfully", Success: true });
      } catch (error) {
        console.error(error);
        return res.status(500).send(`Internal server error: ${error.message}`);
      }
    } else {
      return res.status(401).send("You must be logged in to post a letter");
    }
  });
  
  functionRoutes.post("/like-letter", async (req, res) => {
    const { letterId, profileUsername } = req.body;
  
    if (req.session.userObject) {
      try {
        const user = await User.findOne({ username: profileUsername });
        if (!user) {
          return res.status(404).send("User not found");
        }
  
        const letter = user.letters.find((letter) => letter.id === letterId);
        if (!letter) {
          return res.status(404).send("Letter not found");
        }
  
        const alreadyLiked = letter.likes.find(
          (like) => like.likerUsername === req.session.userObject.username
        );
        if (alreadyLiked) {
          res.status(400).send("You have already liked this letter");
          return;
        }
  
        letter.likes.push({
          likerId: req.session.userObject.id,
          likerUsername: req.session.userObject.username,
        });
        await user.save();
  
        return res
          .status(200)
          .send({ Message: "Liked letter successfully", Success: true });
      } catch (error) {
        console.error(error);
        return res.status(500).send(`Error: ${error.message}`);
      }
    } else {
      return res.status(401).send("You must be logged in to like a letter");
    }
  });
  functionRoutes.post("/comment-letter", async (req, res) => {
    const { letterId, comment, profileUsername } = req.body;
  
    if (req.session.userObject) {
      try {
        const user = await User.findOne({ username: profileUsername });
        if (!user) {
          return res.status(404).send("User not found");
        }
  
        const letter = user.letters.find((letter) => letter.id === letterId);
        if (!letter) {
          return res.status(404).send("Letter not found");
        }
  
        letter.comments.push({
          commenterId: req.session.userObject.id,
          commenterUsername: req.session.userObject.username,
          comment: comment,
        });
        await user.save();
  
        return res
          .status(200)
          .send({ Message: "Commented successfully", Success: true });
      } catch (error) {
        console.error(error);
        return res.status(500).send(`Error: ${error.message}`);
      }
    } else {
      return res.status(401).send("You must be logged in to comment on a letter");
    }
  });
  
  // Configure multer for file storage
  const ppStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "profilepictures/");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  const ppUpload = multer({ storage: ppStorage });
  
  functionRoutes.post("/new-profilepicture", ppUpload.single("img"), async (req, res) => {
    const img = req.file ? `/profilepictures/${req.file.filename}` : null;
  
    if (!req.session.userObject) {
      return res.status(401).send("Unauthorized");
    }
  
    try {
      const user = await User.findOne({
        username: req.session.userObject.username,
      });
  
      if (!user) {
        return res.status(404).send("No user found");
      }
  
      // Update profile picture
      user.profilepic = img;
  
      // Save the updated user
      await user.save();
  
      // Send success response
      return res
        .status(200)
        .send({ Message: "Profile picture updated successfully", Success: true });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ Message: "Internal server error", Success: false });
    }
  });
  
  // Configure multer for file storage
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/"); // Save files in 'uploads/' folder
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
    },
  });
  const upload = multer({ storage: storage });
  
  functionRoutes.post("/new-post", upload.single("img"), async (req, res) => {
    const { description } = req.body;
    const img = req.file ? `/uploads/${req.file.filename}` : null; // Path for accessing the uploaded image
  
    if (req.session.userObject) {
      try {
        const user = await User.findOne({
          username: req.session.userObject.username,
        }).select("posts");
  
        if (!user) {
          return res.status(404).send("No user found");
        }
  
        // Push the post with the image URL to the user's posts
        user.posts.push({ postImg: img, postContent: description });
        await user.save();
  
        return res.status(200).send("Successfully uploaded post");
      } catch (error) {
        console.error(error);
        return res.status(500).send(`Error occurred: ${error.message}`);
      }
    } else {
      return res.status(401).send("You must be logged in to add a new post");
    }
  });
  
  functionRoutes.post("/like-post", async (req, res) => {
    const { postId, profileUsername } = req.body;
  
    if (req.session.userObject) {
      try {
        const user = await User.findOne({ username: profileUsername });
        if (!user) {
          return res.status(404).send("User not found");
        }
  
        const post = user.posts.find((post) => post._id === postId);
        if (!post) {
          return res.status(404).send("Post not found");
        }
  
        // Prevent duplicate likes
        const alreadyLiked = post.likes.find(
          (like) => like.likerUsername === req.session.userObject.username
        );
        if (alreadyLiked) {
          res.status(400).send("You have already liked this post");
          return;
        }
  
        post.likes.push({
          likerId: req.session.userObject.id,
          likerUsername: req.session.userObject.username,
        });
        await user.save();
  
        return res
          .status(200)
          .send({ Message: "Liked post successfully", Success: true });
      } catch (error) {
        console.error(error);
        return res.status(500).send(`Error: ${error.message}`);
      }
    } else {
      return res.status(401).send("You must be logged in to like a post");
    }
  });
  
  functionRoutes.post("/comment-post", async (req, res) => {
    const { postId, comment, profileUsername } = req.body;
  
    if (req.session.userObject) {
      try {
        const user = await User.findOne({ username: profileUsername });
        if (!user) {
          return res.status(404).send("User not found");
        }
  
        const post = user.posts.find((post) => post._id === postId);
        if (!post) {
          return res.status(404).send("Post not found");
        }
  
        post.comments.push({
          commenterId: req.session.userObject.id,
          commenterUsername: req.session.userObject.username,
          comment: comment,
        });
  
        await user.save();
  
        return res
          .status(200)
          .send({ Message: "Commented successfully", Success: true });
      } catch (error) {
        console.error(error);
        return res.status(500).send(`Error: ${error.message}`);
      }
    } else {
      return res.status(401).send("You must be logged in to comment on a post");
    }
  });
  
  functionRoutes.get("/home-feed", async (req, res) => {
    if (req.session.userObject) {
      try {
        const user = await User.findOne({
          username: req.session.userObject.username,
        });
        if (!user) return res.status(404).send("No users found");
  
        let posts = [];
  
        for (const followee of user.following) {
          let u = await User.findOne({ username: followee.username }).populate(
            "posts letters username"
          );
          if (u) {
            if (u.posts && u.posts.length > 0) {
              u.posts.forEach((post) =>
                posts.push({ ...post.toObject(), username: u.username })
              );
            }
            if (u.letters && u.letters.length > 0) {
              u.letters.forEach((letter) =>
                posts.push({ ...letter.toObject(), username: u.username })
              );
            }
          }
        }
        const sortedPosts = quickSort(posts);
  
        res.status(200).send({ Success: true, feed: sortedPosts });
      } catch (error) {
        res.status(500).send(`Internal Server Error --> ${error.message}`);
      }
    } else {
      res.status(400).send("You must be logged in");
    }
  });

  module.exports = functionRoutes;