const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config()
app.use(bodyParser.urlencoded({ extended: true }));


const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'nodejs'
});

con.connect((err) => {
    if (err) {
        console.log('error connecting: ' + err.stack);
        return;
    }
    console.log('success');
    con.query('CREATE DATABASE nodejs', function (err, result) {
        // if (err) throw err;
        const sql = 'CREATE TABLE users (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL)';
        con.query(sql, function (err, result) {
            // if (err) throw err;
            // console.log('table created');
        });
    });
});



app.listen(8080, function () {
    console.log('listening on 8080')
});


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/templates/index.html')
})


app.get('/test', function (req, res) {
    res.send('test')
})

app.get('/write', (req, res) => {
    res.sendFile(__dirname + '/templates/write.html')
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

app.get('/users', (req, res) => {
    con.connect((err) =>{
        console.log('search users data');
        const sql = "select * from users"
        con.query(sql, function(err, result, fields) {
            if (err) throw err;
            console.log(result)
        })
        
    })
    res.send('done')
})

app.post('/users/add', (req, res) => {
    console.log(req.body)
    con.connect(function(err){
        console.log('insert users data');
        const sql = `insert into users(name, email) values("${req.body.name}","${req.body.email}")`
        con.query(sql, (err, result, fields)=>{
            if (err) throw err;
        })
    })
    res.send('done')
})