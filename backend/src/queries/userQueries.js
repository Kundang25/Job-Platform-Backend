const { query } = require('../config/db');

const findUserByEmail = async (email) => {
  const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0];
};

const findUserById = async (id) => {
  const { rows } = await query(
    'SELECT id, name, email, role, is_verified, avatar_url, created_at FROM users WHERE id = $1',
    [id]
  );
  return rows[0];
};

const createUser = async ({ name, email, hashedPassword }) => {
  const { rows } = await query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, 'student')
     RETURNING id, name, email, role, is_verified, created_at`,
    [name, email, hashedPassword]
  );
  return rows[0];
};

const updateLastLogin = async (id) => {
  await query('UPDATE users SET last_login = now() WHERE id = $1', [id]);
};

module.exports = { findUserByEmail, findUserById, createUser, updateLastLogin };
