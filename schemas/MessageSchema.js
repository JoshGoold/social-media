const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    content: {
      type: String,
      required: true,
    },
    sender: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'User' }, // Reference user schema
    createdAt: {
      type: Date,
      immutable: true,
      default: function () {
        return new Date(); 
      },
    },
  });
  
  const Message = mongoose.model('Message', messageSchema);

  module.exports = Message;