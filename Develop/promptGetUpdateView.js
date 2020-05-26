const inquirer = require("inquirer");
const departments = require("./departments");
const role = require("./role");
const employee = require("./employee");

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
                        "Update Employee Role and Manager",
                        "Total Utilized Department Budget",
                        "Delete Department",
                        // "Delete Role",
                        "Delete Employee",
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
            role.addRole(connection, userPrompt, viewRolesNoPrompt);
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
        case "Update Employee Role and Manager":
            updateEmployeeRoleAndManager(connection);
            break;
        case "Total Utilized Department Budget":
            employee.totalUtilizedEmployeedBudget(connection, userPrompt);
            break;
        case "Update Employee Manager":
            employee.updateEmployeeManager(connection, userPrompt);
            break;
        case "Delete Department":
            departments.deleteDepartment(connection, userPrompt, viewRolesNoPrompt);
            break;
        // case "Delete Role":
        //     role.deleteRole(connection, userPrompt);
        //     break;
        case "Delete Employee":
            employee.deleteEmployee(connection, userPrompt, getManager);
            break;
        case "Exit":
            connection.end();
        default:
            console.log("Please chose an Employee to option.");
    }
};

const getManager = async (connection) => {
    sqlQuery = "SELECT first_name, last_name FROM employee";

    const [rows, fields] = await connection.query(sqlQuery);

    console.table(rows)

    return rows;
};

const updateEmployeeRoleAndManager = async (connection) => {
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


const viewRolesNoPrompt = async (connection) => {
    const sqlQuery = "SELECT r.id, r.title, r.salary, d.name AS Department FROM role r LEFT JOIN department d ON d.id = r.department_id ORDER BY r.id;";

    const [rows, fields] = await connection.query(sqlQuery);

    console.table(rows);
};

module.exports = {
    userPrompt: userPrompt,
    getManager: getManager,
    updateEmployeeRoleAndManager: updateEmployeeRoleAndManager,
    viewRolesNoPrompt: viewRolesNoPrompt
}