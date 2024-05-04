// controllers/AuthController.js
const User = require('../models/User');


const signup = (req, res) => {
    const { name, email, password, role } = req.body;
    // Check if role is provided
    if (!role) {
        return res.status(400).json({ error: "Role is required" });
    }
    User.createUser(name, email, password, role, (err, result) => {
        if (err) {
            console.error("Error signing up:", err);
            return res.status(500).json({ error: "Error signing up" });
        }
        return res.json({ success: true, message: "Signup successful" });
    });
};


const bcrypt = require('bcrypt');

const login = (req, res) => {
    const { email, password, role } = req.body;
    // Check if role is provided
    if (!role) {
        return res.status(400).json({ error: "Role is required" });
    }
    User.getUserByEmail(email, (err, result) => {
        if (err) {
            console.error("Error querying database:", err);
            return res.status(500).json({ error: "Error querying database" });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = result.rows[0];
        // Compare the provided password with the hashed password in the database
        bcrypt.compare(password, user.password, (bcryptErr, bcryptResult) => {
            if (bcryptErr) {
                console.error("Error comparing passwords:", bcryptErr);
                return res.status(500).json({ error: "Error comparing passwords" });
            }
            if (!bcryptResult) {
                // Passwords don't match
                return res.status(401).json({ error: "Incorrect password" });
            }
            // Check if user role matches provided role
            if (user.role !== role) {
                return res.status(403).json({ error: "Unauthorized access" });
            }
            // Return only necessary user data
            const userData = {
                name: user.name,
                role: user.role
            };
            // Check user role here and perform role-based actions
            if (user.role === 'admin') {
                // Admin role
                // Example: Redirect to admin dashboard
                return res.json({ success: true, message: "Admin login successful", user: userData });
            } else if (user.role === 'subadmin') {
                // User role
                // Example: Redirect to user dashboard
                return res.json({ success: true, message: "Subadmin login successful", user: userData });
            }
            else if (user.role === 'user') {
                // User role
                // Example: Redirect to user dashboard
                return res.json({ success: true, message: "User login successful", user: userData });
            }

            else {
                // Unknown role
                return res.status(403).json({ error: "Unauthorized access" });
            }
        });
    });
};
const logout = (req, res) => {
    // Here you would typically invalidate the user's session or token
    // For example, if you're using sessions:
    req.session.destroy(err => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).json({ error: "Error logging out" });
        }
        return res.json({ success: true, message: "Logout successful" });
    });

    // If you're using JWT tokens, you might want to blacklist the token
    // and make sure it's not valid anymore.
};

module.exports = {
    signup,
    login,
    logout
};
