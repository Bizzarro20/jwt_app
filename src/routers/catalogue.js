//GESTIONE RICHIESTE

const express = require('express')
const Catalogue = require('../models/Catalogue')
const auth1 = require('../middleware/auth_user')
const auth2 = require('../middleware/auth_pub')


const router = express.Router() //definisco il router per fare get e post della app


//creazione catalogo inteso come creazione di una nuova riga nel catalogo
//ovvero un pub mette un nuovo drink nel catalogo in comune

router.post('/catalogue', auth2, async (req, res) => {
    // insert a new line in the common catalogue

    try {
        const catalogue = new Catalogue(req.body)
        await catalogue.save()
        res.status(201).send({catalogue})
    } catch (error) {
        res.status(400).send(error)
    }
})


//funziona
router.get('/catalogue/pub', auth2, async(req, res) => {  //una richiesta per ottenere info (quindi devo passarchi auth

    //Login a registered pub
    try {
        const pub = req.body;
        const catalogue = await Catalogue.find({"pub": {$exists: true}});
        if (!catalogue) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        }
        res.send({ catalogue })
    } catch (error) {
        res.status(400).send(error)
    }
});

//remove drink from catalogue   --- funziona
router.post('/catalogue/pub/removedrink', auth2, async (req, res) => {
    Catalogue.deleteOne({ pub: req.body.ditta, drink: req.body.drink }, function(err, result) {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
});

router.get('/catalogue/all', auth1, async(req, res) => {
    try {
        const catalogue = await Catalogue.find({"pub": {$exists: true}});
        if (!catalogue) {
            return res.status(401).send({error: 'Catalogue loading failed'})
        }
        res.send({ catalogue })
    } catch (error) {
        res.status(400).send(error)
    }
});

module.exports = router;