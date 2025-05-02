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
	const insert_query_header = `INSERT INTO ${table} (patient_id, employee_id, schedule_date, start_time, duration, next_schedule, appointment_status, description) VALUES ?`;

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

	const rows = [];
	let insert_count = 0;
	patients.forEach((patient) => {
		const number_of_schedules = Math.floor(Math.random() * 10) + 1;
		const random_year = faker.number.int({ min: 2020, max: 2025 });
		const is_within_the_year_customer = Math.random() < 0.5 ? true : false;

		for (let i = 0; i < number_of_schedules; i++) {
			const patient_id = patient.patient_id;
			const employee_id = choose_random_element(1, employees).employee_id;

			const year_offset = Math.floor(Math.random() * 3) + 1;
			const schedule_date = faker.date.between(
				is_within_the_year_customer
					? {
							from: `${random_year}-01-01T00:00:00.000Z`,
							to: `${random_year}-12-31T00:00:00.000Z`,
					  }
					: {
							from: `${random_year - year_offset}-01-01T00:00:00.000Z`,
							to: `${random_year}-12-31T00:00:00.000Z`,
					  }
			);

			const start_time = faker.date
				.between({
					from: '2025-01-01T09:00:00.000Z',
					to: '2025-01-01T17:00:00.000Z',
				})
				.toISOString()
				.slice(11, 19);

			const duration = faker.number.int({
				min: 30,
				max: 240,
				multipleOf: 30,
			});

			const next_schedule = faker.date.between(
				is_within_the_year_customer
					? {
							from: `${random_year}-01-01T00:00:00.000Z`,
							to: `${random_year}-12-31T00:00:00.000Z`,
					  }
					: {
							from: `${random_year - year_offset}-01-01T00:00:00.000Z`,
							to: `${random_year}-12-31T00:00:00.000Z`,
					  }
			);

			const is_cancelled = Math.random() < 0.15;
			let appointment_status = null;
			if (schedule_date.getTime() < Date.now()) {
				appointment_status = is_cancelled ? 'cancelled' : 'completed';
			} else {
				appointment_status = 'pending';
			}

			const description =
				Math.random() < 0.3
					? null
					: faker.lorem.sentence({ min: 10, max: 75 });

			rows.push([
				patient_id,
				employee_id,
				schedule_date,
				start_time,
				duration,
				next_schedule,
				appointment_status,
				description,
			]);

			insert_count++;
		}
	});

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
