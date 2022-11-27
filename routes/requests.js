var router = require('express').Router();
const con = require('./../server.js')


router.get('/requests/:request_id', (req, res) => {
    var request_id = req.params.request_id
    const sql_current = `select requests.request_id, title, start_date , due_date , work_id , isDone , former_request_id , users.user_id, user_name from requests left join users on requests.who_did_id = users.user_id where requests.request_id = ${request_id};`
    const sql_former = `select * from requests where request_id in (select former_request_id  from requests where request_id = ${request_id});`
    const sql_following = `select * from requests where former_request_id = ${request_id};`
    con.query(sql_current + sql_former + sql_following, (err, result) => {
        if (err) { throw err }
        console.log(result)
        res.render('request_detail.ejs', { requests: result[0], requests_former: result[1], requests_foll: result[2] })
    })
})

router.get('/requests/:requests_id/get_comments', (req, res) => {
    var request_id = req.params.requests_id
    const sql_comments = `select * from request_comments left join users on request_comments.comment_user_id = users.user_id where request_comments.request_id = ${request_id}`
    con.query(sql_comments, (err, result) => {
        console.log(result)
        res.send({ comments: result })
    })

})


router.get('/requests/mode/add', (req, res) => {
    var work_id_in_query = "0"

    if (req.query.work_id) {
        work_id_in_query = req.query.work_id
    }
    console.log(work_id_in_query)
    const sql = `select * from works left join users on works.user_id  where works.user_id = users.user_id  and works.work_id = ${work_id_in_query};`
    const sql_request_list = `select title, request_id  from requests where work_id = ${work_id_in_query};`
    con.query(sql + sql_request_list, (err, result) => {
        if (err) {
            console.log(err)
        }
        console.log(result)
        res.render('request_mode_add.ejs', { work_id: work_id_in_query, works: result[0], request_list: result[1] })
    })
    // res.render('request_mode_add.ejs', {work_id: req.query.work_id})
})

module.exports = router;