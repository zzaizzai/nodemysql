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
    dateStrings : "date",
    multipleStatements: true
});

con.connect((err) => {
    if (err) {
        console.log('error connecting: ' + err.stack);
        return;
    }
    console.log('success');
    con.query('CREATE DATABASE nodejs', function (err, result) {
        // if (err) throw err;
        const sql = "CREATE TABLE users (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, user_name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL);"

        con.query(sql, function (err, result) {
            if (err) {
            } else {
                console.log('created users table');
            }
        });

        const sql2 = "CREATE TABLE works (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, title VARCHAR(255) NOT NULL, FOREIGN KEY (user_id) REFERENCES users (id) ); "

        con.query(sql2, function (err, result) {
            if (err) {
            } else {
                console.log('created works table');
            }
        });

        const sql3 = "CREATE TABLE requests (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, title VARCHAR(255) NOT NULL, start_date date NOT NULL, isDone_date date DEFAULT NULL, due_date date, work_id int,isDone bool  DEFAULT NULL,who_did_id int ,FOREIGN KEY (work_id) REFERENCES works (id),FOREIGN KEY (who_did_id) REFERENCES users (id));"
        con.query(sql3, function (err, result) {
            if (err) {
            } else {
                console.log('created requests table');
            }
        });
    });
});


app.listen(8080, function () {
    console.log('listening on 8080')
});


app.get('/', function (req, res) {
    res.render('index.ejs')
})


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

app.get('/users', (req, res) => {
    con.connect((err) => {
        console.log('search users data');
        const sql = "select * from users"
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            console.log(result)
            res.render('users.ejs', { users: result })
        })
    })
})

app.get('/users/:id', (req, res) => {
    console.log(req.params.id)
    var user_id = parseInt(req.params.id)
    const sql = `select * from users where users.id = ${user_id} ; select * from works where works.user_id = ${user_id} ;`;
    con.query(sql, function (err, result) {
        console.log(result[0])
        console.log(result[1])

        res.render('users_detail.ejs', { users: result[0], works : result[1] })
    })
})

app.get('/works/:work_id', (req, res) => {
    var work_id = req.params.work_id
    const sql1 = `select requests.id as request_id, work_id,  title , start_date , due_date , isDone_date , who_did_id , users.user_name as who_did_name, isDone  from  requests left join users on users.id  = requests.who_did_id where requests.work_id = ${work_id}  ;`
    const sql2 = `select  min(start_date) as min_date, count(*) as count_all, (select count(*)  from requests where isDone = 1 and work_id = ${work_id}) as count_completed, (select count(*)  from requests where isDone =0 and work_id = ${work_id}) as count_not_completed  from  requests left join users on users.id  = requests.who_did_id where requests.work_id = ${work_id};`
    con.query(sql1 + sql2, function(err, result){
        console.log(result)
        res.render('work_detail.ejs', { requests: result[0], analy: result[1] })

    })
})

app.get('/requests/:request_id', (req, res) => {
    var request_id = req.params.request_id
    const sql = `select * from requests left join users on requests.who_did_id = users.id where requests.id = ${request_id}`
    con.query(sql, (err, result)=> {
        if (err) {
            console.log(err)
        }
        console.log(result)
        res.render('request_detail.ejs', {requests: result})
    })
})

app.get('/requests/mode/add', (req, res)=> {
    console.log(req.query.work_id)
    res.render('request_mode_add.ejs', {work_id: req.query.work_id})
})

app.get('/works/mode/add' ,(req, res) => {
    res.render('work_mode_add')

})

app.post('/works/mode/add/write', (req, res)=> {
    console.log(req.body)
    const sql = `insert into works(user_id, title) values("${req.body.user_id}", "${req.body.title}")`
    con.query(sql, (err, result) => {
        if (err) {
            console.log(err)
        }
        res.status(200).send({ message: "success" })
    })
})

app.delete('/users/delete', (req, res) => {
    console.log(req.body)
    req.body.id = parseInt(req.body.id)
    const sql = `delete from users where id = ${req.body.id}`
    con.query(sql, (err, result, fields) => {
        if (err) throw err;
        console.log('deleted')
        res.status(200).send({ message: "success" })
    })
})

app.post('/users/add', (req, res) => {
    console.log(req.body)
    con.connect(function (err) {
        console.log('insert users data');
        const sql = `insert into users(user_name, email) values("${req.body.name}","${req.body.email}")`
        con.query(sql, (err, result, fields) => {
            if (err) throw err;
            res.send(result)
        })
    })

})