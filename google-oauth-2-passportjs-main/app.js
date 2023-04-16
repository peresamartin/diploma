var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var sql = require('./databasepg');
var id = require('./authenticate');
const forecast = require("./build/Release/forecast.node");
module.exports = forecast;
var cpp = require("./sqlcommands");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { profile, Console } = require('console');

var app = express();

app.use(express.json());

app.post("/newdatas", async (req,res) => {

    
    const {data} = req.body;
    const {eat} = req.body;
    const {time} = req.body;
    
    
    if(id.id != null)
    {
      console.log(data);
      console.log(eat);
      console.log(time);
      
       obj = await cpp.cppanswer(id, data, eat, time);
       console.log(obj);
       var result = [];
       for(var key in obj)
       {
          if(obj.hasOwnProperty(key))
          {
            console.log(key, obj[key]);
            result.push({time: key, bglPrediction: obj[key]});
          }
       }
       res.contentType('application/json');
      res.end(JSON.stringify(result));
      

    }
});


//google login
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(passport.initialize());

require('./authenticate');

app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  //res.redirect('/');
  res.end("asd");
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((user, done) => {
    done(null, user);
})



module.exports = app;
