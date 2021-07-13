const express = require("express");
const mongoose = require("mongoose"); // a package for communicating with MongoDB
const cookieParser = require("cookie-parser");
const cors = require("cors");

const Users = require("./users");//because we want a local file, we need to use ./
const Messages = require("./Message");//because we want a local file, we need to use ./
const Chats=require("./chat");

// Initializing Server
const app = express(); // express is a function that returns an instance
app.use(express.json()); // this makes it easier to process JSON requests

app.listen(process.env.PORT || 8080, () =>
  console.log("Our server is listening"));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    AccessControlAllowMethods: "GET, POST, PUT"
  })
);
app.use(cookieParser());

//const mongoURL= process.env.WHATSAPP_DB;

const mongoURL = "mongodb+srv://yizako:wadb1234@cluster0.o82ju.mongodb.net/test";

mongoose.set("useUnifiedTopology", true);

mongoose
  .connect(mongoURL, { useNewUrlParser: true })
  .then(() => console.log("connected to MongoDB"))
  .catch((err) => console.error(err));
  
  app.get("/", (req, res) => {
    res.write("<h1>Welcome to my WhatsApp!</h1>");
    res.end();
  });
  app.get("/api/users", Users.getAll); 
 
   app.get("/api/users/:id", Users.getById);
  
  app.get("/api/me", Users.getLoggedUserByCookie);
  
    app.post("/api/users", Users.createNew);
    
   app.put("/api/users/:id", Users.update);
  
   app.delete("/api/users/:id", Users.delete);
 
   app.get("/api/messages", Messages.getAll); 
 
   app.get("/api/messages/:id", Messages.getById);
 
  app.post("/api/messages", Messages.createNew);
 
   app.put("/api/messages/:id", Messages.update);
  
  app.delete("/api/messages/:id", Messages.delete);
  
  app.get("/api/chats", Chats.getAll);
 
   app.get("/api/chats/:id", Chats.getById);
  
  app.get("/api/chats/:id/messages", Messages.getByChat);

 // app.get("/api/friends/:id",chats.getFriends);
  
  app.post("/api/chats", Chats.createNew);
  
  app.post("/api/chats/:id/messages", Messages.createNew);
  

// delete a chat
app.delete("/api/chats/:id", Chats.delete);
