const mysql = require("mysql")
const chalk = require("chalk")
const config = require("./config")
const log = console.log
const async = require('async')
const productionConfig = {
  HOST: 'localhost',
    USER: 'admin',
    PASSWORD: 'password',
    DATABASE: 'imgbeam'
}
const connection = mysql.createConnection({
  host: process.env.MODE == 'development' ? config.HOST : productionConfig.HOST,
  user: process.env.MODE == 'development' ? config.USER : productionConfig.USER,
  password: process.env.MODE == 'development' ? config.PASSWORD : productionConfig.PASSWORD,
  database: process.env.MODE == 'development' ? config.DATABASE : productionConfig.DATABASE,
  port: "3306",
})
connection.connect((err) => {
  if (err) {
    log(chalk.red("FAILED " + err))
    // console.log(config)
    return
  }
  log(chalk.green(`Connected to ${chalk.hex('#1ffffb').bold(config.DATABASE)} database @ ${chalk.hex('#1ffffb').bold(config.HOST)} via user:${chalk.hex('#1ffffb').bold(config.USER)}`))
})

// if tables are not present, create them here
log(chalk.blue("Checking database state..."))
check_tables()
check_admin_accounts()




// users
// connection.query(
//   `CREATE TABLE IF NOT EXISTS users (
//   id bigint unsigned NOT NULL AUTO_INCREMENT,
//   username varchar(255) NOT NULL,
//   salt varchar(255) NOT NULL,
//   hash char(60) NOT NULL,
//   email varchar(255) DEFAULT NULL,
//   phone int DEFAULT NULL,
//   PRIMARY KEY (id),
//   UNIQUE KEY id (id)
// )`,
//   (err, res) => {
//     if (err) {
//       log(chalk.red("Error querying database."))
//       return
//     }
//     if (res.fieldCount === 0) {
//       log(chalk.green("Table 'users' found, skipping..."))
//       return
//     } else {
//       log(chalk.blue("'users' table not found, building..."))
//       return
//     }
//   }
// )
// // user_relationships
// connection.query(
//   `CREATE TABLE IF NOT EXISTS user_relationships (
//     user1 varchar(255) DEFAULT NULL,
//     user2 varchar(255) DEFAULT NULL,
//     user1_id int DEFAULT NULL,
//     user2_id int DEFAULT NULL,
//     confirmed tinyint(1) NOT NULL DEFAULT 0
//   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`,
//   (err, res) => {
//     if (err) {
//       log(chalk.red("Error querying database."))
//       return
//     }
//     if (res.fieldCount === 0) {
//       log(chalk.green("Table 'user_relationships' found, skipping..."))
//       return
//     } else {
//       log(chalk.blue("'user_relationships' table not found, building..."))
//       return
//     }
//   }
// )

function check_admin_accounts(){
  let admin = {
    username: 'admin',
    password: 'sample'
  }
  let jake = {
    username: 'jake',
    password: 'sample'
  }



}

function check_tables(){
  
}


module.exports = connection
