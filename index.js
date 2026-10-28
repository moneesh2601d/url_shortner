const express = require("express");
const session = require("express-session");

const connectDB = require("./databaseConnect");

const authRoutes = require("./routes/authRoutes");
const urlRoutes = require("./routes/urlRoutes");

const { redirectToOriginalUrl } = require("./controllers/urlController");


const app = express();

connectDB();

app.use(express.urlencoded({extended: true}));

app.use(express.json());


app.use(
    session({
        secret: "my-local-url-shortener-secret",
        resave: false,
        saveUninitialized: false,

        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        }
    })
);

app.set("view engine","ejs");

app.set("views","./views");

app.use("/",authRoutes);

app.use("/",urlRoutes);

app.get("/:shortCode",redirectToOriginalUrl);

app.get("/", (req, res) => {
    if (req.session.userId) {
        return res.redirect("/dashboard");
    }

    res.redirect("/login");
});


const PORT = 5000;

app.listen(PORT);