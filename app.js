var express = require('express')
var ejs = require('ejs')
var cookieParser = require('cookie-parser')
var expressSession = require('express-session')
var bodyParser = require('body-parser')
var multer = require('multer')

var app = express()
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.set('view engine','ejs')
//app.engine( '.html', require( 'ejs' ).__express );
app.set('port',process.env.PORT||3000)

app.use(express.static(__dirname+'/public'))


app.get('/',function (req,res) {
    res.render('login')
})



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
