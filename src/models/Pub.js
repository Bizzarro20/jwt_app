//MODELLO DI UN PUB

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pubSchema = mongoose.Schema({
    ditta: {
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
        minLength: 6
    },
/*
    drinks: [{
        drink: {
            type: String,  //id
            type: String,   //nome drink
            unique: true
        }
    }],*/
    tokens: [{          //una lista di token perchè posso avere un token per ogni dispositivo
        token: {        //ogni token è stringa e required
            type: String,
            required: true
        }
    }]
});

pubSchema.pre('save', async function (next) {     //se voglio trasformare tutto in minuscolo o altro lo faccio qua
    // Hash the password before saving the pub model
    const pub = this;
    if (pub.isModified('password')) {              //quando trigero save sto modificando la password
        pub.password = await bcrypt.hash(pub.password, 8);  //8 è il padding
    }                                                          //pub è lo schema (this) quindi accedo al
    next();                                        //campo password del attuale user
});

pubSchema.methods.generateAuthToken = async function() {  //prendo i dati nel schema
    // Generate an auth token for the pub
    const pub = this;
    const token = jwt.sign({_id: pub._id}, process.env.JWT_KEY); //sign è metodo paccheto jwt
    pub.tokens = pub.tokens.concat({token});                   //pub._id è il payload del token ... sempre dentro sign posso mettere
    await pub.save();                                           //una data di scadenza del token .. cmq passo anche key segreta
    return token;                       //quind metto nel schema.tokens il token
}                                   //ritorno token ogni volta che un utente fa qualcosa

pubSchema.statics.findByCredentials = async (email, password) => {
    // Search for a pub by email and password.
    const pub = await Pub.findOne({ email} );     //vado nella mia base di dati e uso find one
    if (!pub) {
        throw new Error({ error: 'Invalid login credentials' });
    }       //quindi fin qui email c'è .. vedo se le password è giusta
    const isPasswordMatch = await bcrypt.compare(password, pub.password); //confronto con quella nel db
    if (!isPasswordMatch) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    return pub;         //quindi ritorno lo schema
}

const Pub = mongoose.model('Pub', pubSchema);

module.exports = Pub;