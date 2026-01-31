import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = mongoose.Schema({
    name:{
        required:true,
        type:String
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        
    },
    mobile:{
        type:String
    }
})

userSchema.pre('save',async function(next){
if(!this.isModified('password')){
    next()
}
const salt =  await bcrypt.genSalt(10)
console.log(this.password)
this.password = await bcrypt.hash(this.password,salt)
})

const User = mongoose.model('user',userSchema)

export default User