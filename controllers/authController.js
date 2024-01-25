const db = require("../models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Yup = require("yup");
const dotenv = require('dotenv');

dotenv.config();

const User = db.user;

const registerUser = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({success: false, message: "Request body is empty provide name, email and password",});
          }
        const { name, email, password } = req.body;
        const requiredFields = ["name", "email", "password"];

        for (const field of requiredFields) {
          if (!req.body[field]) {
            return res.status(400).json({ success: false, message: `${field} is required` });
          }
        }
        const dataScheme = Yup.object({
            name: Yup.string().required("Name is required").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed in name field"),
            email: Yup.string().matches(/^[^\d\s@][^\s@]*@[^\s@]+\.[^\s@]+$/).required("Email is required"),
            password: Yup.string().required("Password is required")
          });

          const data = {};
          Object.entries(req.body).forEach(([key, value]) => {
              data[key] = value.trim();
          });

          const valdiatedData = await dataScheme.validate(data);
          if (!valdiatedData) {
            return res.status(400).send({message: "Data not valid",});
          }
        const userExists = await User.findOne({
            where: {email}
        });
        if (userExists) {
            return res.status(400).json({ success: false, message: "Email is already associated with an account"});
        }

        await User.create({
            name,
            email,
            password: await bcrypt.hash(password, 15),
        });
        return res.status(201).json({ success: true, message: "User registered successfully"});

    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Error in registering user"});
    }
}

const signInUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({
            where: {email}
        });
        if (!user) {
            return res.status(404).json({ success: false, message: "Email not found"});
        }

        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            return res.status(401).json({ success: false, message: "Incorrect email or password"});
        }

        const token = jwt.sign(
            {
                user: {
                    name: user.name,
                    email: user.email,
                    id: user.id,
                },
            },
            process.env.JWT_SECRET,
            { expiresIn: "15h" }
        );
        data = {name: user.name, email: user.email, accessToken: token}
        return res.status(200).json({ success: true, data: data, message: "Login successfully"});
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Error in sign in"});
    }
}

module.exports = {
    registerUser,
    signInUser
}
