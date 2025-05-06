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

const DENTAL_EMPLOYEES = [
	'dentist',
	'dental hygienist',
	'orthodontist',
	'oral surgeon',
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

async function seed_database() {
	const database = 'iflair-dental-clinic-management-system';
	const table = 'employee';
	const insert_query_header = `INSERT INTO ${table} (occupation_id, first_name, last_name, middle_name, date_of_birth, age, gender, street, province, municipality, barangay, zip_code, email, contact_no) VALUES ?`;

	// Establish SQL connection
	const connection = await mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '',
		database,
		connectTimeout: 10000,
	});
	console.log('Connected to MySQL.');

	const [occupations] = await connection.execute('SELECT * FROM occupation');

	// Generate rows with random data
	const rows = [];
	let insert_count = 0;
	console.log(`Generating random ${table} data...`);
	for (let i = 0; i < occupations.length; i++) {
		let num_per_occupation_to_insert = 2;
		if (DENTAL_EMPLOYEES.includes(occupations[i].name.toLocaleLowerCase())) {
			num_per_occupation_to_insert = 5;
		}

		for (let j = 0; j < num_per_occupation_to_insert; j++) {
			const gender = choose_random_element(1, GENDERS);

			const first_name =
				gender == 'male'
					? choose_random_element(1, MALE_FIRST_NAMES)
					: choose_random_element(1, FEMALE_FIRST_NAMES);

			const middle_name = choose_random_element(0.6, MIDDLE_NAMES);

			const last_name = choose_random_element(1, LAST_NAMES);

			const contact_no = faker.phone.number({ style: 'international' });

			const date_of_birth = faker.date.birthdate({
				min: 5,
				max: 90,
				mode: 'age',
			});

			const age = calculate_age(date_of_birth);

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

			const email = `${first_name}${last_name}@gmail.com`.toLocaleLowerCase();

			const occupation_id = occupations[i].occupation_id;

			rows.push([
				occupation_id,
				first_name,
				last_name,
				middle_name,
				date_of_birth,
				age,
				gender,
				street,
				province,
				municipality,
				barangay,
				zip_code,
				email,
				contact_no,
			]);

			insert_count++;
		}
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
