//INIZIALIZZAZIONE APPLICAZIONI EXPRESS E COLLEGAMENTO AI ROUTER PER GESTIRE LE RICHIESTE DAL SERVER

const express = require('express');
const userRouter = require('./routers/user');
const pubRouter = require('./routers/pub');
const reviewRouter = require('./routers/review');
const catalogueRouter = require('./routers/catalogue');
const port1 = process.env.PORT1;
const port2 = process.env.PORT2;
const port3 = process.env.PORT3;
const port4 = process.env.PORT4;


require('./db/db');

const app1 = express();
const app2 = express();
const app3 = express();
const app4 = express();

app1.use(express.json());
app1.use(userRouter);

app2.use(express.json());
app2.use(pubRouter);

app3.use(express.json());
app3.use(reviewRouter);


app4.use(express.json());
app4.use(catalogueRouter);


app1.listen(port1, () => {
    console.log(`Running on port ${port1}`)
});


app2.listen(port2, () => {
    console.log(`Running on port ${port2}`)
});

app3.listen(port3, () => {
    console.log(`Running on port ${port3}`)
});

app4.listen(port4, () => {
    console.log(`Running on port ${port4}`)
});

