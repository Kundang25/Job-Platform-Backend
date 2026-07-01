const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { signupSchema } = require("../validators/authValidator");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d"
    }
  );
};




const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userRole =
        role && ["student", "admin"].includes(role)
            ? role
            : "student";

    const newUser = await pool.query(
      `INSERT INTO users 
      (id, name, email, password, role, is_verified, created_at, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW())
      RETURNING id,name,email,role`,
      [
        uuidv4(),
        name,
        email,
        hashedPassword,
        userRole,
        false
      ]
    );

    const { error } = signupSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
}

    const token = generateToken(newUser.rows[0]);

    res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      user: newUser.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};





const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    await pool.query(
      "UPDATE users SET last_login = NOW() WHERE id = $1",
      [user.id]
    );

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT id,name,email,role FROM users WHERE id = $1",
      [req.user.id]
    );

    res.status(200).json({
      success: true,
      user: user.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = {
  signup,
  login,
  getMe
};