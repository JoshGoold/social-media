//Express server
const express = require("express")
//.env for security of variables
const dotenv = require("dotenv")
//MongoDB database
const mongoose = require("mongoose")
//Bcrypt for password hashing
const bcrypt = require("bcrypt")
//Express session for session cookies
const session = require("express-session");
//cookie parser to parse cookies
const cookieParser = require("cookie-parser");
//cors so you can only make calls from a specific endpoint
const cors = require("cors");
const bodyParser = require("body-parser");
//password hashing script 
const hash = require("./js/hash")
const multer = require("multer")
const fs = require('fs');
//database schemas
const User = require('./schemas/UserSchema')
const Message = require("./schemas/MessageSchema")
const Conversation = require("./schemas/ConversationSchema") 
const path = require('path');
const { preview } = require("vite");
//configure .env files for security
dotenv.config()
//set express server to app variable to configure environment
const app = express()
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));
app.use('/profilepictures', express.static('profilepictures'));

//parses data to json format 
app.use(express.json());
//sets strict origin of calls to be from local host port
app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(bodyParser.json());
//set up session ccokies to be secure and safe withy max age of 1 day
app.use(
    session({
      secret: "secret", // secret key used to encrypt the session cookie
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 48,
        //set session cookie properties
      },
    })
  );


//Connect to mongodb cluster
mongoose
.connect(process.env.DB_CONNECT)
.then(()=>{
    console.log('DATABASE INITIALIZED')
    //Start node js server after database connects
    app.listen(process.env.SERVER_PORT, ()=>{
        console.log(`SERVER STARTED ON PORT: ${process.env.SERVER_PORT}`)
    })
})
.catch((e)=>{
    console.log("DATABASE FAILURE: ",e.message)
})


app.get("/", (req, res)=>{
    try {
        res.status(200).send(`Welcome to nodejs-project1`)
    } catch (error) {
        console.log(error.message)
    }
})

//Registration endpoint
app.post("/register", async (req, res) => {
    //grab email, username, and password from the request body for account creation
    const { username, email, password } = req.body;

    //make sure every username is unique (makes it easier to search for users without needing id)
    const isUsernameUnique = await User.findOne({username: username})

    if(username === isUsernameUnique?.username){
        res.status(300).send({Message:`Username taken: ${username} is an invalid username`, Success: false})
    }
    else{ //continues script if the username chosen is unique
        try {
            //hash password to be securely stored in database
            const hashedPassword = await hash(password);
            
            //creates a new user schema / entry to database then saves the info to the database
            const user = new User({
              username: username,
              email: email,
              password: hashedPassword
            });
        
            await user.save();
        

            console.log(`NEW USER UPLOADED\nUSERNAME: ${user.username}\nUSER EMAIL: ${user.email}\nUSER ID: ${user._id}\nWELCOME`);
            res.status(200).send({Message:`SUCCESSFUL REGISTRATION\nWELCOME ${user.username}\nYOUR USER ID IS: ${user._id}\nEMAIL: ${user.email}`, Success: true});
          } catch (error) {

            console.error('ERROR: ', error.message);
            res.status(500).send({Message: `INTERNAL SERVER ERROR: ${error.message}`, Success: false});
          }
    }
  });

  //Login endpoint
app.post("/login", async (req,res)=>{
    //username and password needed to login
    const {username, password} = req.body;

    try {
        //searches the database for the user with that specific username, if none returns an error message
      const user = await User.findOne({username: username});
      if (!user) {
        return res.status(400).send({ Message: "No users found" });
      }
      //if user is found we use bcrypt compare method to see if the password matches the hashed one in database
      const isMatch = await bcrypt.compare(password, user.password)

      //if the password is correct you successfully log in and a user session cookie is created
      if(isMatch){
        req.session.userObject = {
            username: user.username,
            email: user.email,
            id: String(user._id),
            objID: user._id
        }
        const userobj = req.session.userObject;

        console.log(`LOGIN SUCESS\nWELCOME BACK ${user.username}`)
        //sends user info to front-end 
        res.status(200).send({
            message: `LOGIN SUCESS. WELCOME BACK ${user.username}`,
            login: true,
            userCookie: userobj
        })
      }else {
        res.status(400).send({ Message: "Invalid Credentials", login: false });
      }
    } catch (error) {
        console.log('Server Error %d', error.message)
        res.status(400).send({message: `server error: ${error.message}`, login: false})
    }
})

