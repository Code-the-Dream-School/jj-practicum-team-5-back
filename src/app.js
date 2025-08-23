const express = require('express');
const app = express();
const cors = require('cors')
const favicon = require('express-favicon');
const logger = require('morgan');

const mainRouter = require('./routes/mainRouter');
const projectRoutes = require('./routes/projectRoutes');

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.static('public'))
app.use(favicon(__dirname + '/public/favicon.ico'));

// routes
app.use('/api/v1', mainRouter)
app.use('/api/v1/projects', projectRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

module.exports = app;

