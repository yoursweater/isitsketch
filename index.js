require('./app/index')
const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const exphbs = require('express-handlebars')

//Http server

app.get('/', (request, response) => {
  response.render('home', {})
})

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
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
