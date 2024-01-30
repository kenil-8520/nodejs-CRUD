const db = require("../models");
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
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
        if(!email || !password) {
            return res.status(400).json({success:false, message:"Please provide email and password to login"})
        }

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


const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        if(!oldPassword || !newPassword || !confirmPassword){
            return res.status(400).json({success:false, message:"Please provide old password, new password and confirm password"})
        }
        else if (newPassword !== confirmPassword){
            return res.status(400).json({success:false, message:"New password and confirm password does not match"})
        }
        const userId = req.user.id;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const passwordValid = await bcrypt.compare(oldPassword, user.password);
        if (!passwordValid) {
            return res.status(401).json({ success: false, message: "Incorrect old password" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();
        return res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Error in changing password" });
    }
};

const sendResetPasswordEmail = async(email, resetToken) => {
    const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 587,
        auth: {
            user: process.env.user,
            pass: process.env.password,
        },
    });
    console.log(resetToken);

    const mailOptions = {
        from: 'test.infynno@gmail.com',
        to: email,
        subject: 'Reset Your Password',
        html: `<p>Please click the following link to reset your password: <a href="http://localhost:3000/reset-password?token=${resetToken}">${resetToken}</a></p>`
    };
    console.log(mailOptions);

    try {
        await transporter.sendMail(mailOptions);
        console.log('Reset password email sent successfully');
    } catch (error) {
        console.error('Error sending reset password email:', error);
    }
}

const forgotpassword = async (req, res) => {
    try {
        const { email } = req.body;
        if(!email){
            return res.status(400).json({ success: false, message: 'Please enter email to reset the password' });
        }
        console.log(email);
        const user = await User.findOne({ email:email });
        console.log({user});
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        user.resetToken = resetToken;
        await user.save();
        await sendResetPasswordEmail(email, resetToken);
        return res.status(200).json({ success: true, message: 'Reset token sent successfully' });
    } catch (error) {
        console.error('Error during forgot password:', error);
        return res.status(500).json({ success: false, message: 'Invalid token' });
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token, newpassword, confirmpassword } = req.body;
        if(!token || !newpassword || !confirmpassword) {
            return res.status(400).json({success:false, message:"Please provide token, new password and confirm password fields"})
        }
        if (newpassword !== confirmpassword){
            return res.status(404).json({success:false, message:"New password and confirm password is not same "})
         }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        console.log(userId);

        const user = await User.findOne(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const hashedNewPassword = await bcrypt.hash(newpassword, 10);
        user.password = hashedNewPassword;
        user.resetToken = null;
        await user.save();

        return res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        const errorMessage = error.message.replace(/\\|"/g, '');
        if (errorMessage.includes('jwt expired')) {
            return res.status(422).json({ success:false, message: `Your session has been expried`});
        }
        console.error('Error during password reset:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

module.exports = {
    registerUser,
    signInUser,
    changePassword,
    forgotpassword,
    resetPassword
}
