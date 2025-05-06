const mysql = require('mysql2/promise');
const fs = require('fs');

const OCCUPATIONS = [
	{
		name: 'Dentist',
		description:
			'Primary dental care provider who diagnoses and treats oral health issues',
	},
	{
		name: 'Dental Hygienist',
		description: 'Provides teeth cleaning and preventive oral care',
	},
	{
		name: 'Orthodontist',
		description: 'Specializes in braces and teeth alignment correction',
	},
	{
		name: 'Oral Surgeon',
		description: 'Performs tooth extractions and complex jaw surgeries',
	},
	{
		name: 'Dental Assistant',
		description: 'Assists dentists during procedures and prepares equipment',
	},
	{
		name: 'Dental Lab Technician',
		description: 'Creates crowns, dentures, and other prosthetics',
	},
	{
		name: 'Sterilization Technician',
		description: 'Ensures all instruments are properly sanitized',
	},
	{
		name: 'Receptionist',
		description: 'Manages front desk, appointments, and patient check-in',
	},
	{
		name: 'Billing Specialist',
		description: 'Handles insurance claims and payment processing',
	},
	{
		name: 'Office Manager',
		description: 'Oversees clinic operations and staff scheduling',
	},
	{
		name: 'Marketing Coordinator',
		description: 'Manages clinic promotions and online presence',
	},
	{
		name: 'Nurse',
		description: 'Provides general medical support in clinic operations',
	},
	{
		name: 'Medical Records Clerk',
		description: 'Maintains and organizes patient health records',
	},
	{
		name: 'Janitorial Staff',
		description: 'Ensures cleanliness and sanitation of clinic facilities',
	},
	{
		name: 'Maintenance Technician',
		description: 'Handles equipment repairs and facility upkeep',
	},
	{
		name: 'IT Support Specialist',
		description: 'Manages clinic software and computer systems',
	},
	{
		name: 'Data Entry Clerk',
		description: 'Inputs and updates patient information in databases',
	},
	{ name: 'Nutritionist', description: 'Provides dietary advice for oral health' },
	{
		name: 'Counselor',
		description: 'Offers patient support for dental anxiety management',
	},
	{
		name: 'Human Resources Manager',
		description: 'Handles staff recruitment and employee relations',
	},
	{ name: 'Accountant', description: 'Manages clinic finances and bookkeeping' },
];

async function seed_database() {
	const database = 'iflair-dental-clinic-management-system';
	const table = '';
	const insert_query_header = `INSERT INTO ${table} (attr1, attr2) VALUES ?`;

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
	const insert_count = 0;
	console.log(`Generating ${insert_count} random ${table} data...`);
	for (let i = 0; i < insert_count; i++) {}

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
