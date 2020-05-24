const mysql = require("mysql2/promise");
const inquirer = require("inquirer");
const departments = require("./Develop/departments");
const role = require("./Develop/role");
const employee = require("./Develop/employee");
// const userPrompt = require("./Develop/prompt");

// const PORT = process.env.PORT || 8080;
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
        await userPrompt(connection);

    } catch (error) {
        console.log(error);
    }
};

async function userPrompt(connection) {
    const userInput = await inquirer
        .prompt([
            {
                type: "list",
                name: "optionPicked",
                message: "Which of the following would you like to do?",
                choices:
                    [
                        "Add Employee",
                        "Add Department",
                        "Add Role",
                        "View Departments",
                        "View Roles",
                        "View Employees",
                        // "View Employees by Manager",
                        // "Update Employee",
                        // "Update Employee Manager",
                        // "Update Employee Role",
                        // "Delete Department",
                        // "Delete Role",
                        // "Delete Employee",
                        "Exit"
                    ]
            }
        ])
    switch (userInput.optionPicked) {
        case "Add Employee":
            employee.addEmployee(connection, userPrompt);
            break;
        case "Add Department":
            departments.addDepartment(connection, userPrompt);
            break;
        case "Add Role":
            role.addRole(connection, userPrompt);
            break;
        case "View Departments":
            departments.viewDepartments(connection, userPrompt);
            break;
        case "View Roles":
            role.viewRoles(connection, userPrompt);
            break;
        case "View Employees":
            employee.viewEmployees(connection, userPrompt);
            break;
        case "View Employees by Manager":
            employee.viewEmployeesByManager(connection, userPrompt);
            break;
        case "Update Employee Role":
            employee.updateEmployeeRole(connection, userPrompt);
            break;
        case "Update Employee Manager":
            employee.updateEmployeeManager(connection, userPrompt);
            break;
        case "Delete Department":
            departments.deleteDepartment(connection, userPrompt);
            break;
        case "Delete Role":
            role.deleteRole(connection, userPrompt);
            break;
        case "Delete Employee":
            employee.deleteEmployee(connection, userPrompt);
        case "Exit":
            connection.end();
        default:
            console.log("Please chose an Employee to add.");
    }
};

main();

module.exports = userPrompt;