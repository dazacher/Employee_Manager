const inquirer = require("inquirer");
const department = require("./departments");
const role = require("./role");

const viewEmployees = async (connection, userPrompt) => {
    let sqlQuery = "SELECT emp.id AS Employee_ID, emp.first_name, emp.last_name, r.title, r.salary, CONCAT(mgr.first_name , ' ', mgr.last_name) AS Manager, d.name AS Department_Name ";
    sqlQuery += "FROM employee emp ";
    sqlQuery += "LEFT JOIN employee mgr ON emp.manager_id = mgr.id ";
    sqlQuery += "INNER JOIN role r ON emp.role_id = r.id ";
    sqlQuery += "LEFT JOIN department d ON r.department_id = d.id ";
    sqlQuery += "ORDER BY emp.id;";

    const [rows, fields] = await connection.query(sqlQuery);

    console.table(rows);

    await userPrompt(connection);
};

const viewEmployeesNoPrompt = async (connection) => {
    let sqlQuery = "SELECT emp.id AS Employee_ID, emp.first_name, emp.last_name, r.title, r.salary, CONCAT(mgr.first_name , ' ', mgr.last_name) AS Manager, d.name AS Department_Name ";
    sqlQuery += "FROM employee emp ";
    sqlQuery += "LEFT JOIN employee mgr ON emp.manager_id = mgr.id ";
    sqlQuery += "INNER JOIN role r ON emp.role_id = r.id ";
    sqlQuery += "LEFT JOIN department d ON r.department_id = d.id ";
    sqlQuery += "ORDER BY emp.id;";

    const [rows, fields] = await connection.query(sqlQuery);

    console.table(rows);

};


const addEmployee = async (connection, userPrompt, getManager) => {
    try {
        const employeeInfo = await getEmployeeInfo(connection, getManager);
        console.log(employeeInfo);

        const sqlQuery = "INSERT INTO employee SET ?";
        const params = {
            first_name: `${employeeInfo.userInput.firstName}`,
            last_name: `${employeeInfo.userInput.lastName}`,
            role_id: employeeInfo.roleID.id,
            manager_id: employeeInfo.managerID
        };

        const [rows, fields] = await connection.query(sqlQuery, params);

        console.table(rows);
    } catch (error) {
        console.log(error);
    }

    await viewEmployeesNoPrompt(connection);
    await userPrompt(connection);
};

const getEmployeeInfo = async (connection, getManager) => {
    try {

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
        return { userInput, managerID, roleID };

    } catch (error) {
        console.log(error);
    }


};

const totalUtilizedEmployeedBudget = async (connection, userPrompt) => {
    try {

        let sqlQuery = "SELECT COUNT(*) AS Total_Employees, SUM(r.salary) AS Total_Salaries, d.name AS Department_Name ";
        sqlQuery += "FROM employee e ";
        sqlQuery += "LEFT JOIN role r ON r.id = e.role_id ";
        sqlQuery += "LEFT JOIN department d ON d.id = r.department_id ";
        sqlQuery += "GROUP BY d.id";

        const [rows, fields] = await connection.query(sqlQuery);

        console.table(rows);

        await userPrompt(connection);
    } catch (error) {
        console.log(error);
    }
};

const deleteEmployee = async (connection, userPrompt, getManager) => {

    try {
        const employeeInfo = await getEmployeeName(connection, getManager);

        const lastName = employeeInfo.selectedEmployee.split(" ")[1];
        const firstName = employeeInfo.selectedEmployee.split(" ")[0];

        let sqlQuery = "DELETE FROM employee WHERE ? AND ?;";

        const params = [{ first_name: firstName }, { last_name: lastName }];

        const [rows, fields] = await connection.query(sqlQuery, params);

        console.table(rows);

    } catch (error) {
        console.log(error);
    }

    await viewEmployeesNoPrompt(connection);
    await userPrompt(connection);
}

const getEmployeeName = async (connection, getManager) => {
    const userInput = await inquirer
        .prompt([
            {
                type: "list",
                name: "selectedEmployee",
                message: "Please select an Employee to Delete:",
                choices: async () => {
                    const rows = await getManager(connection);
                    let employee = [];
                    for (let i = 0; i < rows.length; i++) {
                        employee.push(rows[i].first_name + " " + rows[i].last_name);
                    }
                    console.log(rows);
                    console.log(employee);
                    return employee;
                }
            }
        ])
    return userInput;
}

const viewEmployeesByManager = async (connection, userPrompt) => {
    let sqlQuery = "SELECT emp.first_name, emp.last_name,  CONCAT(mgr.first_name , ' ', mgr.last_name) AS Manager ";
    sqlQuery += "FROM employee emp ";
    sqlQuery += "INNER JOIN employee mgr ON emp.manager_id = mgr.id";

    const [rows, fields] = await connection.query(sqlQuery);

    console.table(rows)

    await userPrompt(connection);

};

const getManagerID = async (connection, userInput) => {
    if (userInput.selectedManager === "None") {
        return null;
    }

    const sqlQuery = "SELECT id FROM employee WHERE ? AND ?"
    lastName = userInput.selectedManager.split(" ")[1];
    firstName = userInput.selectedManager.split(" ")[0];
    console.log(lastName + " " + firstName);
    const params = [{ first_name: firstName }, { last_name: lastName }];

    const [rows, fields] = await connection.query(sqlQuery, params);

    console.table(rows)

    return rows[0].id;
};


module.exports = {
    viewEmployees: viewEmployees,
    viewEmployeesNoPrompt: viewEmployeesNoPrompt,
    addEmployee: addEmployee,
    getEmployeeInfo: getEmployeeInfo,
    getManagerID: getManagerID,
    viewEmployeesByManager: viewEmployeesByManager,
    totalUtilizedEmployeedBudget: totalUtilizedEmployeedBudget,
    deleteEmployee: deleteEmployee
}