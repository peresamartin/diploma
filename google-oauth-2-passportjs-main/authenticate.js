var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var sql = require('./databasepg');
var id;

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((user, done) => {
    done(null, user);
})

passport.use(new GoogleStrategy({
    clientID: '559167877399-6inrqdvql3cai6kcrs7pthp8el7pjuqj.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "http://diplomaforecast.com:3000/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // Register user here.
    //console.log(profile.id);
    var userIs;
    sql.client.query(`select * from public.felhasznalo where google_id = '`+profile.id+`'`,(err, res)=>{
        if(err)
        {
          console.log(err.message);
        }
        else
        {
          if(res.rowCount<1)
          {
            sql.client.query(`INSERT INTO public."felhasznalo"(google_id, felh_tipus) values ('`+profile.id+`', 0)`, (err,res )=>{
              if(err)
              {
                console.log(err.message);
              }
              sql.client.end;
            });
            cb(null, profile);
          }
          else
          {
            sql.client.end;
            cb(null, profile);
          }
        }
    });
    
    module.exports.id=profile.id;
}
));


