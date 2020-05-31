//fa da ponte con il database
//serve per fare quelle cose che servono (controlli) prima che la richiesta arrivi
//al server e che il server ritorni la risposta

//ad esempio quando uno vuole una risorsa (es recensioni), voglio verificare
//che questa persona possa accedere (usare la funzione per ottenere quei dati)


const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth_user = async(req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '')  //prendiamo dal header il nostro token jwt (jwt token sono tipo bearer)
    const data = jwt.verify(token, process.env.JWT_KEY)    //verifca il token dalla sessione con la key segreta
    try {                                                   //fa una decodifica del token
        const user = await User.findOne({ _id: data._id, 'tokens.token': token })  //cerco nel db un user che ha quel token
        if (!user) {
            throw new Error()           //chi fa la richiesta non ha un token valido
        }
        req.user = user
        req.token = token
        next()                      //next dice passa la richiesta al server.
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }                                                                               //token non esiste o scaduto se ho messo scadenza

}
module.exports = auth_user           //cosi possiamo usarlo globalmente