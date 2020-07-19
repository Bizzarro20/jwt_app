const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true   //toglie gli spazi alla fine (sanifica)
    },
    email: {
        type: String,
        required: true,
        unique: true,           //unique nel database
        lowercase: true,
        validate: value => {            //prendi la mail prima messa .. usa libreria validator per usare il suo metodo
            if (!validator.isEmail(value)) {
                throw new Error({error: 'Invalid Email address'})
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7        //NON FUNZIONA !!!!!!!!    funziona min = 7,
    },
    tokens: [{          //una lista di token perchè posso avere un token per ogni dispositivo
        token: {        //ogni token è stringa e required
            type: String,
            required: true
        }
    }]
})

userSchema.pre('save', async function (next) {     //se voglio trasformare tutto in minuscolo o altro lo faccio qua
    // Hash the password before saving the user model
    const user = this
    if (user.isModified('password')) {              //quando trigero save sto modificando la password
        user.password = await bcrypt.hash(user.password, 8)  //8 è il padding
    }                                                          //user è lo schema (this) quindi accedo al
    next()                                              //campo password del attuale user
})

userSchema.methods.generateAuthToken = async function() {  //prendo i dati nel schema
    // Generate an auth token for the user
    const user = this
    const token = jwt.sign({_id: user._id}, process.env.JWT_KEY) //sign è metodo paccheto jwt
    user.tokens = user.tokens.concat({token})                   //user._id è il payload del token ... sempre dentro sign posso mettere
    await user.save()                                           //una data di scadenza del token .. cmq passo anche key segreta
    return token                        //quind metto nel schema.tokens il token
}                                   //ritorno token ogni volta che un utente fa qualcosa

userSchema.statics.findByCredentials = async (email, password) => {
    // Search for a user by email and password.
    const user = await User.findOne({ email} )     //vado nella mia base di dati e uso find one
    if (!user) {
        throw new Error({ error: 'Invalid login credentials' })
    }       //quindi fin qui email c'è .. vedo se le password è giusta
    const isPasswordMatch = await bcrypt.compare(password, user.password) //confronto con quella nel db
    if (!isPasswordMatch) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    return user         //quindi ritorno lo schema
}

const User = mongoose.model('User', userSchema)

module.exports = User  //disponibile a livello globale