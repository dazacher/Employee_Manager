const mysql = require("mysql2/promise");
const prompt = require("./Develop/promptGetUpdateView");
const chalk = require('chalk');
var figlet = require('figlet');
console.log(
    chalk.magentaBright.bgBlueBright(
        figlet.textSync('Employee \n Manager', { horizontalLayout: 'full', verticalLayout: 'full' })
    )
);

let connection;

const main = async () => {
    try {
        connection = await mysql.createConnection({
            host: "localhost",
            port: 3306,
            user: "root",
            password: "password",
            database: "employees_db"
        });

        console.log(`Connected to db with id: ${connection.threadId}`);
        await prompt.userPrompt(connection);

    } catch (error) {
        console.log(error);
    }
};

main();