const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const Document = require('./models/Document');
const User = require('./models/User');

const app = express();
const PORT = 5000;
const httpServer = http.createServer(app); 

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log('MongoDB Connection Successful'))
  .catch((err) => console.error('MongoDB Connection Failed:', err));

app.use(cors());
app.use(express.json()); 

const verifyToken = (req, res, next) => {
  console.log("Middlewate is triggred");
  var token = req.headers.authorization
  if (!token) {
    res.send("Request Denied");
  }
  try {
    const user = jwt.verify(token,process.env.SECRET_KEY);
    console.log(user);
    req.user = user
  } catch (error) {
    console.log(error);
    res.send("Error in Token")
  }
  next();
};

app.get('/json',verifyToken,(req,res)=>{
  console.log("inside json route");
  res.json({message:"This is a middleware check",user:req.user.userName})
})


app.post("/signup", async (req, res) => {
    var { userName, email, password } = req.body;
    var hashedPassword = await bcrypt.hash(password, 15);
    console.log(hashedPassword);
    try {
      const newUser = new User({
        userName: userName,
        email: email,
        password: hashedPassword,
      });
      console.log(newUser);
      newUser.save();
      res.status(201).send({ response: "signup successfull", signupStatus: true });
    } catch (err) {
      res.status(400).send("Signup Unsuccessfull", err);
    }
  });

  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).send({ response: "User not found", loginStatus: false });
      }
      const payload = {
        email: user.email,
        userName: user.userName,
      };
      const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "24hr",
      });
      console.log(token);
      if (bcrypt.compare(user.password, password)) {
        res.status(200).send({ response: "Login successful", loginStatus: true,token: token,email:email });
      } else {
        res.status(401).send({ response: "Incorrect password", loginStatus: false });
      }
    } catch (err) {
      res.status(500).send("Error during login");
    }
  });

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const getDocument = async (id) => {
  if (!id) return null;

  try {
    const document = await Document.findById(id);
    return document || (await Document.create({ _id: id, data: '' }));
  } catch (error) {
    console.error('Error fetching document:', error);
    return null;
  }
};

const updateDocument = async (id, data) => {
  try {
    return await Document.findByIdAndUpdate(id, { data }, { new: true });
  } catch (error) {
    console.error('Error updating document:', error);
  }
};

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('get-document', async (documentId) => {
    const document = await getDocument(documentId);
    if (!document) return;

    socket.join(documentId);
    socket.emit('load-document', document.data);

    socket.on('send-changes', (delta) => {
      socket.broadcast.to(documentId).emit('receive-changes', delta);
    });

    socket.on('save-document', async (data) => {
      await updateDocument(documentId, data);
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

