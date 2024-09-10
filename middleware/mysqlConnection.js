// middleware/mysqlConnection.js
import { createConnection } from 'mysql2';

let connection = null;

const connectToMySQL = (req, res, next) => {
    if (connection) {
        // If the connection already exists, skip connecting
        req.db = connection;
        return next();
    }

    // Create a new MySQL connection
    connection = createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'myapp'
    });

    connection.connect((err) => {
        if (err) {
            console.error('Failed to connect to MySQL', err);
            return res.status(500).json({ message: 'Failed to connect to MySQL' });
        }
        console.log('Connected to MySQL!');
        req.db = connection;
        next();
    });
};

export default connectToMySQL;
