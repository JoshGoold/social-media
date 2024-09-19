const mongoose = require("mongoose");

const userSchama = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    text: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: function () {
      return new Date(); // Return a new Date object
    },
  },
  following: [
    {
      id: { type: mongoose.SchemaTypes.ObjectId },
      username: { type: String },
    },
  ],
  followers: [
    {
      id: { type: mongoose.SchemaTypes.ObjectId },
      username: { type: String },
    },
  ],
  updatedAt: {
    type: Date,
    default: function () {
      return new Date(); // Return a new Date object
    },
  },
  profilepic: {
    type: String,
    default: "/profilepictures/defaultpic.png",
  },
  posts: [
    {
      postContent: {
        type: String,
      },
      postImg: {
        type: String,
      },
      createdAt: {
        type: String,
        default: function () {
          const date = new Date();
          return date.getHours() + " " + date.getFullYear();
        },
      },
      likes: [
        {
          likerId: {
            type: mongoose.SchemaTypes.ObjectId,
          },
          likerUsername: {
            type: String,
          },
        },
      ],
      comments: [
        {
          commenterId: {
            type: mongoose.SchemaTypes.ObjectId,
          },
          commenterUsername: {
            type: String,
          },
          comment: {
            type: String,
          },
        },
      ],
      tags: [
        {
          taggedId: {
            type: mongoose.SchemaTypes.ObjectId,
          },
          taggedusername: {
            type: String,
          },
        },
      ],
    },
  ],
  letters: [
    {
      letterContent: {
        type: String,
      },
      letterHead: {
        type: String,
      },
      createdAt: {
        type: String,
        default: function () {
          const date = new Date();
          return date.getHours() + " " + date.getFullYear();
        },
      },
      likes: [
        {
          likerId: {
            type: mongoose.SchemaTypes.ObjectId,
          },
          likerUsername: {
            type: String,
          },
        },
      ],
      comments: [
        {
          commenterId: {
            type: mongoose.SchemaTypes.ObjectId,
          },
          commenterUsername: {
            type: String,
          },
          comment: {
            type: String,
          },
        },
      ],
      tags: [
        {
          taggedId: {
            type: mongoose.SchemaTypes.ObjectId,
          },
          taggedusername: {
            type: String,
          },
        },
      ],
    },
  ],
  conversations: [
    {
      id: {
        type: mongoose.SchemaTypes.ObjectId,
      },
      participantName: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("User", userSchama);
