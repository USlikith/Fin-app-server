// routes/userRoutes.js
import  { Router } from 'express';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
const router = Router();

// Middleware to connect to MySQL
import connectToMySQL from '../middleware/mysqlConnection.js';

// Use the MySQL connection middleware
router.use(connectToMySQL);

// Register new user
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const db = req.db;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        const hashedPassword = await hash(password, 10);
        db.query(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword],
            (err, results) => {
                if (err) {
                    return res.status(500).json({ message: 'Error registering user.' });
                }
                res.status(201).json({ message: 'User registered successfully!' });
            }
        );
    } catch (err) {
        res.status(500).json({ message: 'Error hashing password.' });
    }
});

// Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const db = req.db;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    db.query(
        'SELECT * FROM users WHERE username = ?',
        [username],
        async (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching user.' });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }

            const user = results[0];

            try {
                const match = await compare(password, user.password);
                if (!match) {
                    return res.status(401).json({ message: 'Invalid credentials.' });
                }

                const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
                res.json({ token });
            } catch (err) {
                console.log(err)
                res.status(500).json({ message: 'Error comparing passwords.' });
            }
        }
    );
});

// Logout (for simplicity, we won't implement logout functionality as it's typically handled client-side by removing the token)
router.post('/logout', (req, res) => {
    res.json({ message: 'Logout successful.' });
});

export default router;
