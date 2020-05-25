const mysql = require("mysql2/promise");
const inquirer = require("inquirer");

const prompt = require("./Develop/promptGetUpdate");

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

// module.exports = userPrompt;