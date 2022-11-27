var router = require('express').Router();
const con = require('./../server.js')

router.get('/works/:work_id', (req, res) => {
    var work_id = req.params.work_id
    const sql1 = `select requests.request_id as request_id, work_id,  title , start_date , due_date , isDone_date , who_did_id , users.user_name as who_did_name, isDone  from  requests left join users on users.user_id  = requests.who_did_id where requests.work_id = ${work_id}  order by requests.due_date ;`
    const sql2 = `select  min(start_date) as min_date, count(*) as count_all, (select count(*)  from requests where isDone = 1 and work_id = ${work_id}) as count_completed, (select count(*)  from requests where isDone =0 and work_id = ${work_id}) as count_not_completed  from  requests left join users on users.user_id  = requests.who_did_id where requests.work_id = ${work_id};`
    const sql3 = `select * from works left join users on works.user_id  where works.user_id = users.user_id  and  works.work_id = ${req.params.work_id}`
    con.query(sql1 + sql2 + sql3, function (err, result) {
        console.log(result)
        res.render('work_detail.ejs', { requests: result[0], analy: result[1], work_and_client: result[2] })
    })
})


router.get('/works/mode/add', (req, res) => {
    res.render('work_mode_add.ejs')
})

router.get('/works/mode/edit', (req, res) => {
    work_id_in_query = "0"
    if (req.query.work_id) {
        work_id_in_query = req.query.work_id
    }
    const sql = `select * from works where work_id = ${work_id_in_query}`
    con.query(sql, (err, result) => {
        console.log(result)
        res.render('work_mode_edit.ejs', { work_edit: result[0] })
    })
})


router.post('/works/mode/add/write', (req, res) => {
    console.log(req.body)
    const sql = `insert into works(user_id, title) values("${req.body.user_id}", "${req.body.title}")`
    con.query(sql, (err, result) => {
        if (err) {
            console.log(err)
        }
        res.status(200).send({ message: "success" })
    })
})

router.post('/works/mode/edit/write', (req, res) => {
    console.log(req.body)
    const sql = `update works set title = "${req.body.title}", purpose_text = "${req.body.purpose_text}" where work_id = ${req.body.work_id}`
    con.query(sql, (err, result) => {
        if (err) {
            console.log(err)
        }
        res.status(200).send({ message: "success" })
    })
})


module.exports = router;