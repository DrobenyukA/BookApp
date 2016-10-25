var express       = require('express'),
    bodyParser    = require('body-parser'),
    //usersModule   = require('./modules/UsersModule'),
    //configsModule = require('./modules/ConfigModule'),
    //book          = require('./modules/BookModule'),
    app           = express(),
    PORT          = 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));


app.listen(PORT, function () {
    console.log('Example app listening on port ' + PORT + '!');
});
