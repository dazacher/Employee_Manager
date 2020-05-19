const mysql = require("mysql2/promise");
const inquirer = require("inquirer");

const main = async () => {
    try {
        const connection = await mysql.createConnection({
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

const viewDepartments = async (connection) => {
    const sqlQuery = "SELECT * FROM department";

    const [rows, fields] = await connection.query(sqlQuery);

    console.table(rows);

    userPrompt(connection);
}

const viewRoles = async (connection) => {
    const sqlQuery = "SELECT * FROM role";

    const [rows, fields] = await connection.query(sqlQuery);

    console.table(rows);

    userPrompt(connection);
}

const viewEmployees = async (connection) => {
    const sqlQuery = "SELECT * FROM employee";

    const [rows, fields] = await connection.query(sqlQuery);

    console.table(rows);

    userPrompt(connection);
}

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
                        "View Employees by Manager",
                        // "Update Employee",
                        // "Update Employee Manager",
                        "Update Employee Role",
                        "Delete Department",
                        "Delete Role",
                        "Delete Employee",
                        "Exit"
                    ]
            }
        ])
    switch (userInput.optionPicked) {
        case "Add Employee":
            addEmployee(connection);
            break;
        case "Add Department":
            addDepartment(connection);
            break;
        case "Add Role":
            addRole(connection);
            break;
        case "View Departments":
            viewDepartments(connection);
            break;
        case "View Roles":
            viewRoles(connection);
            break;
        case "View Employees":
            viewEmployees(connection);
            break;
        case "View Employees by Manager":
            viewEmployeesByManager(connection);
            break;
        case "Update Employee Role":
            updateEmployeeRole(connection);
            break;
        case "Update Employee Manager":
            updateEmployeeManager(connection);
            break;
        case "Delete Department":
            deleteDepartment(connection);
            break;
        case "Delete Role":
            deleteRole(connection);
            break;
        case "Delete Employee":
            deleteEmployee(connection);
        case "Exit":
            connection.end();
        default:
            console.log("Please chose an Employee to add.");
    }
}

const addEmployee = async (connection) => {
    try {
        const employeeInfo = await getEmployeeInfo(connection);
        console.log(employeeInfo);
        console.log("----------------------------------------------------");
        console.log(employeeInfo.userInput.firstName);
        console.log("----------------------------------------------------");
        console.log("Adding Employee....................");
        const sqlQuery = "INSERT INTO employee SET ?";
        const params = {
            first_name: `${employeeInfo.userInput.firstName}`, 
            last_name: `${employeeInfo.userInput.lastName}`, 
            role_id: employeeInfo.roleID.id, 
            manager_id: employeeInfo.managerID.id
        }

        const [rows, fields] = await connection.query(sqlQuery, params);

        console.table(rows);
    } catch (error) {
        console.log(error);
    }

    userPrompt(connection);
}


const getEmployeeInfo = async (connection) => {
    const userInput = await inquirer
        .prompt([
            {
                type: "input",
                name: "firstName",
                message: "What is the Employees first name?"
            }
            ,
            {
                type: "input",
                name: "lastName",
                message: "What is the employees last name?"
            },
            {
                type: "list",
                name: "selectedManager",
                message: "Please select a manager:",
                choices: async () => {
                    const rows = await getManager(connection);
                    let employees = [];
                    for (let i = 0; i < rows.length; i++) {
                        employees.push(rows[i].first_name + " " + rows[i].last_name);
                    }
                    console.log(rows);
                    console.log(employees);
                    return employees;
                }
            },
            {
                type: "list",
                name: "selectedRole",
                message: "What role will this employee play:",
                choices: async () => {
                    const rows = await getRoles(connection);
                    let roles = [];
                    for (let i = 0; i < rows.length; i++) {
                        roles.push(rows[i].title);
                    }
                    console.log(rows);
                    console.log(roles);
                    return roles;
                }
            }
        ])

    const managerID = await getManagerID(connection, userInput);
    const roleID = await getRoleID(connection, userInput);

    return { userInput, managerID, roleID }
}

const getManager = async (connection) => {
    sqlQuery = "SELECT first_name, last_name FROM employee";

    const [rows, fields] = await connection.query(sqlQuery);

    console.table(rows)

    return rows;
}

const getRoles = async (connection) => {
    sqlQuery = "SELECT title FROM role";

    const [rows, fields] = await connection.query(sqlQuery);

    console.table(rows)

    return rows;
}

const getManagerID = async (connection, userInput) => {
    sqlQuery = "SELECT id FROM employee WHERE ? AND ?"
    lastName = userInput.selectedManager.split(" ")[1];
    firstName = userInput.selectedManager.split(" ")[0];
    console.log(lastName + " " + firstName);
    params = [{ first_name: firstName }, { last_name: lastName }];

    const [rows, fields] = await connection.query(sqlQuery, params);

    console.table(rows)

    return rows[0];
}

const getRoleID = async (connection, userInput) => {
    sqlQuery = "SELECT id FROM role WHERE ?"
    // lastName = userInput.selectedManager.split(" ")[1];
    // firstName = userInput.selectedManager.split(" ")[0];
    // console.log(lastName + " " + firstName);
    params = { title: userInput.selectedRole };

    const [rows, fields] = await connection.query(sqlQuery, params);

    console.table(rows)

    return rows[0];
}
main();