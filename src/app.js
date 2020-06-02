const express = require('express');
const userRouter = require('./routers/user');
const pubRouter = require('./routers/pub');
const reviewRouter = require('./routers/review');
const port1 = process.env.PORT1;
const port2 = process.env.PORT2;
const port3 = process.env.PORT3;



require('./db/db');

const app1 = express();
const app2 = express();
const app3 = express();

app1.use(express.json());
app1.use(userRouter);

app2.use(express.json());
app2.use(pubRouter);

app3.use(express.json());
app3.use(reviewRouter);


app1.listen(port1, () => {
    console.log(`Server running on port ${port1}`)
});


app2.listen(port2, () => {
    console.log(`Server running on port ${port2}`)
});

app3.listen(port3, () => {
    console.log(`Server running on port ${port3}`)
});

/*
app.use(express.json());
app.use(userRouter);        //avrò una cosa esterna invece di app.get o app.post
                        //uso router pub quando voglio usare cose di pub (login, logout, registrazione)
*/