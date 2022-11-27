var router = require('express').Router();
const con = require('./../server.js')


router.get('/samples', (req, res) => {
    const sql = `select * from samples left join requests on samples.request_id = requests.request_id left join users on samples.who_did_id  = users.user_id;  `
    con.query(sql, function (err, result) {
        if (err) { throw err }
        console.log(result)
        res.render('samples.ejs', { samples: result })

    })
})



module.exports = router;