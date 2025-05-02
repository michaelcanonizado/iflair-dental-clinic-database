const mysql = require('mysql2/promise');
const { faker } = require('@faker-js/faker');
const fs = require('fs');

async function seed_database() {
	const database = 'iflair-dental-clinic-management-system';
	const table = 'payment';
	const insert_query_header = `INSERT INTO ${table} (appointment_id, amount, is_paid) VALUES ?`;

	// Establish SQL connection
	const connection = await mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '',
		database,
		connectTimeout: 10000,
	});
	console.log('Connected to MySQL.');

	const [appointments] = await connection.execute(
		'SELECT aps.appointment_id, ap.schedule_date, SUM(s.price) AS total_price, COUNT(*) AS number_of_services FROM appointment_service aps JOIN appointment ap ON aps.appointment_id = ap.appointment_id JOIN service s ON aps.service_id = s.service_id GROUP BY aps.appointment_id'
	);

	// Generate rows with random data
	const rows = [];
	const insert_count = appointments.length;
	console.log(`Generating ${insert_count} random ${table} data...`);
	for (let i = 0; i < insert_count; i++) {
		const appointment_id = appointments[i].appointment_id;
		const amount = parseFloat(appointments[i].total_price);
		const is_paid = appointments[i].schedule_date.getTime() < Date.now();

		rows.push([appointment_id, amount, is_paid]);
	}

	// Output generated rows
	console.log(rows);

	// Delete all existing rows in table
	console.log(`Deleting all rows in:  ${database}.${table}...`);
	await connection.query(`DELETE FROM ${table}`);
	console.log(`Deleted all rows in:  ${database}.${table}!`);

	// Reset primary key auto increment to 1
	console.log(`Reseting AUTO_INCREMENT to 1 in:  ${database}.${table}...`);
	await connection.query(`ALTER TABLE ${table} AUTO_INCREMENT = 1`);
	console.log(`Reseted AUTO_INCREMENT to 1 in:  ${database}.${table}...`);

	// Insert the generated data into the database
	console.log(`Inserting ${insert_count} generated ${table} data...`);
	await connection.query(insert_query_header, [rows]);
	console.log('Seed successful!');

	// Generate the raw SQL of the actions above  for logging
	const raw_sql =
		`DELETE FROM ${table};\n` +
		`ALTER TABLE ${table} AUTO_INCREMENT = 1;\n\n` +
		mysql.format(insert_query_header, [rows]);

	fs.writeFileSync(`queries/${table}.txt`, raw_sql, { flag: 'w' });

	// Terminate connection
	await connection.end();
}

seed_database().catch(console.error);
