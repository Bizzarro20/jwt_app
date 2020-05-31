const express = require('express');
const userRouter = require('./routers/user');
const pubRouter = require('./routers/pub');
const port = process.env.PORT;


require('./db/db');

const app1 = express();
const app2 = express();

app1.use(express.json());
app1.use(userRouter);

app2.use(express.json());
app2.use(pubRouter);

app2.listen(port, () => {
    console.log(`Server running on port ${port}`)
});



/*
app.use(express.json());
app.use(userRouter);        //avrò una cosa esterna invece di app.get o app.post
                        //uso router pub quando voglio usare cose di pub (login, logout, registrazione)
*/