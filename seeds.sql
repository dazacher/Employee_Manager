USE employees_db;

INSERT INTO department (name)
VALUES ("Accountant");

INSERT INTO department (name)
VALUES ("Lead Engineer");

INSERT INTO department (name)
VALUES ("Legal Team Lead");

INSERT INTO department (name)
VALUES ("Lawyer");

INSERT INTO department (name)
VALUES ("Software Engineer");

INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer",  95000, 5);

INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer",  125000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Accountant",  165000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Legal Team Lead",  205000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Lawyer",  185000, 4);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Danyal",  "Khalid", 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Dee Ann",  "Scanniello", 5, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Esme",  "Rodriguez", 5, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tom",  "Black", 5, 1);


