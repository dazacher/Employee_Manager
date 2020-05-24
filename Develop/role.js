// const userPrompt = require("./prompt.js")
const departments = require("./departments");
const inquirer = require("inquirer");

const viewRoles = async (connection, userPrompt) => {
    const sqlQuery = "SELECT r.id, r.title, r.salary, d.name AS Department FROM role r INNER JOIN department d ON d.id = r.department_id ORDER BY r.id;";

    const [rows, fields] = await connection.query(sqlQuery);

    console.table(rows);

    userPrompt(connection);
};

const viewRolesNoPrompt = async (connection) => {
    const sqlQuery = "SELECT * FROM role";

    const [rows, fields] = await connection.query(sqlQuery);

    console.table(rows);
};

const addRole = async (connection, userPrompt) => {
    try {
        await viewRolesNoPrompt(connection);

        const roleInfo = await getRoleInfo(connection);
        console.log(roleInfo);
        const sqlQuery = "INSERT INTO role SET ?";
        const params = {
            title: roleInfo.userInput.roleName,
            salary: roleInfo.userInput.salary,
            department_id: roleInfo.departmentID.id
        }

        const [rows, fields] = await connection.query(sqlQuery, params);

        console.table(rows);

        await departments.viewRolesNoPrompt(connection);
        await userPrompt(connection);
    } catch (error) {
        console.log(error);
    }
};

const getRoles = async (connection) => {
    sqlQuery = "SELECT title FROM role";

    const [rows, fields] = await connection.query(sqlQuery);

    console.table(rows)

    return rows;
};

const getRoleID = async (connection, userInput) => {
    const sqlQuery = "SELECT id FROM role WHERE ?"

    const params = { title: userInput.selectedRole };

    const [rows, fields] = await connection.query(sqlQuery, params);

    console.table(rows)

    return rows[0];
};

const getRoleInfo = async (connection) => {
    const userInput = await inquirer
        .prompt([
            {
                type: "input",
                name: "roleName",
                message: "What is the name of the Role you would like to add?"
            },
            {
                type: "input",
                name: "salary",
                message: "What yearly salary is assigned to this role?"
            },
            {
                type: "list",
                name: "selectedDepartment",
                message: "What Department is this Role assigned to?",
                choices: async () => {
                    const rows = await departments.getDepartments(connection);
                    let department = [];
                    for (let i = 0; i < rows.length; i++) {
                        department.push(rows[i].name);
                    }
                    console.log(rows);
                    console.log(department);
                    return department;
                }
            }
        ])

    const departmentID = await departments.getDepartmentID(connection, userInput);

    return { userInput, departmentID };
};

module.exports = {
    viewRoles: viewRoles,
    viewRolesNoPrompt: viewRolesNoPrompt,
    addRole: addRole,
    getRoles: getRoles,
    getRoleID: getRoleID,
    getRoleInfo: getRoleInfo
}