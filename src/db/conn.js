const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/registrationForm", {
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:true
}).then( () => {
    console.log("Connection successful");
}).catch( (e) => {
    console.log(e);
    // console.log("No connection");
});