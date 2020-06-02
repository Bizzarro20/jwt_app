//in questo file viene creato il modello di una recensione

const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const reviewSchema = mongoose.Schema({
    timestamp: {
        type: Date
    },
    user: {
        type: String,
        required: true
    },
    pub: {
        type: String,
        required: true
    },
    drink: {
        type: String,
        required: true
    },
    rank: {
        type: Number,
        required: true
    }
})


reviewSchema.pre('save', async function (next) {
    // insert in the db the review
    const review = this
    next()
})

/*
reviewSchema.methods.generateAuthToken = async function() {  //prendo i dati nel schema
    // Generate an auth token for the review
    const review = this
    const token = jwt.sign({_id: review._id}, process.env.JWT_KEY) //sign è metodo paccheto jwt
    review.tokens = review.tokens.concat({token})                   //review._id è il payload del token ... sempre dentro sign posso mettere
    await review.save()                                           //una data di scadenza del token .. cmq passo anche key segreta
    return token                        //quind metto nel schema.tokens il token
}                                   //ritorno token ogni volta che un utente fa qualcosa

reviewSchema.statics.findByCredentials = async (email, password) => {
    // Search for a review by email and password.
    const review = await review.findOne({ email} )     //vado nella mia base di dati e uso find one
    if (!review) {
        throw new Error({ error: 'Invalid login credentials' })
    }       //quindi fin qui email c'è .. vedo se le password è giusta
    const isPasswordMatch = await bcrypt.compare(password, review.password) //confronto con quella nel db
    if (!isPasswordMatch) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    return review         //quindi ritorno lo schema
}

*/

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review  //disponibile a livello globale