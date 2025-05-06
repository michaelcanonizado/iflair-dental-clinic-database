const mysql = require('mysql2/promise');
const { faker } = require('@faker-js/faker');
const fs = require('fs');
const { choose_random_element } = require('./utils.js');

const SMS_TEMPLATES = [
	{
		name: 'appointment confirmation',
		format: 'iFlair Dental: Hi {Patient Name}, your appointment with Dr. {Dentist} is confirmed for {Date} at {Time}. Reply YES to confirm or CALL {Clinic Number} to reschedule.\n\nThis is an auto-generated text. For inquiries, please call 1800-FLAIR-DC (1800-352-4732) or email us at info@iflairdental.com. For appointment scheduling, email at appointments@iflairdental.com',
	},
	{
		name: 'reminder',
		format: 'iFlair Dental: Friendly reminder! Your dental appointment is tomorrow, {Date} at {Time}. Kindly arrive 10 mins early. Cancel? Call {Clinic Number}.\n\nThis is an auto-generated text. For inquiries, please call 1800-FLAIR-DC (1800-352-4732) or email us at info@iflairdental.com. For appointment scheduling, email at appointments@iflairdental.com',
	},
	{
		name: 'feedback request',
		format: 'iFlair Dental: How was your visit? Rate us: {Rating Link}. Your feedback helps us improve!\n\nThis is an auto-generated text. For inquiries, please call 1800-FLAIR-DC (1800-352-4732) or email us at info@iflairdental.com. For appointment scheduling, email at appointments@iflairdental.com',
	},
];

async function seed_database() {
	const database = 'iflair-dental-clinic-management-system';
	const table = 'sms_template';
	const insert_query_header = `INSERT INTO ${table} (name, format) VALUES ?`;

	// Establish SQL connection
	const connection = await mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '',
		database,
		connectTimeout: 10000,
	});
	console.log('Connected to MySQL.');

	// Generate rows with random data
	const rows = [];
	const insert_count = SMS_TEMPLATES.length;
	console.log(`Generating ${insert_count} random ${table} data...`);
	for (let i = 0; i < insert_count; i++) {
		const name = SMS_TEMPLATES[i].name;
		const format = SMS_TEMPLATES[i].format;

		rows.push([name, format]);
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
