var express = require('express')
var ejs = require('ejs')
var cookieParser = require('cookie-parser')
var expressSession = require('express-session')
var bodyParser = require('body-parser')
var multer = require('multer')

var app = express()
app.use(bodyParser.urlencoded({extended:true}))
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


app.get('/login',function (req,res) {
    res.render('login')
})


app.post('/login',function (req,res) {
    var user = {
        username:'dantegg',
        password:'dantegg'
    }
    console.log(req.body)
    if(req.body.username == user.username && req.body.password == user.password){
        req.session.user = user
        res.redirect('myspace')
    }else{
        req.session.error = '用户名或密码不正确'
        res.send(404)
    }
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
