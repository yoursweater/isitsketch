require('./app/index')
const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const exphbs = require('express-handlebars')
var requirejs = require('requirejs');





//Http server

app.get('/', (request, response) => {

var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'google',
  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyDPMSlU4RW9QMz8ceTsBbBevwtLJvOLDAQ', // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};

var geocoder = NodeGeocoder(options);
// Using callback
geocoder.geocode('10027', function(err, res) {
  console.log(res[0]['latitude']);
  console.log(res[0]['longitude']);
});

  response.render('home', {})
})

//


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
