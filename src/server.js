const mongoose = require('mongoose');
require('dotenv').config();
const { PORT = 8000 } = process.env;
const app = require("./app");


const mongoURI = process.env.MONGO_URI

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('MongoDB connected!');
        app.listen(PORT, () => console.log(`Listening on Port ${PORT}!`));
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
