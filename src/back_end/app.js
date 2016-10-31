var express       = require('express'),
    bodyParser    = require('body-parser'),
    usersModule   = require('./modules/UsersModule'),
    configsModule = require('./modules/ConfigModule'),
    book          = require('./modules/BookModule'),
    app           = express(),
    PORT          = 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.listen(PORT, function () {
    console.log('Example app listening on port ' + PORT + '!');
});

/* ==> User routes <== */
app.post('/check-login', function (req, res) {
    res.send(usersModule.isAvailableLogin(req.body)) ;
});

app.post('/register-user', function (req, res) {
    res.send(usersModule.registered(req.body)) ;
});

app.post('/authenticate', function (req, res) {
    res.send(usersModule.authenticate(req.body));
});

/* ==> Config routes <== */
app.get('/config', function(req, res){
    var userId = usersModule.getUserId(req.headers.token);
    res.send(configsModule.getUserConfig(userId));
});
app.post('/config', function(req, res){
    var userId = usersModule.getUserId(req.headers.token);
    res.send(configsModule.saveConfig(req.body, userId));
});

/* ==> Book routes <== */
       // /save-book
app.post('/book', function (req, res) {
    var userId = usersModule.getUserId(req.headers.token);
    res.send(book.saveBook(req.body, userId));
});

app.get('/user-books', function(req, res){
    var userId = usersModule.getUserId(req.headers.token);
    res.send(book.getBook(userId));
});

app.post('/user-books', function(req, res){
    var userId = usersModule.getUserId(req.headers.token);
    // console.log(req.body);
    // console.log(userId);
    res.send(book.saveBook(req.body, userId));
});



