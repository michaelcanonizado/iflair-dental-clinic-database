const mysql = require('mysql2/promise');
const { faker } = require('@faker-js/faker');
const fs = require('fs');
const { choose_random_element } = require('./utils.js');

const DENTAL_SERVICES = [
	{
		service_name: 'General Consultation',
		description: 'Initial dental examination and treatment planning',
		price: 500,
	},
	{
		service_name: 'Oral Prophylaxis',
		description: 'Professional cleaning to remove plaque and tartar',
		price: 800,
	},
	{
		service_name: 'Teeth Whitening',
		description: 'In-office bleaching treatment',
		price: 8000,
	},
	{
		service_name: 'Root Canal Therapy',
		description: 'Treatment for infected or damaged tooth pulp',
		price: 6500,
	},
	{
		service_name: 'Composite Filling',
		description: 'Tooth-colored filling for cavities',
		price: 1000,
	},
	{
		service_name: 'Porcelain Veneers',
		description:
			'Thin shells applied to the front of teeth for aesthetic improvement',
		price: 10000,
	},
	{
		service_name: 'Zirconia Crown',
		description: 'Durable and aesthetic crown material',
		price: 25000,
	},
	{
		service_name: 'Ceramic Crown',
		description: 'All-ceramic crown for natural appearance',
		price: 16000,
	},
	{
		service_name: 'Porcelain Fused to Metal Crown',
		description: 'Crown with a metal base covered by porcelain',
		price: 10000,
	},
	{
		service_name: 'Temporary Crown',
		description: 'Short-term crown placed while waiting for permanent one',
		price: 1500,
	},
	{
		service_name: 'Dental Bridge',
		description: 'Restores missing teeth by bridging gaps',
		price: 10000,
	},
	{
		service_name: 'Partial Denture',
		description: 'Removable dental appliance to replace missing teeth',
		price: 8000,
	},
	{
		service_name: 'Complete Denture',
		description: 'Full set of removable teeth for edentulous patients',
		price: 20000,
	},
	{
		service_name: 'Flexible Denture',
		description: 'Comfortable and durable removable denture',
		price: 16000,
	},
	{
		service_name: 'Dental Implant',
		description: 'Surgical placement of a tooth root substitute',
		price: 88000,
	},
	{
		service_name: 'Orthodontic Consultation',
		description:
			'Initial consultation for braces or other orthodontic treatments',
		price: 800,
	},
	{
		service_name: 'Braces (Metal)',
		description: 'Traditional metal braces to straighten teeth',
		price: 35000,
	},
	{
		service_name: 'Braces (Ceramic)',
		description: 'Less visible ceramic braces',
		price: 45000,
	},
	{
		service_name: 'Lingual Braces',
		description: 'Braces placed on the inner surface of the teeth',
		price: 60000,
	},
	{
		service_name: 'Invisalign',
		description: 'Clear aligners for teeth straightening',
		price: 60000,
	},
	{
		service_name: 'Teeth Extraction',
		description: 'Removal of a tooth',
		price: 1000,
	},
	{
		service_name: 'Wisdom Tooth Extraction',
		description: 'Surgical removal of impacted wisdom teeth',
		price: 8000,
	},
	{
		service_name: 'Gum Surgery',
		description: 'Surgical treatment for gum diseases',
		price: 15000,
	},
	{
		service_name: 'Frenectomy',
		description: 'Surgical removal of a frenulum (small fold of tissue)',
		price: 5000,
	},
	{
		service_name: 'Pediatric Dental Consultation',
		description: 'Dental examination for children',
		price: 600,
	},
	{
		service_name: 'Fluoride Treatment',
		description: 'Fluoride application to strengthen teeth',
		price: 500,
	},
	{
		service_name: 'Sealant Application',
		description: 'Coating for teeth to prevent cavities',
		price: 1000,
	},
	{
		service_name: 'Mouth Guard',
		description: 'Custom-fit guard for protecting teeth during sports',
		price: 2000,
	},
	{
		service_name: 'Night Guard',
		description: 'Custom-fit guard to prevent teeth grinding at night',
		price: 3000,
	},
	{
		service_name: 'TMJ Treatment',
		description: 'Treatment for jaw joint disorders',
		price: 4000,
	},
	{
		service_name: 'X-ray',
		description: 'Dental radiograph for diagnostic purposes',
		price: 700,
	},
	{
		service_name: 'Panoramic X-ray',
		description: 'Full-mouth radiograph to check for dental issues',
		price: 1500,
	},
	{
		service_name: 'Cone Beam CT Scan',
		description: '3D imaging for more detailed diagnostics',
		price: 5000,
	},
	{
		service_name: 'Laser Dentistry',
		description: 'Use of lasers for various dental procedures',
		price: 5000,
	},
	{
		service_name: 'Biopsy',
		description: 'Removal of tissue for examination',
		price: 8000,
	},
	{
		service_name: 'Teeth Contouring',
		description: 'Sculpting of teeth to improve appearance',
		price: 2000,
	},
	{
		service_name: 'Bonding',
		description: 'Application of tooth-colored resin to repair teeth',
		price: 2500,
	},
	{
		service_name: 'Dental Fillings (Silver)',
		description: 'Silver amalgam fillings for cavities',
		price: 1000,
	},
	{
		service_name: 'Dental Fillings (Gold)',
		description: 'Gold fillings for a more durable restoration',
		price: 5000,
	},
	{
		service_name: 'Scaling and Root Planing',
		description: 'Deep cleaning to treat gum disease',
		price: 3000,
	},
	{
		service_name: 'Sinus Lift Surgery',
		description: 'Procedure to add bone in the upper jaw for implant placement',
		price: 20000,
	},
	{
		service_name: 'Socket Preservation',
		description: 'Preservation of the jawbone after tooth extraction',
		price: 6000,
	},
	{
		service_name: 'Bone Grafting',
		description: 'Surgical procedure to add bone to the jaw',
		price: 15000,
	},
	{
		service_name: 'Oral Cancer Screening',
		description: 'Examination to check for signs of oral cancer',
		price: 1000,
	},
	{
		service_name: 'Saliva Test',
		description: 'Test to diagnose dental and systemic health issues',
		price: 1500,
	},
	{
		service_name: 'Cosmetic Bonding',
		description: 'Reshaping and bonding teeth for improved aesthetics',
		price: 3000,
	},
	{
		service_name: 'Smile Makeover',
		description:
			'Combination of treatments to improve the appearance of your smile',
		price: 25000,
	},
	{
		service_name: 'Veneer Consultation',
		description: 'Initial consultation for porcelain veneers',
		price: 1000,
	},
	{
		service_name: 'Orthognathic Surgery',
		description: 'Corrective jaw surgery to treat severe jaw disorders',
		price: 50000,
	},
	{
		service_name: 'Denture Adjustment',
		description: 'Adjustment of dentures for better fit and comfort',
		price: 1500,
	},
	{
		service_name: 'Denture Reline',
		description: 'Refitting of dentures to improve function',
		price: 2000,
	},
	{
		service_name: 'Emergency Dental Care',
		description: 'Treatment for dental emergencies, including pain management',
		price: 3000,
	},
	{
		service_name: 'Sedation Dentistry',
		description: 'Use of sedatives for anxiety-free dental procedures',
		price: 4000,
	},
];

async function seed_database() {
	const database = 'iflair-dental-clinic-management-system';
	const table = 'service';
	const insert_query_header = `INSERT INTO ${table} (name, description, price) VALUES ?`;

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
	const insertCount = DENTAL_SERVICES.length;
	console.log(`Generating ${insertCount} random ${table} data...`);
	for (let i = 0; i < insertCount; i++) {
		rows.push([
			DENTAL_SERVICES[i].service_name,
			DENTAL_SERVICES[i].description,
			DENTAL_SERVICES[i].price,
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
