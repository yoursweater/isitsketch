require('./app/index')
var express = require('express')
var request = require('request');
var app = express()
var path = require('path')
var exphbs = require('express-handlebars')

//Http server

var port = process.env.PORT || 8000
var server = app.listen(port);
console.log('Listening on port ' + port);

app.get('/', (request, response) => {
  response.render('home')
})


//Views

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts')
}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))

//serve static files

app.use(express.static(path.join(__dirname, 'public')));
