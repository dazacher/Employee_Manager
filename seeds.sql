USE employees_db;

INSERT INTO department (name)
VALUES ("Accounting");

INSERT INTO department (name)
VALUES ("Engineering");

INSERT INTO department (name)
VALUES ("Manager");

INSERT INTO department (name)
VALUES ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer",  95000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer",  125000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Accountant",  165000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Legal Team Lead",  205000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Lawyer",  185000, 4);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Danyal",  "Khalid", 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Dee Ann",  "Scanniello", 1, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tom",  "Jones", 1, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jimmy",  "Hendricks", 1, 1);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Mary",  "Poppins", 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Bob",  "Smith", 5, 5);


