const express = require('express');
const cors = require('cors');
const app = express();
const dbConnect = require('./Models/dbconnect');
const User = require('./Models/userSchema');
const Artist = require("./Models/MeterialModel");
require('dotenv').config();
const path = require('path'); 

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

dbConnect();

const userRouter = require('./Routes/userRoutes');
app.use('/', userRouter);



app.listen(process.env.PORT, () => console.log('Server connected successfully...'));








// Consolidating the /users route definition
app.get("/users", async (req, res) => {
    try {
        const users = await User.find({}, "-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

app.delete("/users/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
    }
});

app.put("/users/:id", async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: "Failed to update user" });
    }
});

app.get("/artists", async (req, res) => {
    try {
        const artists = await Artist.find();
        res.json(artists);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch artists" });
    }
});

