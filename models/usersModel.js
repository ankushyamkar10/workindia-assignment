const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL, -- UNIQUE constraint added here
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user'
  );
`;

module.exports = createUsersTable;
