const pool = require("../config/db");

const addTrain = async (req, res) => {
  const { name, source, destination, total_seats } = req.body;

  if (total_seats <= 0) {
    return res.status(400).json({ message: "Total seats must be greater than zero" });
  }

  try {
    const query =
      "INSERT INTO trains (name, source, destination, total_seats, available_seats) VALUES ($1, $2, $3, $4, $4)";
    await pool.query(query, [name, source, destination, total_seats]);
    res.status(201).json({ message: "Train added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error adding train", error: err.message });
  }
};

const updateTrain = async (req, res) => {
  const { train_id } = req.params;
  const { total_seats } = req.body;

  if (total_seats <= 0) {
    return res.status(400).json({ message: "Total seats must be greater than zero" });
  }

  try {
    await pool.query("BEGIN");

    const trainQuery = "SELECT * FROM trains WHERE id = $1 FOR UPDATE";
    const trainResult = await pool.query(trainQuery, [train_id]);
    const train = trainResult.rows[0];

    if (!train) {
      return res.status(404).json({ message: "Train not found" });
    }

    const newAvailableSeats = train.available_seats - (train.total_seats - total_seats);

    if (newAvailableSeats < 0) {
      return res.status(400).json({ message: "Not enough available seats to update" });
    }

    const updateQuery = `
      UPDATE trains
      SET total_seats = $1, available_seats = $2
      WHERE id = $3
    `;
    await pool.query(updateQuery, [total_seats, newAvailableSeats, train_id]);

    await pool.query("COMMIT");

    res.status(200).json({ message: "Train updated successfully" });
  } catch (err) {
    await pool.query("ROLLBACK");
    res.status(500).json({ message: "Error updating train", error: err.message });
  }
};

module.exports = { addTrain, updateTrain };
