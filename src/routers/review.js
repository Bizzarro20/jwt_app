//GESTIONE RICHIESTE

const express = require('express')
const Review = require('../models/Review')
const User = require('../models/User')
const auth1 = require('../middleware/auth_user')
const auth2 = require('../middleware/auth_pub')


const router = express.Router() //definisco il router per fare get e post della app

router.post('/review', auth1, async (req, res) => {
    // Create a new review

    try {
        const review = new Review(req.body)     //ricevo una richiesta per inserire la recensione
        await review.save()           //salva nel db?
        res.status(201).send({review})   //rimanda indietro review  ... quindi posso salvare ciò che ritornato e usarlo
    } catch (error) {                       //nota ritornando review
        res.status(400).send(error)
    }
})


//funziona
router.get('/review/pub', auth2, async(req, res) => {  //una richiesta per ottenere info (quindi devo passarchi auth

    //Login a registered pub
    try {
        const pub = req.body;
        const review = await Review.find({"pub": {$exists: true}});
        //const review = await Review.find({"pub": pub});
        if (!pub) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        }
        res.send({ review })
    } catch (error) {
        res.status(400).send(error)
    }
});

router.get('/review/user', auth1, async(req, res) => {  //una richiesta per ottenere info (quindi devo passarchi auth
    try {
        const user = req.body;
        const review = await Review.find({"user": {$exists: true}});
        //const review = await Review.find({"pub": pub});
        if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        }
        res.send({ review })
    } catch (error) {
        res.status(400).send(error)
    }
});

module.exports = router;