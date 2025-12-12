const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query(
            'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
            [name, email, hashedPassword, role || 'USER']
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Full Registration Error:", JSON.stringify(error, null, 2), error.code);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Registration failed' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(400).json({ error: 'User not found' });

        const user = result.rows[0];
        if (await bcrypt.compare(password, user.password_hash)) {
            const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret');
            res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
        } else {
            res.status(403).json({ error: 'Invalid password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
};

module.exports = { register, login };
