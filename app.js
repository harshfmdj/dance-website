const express = require("express");
const router = express.Router();
const path = require("path");
const app = express();
const mongoose = require('mongoose');
const bodyparser = require("body-parser");

mongoose.connect('mongodb://localhost/Login', { useNewUrlParser: true });
const port = 8000;


// Define mongoose schema
var signup = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    address: String,
    password: String
});
var Contact = mongoose.model('signup', signup);

// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')) // For serving static files
app.use(express.urlencoded())

// PUG SPECIFIC STUFF
app.set('view engine', 'pug') // Set the template engine as pug
app.set('views', path.join(__dirname, 'views')) // Set the views directory

// ENDPOINTS
app.get('/', (req, res) => {
    const params = {}
    res.status(200).render('home.pug', params);
})

app.get('/contact', (req, res) => {
    const params = {}
    res.status(200).render('contact.pug', params);
})
app.get('/signin', (req, res) => {
    const params = {}
    res.status(200).render('signin.pug', params);
});
app.post('/signin', (req, res) => {
    var username = req.body.name;
    var password = req.body.password;

    Contact.findOne({ email: username, password: password }, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        if (!user) {
            return res.status(404).render('contact.pug')

        }
        return res.status(200).render('home.pug');
    });
});
app.post('/contact', (req, res) => {
    var myData = new Contact(req.body);
    myData.save().then(() => {
        res.status(200).render('contact.pug');
    }).catch(() => {
        res.status(400).send("Item was not saved to the database")
    });

    // es.status(200).render('contact.pugr');
})

// START THE SERVER
app.listen(port, () => {
    console.log(`The application started successfully on port ${port}`);
});