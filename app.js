
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const adminRoutes = require('./routes/admin-routes.js')
const shopRoutes = require('./routes/shop-routes.js')
const errorController = require('./controllers/error.js')
const sequelize = require('./util/database.js')
const Product = require('./models/product-model.js')
const User = require('./models/user-model.js')
// const { constants } = require('buffer')
const Cart = require('./models/cart.js')
const CartItem = require('./models/cart-item.js')
const Order = require('./models/order.js')
const OrderItem = require('./models/order-item.js')

const app = express();
app.set('view engine', 'ejs')
app.set('views', 'views')

// db.execute('SELECT * FROM products').then(results => {
//     console.log(results[0])
// }).catch(err => {
//     console.log(err)
// })

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
// app.use((req, res, next) => {
//     console.log('in middle ware')
//     next() // Allows the request to continue to the next moddleware in line
// })
app.use((req, res, next) => {
    User.findByPk(1).then(user => {
        req.user = user
        next();
    }).catch(err => {
        console.log(err)
    })
})
app.use('/admin', adminRoutes)

app.use(shopRoutes)

app.use(errorController.get404)


Product.belongsTo(User, { constants: true, onDelete: 'CASCADE' })

User.hasMany(Product)
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, { through: CartItem })
Order.belongsTo(User)
User.hasMany(Order)
Order.belongsToMany(Product, { through: OrderItem })

sequelize.sync().then(result => {
    // console.log(result)
    return User.findByPk(1)
}).then(user => {
    if (!user) {
        return User.create({
            name: 'Nisar',
            email: 'nisarh039@gmail.com',
        })
    }
    return user
}).then(user => {
    return user.createCart();

}).then(cart => {
    app.listen(3000)
}).catch(err => {
    console.log(err)
})
