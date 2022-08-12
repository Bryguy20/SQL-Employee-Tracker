const mysql = require('mysql2');
const inquirer = require('inquirer');
 const cTable = require('console.table');
 const chalk = require('chalk');
const figlet = require('figlet');

require('dotenv').config()

const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        port: 3306,
        password:'',
        database: 'employee_db'
    },
);
 
connection.connect((error) => {
    if (error) throw error;
    console.log(chalk.yellow.bold(`=================================`));
    console.log(``);
    console.log(chalk.greenBright.bold(figlet.textSync('Employee Tracker')));
    console.log(``);
    console.log(`                      ` + chalk.greenBright.bold('Created By: Bryan Segarra'));
    console.log(``);
    console.log(chalk.yellow.bold(`====================================`));
    promptUser();
});

const promptUser = () => {
    inquirer.prompt ([
        {
            type: 'list',
            name: 'choices',
            message: 'What would you like to?',
            choices: ['View all departments', 
                       'View all roles',
                       'View all employees',
                       'Add a department',
                       'Add a role',
                       'Add an employee',
                       'Update an employee role',
                       'Update an employee manager',
                       'View employees by department',
                       'Delete a department',
                       'Delete a role',
                       'Delete an employee',
                       'Exit']
        }
    ])
     
      .then(function(answer) {
          switch (answer.choices){
                case 'View all employees':
                    showEmployees();
                    break;
                case 'View all departments':
                    loadDepartments();
                    break;
                case 'View all roles':
                    showRoles();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Add a department':
                    addDepartments();
                    break;
                case 'Add a role':
                    addRoles();
                    break;
                case 'Update an employee role':
                    updateRole();
                    break;
                case 'Update an employee manager':
                    updateManager();
                    break;    
                case 'Delete an employee':
                    deleteEmployee();
                    break;
                case 'Delete a department':
                    deleteDepartment();
                    break;    
                case 'View employees by department':
                      employeeDepartment();
                      break;    
                case 'Delete a role':
                    deleteRole();
                    break;    
                case 'EXIT': 
                    exitApp();
                    break;
                default:
                    break;
            }
    })
         

};

// function to show all departments
function loadDepartments() {
    var query = 'SELECT * FROM employee_db.department';
    connection.query(query, function (err, res){
        if (err) throw err;
        console.log(res.length + ' department found!');
        console.table('All Department:', res); 
         promptUser();
    });
};  

// function to show all roles
function showRoles() {
   var query ='SELECT * FROM employee_db.role';
  connection.query(query, function (err, res){
    if (err) throw err;
     console.log(res.length + ' Roles found!');
     console.table('All Role:', res);
     promptUser();
   
   });      
};

// function to show all employees 
showEmployees = () => {
    const sql = 'SELECT * FROM employee_db.employee';
    connection.query(sql, (err, res) => {
    if (err) throw err;
    console.log(res.length + ' employees found!' );
    console.table('All Employees:', res)
    promptUser();
});
};


// function to add a department
function addDepartments() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDept',
            message: "What department do you want to add?",
            validate: addDept => {
                if (addDept) {
                    return true;
                } else {
                    console.log('Please enter a department');
                    return false;
                }
            }
        }
    ])
    
     .then(answer => {
         const sql = 'INSERT INTO employee_db.department (name) VALUES (?)';
     connection.query(sql, answer.addDept, (err, res) => {
         if (err) throw err;
         console.log(res.length + 'Add department');
         console.table('Added ' + answer.addDept + ' to departments!');

         loadDepartments();
     });
     });
};


// function to add a role
addRoles = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addRole',
            message: "What role do want to add?",
            validate: addRole => {
                if (addRole) {
                    return true;
                } else {
                    console.log('Please enter a role');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: "What is the salary of this role?",
            validate: addSalary => {
                if(isNaN(addSalary)) {
                   console.log('Please enter a salary'); 
                    return false;
                } else {
                   
                    return true;
                }
            }
        }
    ])

    .then(answer => {
        const params = [answer.addRole, answer.salary];

        // grab dept from department table 
        const loadDep = 'SELECT name, id FROM department';

        connection.query(loadDep, (err, data) => {
         if (err) throw err;

         const dept = data.map(({ name, id}) => ({name: name, value: id}));

         inquirer.prompt([
             {
                 type: 'list',
                 name: 'dept',
                 message: "What department is this role in?",
                 choices: dept
             }
         ])
          .then(deptChoice => {
              const dept = deptChoice.dept;
              params.push(dept);

              const sql = ` INSERT INTO role  (title, salary, department_id)  VALUES (?, ?, ?)`;
               connection.query(sql, params, (err, res) => {
                   if (err) throw err;
                   console.log(res.length + 'Add role');
                   console.table('Added' + answer.role + " to roles!");

                   showRoles();
               });             
          });
        });
    });
};


