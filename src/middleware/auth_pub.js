//GESTIONE AUTORIZZAZIONE PUB
// fa da ponte con il database
//serve per fare quelle cose che servono (controlli) prima che la richiesta arrivi
//al server e che il server ritorni la risposta

const jwt = require('jsonwebtoken')
const Pub = require('../models/Pub')

const auth = async(req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '')  //prendiamo dal header il nostro token jwt (jwt token sono tipo bearer)
    const data = jwt.verify(token, process.env.JWT_KEY)    //verifca il token dalla sessione con la key segreta
    try {                                                   //fa una decodifica del token
        const pub = await Pub.findOne({ _id: data._id, 'tokens.token': token })  //cerco nel db un pub che ha quel token
        if (!pub) {
            throw new Error()           //chi fa la richiesta non ha un token valido
        }
        req.pub = pub
        req.token = token
        next()                      //next dice passa la richiesta al server.
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }                                                                               //token non esiste o scaduto se ho messo scadenza

}
module.exports = auth