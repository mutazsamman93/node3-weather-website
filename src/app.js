const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


const app = express()
const port = process.env.PORT || 3000

// Define path for express config
const publicDirectoryPath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Step handlebars engine and views location
app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Step static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req,res) => {
    res.render('index', {
        title: 'Weather',
        name:'Mutaz'
    })
})

app.get('/about',(req,res)=>{
    res.render('about',{
        title:'About Me',
        name:'Mutaz'
    })
})

app.get('/help',(req,res) =>{
    res.render('help',{
        title:'Help page',
        helpText:'This is my help text',
        name:'Mutaz'
    })
})

app.get('/weather', (req, res) => {
    const address = req.query.address
    if(!address){
        return res.send({
            error:'You must provide an address'
        })
    }

    geocode(address, (error, {latitude, longitude, location}={}) => {
        if(error) {
            return res.send({
                error
            })
        }
        forecast(latitude, longitude, (error, forecastData={}) => {
            if(error){
                return res.send({
                    error
                })
            }
            res.send({
                address: location,
                forecast: forecastData
            })
            // console.log(location)
            // console.log(forecastData)
          })
    })

    
})

app.get('/products', (req, res) =>{
    if(!req.query.search){
       return res.send({
            error: 'you must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        product:{}
    })
})

app.get('/help/*', (req, res)=>{
    res.render('404',{
        title:'404 page',
        errorMessage:'Help article not found',
        name:'Mutaz'
    })
})

app.get('*',(req, res) => {

    res.render('404', {
        title:'404 page',
        errorMessage:'Page not found',
        name:'Mutaz'
    })
})

app.listen(port, () => {
    console.log('Server is up on port' + port)
})