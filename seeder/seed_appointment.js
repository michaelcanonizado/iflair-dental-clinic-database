const mysql = require('mysql2/promise');
const { faker } = require('@faker-js/faker');
const fs = require('fs');
const { choose_random_element } = require('./utils.js');

const VALID_EMPLOYEES = [
	'dentist',
	'dental hygienist',
	'orthodontist',
	'oral surgeon',
	'dental assistant',
];

async function seed_database() {
	const database = 'iflair-dental-clinic-management-system';
	const table = 'appointment';
	const insert_query_header = `INSERT INTO ${table} (patient_id, employee_id, schedule_id, start_time, duration, next_schedule, appointment_status, description) VALUES ?`;

	// Establish SQL connection
	const connection = await mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '',
		database,
		connectTimeout: 10000,
	});
	console.log('Connected to MySQL.');

	const [patients] = await connection.execute('SELECT * FROM patient');
	const [employees_copy] = await connection.execute(
		'SELECT * FROM employee e JOIN occupation o WHERE e.occupation_id = o.occupation_id'
	);
	const employees = employees_copy.filter((employee) => {
		if (VALID_EMPLOYEES.includes(employee.name.toLowerCase())) {
			return employee;
		}
	});

	// Generate rows with random data
	console.log(`Generating random ${table} data...`);
	console.log(employees);

	return;

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
	console.log(`Inserting ${insertCount} generated ${table} data...`);
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
