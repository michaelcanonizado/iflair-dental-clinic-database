const mysql = require('mysql2/promise');
const { faker } = require('@faker-js/faker');
const fs = require('fs');
const { choose_random_element } = require('./utils.js');

async function seed_database() {
	const database = 'iflair-dental-clinic-management-system';
	const table = 'appointment_service';
	const insert_query_header = `INSERT INTO ${table} (appointment_id, service_id) VALUES ?`;

	// Establish SQL connection
	const connection = await mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '',
		database,
		connectTimeout: 10000,
	});
	console.log('Connected to MySQL.');

	const [appointments] = await connection.execute('SELECT * FROM appointment');
	const [services] = await connection.execute('SELECT * FROM service');

	// Generate rows with random data
	const rows = [];
	let insert_count = 0;
	console.log(`Generating random ${table} data...`);
	appointments.forEach((appointment) => {
		const number_of_services = Math.floor(Math.random() * 3) + 1;

		const scheduled_services = [];
		for (let i = 0; i < number_of_services; i++) {
			let service_id = choose_random_element(1, services).service_id;
			while (
				scheduled_services.includes(service_id) &&
				scheduled_services.length < services.length
			) {
				service_id = choose_random_element(1, services).service_id;
			}
			scheduled_services.push(service_id);

			rows.push([appointment.appointment_id, service_id]);

			insert_count++;
		}
	});

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
