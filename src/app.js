require('dotenv').config(); // Putt at the top

const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

require("./db/conn");
const Register = require("./models/registers");
const { json } = require("express");

const port = process.env.PORT || 3000;

/*
app.get("/", (req, res) => {
    res.send("Hello World");
});
*/

const staticPath = path.join(__dirname, "../public");
const templatePath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

const bootstrapPath = path.join(__dirname, "../node_modules/bootstrap/dist/");

app.use(express.static(staticPath));
app.set("view engine", "hbs");
app.set("views", templatePath);
hbs.registerPartials(partialsPath);

app.use(express.static(bootstrapPath));

app.use(express.json());
app.use(express.urlencoded({extended:false}));

// console.log(process.env.SECRET_KEY);

app.get("/", (req, res) => {
    res.render("index");
});


app.get("/register", (req, res) => {
    res.render("register");
});

// ..............................................................
// Create User...
app.post("/register", async(req, res) => {
    try{
        // console.log(req.body.firstName);
        // res.send(req.body.firstName);

        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;

        if(password === confirmPassword) {

            const registerEmployee = new Register({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmPassword: password
            })

            // (JWT) Middleware...
            console.log("the success part " +registerEmployee);
            const token = await registerEmployee.generateAuthToken();
            console.log("the token part " +token);

            // Secure Password using Hashing...

            const registered = await registerEmployee.save();
            console.log("the token part " + registered);

            res.status(201).render("index");

        }else{
            res.send("Password are not matching");
        }

    }catch(e){
        res.status(400).send(e);
        console.log("the error part page");
    };
});
// ..............................................................



app.get("/login", (req, res) => {
    res.render("login");
});

// ..............................................................
// Get User
app.post("/login", async(req, res) => {

    try{
        const email = req.body.email;
        const password = req.body.password;

        const userLogin = await Register.findOne({email});
        // res.send(userLogin.password);
        // console.log(userLogin);

        const isMatch = await bcrypt.compare(password, userLogin.password);

        const token = await userLogin.generateAuthToken();
        console.log("the token part " +token);

        if(isMatch) {
            res.status(201).render("index");
        }else{
            // res.status(400).send("Entered wrong password");
            res.status(400).send("Invalid login Details");
        }

    }catch(e){
        // res.status(400).send("Invalid Email");
        res.status(400).send("Invalid login Details");
    }
    // res.render("index");
});
// ..............................................................


app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/contact", (req, res) => {
    res.render("contact");
});




// ..............................................................
// Encryption & Hashing (bcryptjs)
/*
const bcrypt = require("bcryptjs");

const securePassword = async (password) => {
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    const passwordMatch = await bcrypt.compare("Arsad@123", passwordHash);
    console.log(passwordMatch);
}
securePassword("Arsad@123");
*/
// ..............................................................



// ..............................................................
// Authentication -> JSON Web Token (JWT)
// const jwt = require("jsonwebtoken");

// const createToken = async() => {
//     const token = await jwt.sign({_id: "60f5013c9a7cc30288b09250"}, "mynameisarsadsiddiqui", {
//         expiresIn: "2 minutes"
//     });
//     console.log(token);

//     const userVerify = jwt.verify(token, "mynameisarsadsiddiqui");
//     console.log(userVerify);
// }
// createToken();
// ..............................................................




// Listening Port..........................................
app.listen(port, () => {
    console.log(`Server is running at port number ${port}`);
});