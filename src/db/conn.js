const mongoose = require ('mongoose');

// const DB = process.env.DATABAse;
mongoose.connect("mongodb+srv://jagannath:jagannath8001@cluster0.0gw9n.mongodb.net/mernproject?retryWrites=true&w=majority",{
      useNewUrlParser:true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify:false

}).then(() =>{
    console.log("System Connected.....")
}).catch((err)=> console.log('err'));