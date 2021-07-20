const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");


// Schema...
const employeeSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]

});

// Authentication & Middleware -> JSON Web Token (JWT)...
employeeSchema.methods.generateAuthToken = async function(){
    try{
        console.log(this._id);
        const token = jwt.sign({_id: this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        // this.tokens = this.tokens.concat({token});
        await this.save();
        return token;
    }catch(error){
        res.send("The error part" +error);
        console.log("The error part" +error);
    }
}


// Secure Password using Hashing...
employeeSchema.pre("save", async function(next) {

    if(this.isModified("password")){
        // console.log(`the current password is ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10);
        // console.log(`the current password is ${this.password}`);
        this.confirmPassword = await bcrypt.hash(this.password, 10);
        // this.confirmPassword = undefined;
    }
    next();
});


// Collection...
const Register = new mongoose.model("Register", employeeSchema);

// Export...
module.exports = Register;