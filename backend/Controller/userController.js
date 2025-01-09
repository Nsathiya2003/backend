import User from "../Models/userModel.js";
import { generateAccessToken, generateOTP, sendOTP, transporter } from "../Middleware/token.js";
import bcrypt from "bcrypt";
import cookieParser from 'cookie-parser';

export const UserSignup = async (req,res)=>{
        const {username,password,email,mobileNo}=req.body;
        console.log("password",password);
        console.log("body datas",req.body);
     try{
         if(!username || !password || !email ||!mobileNo){
            return res.status(400).json({
               message: "All fields are required"
            })
         };
         const hashedPassword = await bcrypt.hash(password,10);
         console.log("hashedPassword--",hashedPassword);
          const user = await User.create({
            username:username,
            password:hashedPassword,
            email:email,
            mobileNo:mobileNo
         })
         res.status(201).json({
            message:"User created successfully",
            data:user
         })

     }
     catch(err){
        res.status(500).json({message:"Something went wrong",error:err.message })
        console.log("error creating user",err);
     }

}


export const UserLogin = async (req, res) => {
   const { email, password } = req.body;

   try {
      console.log("email",email);
      console.log("password",password);

      if (!email || !password) {
         return res.status(400).json({
            message: "All Fields are required",
         });
      }
      const user = await User.findOne({
         where: { email: email },
      });
      console.log("user is---------------",user);
      if (!user) {
         return res.status(404).json({
            message: "User not found",
         });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log("passworddddd",isPasswordValid)
      if (!isPasswordValid) {
         return res.status(401).json({
            message: "Invalid credentials",
         }); 
      }

      const token = generateAccessToken({ id: user.id, email: user.email });
      console.log('token--------',token);
      if (token) {
         const updatedUser = await User.update(
            { token: token }, 
            { where: { email: user.email } } // Condition to find the user by email
         );
   
         console.log("Token updated successfully for user:", updatedUser);
      }
      res.status(200).json({
         message: "User Logged Successfully",
         token,
      });
   } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
         message: "Internal Server Error",
      });
   }
};

export const forgotPassword = async (req, res) => {
   const { email } = req.body;
 
   try {
     const user = await User.findOne({ where: { email } });
     if (!user) {
       return res.status(400).json({ error: 'User not found' });
     }
 
     const otp = generateOTP();
     user.resetOTP = otp;
     await user.save();
 
     res.cookie('email', email, { httpOnly: true });
     await sendOTP(email, otp);
   
     res.status(200).json({ 
      data:user,
      message: 'OTP sent to your email',
    }); // Remove `otp` in production
   } catch (error) {
     console.error(error);
     res.status(500).send('Server error');
   }
 };

 export const resetPassword = async (req, res) => {
   const email = req.cookies.email;
   const { otp, newPassword, confirmPassword } = req.body;
 if (!email) {
     return res.status(400).json({ message: 'Email cookie is missing' });
   }
 
   try {
     const user = await User.findOne({ where: { email } });
     if (!user) {
       return res.status(400).json({ message: 'User not found' });
     }
if (otp !== user.resetOTP) {
       return res.status(400).json({ message: 'Invalid OTP' });
     }
 
     if (newPassword !== confirmPassword) {
       return res.status(400).json({ message: 'Passwords do not match' });
     }
 
     user.password = await bcrypt.hash(newPassword, 10);
     console.log("changed password is",user.password);
     user.resetOTP = null; // Clear OTP
     await user.save();
     res.clearCookie('email');
     const mailOptions = {
      from:process.env.EMAIL,
      to:user.email,
      text:`Password reset successfully.login your account`
    }
     console.log("mailOptions is",mailOptions);
     transporter.sendMail(mailOptions,(error, info) => { 
      if (error) {
        console.log(`Error--: ${error}`); 
      } 
      else {
        console.log(`Email sent: ${info.response}`);
        res.json({ message: 'Password reset successfully', user });
      }
      });
   } 
   catch (error) {
     console.error(error);
     res.status(500).json({ message: 'Something went wrong' });
   }
 };

