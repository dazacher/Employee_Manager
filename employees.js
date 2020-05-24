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
                        "Update Employee Role",
                        // "Delete Department",
                        // "Delete Role",
                        // "Delete Employee",
                        "Exit"
                    ]
            }
        ])
    switch (userInput.optionPicked) {
        case "Add Employee":
            employee.addEmployee(connection, userPrompt, getManager);
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
            updateEmployeeRole(connection);
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

const getManager = async (connection) => {
    sqlQuery = "SELECT first_name, last_name FROM employee";

    const [rows, fields] = await connection.query(sqlQuery);

    console.table(rows)

    return rows;
};

const updateEmployeeRole = async (connection) => {
    try {
        const roleInfo = await role.getRoleInfoUpdate(connection, getManager);
        console.log(roleInfo);
        employeeLastName = roleInfo.selectedEmployee.split(" ")[1];
        employeeFirstName = roleInfo.selectedEmployee.split(" ")[0];
        managerLastName = roleInfo.selectedManager.split(" ")[1];
        managerFirstName = roleInfo.selectedManager.split(" ")[0];
        let sqlQuery = "UPDATE employee ";
        sqlQuery += "SET role_id = (SELECT id FROM role WHERE ?), manager_id = (SELECT * FROM (SELECT id FROM employee WHERE ? AND ?)tblTmp) ";
        sqlQuery += "WHERE id = (SELECT * FROM(SELECT id FROM employee WHERE ? AND ?)tblTmp);";

        const params = [
            { title: roleInfo.selectedRole },
            { first_name: managerFirstName },
            { last_name: managerLastName },
            { first_name: employeeFirstName },
            { last_name: employeeLastName }
        ];

        console.log(params);
        console.log(sqlQuery);
        const [rows, fields] = await connection.query(sqlQuery, params);

        console.table(rows);
        await employee.viewEmployees(connection, userPrompt);
    } catch (error) {
        console.log(error);
    }
};



main();

module.exports = userPrompt;