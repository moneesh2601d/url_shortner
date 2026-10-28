const User = require("../models/User");
const bcrypt = require("bcryptjs");


const showLogin = (req, res) => {

    if (req.session.userId) {
        return res.redirect("/dashboard");
    }

    res.render("login", {
        error: null
    });
};


const showSignup = (req, res) => {

    if (req.session.userId) {
        return res.redirect("/dashboard");
    }

    res.render("signup", {
        error: null
    });
};


const signup = async (req, res) => {
    try{
        const { name, email, password } = req.body;

        if(!name || !email || !password) {
            return res.render("signup", {
                error: "All fields are required"
            });
        }
        if(password.length < 6) {
            return res.render("signup", {
                error: "Password must be at least 6 characters"
            });
        }
        const existingUser = await User.findOne({
            email
        });
        if(existingUser) {
            return res.render("signup", {
                error: "Email already registered"
            });
        }
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );
        await User.create({
            name,
            email,
            password: hashedPassword
        });
        res.redirect("/login");

    }catch(error) {
        console.error(error);
        res.render("signup", {
            error: "Something went wrong"
        });
    }
};

const login = async (req, res) => {
    try{
        const { email, password } = req.body;
        if(!email || !password){
            return res.render("login", {
                error: "Email and password are required"
            });
        }
        const user = await User.findOne({
            email
        });
        if(!user){
            return res.render("login", {
                error: "Invalid email or password"
            });
        }
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );
        if(!passwordMatch){
            return res.render("login", {
                error: "Invalid email or password"
            });
        }

        req.session.userId = user._id.toString();

        req.session.userName = user.name;

        res.redirect("/dashboard");

    }catch(error){
        console.error(error);
        res.render("login", {
            error: "Something went wrong"
        });
    }
};

const logout = (req, res) => {

    req.session.destroy((error) => {
        if(error){
            console.error(error);
        }
        res.redirect("/login");
    });
};


module.exports = {
    showLogin,
    showSignup,
    signup,
    login,
    logout
};