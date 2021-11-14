const Sequelize = require("sequelize")


// production
const sequelize = new Sequelize(process.env.DATABASE_URL,{
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
       rejectUnauthorized: false
      },
    },
   }
)


//dev
// const sequelize = new Sequelize({
//     dialect: 'sqlite',
//     storage: './database.sqlite'
// })

module.exports =  sequelize