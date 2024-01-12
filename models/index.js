const dbConfig = require('../config/dbConfig.js')

const {Sequelize, DataTypes} = require('sequelize')

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,{
        host:dbConfig.HOST,
        dialect:dbConfig.dialect,
    }
)

sequelize.authenticate()
.then(() => {

})
.catch((error) =>{
    console.log("error", error);
})

const db = {}

db.sequelize = Sequelize
db.sequelize = sequelize

db.employees = require('./employeeModel.js')(sequelize, DataTypes)

db.sequelize.sync({ force:false })

module.exports = db