//create conversation endpoint 
app.post("/create-conversation", async (req, res) => {
    //to create a conversation you must choose a user to send to and send a message
    const { message, toUsername } = req.body;

    //checks if user is logged in, if not you cannot send a message
    if (req.session.userObject) {
        try {
            //grabs user info for both sender and recipent for conversation creation
            const user = await User.findOne({ username: toUsername });
            const your = await User.findOne({username: req.session.userObject.username})

            //if no user if found sends error message
            if (!user) {
                return res.status(404).send("Recipient not found");
            }

            const hasConversation = await Conversation.findOne({participants: [user._id, your._id]})

            if(hasConversation){
                return res.status(400).send(`You Already have a conversation with ${user.username}`)
            }

            const newMessage = {
                content: message,
                sender: your._id
            };

            //creates a new message schema / entry and saves it to the database with message content and sender id
            const nMessage = new Message({content: newMessage.content, sender: newMessage.sender})

            await nMessage.save();

            //creates a new conversation schema / entry saves it database, adds conversation id to both recipent and sender schemas
            //also adds the first message sent in the conversation
            const conversation = new Conversation({participants: [newMessage.sender, user._id], messages: [nMessage._id]})

            user.conversations.push({
                id: conversation._id,
                participantName: your.username
            });

            your.conversations.push({
                id: conversation.id,
                participantName: user.username
            })

            //saves all changes to database
            await conversation.save();
            await user.save();
            await your.save();


            res.status(200).send({Message:`Message sent successfully\nto user: ${user.username}\nto id: ${user._id}\nfrom user: ${req.session.userObject.username}\nfrom id: ${req.session.userObject.id}\nMessage Content: ${message}\nConversation created\nconvo id: ${conversation._id}`, Success: true});
        } catch (error) {
            console.error(`Error: ${error.message}`);
            res.status(500).send(`Internal server error: ${error.message}`);
        }
    } else {
        res.status(401).send("You must be logged in to send a message");
    }
});

// Sends session user object containing username, email, id
app.get("/collect-cookie", (req, res)=>{
    try {
        if(req.session.userObject){
            res.status(200).send({userCookie: req.session.userObject, valid: true})
        } else{
            res.status(400).send({valid: false, message: "No cookie in system"})
        }
    } catch (error) {
        console.error(error.message)
        res.status(500).send({message: "internal server error"})
    }  
})

