const bcrypt=require('bcryptjs')
const jwt= require('jsonwebtoken')
const {UserInputError, addErrorLoggingToSchema}=require('apollo-server');

const User = require("../../models/User");
const {SECRET_KEY}=require('../../config')
const  {registerValidation, loginValidation}=require('../../utils/validators')

const generateToken=(user)=>{
   return jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email
    },SECRET_KEY,{expiresIn:'1h'});
}
module.exports = {
  Mutation: {
    // User login mutation
    async loginUser(_,{username,password},context,info){
        const {errors,valid}=loginValidation(username,password);
        if(!valid){
            throw new UserInputError("Errors",{errors});
        }

        const user=await User.findOne({username});
        if(!user){
            errors.general='User does not exist'
            throw new UserInputError("User does not exist",{errors})
        }

        const passwordMatch=await bcrypt.compare(password,user.password);
        if(!passwordMatch){
            errors.general='Incorrect credentials'
            throw new UserInputError("Incorrect credentials",{errors});
        }

        const token=generateToken(user);
        return {
            ...user._doc,
            id:user.id,
            token
        }
    },
    // User registration mutation
    async register(
      _,
      { registerInput: { username, password, confirmPassword, email } },
      context,
      info
    ) {
        // Performing user credential validation
        const {errors,valid}=registerValidation(username,password,confirmPassword,email);
        if(!valid){
            throw new UserInputError("Errors",{errors});
        }

        // Checking if username exists or not
        const user=await User.findOne({username})
        if(user){
            throw new UserInputError("User already exists",{
                errors:{
                    username:"Username already exists"
                }
            })
        }

        password=await bcrypt.hash(password,12);

        const newUser=new User({
            username,
            password,
            email,
            createdAt:new Date().toISOString()
        })

        const res=await newUser.save();

        const token=generateToken(res);

        return {
            ...res._doc,
            id: res.id,
            token
        }
    },
  },
};
