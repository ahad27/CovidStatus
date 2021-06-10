require('dotenv').config();
const express = require ("express");

const path = require("path");
const app =express();
const hbs  = require("hbs");
const bcrypt = require ("bcryptjs");
const cookieParser = require("cookie-parser");
const auth = require("./middleweare/auth");
require("./db/conn");
const Register = require("./models/registers");
const {json} = require ("express");
const port = process.env.PORT || 3000;


const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.static(static_path));

app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

// console.log(process.env.SECRET_KEY);
app.get("/", (req, res) => {
res.render("index");
});

app.get("/register", (req, res) => {
      res.render("register");
 });
 app.get("/secret",  auth, (req, res) => {
      // console.log(` this is the cookie ${req.cookies.jwt}`);
      res.render("secret");
 });

 app.get("/logout", auth, async(req, res) =>{
       try{
             res.clearCookie("jwt");

            console.log("logout sucessfully");
            //  await req.user.save();
             res.render("login");
       }catch(error){
             res.status(500).send(error);
       }

 })


 //reg
 app.post("/register",  async(req, res) => {
       try{
       const password = req.body.password;
       const cpassword = req.body.conpassword;

       if(password === cpassword){
             const registerEmployee = new Register({
                   name : req.body.name,
                   email : req.body.email,
                   password : req.body.password,
                   conpassword : req.body.conpassword

             })


             const token = await registerEmployee.generateAuthToken();

             res.cookie("jwt", token, {
                   expires:new Date(Date.now() + 600000),
                   httpOnly:true
             } );
            //  console.log(cookie);

             const registerd = await registerEmployee.save();
             res.status(201).render("index");

       }else{
             res.send("password are not match")
       }


       }catch (error){
             res.status(400).send(error);

       }
     
 });

 
 app.get("/login", (req, res) => {
      res.render("login")
 });

  //
  app.post("/login",  async (req, res) => {
        try{

            const email = req.body.email;
            const password = req.body.password;

            // console.log(`${email} and password is ${password}`)
             const useremail = await Register.findOne({email:email});

             const isMatch =await bcrypt.compare(password, useremail.password);

             const token = await useremail.generateAuthToken();
             console.log("the token part" + token);

             res.cookie("jwt", token, {
                  expires:new Date(Date.now() + 600000),
                  httpOnly:true

            } );
           

             if(isMatch){
                   res.status(201).render("secret")
             }else{
                   res.send("Invalied crediential");
             }

        }catch(error){
              res.status(400).send("Invalied crediential")

        }
      
 });
















app.listen(port, () =>{
      console.log(`server is renning${port}`);
})