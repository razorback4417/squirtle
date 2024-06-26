const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')


const registerUser = async (req, res) => {
    const { firstName, lastName, username, password, email, phoneNumber } = req.body;

    try {
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'Username already exists' });
        }

        const newUser = new User({ firstName, lastName, username, password, email, phoneNumber });
        console.log(JSON.stringify(newUser))
        await newUser.save();

        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: 'Invalid username or password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ success: true, token, userId: user._id, message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

//get request for all user
const getUsers = async (req,res) => {
    try{
        const users = await User.find({}).sort({createdAt: -1})
        res.status(200).json({users})
    }catch(err){
        res.status(400).json({message: err.message})
    }
}

//get request for a single user
const getUser = async (req,res) => {
    const {id} = req.params
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'User not found'})
    }

    const user = await User.findById(id)
    
    if(!user){
        res.status(404).json({message: 'User not found'})
    }

    res.status(200).json({user})
}

module.exports = { registerUser, loginUser, getUsers, getUser };
