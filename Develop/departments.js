// const userPrompt = require("./prompt.js")
// console.log(userPrompt);
const inquirer = require("inquirer");
// const userPrompt = require("../employees");

const viewDepartments = async (connection, userPrompt) => {
    const sqlQuery = "SELECT * FROM department";

    const [rows, fields] = await connection.query(sqlQuery);

    console.table(rows);

    await userPrompt(connection);
};

const viewDepartmentsNoPrompt = async (connection) => {
    const sqlQuery = "SELECT * FROM department";

    const [rows, fields] = await connection.query(sqlQuery);

    console.table(rows);
};

const addDepartment = async (connection) => {
    try {
        await viewDepartmentsNoPrompt(connection);

        const departmentName = await getDepartmentInfo(connection);

        const sqlQuery = "INSERT INTO department SET ?";
        const params = {
            name: `${departmentName.departmentName}`,
        }

        const [rows, fields] = await connection.query(sqlQuery, params);

        console.table(rows);

        await viewDepartmentsNoPrompt(connection);
        await userPrompt(connection);
    } catch (error) {
        console.log(error);
    }
};

const getDepartments = async (connection) => {
    sqlQuery = "SELECT name FROM department";

    const [rows, fields] = await connection.query(sqlQuery);

    console.table(rows)

    return rows;
};

const getDepartmentInfoDelete = async (connection) => {
    const userInput = await inquirer
        .prompt([
            {
                type: "input",
                name: "departmentName",
                message: "What is the name of the Department you would like to delete?"
            }
        ])
    return userInput;
};

const getDepartmentInfo = async (connection) => {
    const userInput = await inquirer
        .prompt([
            {
                type: "input",
                name: "departmentName",
                message: "What is the name of the Department you would like to add?"
            }
        ])
    return userInput;
};

const getDepartmentID = async (connection, userInput) => {
    const sqlQuery = "SELECT id FROM department WHERE ?"

    const params = { name: userInput.selectedDepartment };

    const [rows, fields] = await connection.query(sqlQuery, params);

    console.table(rows)

    return rows[0];
};

const deleteDepartment = async (connection, userInput) => {
    departmentID = await getDepartmentInfoDelete(connection, userInput);
}

module.exports = {
    viewDepartments: viewDepartments,
    viewDepartmentsNoPrompt: viewDepartmentsNoPrompt,
    addDepartment: addDepartment,
    getDepartmentInfoDelete: getDepartmentInfoDelete,
    getDepartmentInfo: getDepartmentInfo,
    getDepartmentID: getDepartmentID,
    deleteDepartment: deleteDepartment,
    getDepartments: getDepartments
}

