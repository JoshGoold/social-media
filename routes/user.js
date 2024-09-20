const User = require("../schemas/UserSchema");
const Message = require("../schemas/MessageSchema");
const Conversation = require("../schemas/ConversationSchema");


const hash = require("../js/hash");

//Bcrypt for password hashing
const bcrypt = require("bcrypt");

const express = require("express")
const userRoutes = express.Router()

//Registration endpoint
userRoutes.post("/register", async (req, res) => {
    //grab email, username, and password from the request body for account creation
    const { username, email, password } = req.body;
  
    //make sure every username is unique (makes it easier to search for users without needing id)
    const isUsernameUnique = await User.findOne({ username: username });
  
    if (username === isUsernameUnique?.username) {
      res.status(300).send({
        Message: `Username taken: ${username} is an invalid username`,
        Success: false,
      });
    } else {
      //continues script if the username chosen is unique
      try {
        //hash password to be securely stored in database
        const hashedPassword = await hash(password);
  
        //creates a new user schema / entry to database then saves the info to the database
        const user = new User({
          username: username,
          email: email,
          password: hashedPassword,
        });
  
        await user.save();
  
        console.log(
          `NEW USER UPLOADED\nUSERNAME: ${user.username}\nUSER EMAIL: ${user.email}\nUSER ID: ${user._id}\nWELCOME`
        );
        res.status(200).send({
          Message: `SUCCESSFUL REGISTRATION\nWELCOME ${user.username}\nYOUR USER ID IS: ${user._id}\nEMAIL: ${user.email}`,
          Success: true,
        });
      } catch (error) {
        console.error("ERROR: ", error.message);
        res.status(500).send({
          Message: `INTERNAL SERVER ERROR: ${error.message}`,
          Success: false,
        });
      }
    }
  });
  
  //Login endpoint
  userRoutes.post("/login", async (req, res) => {
    //username and password needed to login
    const { username, password } = req.body;
  
    try {
      //searches the database for the user with that specific username, if none returns an error message
      const user = await User.findOne({ username: username });
      if (!user) {
        return res.status(400).send({ Message: "No users found" });
      }
      //if user is found we use bcrypt compare method to see if the password matches the hashed one in database
      const isMatch = await bcrypt.compare(password, user.password);
  
      //if the password is correct you successfully log in and a user session cookie is created
      if (isMatch) {
        req.session.userObject = {
          username: user.username,
          email: user.email,
          id: String(user._id),
          objID: user._id,
          profilePic: user.profilepic,
        };
        const userobj = req.session.userObject;
  
        console.log(`LOGIN SUCESS\nWELCOME BACK ${user.username}`);
        //sends user info to front-end
        res.status(200).send({
          message: `LOGIN SUCESS. WELCOME BACK ${user.username}`,
          login: true,
          userCookie: userobj,
        });
      } else {
        res.status(400).send({ Message: "Invalid Credentials", login: false });
      }
    } catch (error) {
      console.log("Server Error %d", error.message);
      res
        .status(400)
        .send({ message: `server error: ${error.message}`, login: false });
    }
  });
  
  //create conversation endpoint
  userRoutes.post("/create-conversation", async (req, res) => {
    //to create a conversation you must choose a user to send to and send a message
    const { message, toUsername } = req.body;
  
    //checks if user is logged in, if not you cannot send a message
    if (req.session.userObject) {
      try {
        //grabs user info for both sender and recipent for conversation creation
        const user = await User.findOne({ username: toUsername });
        const your = await User.findOne({
          username: req.session.userObject.username,
        });
  
        //if no user if found sends error message
        if (!user) {
          return res.status(404).send("Recipient not found");
        }
  
        const hasConversation = await Conversation.findOne({
          participants: [user._id, your._id],
        });
  
        if (hasConversation) {
          return res
            .status(400)
            .send(`You Already have a conversation with ${user.username}`);
        }
  
        const newMessage = {
          content: message,
          sender: your._id,
        };
  
        //creates a new message schema / entry and saves it to the database with message content and sender id
        const nMessage = new Message({
          content: newMessage.content,
          sender: newMessage.sender,
        });
  
        await nMessage.save();
  
        //creates a new conversation schema / entry saves it database, adds conversation id to both recipent and sender schemas
        //also adds the first message sent in the conversation
        const conversation = new Conversation({
          participants: [newMessage.sender, user._id],
          messages: [nMessage._id],
        });
  
        user.conversations.push({
          id: conversation._id,
          participantName: your.username,
        });
  
        your.conversations.push({
          id: conversation._id,
          participantName: user.username,
        });
  
        //saves all changes to database
        await conversation.save();
        await user.save();
        await your.save();
  
        res.status(200).send({
          Message: `Message sent successfully\nto user: ${user.username}\nto id: ${user._id}\nfrom user: ${req.session.userObject.username}\nfrom id: ${req.session.userObject.id}\nMessage Content: ${message}\nConversation created\nconvo id: ${conversation._id}`,
          Success: true,
        });
      } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).send(`Internal server error: ${error.message}`);
      }
    } else {
      res.status(401).send("You must be logged in to send a message");
    }
  });
  
  // Sends session user object containing username, email, id
  userRoutes.get("/collect-cookie", (req, res) => {
    try {
      if (req.session.userObject) {
        res.status(200).send({ userCookie: req.session.userObject, valid: true });
      } else {
        res.status(400).send({ valid: false, message: "No cookie in system" });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ message: "internal server error" });
    }
  });
  
  //send message to pre existing conversation endpoint
  userRoutes.post("/send-message", async (req, res) => {
    // you need a message, conversation id, and a recipent
    const { message, toUsername, convoID } = req.body;
  
    //makes sure your logged in before sending the message
    if (req.session.userObject) {
      try {
        //creates new message entry to database and saves it
        const newMessage = new Message({
          content: message,
          sender: req.session.userObject.id,
        });
  
        await newMessage.save();
  
        //finds conversation by id given to add the message to
        const conversation = await Conversation.findById(convoID);
  
        //if no conversation is found sends error message
        if (!conversation) {
          return res.status(404).send("Conversation not found");
        }
        //if the conversation is found it adds the new message to the conversation and saves it
        conversation.messages.push(newMessage._id);
        await conversation.save();
        console.log(`message sent to conversation ${conversation._id}`)
        res.status(200).send({
          Message: `Message sent successfully\nTo user: ${toUsername}\nFrom: ${req.session.userObject.username}\nConvo ID: ${convoID}`,
          Success: true,
        });
      } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).send(`Error occurred: ${error.message}`);
      }
    } else {
      res.status(401).send("Unauthorized");
    }
  });
  
  //message history endpoint
  userRoutes.get("/message-history", async (req, res) => {
    //makes sure your logged in before grabbing the info
    if (req.session.userObject) {
      try {
        //finds your user in object in database based off your id
        const user = await User.findOne({ _id: req.session.userObject.id });
  
        //if you do not have any conversations yet sends a error message
        if (!user.conversations || user.conversations.length === 0) {
          return res.status(200).send("No conversations found.");
        }
  
        //For every existing conversation connected to your account id it will create a promise that returns
        //the conversation participant name, conversation id and all messages which have been sent in the conversation
        const convoPromises = user.conversations.map(async (convo) => {
          let output = convo.participantName;
  
          //for each instance it will find the conversation by the id given then populate it with all message ids which
          //reference the message schema and populate the conversation with them
          const conversation = await Conversation.findById(convo.id).populate(
            "messages"
          );
  
          //if no conversation with that id is found returns error message
          if (!conversation) {
            return output + "Conversation not found.\n";
          }
  
          //maps out each message which was populated within the conversation object and extracts its content and sender info
          const msgs = conversation.messages.map((msg) => {
            return `${
              msg.sender.equals(user._id) ? "You" : convo.participantName
            }: ${msg.content}`;
          });
  
          let conv = {
            head: output,
            convoID: String(convo.id),
            msgs: msgs,
          };
          //returns messages along with convo id and "output" which is just the recipent name of your conversation
          return conv;
        });
  
        //creates conversation object which stores all conversation promises
        const convos = await Promise.all(convoPromises);
  
        //sends conversations upon completion
        res.send({ convos: convos, Success: true });
      } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
      }
    } else {
      res.status(401).send("Unauthorized");
    }
  });
  
  // Server-side logout endpoint
  userRoutes.post("/logout", (req, res) => {
    // Destroy the session, which will clear the session cookie
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        res.status(500).send("Error logging out");
      } else {
        res.clearCookie("connect.sid");
        // Respond with a success message or any desired response
        res.send({ Message: "Success" });
      }
    });
  });

  module.exports = userRoutes;