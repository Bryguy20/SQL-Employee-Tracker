INSERT INTO department ( name)
VALUES
(' Engineering '),
( ' Finance '),
( ' Legal '),
( ' Sales ');

INSERT INTO role (title, salary, department_id)
VALUES
( ' Sales Lead ', 90000, 4 ),
( ' Accountant ', 100000, 2),
( ' Salesperson ', 80000, 4 ),
( ' Lead Engineer ', 150000, 1),
( ' Software Engineer ', 120000, 1 ),
( ' Account Manager ', 160000, 2),
( ' Legal Team Lead ', 250000, 3),
( ' Lawyer ', 190000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
( 'Brian ', ' Allen ', 1, null),
( 'Tyler ', ' Anderson ', 2, null),
( 'Satchi ', ' Arana ', 1,null),
( 'Ana ', ' Jones ', 3,null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
( 'Kelly ', ' Green ', 2, 1),
( 'Bryan ', ' Segarra ',1,2),
( 'Naraya ', ' Segarra ', 1,3),
(' Jaquel ', ' Rey ', 1, 4);

