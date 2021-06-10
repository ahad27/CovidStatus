const mongoose = require("mongoose");
const bcrypt = require ("bcryptjs");
const jwt = require ("jsonwebtoken");

const employeeSchema = new mongoose.Schema({

      name : {
            type:String,
            required: true
      },
      email : {
            type:String,
            required: true,
            unique:true
      },
      password : {
            type:String,
            required: true
      },
      conpassword : {
            type:String,
            required: true
      },
      tokens:[{
            token:{
                  type:String,
                  required: true
            }
      }]
})


//token
employeeSchema.methods.generateAuthToken = async function() {
       try{
           console.log(this._id);
            const token = jwt.sign({ _id:this._id.toString()}, "mynameshfkjhdsjkfhksjisthata");
            this.tokens= this.tokens.concat({token:token})
            await this.save();
           return token;
       }catch (error){
             res.send("the error part" + error)

       }
 }

employeeSchema.pre("save", async function (next) {
      if(this.isModified("password")){
            // console.log(`the current password is ${this.password}`);
            this.password = await bcrypt.hash(this.password, 10);
            this.conpassword = await bcrypt.hash(this.password, 10);
            // console.log(`the current password is ${this.password}`);
           

      }
    
      next();


})





//now we need to creat collecliton

const Register = new mongoose.model("Register",employeeSchema );
module.exports = Register;