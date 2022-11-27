var router = require('express').Router();
const con = require('./../server.js')



router.get('/users', (req, res) => {
    const sql = "select * from users"
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(result)
        res.render('users.ejs', { users: result })
    })
})


router.get('/users/:id', (req, res) => {

    console.log(req.params.id)
    var search_val = req.query.value
    var user_id = parseInt(req.params.id)
    const sql = `select * from users where users.user_id = ${user_id} ; `;
    var sql_works = `select * from works where works.user_id = ${user_id} order by start_date desc;`

    if (search_val) {
        console.log("query exist")
        sql_works = `select * from works where works.user_id = ${user_id} and works.title like '%${search_val}%' order by start_date desc;`
    }

    con.query(sql + sql_works, function (err, result) {
        console.log(result[0])
        console.log(result[1])


        res.render('users_detail.ejs', { users: result[0], works: result[1], search_val : search_val })
    })
})


router.post('/users/add', (req, res) => {
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



router.delete('/users/delete', (req, res) => {
    console.log(req.body)
    req.body.id = parseInt(req.body.id)
    const sql = `delete from users where user_id = ${req.body.id}`
    con.query(sql, (err, result, fields) => {
        if (err) throw err;
        console.log('deleted')
        res.status(200).send({ message: "success" })
    })
})


module.exports = router;