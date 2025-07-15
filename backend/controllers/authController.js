// const User = require("../models/user");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const user = require("../models/user");

// //Generate JWT Token
// const generateToken = (user) => {
//     return jwt.sign({ id: user._id, role: user.role},process.env.JWT_SECRET,{expiresIn:"1d"});
// };
// //Register User
// exports.registere = async (req, res) => {

//     try {
//         const{ username, email, password, role} = req.body;

//         //check if user exists
//         const existingUser = await User.findOne({ email});
//         if(existingUser) return res.status(400).json({message : "User already exists"});

//         const user = new User({username, email, password, role});
//         await user.save();

//         const token = generateToken(user);
//         res.status(201).json({message: "User registered",user,token});

//     } catch (error) {
//         res.status(500).json({message:"Server Error",error });
//     }
// };

// //Login User
// exports.login = async (req, res) => {
//     try {
//         const { email, password, } = req.body;

//         const User = await user.findOne({ email});
//         if(!user) return res.status(400).json({message: "Invalid credentials"});

//         const isMatch = await bcrypt.compare(password,user.password);
//         if(!isMatch) return res.status(400).json({message: "Invalid credentials"});

//         const token = generateToken(user);
//         res.status(200).json({message: "Login successful",user,token});

//     } catch (Error){
//         res.status(500).json({message:"server Error", error});
//     }
    
// };

