require('./app/index')
const express = require('express')
const app = express()
const path = require('path')
const exphbs = require('express-handlebars')
var port = process.env.PORT || 8000

//Http server

var server = app.listen(port);
console.log('Listening on port ' + port);

app.get('/', (request, response) => {
  response.render('home', {})
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