//send message to pre existing conversation endpoint
app.post("/send-message", async (req, res) => {
    // you need a message, conversation id, and a recipent
    const { message, toUsername, convoID } = req.body;

    //makes sure your logged in before sending the message
    if (req.session.userObject) {
        try {
  
            //creates new message entry to database and saves it
            const newMessage = new Message({
                content: message,
                sender: req.session.userObject.id
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

            res.status(200).send({Message:`Message sent successfully\nTo user: ${toUsername}\nFrom: ${req.session.userObject.username}\nConvo ID: ${convoID}`,Success:true});
        } catch (error) {
            console.error(`Error: ${error.message}`);
            res.status(500).send(`Error occurred: ${error.message}`);
        }
    } else {
        res.status(401).send("Unauthorized");
    }
});

//message history endpoint
app.get("/message-history", async (req, res) => {
    //makes sure your logged in before grabbing the info
    if (req.session.userObject) {
        try {
            let cID;
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
                cID = convo.id;

                //for each instance it will find the conversation by the id given then populate it with all message ids which
                //reference the message schema and populate the conversation with them
                const conversation = await Conversation.findById(convo.id).populate('messages');

                //if no conversation with that id is found returns error message
                if (!conversation) {
                    return output + "Conversation not found.\n";
                }

                //maps out each message which was populated within the conversation object and extracts its content and sender info
                const msgs = conversation.messages.map((msg) => {
                    return `${msg.sender.equals(user._id) ? 'You' : convo.participantName}: ${msg.content}`;
                });

                let conv = {
                    head: output,
                    convoID: cID,
                    msgs: msgs
                }
                //returns messages along with convo id and "output" which is just the recipent name of your conversation
                return conv;
            });

            //creates conversation object which stores all conversation promises
            const convos = await Promise.all(convoPromises);

            //sends conversations upon completion
            res.send({convos:convos, Success: true});
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred");
        }
    } else {
        res.status(401).send("Unauthorized");
    }
});

 // Server-side logout endpoint
 app.post("/logout", (req, res) => {
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

//user search endpoint
//finds users based off search query regex
  app.get("/user-search", async (req, res) => {
    const searchQuery = req.query.searchQuery; 
    try {
    // Case-sensitive search /RegExp(...,'i') to make insensitive/
    //
      const contains = new RegExp(searchQuery); 
      const result = await User.find({ username: { $regex: contains } }).limit(25).skip(0).select("username _id");
      res.status(200).send({ Message: "Success", list: result });
    } catch (error) {
      console.error(error.message);
      res.status(400).send({ Message: "Search Failed" });
    }
});

//follow endpoint
app.get("/follow", async (req,res)=>{
    const {username} = req.query;
    if(req.session.userObject){
    try {
        const user = await User.findOne({username: username})
        const you = await User.findOne({username: req.session.userObject.username})

        if(!user){
            res.status(300).send("No users found.")
        }

      const existingFollower =  user.followers.find(follower => 
        follower.id.equals(req.session.userObject.id) || 
        follower.username === req.session.userObject.username     
        )

        if(existingFollower){
            res.send("You cannot follow someone twice" )
            return;
        }

        user.followers.push({id: you._id, username: you.username})
        you.following.push({id: user._id, username: user.username})

        await user.save()
        await you.save()

        res.status(200).send({Message: `You are now following ${user.username}`, Success: true})

    } catch (error) {
        res.status(400).send("error occurred: ",error.message)
    }
    } else {
        res.status(401).send("You must be logged in to add a friend")
    }
})



app.get("/user-profile", async (req,res)=>{
    const {username} = req.query;

    try {
        if(req.session.userObject){
            const user = await User.findOne({username:username}).select("username followers following id email profilepic letters posts")

            if(!user){
                res.status(404).send("No users found")
            }
            res.status(200).send({user:{
                username: user.username,
                email: user.email,
                _id: user._id,
                followers: user.followers,
                following: user.following,
                profilepic: user.profilepic,
                letters: user.letters,
                posts: user.posts
            }, Success: true})
            console.log("user found: ",user.username)
        
        } else{
            res.status(401).send("You must be logged in to view an account")
        }
    } catch (error) {
        
    }
})

app.post("/delete-letter", async (req,res)=>{
    const {id} = req.body;

    try {
        if(req.session.userObject){
            const user = await User.findOne({username: req.session.userObject.username})
    
            const letter = user.letters.find(letter => letter._id.equals(id))

            if(!letter){
                res.status(404).send({Message: "no letters found", Success: false})
            }
    
            await letter.deleteOne()

            await user.save()

            res.send({Message: "letter deleted successfully", Success: true})
        } else{
            res.status(400).send({Message: "Unauthorized", Success: false})
        }
    } catch (error) {
        console.error(error)
        res.send(error.message)
    }
    
})

app.post("/delete-post", async (req,res)=>{
    const {id} = req.body;

    try {
        if(req.session.userObject){
            const user = await User.findOne({username: req.session.userObject.username})
    
            const post = user.posts.find(post => post._id.equals(id))

            if(!letter){
                res.status(404).send({Message: "no posts found", Success: false})
            }
    
            await post.deleteOne()

            await user.save()

            res.send({Message: "post deleted successfully", Success: true})
        } else{
            res.status(400).send({Message: "Unauthorized", Success: false})
        }
    } catch (error) {
        console.error(error)
        res.send(error.message)
    }
    
})

app.post("/edit-letter", async (req,res)=>{
    const {id, content, title} = req.body;
    try {
        if(!req.session.userObject){
            return res.status(400).send({Message: "Unauthorized", Success: false})
        }
        const user = await User.findOne({username: req.session.userObject.username})

        if(!user){
            return res.status(404).send({Message: "No users found", Success: false})
        }

        const letter = user.letters.find(letter => letter._id.equals(id))

        if(!letter){
            return res.status(404).send({Message: "No letters found", Success: false})
        }

        letter.letterContent = content;
        letter.letterHead = title;

        await user.save()

        res.send({Message: "Edit success", Success: true})

    } catch (error) {
        console.error(error)
        res.status(500).send({Message: error.message, Success: false})
    }
    
})

app.post("/new-letter", async (req, res) => {
    const { title, contents } = req.body;

    if (req.session.userObject) {
        try {
            const user = await User.findOne({ username: req.session.userObject.username }).select("letters");

            if (!user) {
                return res.status(404).send("No user found");
            }

            user.letters.push({ letterContent: contents, letterHead: title });
            await user.save();

            return res.status(200).send({Message: "Uploaded successfully", Success: true});
        } catch (error) {
            console.error(error);
            return res.status(500).send(`Internal server error: ${error.message}`);
        }
    } else {
        return res.status(401).send("You must be logged in to post a letter");
    }
});

app.post("/like-letter", async (req, res) => {
    const { letterId, profileUsername } = req.body;

    if (req.session.userObject) {
        try {
            const user = await User.findOne({ username: profileUsername });
            if (!user) {
                return res.status(404).send("User not found");
            }

            const letter = user.letters.find(letter => letter.id === letterId);
            if (!letter) {
                return res.status(404).send("Letter not found");
            }

            const alreadyLiked = letter.likes.find(like => like.likerUsername === req.session.userObject.username);
            if (alreadyLiked) {
                res.status(400).send("You have already liked this letter")
                return;
            }

            letter.likes.push({ likerId: req.session.userObject.id, likerUsername: req.session.userObject.username });
            await user.save();

            return res.status(200).send({Message: "Liked letter successfully", Success: true});
        } catch (error) {
            console.error(error);
            return res.status(500).send(`Error: ${error.message}`);
        }
    } else {
        return res.status(401).send("You must be logged in to like a letter");
    }
});
app.post("/comment-letter", async (req, res) => {
    const { letterId, comment, profileUsername } = req.body;

    if (req.session.userObject) {
        try {
            const user = await User.findOne({ username: profileUsername });
            if (!user) {
                return res.status(404).send("User not found");
            }

            const letter = user.letters.find(letter => letter.id === letterId);
            if (!letter) {
                return res.status(404).send("Letter not found");
            }

            letter.comments.push({
                commenterId: req.session.userObject.id,
                commenterUsername: req.session.userObject.username,
                comment: comment
            });
            await user.save();

            return res.status(200).send({Message: "Commented successfully", Success: true});
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
        cb(null, 'profilepictures/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const ppUpload = multer({ storage: ppStorage });

app.post("/new-profilepicture", ppUpload.single('img'), async (req, res) => {
    const img = req.file ? `/profilepictures/${req.file.filename}` : null;

    if (!req.session.userObject) {
        return res.status(401).send("Unauthorized");
    }

    try {
        const user = await User.findOne({ username: req.session.userObject.username });

        if (!user) {
            return res.status(404).send("No user found");
        }

        // Update profile picture
        user.profilepic = img;

        // Save the updated user
        await user.save();

        // Send success response
        return res.status(200).send({ Message: "Profile picture updated successfully", Success: true });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ Message: "Internal server error", Success: false });
    }
});

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Save files in 'uploads/' folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
    }
});
const upload = multer({ storage: storage });

app.post("/new-post", upload.single('img'), async (req, res) => {
    const { description } = req.body;
    const img = req.file ? `/uploads/${req.file.filename}` : null; // Path for accessing the uploaded image

    if (req.session.userObject) {
        try {
            const user = await User.findOne({ username: req.session.userObject.username }).select("posts");

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

app.post("/like-post", async (req, res) => {
    const { postId, profileUsername } = req.body;

    if (req.session.userObject) {
        try {
            const user = await User.findOne({ username: profileUsername });
            if (!user) {
                return res.status(404).send("User not found");
            }

            const post = user.posts.find(post => post.id === postId);
            if (!post) {
                return res.status(404).send("Post not found");
            }

            // Prevent duplicate likes
            const alreadyLiked = post.likes.find(like => like.likerUsername === req.session.userObject.username);
            if (alreadyLiked) {
                res.status(400).send("You have already liked this post")
                return ;
            }

            post.likes.push({ likerId: req.session.userObject.id, likerUsername: req.session.userObject.username });
            await user.save();

            return res.status(200).send({Message:"Liked post successfully", Success: true});
        } catch (error) {
            console.error(error);
            return res.status(500).send(`Error: ${error.message}`);
        }
    } else {
        return res.status(401).send("You must be logged in to like a post");
    }
});

app.post("/comment-post", async (req, res) => {
    const { postId, comment, profileUsername } = req.body;

    if (req.session.userObject) {
        try {
            const user = await User.findOne({ username: profileUsername });
            if (!user) {
                return res.status(404).send("User not found");
            }

            const post = user.posts.find(post => post.id === postId);
            if (!post) {
                return res.status(404).send("Post not found");
            }

            post.comments.push({
                commenterId: req.session.userObject.id,
                commenterUsername: req.session.userObject.username,
                comment: comment
            });

            await user.save();

            return res.status(200).send({Message: "Commented successfully", Success: true});
        } catch (error) {
            console.error(error);
            return res.status(500).send(`Error: ${error.message}`);
        }
    } else {
        return res.status(401).send("You must be logged in to comment on a post");
    }
});

