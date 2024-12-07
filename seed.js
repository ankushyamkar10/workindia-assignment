const bcrypt = require('bcrypt');
const pool = require('./config/db');

(async () => {
  try {
    console.log('Dropping existing tables...');
    
    await pool.query('DROP TABLE IF EXISTS bookings');
    await pool.query('DROP TABLE IF EXISTS trains');
    await pool.query('DROP TABLE IF EXISTS users');

    console.log('Recreating tables...');

    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user'
      );
    `;
    const createTrainsTable = `
      CREATE TABLE IF NOT EXISTS trains (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        source VARCHAR(255) NOT NULL,
        destination VARCHAR(255) NOT NULL,
        total_seats INT NOT NULL,
        available_seats INT NOT NULL
      );
    `;
    const createBookingsTable = `
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        train_id INT REFERENCES trains(id) ON DELETE CASCADE,
        seat_number VARCHAR(10) NOT NULL,
        booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'Booked', -- Booking status
        UNIQUE (train_id, seat_number) -- Ensure no duplicate seat booking per train
      );
    `;

    await pool.query(createUsersTable);
    await pool.query(createTrainsTable);
    await pool.query(createBookingsTable);

    console.log('Seeding database with default data...');

    const adminPassword = await bcrypt.hash('admin123', 10);
    await pool.query(`
      INSERT INTO users (username, email, password, role)
      VALUES ('Admin', 'admin@example.com', $1, 'admin')
      ON CONFLICT (email) DO NOTHING;
    `, [adminPassword]);

    const userPassword = await bcrypt.hash('user123', 10);
    await pool.query(`
      INSERT INTO users (username, email, password, role)
      VALUES 
      ('User1', 'user1@example.com', $1, 'user'),
      ('User2', 'user2@example.com', $1, 'user')
      ON CONFLICT (email) DO NOTHING;
    `, [userPassword]);

    await pool.query(`
      INSERT INTO trains (name, source, destination, total_seats, available_seats)
      VALUES 
      ('Rajdhani Express', 'New Delhi', 'Mumbai Central', 380, 380),
      ('Shatabdi Express', 'Bangalore', 'Chennai Central', 600, 600),
      ('Duronto Express', 'Howrah', 'Sealdah', 800, 800),
      ('Garib Rath', 'Patna', 'Kolkata', 1200, 1200),
      ('Kaveri Express', 'Chennai Central', 'Bangalore', 1200, 1200),
      ('Punjab Mail', 'Ferozpur', 'Mumbai CST', 1000, 1000)
      ON CONFLICT (name) DO NOTHING;
    `);

    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err.message);
    process.exit(1);
  }
})();
