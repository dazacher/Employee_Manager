// const userPrompt = require("./prompt.js")
const inquirer = require("inquirer");
const department = require("./departments")
const role = require("./role")

const viewEmployees = async (connection) => {
    const sqlQuery = "SELECT * FROM employee";

    const [rows, fields] = await connection.query(sqlQuery);

    console.table(rows);

    await userPrompt(connection);
};

const viewEmployeesNoPrompt = async (connection) => {
    const sqlQuery = "SELECT * FROM employee";

    const [rows, fields] = await connection.query(sqlQuery);

    console.table(rows);

};


const addEmployee = async (connection, userPrompt) => {
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
            manager_id: employeeInfo.managerID,
        }

        const [rows, fields] = await connection.query(sqlQuery, params);

        console.table(rows);
    } catch (error) {
        console.log(error);
    }

    await viewEmployeesNoPrompt(connection);
    await userPrompt(connection);
};

const getEmployeeInfo = async (connection, userPrompt) => {
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
                    employees.push("None");
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
                    const rows = await role.getRoles(connection);
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
    const roleID = await role.getRoleID(connection, userInput);

    console.log("-----------------------------" + managerID);
    return { userInput, managerID, roleID }
};

const getManager = async (connection) => {
    sqlQuery = "SELECT first_name, last_name FROM employee";

    const [rows, fields] = await connection.query(sqlQuery);

    console.table(rows)

    return rows;
};

const getManagerID = async (connection, userInput) => {
    if (userInput.selectedManager === "None") {
        return null;
    }

    sqlQuery = "SELECT id FROM employee WHERE ? AND ?"
    lastName = userInput.selectedManager.split(" ")[1];
    firstName = userInput.selectedManager.split(" ")[0];
    console.log(lastName + " " + firstName);
    params = [{ first_name: firstName }, { last_name: lastName }];

    const [rows, fields] = await connection.query(sqlQuery, params);

    console.table(rows)

    return rows[0].id;
};

module.exports = {
    viewEmployees: viewEmployees,
    viewEmployeesNoPrompt: viewEmployeesNoPrompt,
    addEmployee: addEmployee,
    getEmployeeInfo: getEmployeeInfo,
    getManager: getManager,
    getManagerID: getManagerID
}