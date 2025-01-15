import { createConnection } from 'mysql2/promise';
import { CREATE_SCHEMA } from './queries.js';

async function initializeDatabase(config) {
    const connection = await createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        multipleStatements: true
    });

    try {
        console.log('Creating database schema...');
        await connection.execute(CREATE_SCHEMA);
        console.log('Database schema created successfully');
    } catch (error) {
        console.error('Error creating database schema:', error.message);
        throw error;
    } finally {
        await connection.end();
    }
}

export default initializeDatabase;
