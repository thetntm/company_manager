var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");

//get the password from the user (optional)

//create connection data
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "companyManager_DB"
});

//Connect

console.log("Connecting to SQL server...");

connection.connect(function(err) {
  if (err) throw err;
  initialInquiry();
});

//-----------INQUIRY FUNCTIONS--------------

//Inquiry Functions : These are functions that serve as menus.
//Inquiry functions will only get data for navigation purposes.

function initialInquiry() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Add a department, role, or employee",
        "View departments, roles, and employees",
        "Update an employee role",
        "exit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "Add a department, role, or employee":
        addInquiry();
        break;

      case "View departments, roles, and employees":
        viewInquiry();
        break;

      case "Update an employee role":
        updateAction();
        break;

      case "exit":
        connection.end();
        break;
      }
    });
}

function addInquiry() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to add?",
      choices: [
        "An employee",
        "A role",
        "A department",
        "back",
        "exit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "An employee":
        addEmployeeAction();
        break;

      case "A role":
        addRoleAction();
        break;

      case "A department":
        addDepartmentAction();
        break;

      case "back":
        initialInquiry();
        break;

      case "exit":
        connection.end();
        break;
      }
    });
}

function viewInquiry() {

  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to view?",
      choices: [
        "Employees",
        "Roles",
        "Departments",
        "back",
        "exit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "Employees":
        viewEmployeeAction();
        break;

      case "Roles":
        viewRoleAction();
        break;

      case "Departments":
        viewDepartmentAction();
        break;

      case "back":
        initialInquiry();
        break;
        
      case "exit":
        connection.end();
        break;
      }
    });

}

//-----------------ACTION FUNCTIONS-----------------
//Action functions: Where the action is.
//These functions will get data for the actual stuff.

//Add
function addDepartmentAction() {
  inquirer
    .prompt({
      name: "departmentName",
      type: "input",
      message: "Enter the name of the new Department: "
    })
    .then(function(answer) {
      answer.departmentName;

      var query = "INSERT INTO departments (departmentName) VALUES(?)";
      connection.query(query, answer.departmentName, function(err, res) {
        if (err) throw err;
        connection.query("SELECT * FROM departments WHERE departmentName=?", answer.departmentName, function(err, res) {
          if (err) throw err;
          console.table(res);
          initialInquiry();
        });
      });
    });
}

function addRoleAction() {
  inquirer
    .prompt([{
      name: "title",
      type: "input",
      message: "Enter the title of the new role: "
    },
    {
      name: "salary",
      type: "number",
      message: "Enter the salary of the new role: "
    },
    {
      name: "department_id",
      type: "number",
      message: "Enter the id of the department this role will belong to: "
    }])
    .then(function(answer) {
      var query = "INSERT INTO roles (title,salary,department_id) VALUES(?,?,?)";
      connection.query(query, [answer.title,answer.salary,answer.department_id], function(err, res) {
        if (err) throw err;
        connection.query("SELECT * FROM roles WHERE title=?", answer.title, function(err, res) {
          if (err) throw err;
          console.table(res);
          initialInquiry();
        });
      });
    });
}

function addEmployeeAction() {
  inquirer
    .prompt([{
      name: "first_name",
      type: "input",
      message: "Enter the first name of the new employee: "
    },
    {
      name: "last_name",
      type: "input",
      message: "Enter the last name of the new employee: "
    },
    {
      name: "role_id",
      type: "number",
      message: "Enter the id of the role this employee has: "
    },
    {
      name: "manager_id",
      type: "number",
      message: "Enter the id of the manager this employee has, if they have one: ",
      default: "NULL"
    }])
    .then(function(answer) {

      if (!answer.manager_id || answer.manager_id == "NULL") {
        var query = "INSERT INTO employees (first_name,last_name,role_id) VALUES(?,?,?)";
        connection.query(query, [answer.first_name,answer.last_name,answer.role_id], function(err, res) {
          if (err) throw err;
          connection.query("SELECT * FROM employees WHERE last_name=?", answer.last_name, function(err, res) {
            if (err) throw err;
            console.table(res);
            initialInquiry();
          });
        });
      } else {
        var query = "INSERT INTO employees (first_name,last_name,role_id,manager_id) VALUES(?,?,?,?)";
        connection.query(query, [answer.first_name,answer.last_name,answer.role_id,answer.manager_id], function(err, res) {
          if (err) throw err;
          connection.query("SELECT * FROM employees WHERE last_name=?", answer.last_name, function(err, res) {
            if (err) throw err;
            console.table(res);
            initialInquiry();
          });
        });
      }
    });
}

//View
function viewDepartmentAction() {
  connection.query("SELECT * FROM departments", function(err, res) {
    if (err) throw err;
    console.table(res);
    initialInquiry();
  });
}

function viewRoleAction() {
  connection.query("SELECT * FROM roles", function(err, res) {
    if (err) throw err;
    console.table(res);
    initialInquiry();
  });

}

function viewEmployeeAction() {
  connection.query("SELECT * FROM employees", function(err, res) {
    if (err) throw err;
    console.table(res);
    initialInquiry();
  });
}

//Update

function updateAction() {
  inquirer
    .prompt([{
      name: "employee",
      type: "number",
      message: "Enter the id of the employee you want to update: "
    },
    {
      name: "newRole",
      type: "number",
      message: "Enter the id of the new role you want to assign them to: "
    }])
    .then(function(answer) {
      var query = "UPDATE employees SET role_id = ? WHERE id = ?;";
      connection.query(query, [answer.newRole, answer.employee], function(err, res) {
        if (err) throw err;
        console.log("Role successfully changed!");
        initialInquiry();
      });
    });
}