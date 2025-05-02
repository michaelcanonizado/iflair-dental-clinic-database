const mysql = require('mysql2/promise');
const { faker } = require('@faker-js/faker');
const fs = require('fs');
const {
	calculate_age,
	get_random_element,
	choose_random_element,
} = require('./utils.js');

const GENDERS = ['male', 'female'];

const MALE_FIRST_NAMES = fs
	.readFileSync('csv/male_first_names.csv', 'utf8')
	.split('\n')
	.map((name) => name.trim())
	.filter((name) => name.length > 0);

const FEMALE_FIRST_NAMES = fs
	.readFileSync('csv/female_first_names.csv', 'utf8')
	.split('\n')
	.map((name) => name.trim())
	.filter((name) => name.length > 0);

const LAST_NAMES = fs
	.readFileSync('csv/last_names.csv', 'utf8')
	.split('\n')
	.map((name) => name.trim())
	.filter((name) => name.length > 0);

const MIDDLE_NAMES = fs
	.readFileSync('csv/middle_names.csv', 'utf8')
	.split('\n')
	.map((name) => name.trim())
	.filter((name) => name.length > 0);

const OCCUPATIONS = [
	'doctor',
	'engineer',
	'teacher',
	'nurse',
	'artist',
	'scientist',
	'lawyer',
	'architect',
	'developer',
	'designer',
	'chef',
	'journalist',
	'plumber',
	'mechanic',
	'farmer',
];

const MUNICIPALITIES = {
	albay: [
		'bacacay',
		'camalig',
		'daraga',
		'guinobatan',
		'jovellar',
		'libon',
		'malilipot',
		'malinao',
		'manito',
		'oanob',
		'pio duran',
		'polangui',
		'rapu-rapu',
		'sto. domingo',
		'tiwi',
	],
	camarinesNorte: [
		'basud',
		'capalonga',
		'jose panganiban',
		'labo',
		'mercedes',
		'paracale',
		'san lorenzo ruiz',
		'san vicente',
		'sta. elena',
		'talisay',
		'vinzons',
	],
	camarinesSur: [
		'baao',
		'balatan',
		'bato',
		'bombon',
		'buhi',
		'bula',
		'cabusao',
		'calabanga',
		'camaligan',
		'canaman',
		'caramoan',
		'del gallego',
		'gainza',
		'garchitorena',
		'goa',
		'lupi',
		'magarao',
		'milaor',
		'minalabac',
		'nabua',
		'ocampo',
		'pamplona',
		'pasacao',
		'presentacion',
		'ragay',
		'sagnay',
		'san fernando',
		'san jose',
		'sipocot',
		'siruma',
		'tigaon',
		'tinambac',
	],
	catanduanes: [
		'bagamanoc',
		'baras',
		'bato',
		'caramoran',
		'gigmoto',
		'pandan',
		'panganiban',
		'san andres',
		'san miguel',
		'viga',
		'virac',
	],
	masbate: [
		'aroroy',
		'baleno',
		'balud',
		'batuan',
		'cataingan',
		'cawayan',
		'claveria',
		'dimasalang',
		'esperanza',
		'mandaon',
		'milagros',
		'mobo',
		'monreal',
		'palanas',
		'pio v. corpuz',
		'plaridel',
		'san fernando',
		'san jacinto',
		'san pascual',
		'uason',
	],
	sorsogon: [
		'barcelona',
		'bulan',
		'bulusan',
		'casiguran',
		'castilla',
		'donsol',
		'gubat',
		'irosin',
		'juban',
		'magallanes',
		'matnog',
		'pilar',
		'prieto diaz',
		'santa magdalena',
	],
};

const PROVINCES = Object.keys(MUNICIPALITIES);

const BARANGAYS = [
	'barangay 1',
	'barangay 2',
	'barangay 3',
	'barangay 4',
	'barangay 5',
	'barangay 6',
	'barangay 7',
	'barangay 8',
	'barangay 9',
	'barangay 10',
	'barangay 11',
	'barangay 12',
	'barangay 13',
	'barangay 14',
	'barangay 15',
];

const CIVIL_STATUSES = ['single', 'married', 'divorced', 'widower/widowed'];

async function seed_database() {
	const database = 'iflair-dental-clinic-management-system';
	const table = 'patient';
	const insert_query_header = `INSERT INTO ${table} (first_name, middle_name, last_name, gender, contact_no, date_of_birth, age, religion, nationality, occupation, guardian_name, guardian_occupation, street, province, municipality, barangay, zip_code, civil_status) VALUES ?`;

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
	const insertCount = 50;
	console.log(`Generating ${insertCount} random ${table} data...`);
	for (let i = 0; i < insertCount; i++) {
		const gender = choose_random_element(1, GENDERS);

		const first_name =
			gender == 'male'
				? choose_random_element(1, MALE_FIRST_NAMES)
				: choose_random_element(1, FEMALE_FIRST_NAMES);

		const middle_name = choose_random_element(0.6, MIDDLE_NAMES);

		const last_name = choose_random_element(1, LAST_NAMES);

		const contact_no = faker.phone.number({ style: 'international' });

		const date_of_birth = faker.date.birthdate({ min: 5, max: 90, mode: 'age' });

		const age = calculate_age(date_of_birth);

		const religion = 'christian';

		const nationality = 'filipino';

		let occupation = choose_random_element(age > 22 ? 1 : 0, OCCUPATIONS);

		let guardian_name = null;
		let guardian_occupation = null;
		if (age < 18) {
			const guardian_first_name =
				Math.random() < 0.5
					? choose_random_element(1, MALE_FIRST_NAMES)
					: choose_random_element(1, FEMALE_FIRST_NAMES);

			const guardian_middle_name = choose_random_element(1, MIDDLE_NAMES);

			const guardian_last_name = last_name;

			guardian_name =
				guardian_first_name +
				' ' +
				guardian_middle_name +
				' ' +
				guardian_last_name;

			guardian_occupation = choose_random_element(1, OCCUPATIONS);
		}

		const street = choose_random_element(0.3, [
			faker.location.secondaryAddress(),
		]);

		const province = choose_random_element(1, PROVINCES);

		const municipality = choose_random_element(1, MUNICIPALITIES[province]);

		const barangay = choose_random_element(1, BARANGAYS);

		const zip_code = faker.number.int({
			min: 4400,
			max: 4700,
		});

		const civil_status =
			age > 30 ? choose_random_element(1, CIVIL_STATUSES) : 'single';

		rows.push([
			first_name,
			middle_name,
			last_name,
			gender,
			contact_no,
			date_of_birth,
			age,
			religion,
			nationality,
			occupation,
			guardian_name,
			guardian_occupation,
			street,
			province,
			municipality,
			barangay,
			zip_code,
			civil_status,
		]);
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
