

const Sequelize = require('sequelize')

const sequelize = new Sequelize('book_store', 'root', 'Hussain@342', {
    dialect: 'mysql',
    host: 'localhost'
})

module.exports = sequelize;



