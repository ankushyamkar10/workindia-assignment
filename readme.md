
# Train Booking System

This is a basic train booking system that allows users to view available trains, book seats, and manage bookings. The system provides the following features:

- View available trains based on source and destination.
- Book a seat on a train.
- Retrieve booking details.

## Features

1. **Get Train Availability**
   - Endpoint to fetch available trains based on source and destination.
   
2. **Book a Seat**
   - Endpoint to book a seat on a specific train.
   
3. **Get Booking Details**
   - Endpoint to retrieve booking details for a specific user.

## Requirements

- Node.js
- PostgreSQL

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/train-booking-system.git
cd train-booking-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Database

Create a `.env` file in the root directory with the following environment variables:

```bash
DB_USER=abcd
DB_PASSWORD=*****
DB_NAME=name
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_jwt_secret
ADMIN_API_KEY=your_admin_api_key
PORT=6754
```

### 4. Start the Application

```bash
npm start
```

The app will now be running on `http://localhost:3000`.

## Notes

- This system assumes that each seat number is unique for a given train and that seats are allocated in ascending order starting from 1.
- The available seats are updated whenever a new booking is made.
- The system does not yet support canceling bookings or advanced features like booking multiple seats at once.

## License

MIT