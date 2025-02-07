const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

let students = [];
const users = [{ username: 'admin', password: '1234' }];

const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (token === 'Bearer admin-token') {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
};

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.send('admin-token');
    } else {
        res.status(401).send('Login gagal');
    }
});

// Get all students (requires authentication)
app.get('/students', authenticate, (req, res) => {
    res.json(students);
});

// Get single student by index (for editing)
app.get('/students/:index', authenticate, (req, res) => {
    const index = req.params.index;
    res.json(students[index]);
});

// Add a new student
app.post('/students', authenticate, (req, res) => {
    students.push(req.body);
    res.status(201).send();
});

// Update student data
app.put('/students/:index', authenticate, (req, res) => {
    const index = req.params.index;
    students[index] = req.body;
    res.status(200).send();
});

// Delete a student
app.delete('/students/:index', authenticate, (req, res) => {
    const index = req.params.index;
    students.splice(index, 1);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});