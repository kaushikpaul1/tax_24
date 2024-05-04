const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'signup',
    password: '12345',
    port: 5432, 
});


const bcrypt = require('bcrypt');

const createUser = (name, email, password, role, callback) => {
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return callback(err);
        }
        const sql = "INSERT INTO signup (name, email, password,role) VALUES ($1, $2, $3, $4)";
        const values = [name, email, hash, role];
        pool.query(sql, values, callback);
    });
};

// In the login function, you'll need to compare hashed passwords
const getUserByEmail = (email, callback) => {
    const sql = "SELECT * FROM signup WHERE email = $1";
    pool.query(sql, [email], (err, result) => {
        if (err) {
            return callback(err);
        }
        callback(null, result);
    });
};



module.exports = {
    createUser,
    getUserByEmail
};
