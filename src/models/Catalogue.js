//MODELLO DI UN CATALOGO DRINK -- VIENE CREATO UN CATALOGO COMUNE CON TUTTI I DRINK DI TUTTI I PUB
//INSERITI MAN MANO DA CIASCUNO E SALVATI CRONOLOGICAMENTE

//motivo: la app è finalizzata alla recensione dei drink nei pub e non dei pub di per se
//è meglio avere una collezione che contiene tutti i drink con i rispettivi pub, in modo da poter filtrare
//anche per drink .. infatti una collezione con pub e vettore di drink non rende facile filtrare per drink.

const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const catalogueSchema = mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now()
    },
    pub: {
        type: String,
        required: true,
        unique: true
    },
    drink: {
            type: String,
            required: true
        }
})



catalogueSchema.pre('save', async function (next) {
    // insert in the db the catalogue
    const catalogue = this
    next()
})


const Catalogue = mongoose.model('Catalogue', catalogueSchema)

module.exports = Catalogue  //disponibile a livello globale