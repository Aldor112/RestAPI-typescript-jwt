import {Request,Response } from 'express';
import User,{IUser} from '../models/user';
import jwt from 'jsonwebtoken'
import config from '../config/config';

function createToken(user:IUser) {
   return jwt.sign({id: user.id, email: user.email}, config.jwtSecret, {
       expiresIn: 86400
   });
}

export const signUp= async (req: Request, res: Response): Promise<Response> =>{
    if(!req.body.email || !req.body.password){
        return res.status(400).json({msg: 'Please send your email and password'})
    }
    const user = await User.findOne({email: req.body.email});
    if(user){
        return res.status(400).json({msg: 'The user already exist'});
    }
   const newuser = new User(req.body)
   await newuser.save();
    return res.status(201).json(newuser);
}
export const signIn= async (req: Request, res: Response) =>{
    if(!req.body.email || !req.body.password){
        return res.status(400).json({msg: 'Please send your email and password'})
    }

   const user = await User.findOne({email: req.body.email})
   if(!user){
       return res.status(400).json({msg: 'the user does not exist'});
   }

 const isMatch= await user.comparePassword(req.body.password);
   if (isMatch){
       return res.status(200).json({token: createToken(user) });
    }
    res.status(400).json({msg: 'The email or the password are incorrect'})
};