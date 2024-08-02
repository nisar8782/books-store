
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const adminRoutes = require('./routes/admin-routes.js')
const shopRoutes = require('./routes/shop-routes.js')
const errorController = require('./controllers/error.js')

const app = express();
app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
// app.use((req, res, next) => {
//     console.log('in middle ware')
//     next() // Allows the request to continue to the next moddleware in line
// })
app.use('/admin', adminRoutes)

app.use(shopRoutes)

app.use(errorController.get404)
app.listen(3000)