const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.SchemaTypes.ObjectId, required: true }],
  messages: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Message" }], // Reference message schema
  createdAt: {
    type: Date,
    immutable: true,
    default: function () {
      return new Date(); // Return a new Date object
    },
  },
});

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
