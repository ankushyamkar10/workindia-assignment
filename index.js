const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

const createUsersTable = require('./models/usersModel');
const createTrainsTable = require('./models/trainsModel');
const createBookingsTable = require('./models/bookingsModel');
const pool = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

(async () => {
  try {
    await pool.query(createUsersTable);
    await pool.query(createTrainsTable);
    await pool.query(createBookingsTable);
    console.log('Database initialized');
  } catch (err) {
    console.error('Error initializing database:', err.message);
  }
})();

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
