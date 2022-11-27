const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config()
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
app.use('/public', express.static('public'))




const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'nodejs',
    dateStrings: "date",
    multipleStatements: true
});



con.connect((err) => {
    if (err) {
        console.log('error connecting: ' + err.stack);
        return;
    }
    console.log('success');
    con.query('CREATE DATABASE nodejs', function (err, result) {
        ;
    });
});


module.exports = con


app.get('/', function (req, res) {
    res.render('index.ejs')
})



app.use('/', require('./routes/users.js'));
app.use('/', require('./routes/works.js'));
app.use('/', require('./routes/requests.js'));
app.use('/', require('./routes/samples.js'));


app.get('/test', function (req, res) {
    res.send('test')
})

app.get('/write', (req, res) => {
    res.render('write.ejs')
});

app.post('/write/add', (req, res) => {
    res.send('done')
    console.log(req.body)
    console.log(req)
})

app.post('/write/save', (req, res) => {
    res.send('done')
    console.log(req.body)
})



app.use((req, res, next) => {
    res.render('404.ejs')
});


app.listen(8080, function () {
    console.log('listening on 8080')
});