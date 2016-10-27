var express = require('express')
var ejs = require('ejs')
var cookieParser = require('cookie-parser')
var expressSession = require('express-session')
var bodyParser = require('body-parser')
var multer = require('multer')
var mongoose = require('mongoose')

var app = express()

global.dbHandel = require('./database/dbHandel')
global.db = mongoose.connect("mongodb://localhost:27017/test")

app.use(bodyParser.urlencoded({extended:true}))
app.use(multer({ dest: './uploads/'}))
app.use(cookieParser())
app.use(bodyParser.json())

app.use(expressSession({
    secret:'secret',
    resave:true,
    saveUninitialized:true,
    cookie:{
        maxAge:1000*60*10
    }
}))



app.use(function(req, res, next){
    res.locals.user = req.session.user;
    var err = req.session.error;
    res.locals.message = '';
    if (err) res.locals.message = '<div style="margin-bottom: 20px;color:red;">' + err + '</div>';
    next();
});
app.set('view engine','ejs')
//app.engine( '.html', require( 'ejs' ).__express );
app.set('port',process.env.PORT||3000)

app.use(express.static(__dirname+'/public'))


app.get('/',function (req,res) {
    res.redirect('/login')
})

app.get('/login',function (req,res) {
    res.render('login',{message:req.session.error})
})

app.get('/logout',function (req,res) {
    req.session.user= null
    req.session.error= null
    res.redirect('/login')
})


app.post('/login',function (req,res) {
    // var user = {
    //     username:'dantegg',
    //     password:'dantegg'
    // }
    // console.log(req.body)
    // if(req.body.username == user.username && req.body.password == user.password){
    //     req.session.user = user
    //     res.redirect('myspace')
    // }else{
    //     req.session.error = '用户名或密码不正确'
    //     res.send(404)
    // }
    var User = global.dbHandel.getModel('user')
    var uname = req.body.username
    User.findOne({name:uname},function (err,doc) {
        if(err){
            res.send(500)
            console.log(err)
        }else if(!doc){
            req.session.error = 'username or password is wrong'
            res.redirect('login')
            //res.send(404)

        }else{
            if(req.body.password != doc.password){
                req.session.error = 'username or password is wrong'

                //res.send(404)
                res.redirect('login')

            }else{
                req.session.user = doc

                //
                res.redirect('myspace')
                //res.send(200)

            }
        }
    })
})

app.get('/register',function (req,res) {
    res.render('register')
})
    app.post('/register',function (req,res) {
    var User = global.dbHandel.getModel('user')
    var uname = req.body.username
    var upwd = req.body.password
    User.findOne({name:uname},function (err,doc) {
        if(err){
            res.send(500)
            req.session.error = 'network error'
            console.log(err)
        }else if(doc){
            req.session.error = 'user name has been existed'
            res.send(500)
        }else{
            User.create({
                name:uname,
                password:upwd
            },function (err,doc) {
                if(err){
                    res.send(500)
                    console.log(err)
                }else{
                    req.session.error = 'user create success'
                    res.redirect('login')
                }
            })
        }
    })
})


app.get('/myspace',function(req,res){
    if(req.session.user){
        res.render('myspace');
    }else{
        req.session.error = "请先登录"
        res.redirect('login');
    }
});


//page 404
app.use(function (req,res) {
    // res.type("text/plain");
    // res.status(404);
    // res.send('404-Not Found');
    res.status(404);
    res.render('404');
})

//page 500
app.use(function(err,req,res,next){
    console.error(err.stack);
    // res.type('text/plain');
    res.status(500);
    // res.send('500-Server Error');
    res.render('500')

})


app.listen(app.get('port'),function () {
    console.log('Express started on http://localhost:'+
        app.get('port')+';press Ctrl-C to terminate.');
})
