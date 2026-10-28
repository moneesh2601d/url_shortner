const Url = require("../models/Url");
const { nanoid } = require("nanoid");


// ==========================
// DASHBOARD
// ==========================

const showDashboard = async (req, res) => {

    try {

        const urls = await Url.find({
            user: req.session.userId
        }).sort({
            createdAt: -1
        });

        res.render("dashboard", {
            urls,
            userName: req.session.userName,
            error: null,
            success: null
        });

    } catch (error) {

        console.error(error);

        res.render("dashboard", {
            urls: [],
            userName: req.session.userName,
            error: "Unable to load URLs",
            success: null
        });
    }
};


// ==========================
// CREATE SHORT URL
// ==========================

const createShortUrl = async (req, res) => {

    try {

        const {
            originalUrl,
            customCode
        } = req.body;


        if (!originalUrl) {

            const urls = await Url.find({
                user: req.session.userId
            }).sort({
                createdAt: -1
            });

            return res.render("dashboard", {
                urls,
                userName: req.session.userName,
                error: "Please enter a URL",
                success: null
            });
        }


        let shortCode;


        // Custom code provided
        if (customCode && customCode.trim() !== "") {

            shortCode = customCode.trim();

        } else {

            // Generate random code
            shortCode = nanoid(6);
        }


        // Check if short code already exists
        const existingUrl = await Url.findOne({
            shortCode
        });


        if (existingUrl) {

            const urls = await Url.find({
                user: req.session.userId
            }).sort({
                createdAt: -1
            });

            return res.render("dashboard", {
                urls,
                userName: req.session.userName,
                error: "This short code is already taken",
                success: null
            });
        }


        // Create URL
        await Url.create({
            originalUrl,
            shortCode,
            user: req.session.userId
        });


        const urls = await Url.find({
            user: req.session.userId
        }).sort({
            createdAt: -1
        });


        res.render("dashboard", {
            urls,
            userName: req.session.userName,
            error: null,
            success: `URL shortened successfully! /${shortCode}`
        });


    } catch (error) {

        console.error(error);

        const urls = await Url.find({
            user: req.session.userId
        }).sort({
            createdAt: -1
        });

        res.render("dashboard", {
            urls,
            userName: req.session.userName,
            error: "Something went wrong",
            success: null
        });
    }
};


// ==========================
// REDIRECT
// ==========================

const redirectToOriginalUrl = async (req, res) => {

    try {

        const { shortCode } = req.params;


        const url = await Url.findOne({
            shortCode
        });


        if (!url) {

            return res.status(404).send(`
                <h1>404 - URL Not Found</h1>
                <p>This short URL does not exist.</p>
            `);
        }


        // Increase click count
        url.clicks += 1;

        await url.save();


        // Redirect
        res.redirect(url.originalUrl);


    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Something went wrong"
        );
    }
};


module.exports = {
    showDashboard,
    createShortUrl,
    redirectToOriginalUrl
};