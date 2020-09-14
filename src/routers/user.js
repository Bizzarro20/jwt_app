//GESTIONE RICHIESTE

const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth_user');

const router = express.Router(); //definisco il router per fare get e post della app

router.post('/users', async (req, res) => {
    // Create a new user
    try {
        const user = new User(req.body);     //def user con body della richiesta, genero quindi utente
        await user.save();           //cripta pwd .. salva nel db?
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });   //rimanda indietro user e token ... quindi posso salvare ciò che ritornato e usarlo
    } catch (error) {                       //nota ritornando user mi ritorna già una liista di token ovver il token
        res.status(400).send(error);
    }
})

router.post('/users/login', async(req, res) => {
    //Login a registered user
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);
        if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'});
        }
        const token = await user.generateAuthToken();  //genero un nuovo token xk accedo con un dispositivo e con un altro
        res.send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }


});

router.get('/users/me', auth, async(req, res) => {  //una richiesta per ottenere info (quindi devo passarchi auth
    // View logged in user profile
    res.send(req.user);
});

router.get('/users/all', async(req, res) => {  //una richiesta per ottenere info (quindi devo passarchi auth
    // View logged in user profile
    try {
        const u = req.body;
        const user = await User.find({"name": {$exists: true}});
        //const review = await Review.find({"pub": pub});
        if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'});
        }
        res.send({ user });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/users/me/logout', auth, async (req, res) => {
    // Log user out of the application
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return (token.token != req.token);
        })
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
})
//elimina il token cosi non posso più accedere ai dati


router.post('/users/me/logoutall', auth, async(req, res) => {
    // Log user out of all devices
    try {
        req.user.tokens.splice(0, req.user.tokens.length);
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
})
//elimina tutti i token

module.exports = router;