const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'mrking@89', 
    database: 'employee_db'
});

// Connect to MySQL
db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// Get all employees
app.get('/employees', (req, res) => {
    db.query('SELECT * FROM employees', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Add a new employee
app.post('/employees', (req, res) => {
    const { firstName, lastName, age } = req.body;
    const sql = 'INSERT INTO employees (firstName, lastName, age) VALUES (?, ?, ?)';
    db.query(sql, [firstName, lastName, age], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, firstName, lastName, age });
    });
});

// Update an employee
app.put('/employees/:id', (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, age } = req.body;
    const sql = 'UPDATE employees SET firstName = ?, lastName = ?, age = ? WHERE id = ?';
    db.query(sql, [firstName, lastName, age, id], (err, result) => {
        if (err) throw err;
        res.json({ id, firstName, lastName, age });
    });
});

// Delete an employee
app.delete('/employees/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM employees WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Employee deleted' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});