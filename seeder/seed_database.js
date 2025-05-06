const mysql = require('mysql2/promise');

async function seed_database() {
	const database = 'iflair-dental-clinic-management-system';

	// Establish SQL connection
	const connection = await mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '',
		database,
		connectTimeout: 10000,
	});
	console.log('Connected to MySQL.');

	// Terminate connection
	await connection.end();
}

seed_database().catch(console.error);
