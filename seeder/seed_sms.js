const mysql = require('mysql2/promise');
const { faker } = require('@faker-js/faker');
const fs = require('fs');
const { choose_random_element } = require('./utils.js');

async function seed_database() {
	const database = 'iflair-dental-clinic-management-system';
	const table = 'sms';
	const insert_query_header = `INSERT INTO ${table} (appointment_id, sms_template_id, contact_no, status, sent_at) VALUES ?`;

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
		'SELECT * FROM appointment ap JOIN patient p ON ap.patient_id = p.patient_id'
	);

	const [sms_templates] = await connection.execute('SELECT * FROM sms_template');

	// Generate rows with random data
	const rows = [];
	let insert_count = 0;
	console.log(`Generating ${insert_count} random ${table} data...`);
	for (let i = 0; i < appointments.length; i++) {
		const appointment_id = appointments[i].appointment_id;
		const contact_no = appointments[i].contact_no;
		const status =
			appointments[i].schedule_date < Date.now() ? 'sent' : 'pending';

		// Confirmation (1min after appointment creation)
		let sms_template_id = sms_templates.find((sms_template) => {
			if (sms_template.name == 'appointment confirmation') {
				return sms_template;
			}
		});
		let sent_at = new Date(
			appointments[i].created_at.setMinutes(
				appointments[i].created_at.getMinutes() + 1
			)
		);
		rows.push([appointment_id, sms_template_id, contact_no, status, sent_at]);

		// Reminder (24 hours before appointment date)
		sms_template_id = sms_templates.find((sms_template) => {
			if (sms_template.name == 'reminder') {
				return sms_template;
			}
		});
		sent_at = new Date(
			appointments[i].schedule_date.setMinutes(
				appointments[i].schedule_date.getDate() - 1
			)
		);
		rows.push([appointment_id, sms_template_id, contact_no, status, sent_at]);

		// Feedback (schedule date + appointment duration))
		sms_template_id = sms_templates.find((sms_template) => {
			if (sms_template.name == 'feedback request') {
				return sms_template;
			}
		});
		const appointment_duration = appointments[i].duration;
		sent_at = new Date(
			appointments[i].schedule_date.setMinutes(
				appointments[i].schedule_date.getMinutes() + appointment_duration
			)
		);
		rows.push([appointment_id, sms_template_id, contact_no, status, sent_at]);

		insert_count = insert_count + 3;
	}

	// Output generated rows
	console.log(rows);

	return;

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
