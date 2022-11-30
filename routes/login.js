var router = require('express').Router();
const con = require('./../server.js')


const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

router.use(session({ secret: '1234', resave: true, saveUninitialized: false }));
router.use(passport.initialize());
router.use(passport.session());

function is_login(req, res, next) {
    if (req.user) {
        next()
    } else {
        res.render('login.ejs')
    }
}

router.get('/mypage', is_login, function (req, res) {
    console.log(req.user)
    res.render('mypage.ejs', {mydata: req.user})
})


router.get('/login', function (req, res) {
    res.render('login.ejs')
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/fail' }), function (req, res) {
    res.redirect('/')
});

passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'pw',
    session: true,
    passReqToCallback: false,
}, function (input_id, input_pw, done) {
    console.log(input_id, input_pw);
    const sql = `select * from accounts where id = '${input_id}'`
    con.query(sql, function (err, result) {
        login_data = result[0]
        if (err) return done(err)
        if (!login_data) return done(null, false, { message: 'account does not exist' })
        if (input_pw == login_data.pw) {
            return done(null, login_data)
        } else {
            return done(null, false, { message: 'wrong password' })
        }
    })
}));


passport.serializeUser(function (user, done) {
    done(null, user.id)
});

passport.deserializeUser(function (user_id_saved, done) {
    //user information from DB

    const sql = `select * from accounts where id = '${user_id_saved}'`
    con.query(sql, function (err, result) {
        done(null, result)
    })

});


module.exports = router;