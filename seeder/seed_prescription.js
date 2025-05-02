const mysql = require('mysql2/promise');
const { faker } = require('@faker-js/faker');
const fs = require('fs');
const { choose_random_element } = require('./utils.js');

const DENTAL_MEDICATIONS = [
	'Amoxicillin - 500mg, 3 times a day for 7 days',
	'Clindamycin - 300mg, 4 times a day for 7 days',
	'Metronidazole - 400mg, 3 times a day for 5 days',
	'Ibuprofen - 400mg, every 6 hours as needed',
	'Acetaminophen - 500mg, every 4–6 hours as needed',
	'Hydrocodone/Acetaminophen - 1 tablet, every 6 hours as needed for pain',
	'Codeine - 15mg, every 4 hours as needed',
	'Diazepam - 5mg, 1 hour before procedure',
	'Chlorhexidine Gluconate - Rinse with 15ml, twice daily',
	'Dexamethasone - 4mg, once daily for 3 days',
	'Prednisone - 10mg, once daily for 5 days',
	'Lidocaine - Apply as needed before procedure',
	'Benzocaine Gel - Apply to affected area up to 4 times daily',
	'Fluoride Supplements - 1 tablet daily at bedtime',
	'Nystatin - 5ml oral suspension, 4 times daily',
	'Miconazole Oral Gel - Apply pea-sized amount, 4 times daily',
	'Orabase with Benzocaine - Apply to sore area as needed',
	'Magic Mouthwash - Swish 10ml, 3 times daily',
	'Penicillin VK - 500mg, every 6 hours for 10 days',
	'Erythromycin - 250mg, 4 times daily for 7 days',
	'Ciprofloxacin - 500mg, twice daily for 5 days',
	'Cephalexin - 500mg, every 6 hours for 7 days',
	'Ketorolac - 10mg, every 4–6 hours as needed',
	'Tramadol - 50mg, every 6 hours as needed for pain',
	'Naproxen - 250mg, twice daily as needed',
	'Oxycodone/Acetaminophen - 1 tablet every 6 hours for severe pain',
	'Alprazolam - 0.25mg, 30 minutes before appointment',
	'Midazolam - 7.5mg, 1 hour before procedure',
	'Carbamide Peroxide - Apply once daily for whitening',
	'Hydrogen Peroxide Rinse - Rinse for 30 seconds, twice daily',
	'Dyclonine - Apply topically every 4 hours',
	'Articaine - Apply locally before procedure',
	'Bupivacaine - Inject before surgery',
	'Mepivacaine - Local anesthetic, use as directed',
	'Tetracycline - 250mg, 4 times a day for 10 days',
	'Minocycline - 100mg, twice daily',
	'Doxycycline - 100mg, once daily',
	'Rinsinol - Swish and spit twice daily',
	'Gly-Oxide - Apply to gums, twice daily',
	'Biotene - Use as needed for dry mouth',
	'SalivaSure - 1 tablet every 4 hours for dry mouth',
	'Pilocarpine - 5mg, 3 times daily for dry mouth',
	'Zinc Lozenges - 1 lozenge every 2 hours as needed',
	'Aspirin - 325mg, every 4 hours for pain',
	'Paracetamol - 500mg, every 6 hours',
	'Acetaminophen/Caffeine - 1 tablet, twice daily',
	'CloSYS Oral Rinse - Rinse twice daily',
	'Colgate Peroxyl - Rinse for 1 minute, up to 4 times daily',
	'Anbesol - Apply to affected area as needed',
	'Orajel - Apply small amount to gums 3–4 times a day',
];

async function seed_database() {
	const database = 'iflair-dental-clinic-management-system';
	const table = 'prescription';
	const insert_query_header = `INSERT INTO ${table} (appointment_id, description) VALUES ?`;

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

	// Generate rows with random data
	const rows = [];
	const insert_count = appointments.length;
	console.log(`Generating ${insert_count} random ${table} data...`);
	for (let i = 0; i < insert_count; i++) {
		const appointment_id = appointments[i].appointment_id;

		const number_of_medications = Math.floor(Math.random() * 4);
		const random_medications = DENTAL_MEDICATIONS.sort(
			() => Math.random() - 0.5
		).slice(0, number_of_medications);
		const description =
			number_of_medications == 0 ? null : random_medications.join(', ');

		rows.push([appointment_id, description]);
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
