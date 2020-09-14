//GESTIONE RICHIESTE

const express = require('express');
const Pub = require('../models/Pub');
const auth = require('../middleware/auth_pub');

const router = express.Router(); //definisco il router per fare get e post della app

router.post('/pubs', async (req, res) => {
    // Create a new pub
    try {
        const pub = new Pub(req.body);     //def pub con body della richiesta, genero quindi utente
        await pub.save();           //cripta pwd .. salva nel db?
        const token = await pub.generateAuthToken();
        res.status(201).send({ pub, token });   //rimanda indietro pub e token ... quindi posso salvare ciò che ritornato e usarlo
    } catch (error) {                       //nota ritornando pub mi ritorna già una liista di token ovver il token
        res.status(400).send(error);
    }
});

router.post('/pubs/login', async(req, res) => {
    //Login a registered pub
    try {
        const { email, password } = req.body;
        const pub = await Pub.findByCredentials(email, password);
        if (!pub) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'});
        }
        const token = await pub.generateAuthToken();  //genero un nuovo token xk accedo con un dispositivo e con un altro
        res.send({ pub, token });
    } catch (error) {
        res.status(400).send(error);
    }


});

router.get('/pubs/me', auth, async(req, res) => {  //una richiesta per ottenere info (quindi devo passarchi auth
    // View logged in pub profile
    res.send(req.pub);
});


router.post('/pubs/me/logout', auth, async (req, res) => {
    // Log pub out of the application
    try {
        req.pub.tokens = req.pub.tokens.filter((token) => {
            return (token.token != req.token);
        })
        await req.pub.save();
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
});


//elimina il token cosi non posso più accedere ai dati
router.post('/pubs/me/logoutall', auth, async(req, res) => {
    // Log pub out of all devices
    try {
        req.pub.tokens.splice(0, req.pub.tokens.length);
        await req.pub.save();
        res.send()
    } catch (error) {
        res.status(500).send(error);
    }
})
//elimina tutti i token




router.get('/pubs/all',async(req, res) => {  //una richiesta per ottenere info (quindi devo passarchi auth
    // View logged in pub profile
    //res.send(req.pub)
    try {
        const pub = await Pub.find({"ditta": {$exists: true}});
        //const review = await Review.find({"pub": pub});
        if (!pub) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'});
        }
        res.send({ pub });
    } catch (error) {
        res.status(400).send(error);
    }

});



module.exports = router;