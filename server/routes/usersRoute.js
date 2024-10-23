const router = require('express').Router()
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const authMiddleware = require('../middlewares/authMiddleware')

//register a new user
router.post('/register', async (req, res) => {
    try {
        //check if the user exists
        const userExists = await User.findOne({ email: req.body.email })
        if (userExists) {
            return res.send({
                success: false,
                message: "User Already Exists",
            });
        }

        //hash the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        req.body.password = hashedPassword;

        //to save new user  
        const newUser = new User(req.body);
        await newUser.save();

        res.send({ success: true, message: "User created successfully!!" })

    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
})

//login a new user
router.post('/login', async (req, res) => {

    try {
        //check if the user exists
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.send({
                success: false,
                message: "User does not exist",
            });
        }

        //check the password
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!validPassword) {
            return res.send({
                success: false,
                message: "Invalid Password",
            })
        }

        //create and asign token
        const token = jwt.sign({ userId: user._id }, process.env.jwt_secret, {
            expiresIn: "1d"
        })

        res.send({
            success: true,
            message: "Login Successfull!!",
            data: token
        })

    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }

})

//get user details by id
router.get('/get-current-user', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.body.userId).select('-password')
        res.send({
            success: true,
            message: "User details fetched successfully",
            data: user
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
})



module.exports = router;