// function to add an employee
addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is the employee's first name?",
            validate: addFirst => {
                if (addFirst) {
                    return true;
                } else {
                    console.log('Please enter a first name');
                    return false
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?",
            validate: addLast => {
                if (addLast) {
                    return true;
                } else {
                    console.log('Please enter a last name');
                    return false;
                }
            }
        }
    ])

      .then(answer => {
          const params = [answer.firstName, answer.lastName]


          // grab role from the roles table
          const roleSql = `SELECT role.id, role.title FROM role`;

          connection.query(roleSql, (err, data) => {
              if (err) throw err;

              const roles = data.map(({ id, title }) => ({name: title, value: id}));

              inquirer.prompt([
                  {
                      type: 'list',
                      name: 'role',
                      message: "What is the employee's role?",
                      choices: roles
                  }
              ])

              .then(roleChoice => {
                  const role = roleChoice.role;
                  params.push(role);

                  const managerSql = `SELECT * FROM employee`;

                  connection.query(managerSql, (err, data) => {
                      if (err) throw err;

                      const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id}));

                       console.log(managers);


                      inquirer.prompt([
                          {
                              type: 'list',
                              name: 'manager',
                              message: "Who is the employee's manager?",
                              choices: managers
                          }
                      ])
                      .then(managerChoice => {
                          const manager = managerChoice.manager;
                          params.push(manager);

                          const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                          VALUES (?, ?, ?, ?)`;

                          connection.query(sql, params, (err, result) => {
                          if (err) throw err;
                          console.log("Employee has been added!")
                          
                          showEmployees();

                          });
                      });
                  });

              });
          });
      });
};


// function to update an employee role
updateRole = () => {
    //get employee from the employee table
    const employeeSql = `SELECT * FROM employee`;

    connection.query(employeeSql, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id}));

          inquirer.prompt([
              {
                  type: 'list',
                  name: 'name',
                  message: "Which employee would you like to update?",
                  choices: employees
              }
          ])

          .then(empChoice => {
              const employee = empChoice.name;
              const params = [];
              params.push(employee);

              const roleSql = `SELECT * FROM role`;

              connection.query(roleSql, (err, data) => {
                  if (err) throw err;

                  const roles = data.map(({ id, title }) => ({ name: title, value: id}));

                  inquirer.prompt([
                      {
                          type: 'list',
                          name: 'role',
                          message: "What is the employee's new role?",
                          choices: roles 
                      }
                  ])

                  .then(roleChoice => {
                  const role = roleChoice.role;
                  params.push(role);
                  
                  let employee = params[0]
                  params[0] = role
                  params[1] = employee


                   console.log(params)

                  const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                  connection.query(sql, params, (err, result) => {
                      if (err) throw err;
                      console.log("Employee has been updated!");

                      showEmployees();
                  });
                });
              });
          });
    });
};

// function to update an employee manager
updateManager = () => {
    //get employee from employee table
    const employeeSql = `SELECT * FROM employee`;

    connection.query(employeeSql, (err, data) => {
        if(err) throw err;

     const employees = data.map(({id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id}));
     
      inquirer.prompt([
          {
              type: 'list',
              name: 'name',
              message: "Which employee would you like to update?",
              choices: employees
          }
      ])

      .then(empChoice => {
          const employee = empChoice.name;
          const params = [];
          params.push(employee);

          const managerSql = `SELECT * FROM employee`;

           connection.query(managerSql, (err, data) => {
               if (err) throw err;

               const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id}));

               inquirer.prompt([
                   {
                       type: 'list',
                       name: 'manager',
                       message: "Who is the employee's manager?",
                       choices: managers
                   }
               ])
                 
               .then(managerChoice => {
                   const manager = managerChoice.manager;
                   params.push(manager);

                   let employee = params[0]
                   params[0] = manager
                   params[1] = employee


                    //console.log(params)

                   const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;

                   connection.query(sql, params, (err, result) => {
                       if (err) throw err;
                    console.log("Employee has been updated!");


                    showEmployees();

                   });
               });
           });
      });
    });
};

// function to view employee by department
employeeDepartment = () => {
    console.log('Shwoing employee by departments...\n');
    const sql = `SELECT employee.first_name,
                         employee.last_name,
                         department.name AS department 
                      FROM employee
                      LEFT JOIN role ON employee.role_id = role.id
                      LEFT JOIN department ON role.department_id = department.id `;

     connection.query(sql, (err, rows) => {
         if (err) throw err;
         console.table(rows);
         promptUser();
     });                 
};

// function to delete department 
deleteDepartment = () => {
    const deptSql = `SELECT * FROM department`;

    connection.query(deptSql, (err, data) => {
        if (err) throw err;
        
        const dept = data.map(({ name, id }) => ({ name: name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'dept',
                message: "What department do you want to delete?",
                choices: dept
            }
        ])
        .then(deptChoice => {
            const dept = deptChoice.dept;
            const sql = `DELETE FROM department WHERE id = ?`;

            connection.query(sql, dept, (err, result) => {
                if (err) throw err;
                console.log("Successfully deleted!");

                loadDepartments();
            });
        });
    });
};

// function to delete role
deleteRole = () => {
    const roleSql = `SELECT * FROM role`;

    connection.query(roleSql, (err, data) => {
        if (err) throw err;

       const role = data.map(({ title, id }) => ({ name: title, value: id }));

       inquirer.prompt([
           {
               type: 'list',
               name: 'role',
               message: "What role do you want to delete?",
               choices: role
           }
       ])
       .then(roleChoice => {
           const role = roleChoice.role;
           const sql = `DELETE FROM role WHERE id = ?`;

           connection.query(sql, role, (err, result) => {
               if (err) throw err;
               console.log("Successfully deleted!");

               showRoles();
           });
       });
    });
};


// function to delete employees
deleteEmployee = () => {
    // get employees from employee table
    const employeeSql = `SELECT * FROM employee`;

    connection.query(employeeSql, (err, data) => {
        if (err) throw err;

    const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

     inquirer.prompt([
         {
             type: 'list',
             name: ' name',
             message: "Which employee would you like to delete?",
             choices: employees 
         }
     ])

     .then(empChoice => {
         const employee = empChoice.name;

         const sql = `DELETE * FROM employee VALUES = ?`;

         connection.query(sql, employee, (err, result) => {
             if (err) throw err;
             console.log("Successfully Deleted!");

             showEmployees();

         });
     });
    });
};

// exit the app
function exitApp() {
    process.exit();
};



