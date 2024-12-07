const pool = require('../config/db');

const getTrainAvailability = async (req, res) => {
  const { source, destination } = req.query;

  try {
    const query = `
      SELECT 
        id, 
        name, 
        source, 
        destination, 
        total_seats, 
        available_seats
      FROM trains 
      WHERE source = $1 AND destination = $2`;
    const result = await pool.query(query, [source, destination]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No trains found for the specified route' });
    }

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching train availability', error: err.message });
  }
};

const bookSeat = async (req, res) => {
  const { train_id } = req.body;
  const user_id = req.user.id;
  console.log(user_id)

  try {
    await pool.query('BEGIN');

    // Fetch the train details with FOR UPDATE to lock the row
    const trainQuery = 'SELECT * FROM trains WHERE id = $1 FOR UPDATE';
    const trainResult = await pool.query(trainQuery, [train_id]);
    const train = trainResult.rows[0];

    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }

    if (train.available_seats <= 0) {
      return res.status(400).json({ message: 'No available seats for this train' });
    }

    // Determine the next available seat
    const seatNumberQuery = `
      SELECT seat_number FROM bookings 
      WHERE train_id = $1 
      ORDER BY seat_number::INT DESC LIMIT 1`;
    const seatNumberResult = await pool.query(seatNumberQuery, [train_id]);
    const lastAllocatedSeat = seatNumberResult.rows[0]?.seat_number || 0;
    const newSeatNumber = parseInt(lastAllocatedSeat) + 1;

    if (newSeatNumber > train.total_seats) {
      return res.status(400).json({ message: 'No more seats available' });
    }

    // Update the train's available seats
    const updateTrainQuery = `
      UPDATE trains 
      SET available_seats = available_seats - 1 
      WHERE id = $1`;
    await pool.query(updateTrainQuery, [train_id]);

    // Insert the booking record
    const bookingQuery = `
      INSERT INTO bookings (user_id, train_id, seat_number) 
      VALUES ($1, $2, $3) RETURNING id`;
    const bookingResult = await pool.query(bookingQuery, [user_id, train_id, newSeatNumber]);

    const booking_id = bookingResult.rows[0].id;

    await pool.query('COMMIT');

    // Respond with booking details
    res.status(200).json({ 
      message: 'Booking successful', 
      seat_number: newSeatNumber,
      booking_id: booking_id 
    });
  } catch (err) {
    await pool.query('ROLLBACK');
    res.status(500).json({ message: 'Error booking seat', error: err.message });
  }
};


const getBookingDetails = async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user.id;

  try {
    const query = `
      SELECT 
        b.id AS booking_id, 
        t.name AS train_name, 
        t.source, 
        t.destination, 
        b.seat_number, 
        b.booking_date, 
        b.status
      FROM bookings b
      JOIN trains t ON b.train_id = t.id
      WHERE b.id = $1 AND b.user_id = $2`;

    const result = await pool.query(query, [bookingId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found or unauthorized access' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching booking details', error: err.message });
  }
};

module.exports = { getTrainAvailability, bookSeat, getBookingDetails };
