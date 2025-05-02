const mysql = require('mysql2/promise');
const { faker } = require('@faker-js/faker');
const fs = require('fs');
const { choose_random_element } = require('./utils');

const BLOOD_TYPES = [
	'A+',
	'A-',
	'B+',
	'B-',
	'AB+',
	'AB-',
	'O+',
	'O-',
	'A+',
	'A-',
	'B+',
	'B-',
	'AB+',
	'AB-',
	'O+',
	'O-',
	'A+',
	'B+',
	'O+',
];

const ALLERGIES = [
	'Penicillin',
	'Dust',
	'Peanuts',
	'Shellfish',
	'Pollen',
	'Bee stings',
	'Latex',
	'Sulfa drugs',
	'Mold',
	'Cats',
	'Dogs',
	'Strawberries',
	'Eggs',
	'Soy',
	'Wheat',
	'Insect venom',
	'Nickel',
	'Aspirin',
	'Dairy',
	'Gluten',
];

const CHRONIC_ILLNESSES = [
	'Hypertension',
	'Diabetes',
	'Asthma',
	'Migraines',
	'Arthritis',
	'High cholesterol',
	'Thyroid disorder',
	'Heart disease',
	'Chronic bronchitis',
	'GERD',
	'IBS',
	'Chronic fatigue',
	'Fibromyalgia',
	'Kidney disease',
	'Liver disease',
	'Epilepsy',
	'Depression',
	'Anxiety',
	'COPD',
	'Sleep apnea',
];

const CURRENT_MEDICATIONS = [
	'Lisinopril 10mg daily',
	'Metformin 500mg BID',
	'Albuterol inhaler PRN',
	'Amlodipine 5mg daily',
	'Ibuprofen 400mg PRN',
	'Levothyroxine 75mcg daily',
	'Sumatriptan PRN',
	'Insulin glargine nightly',
	'Omeprazole 20mg daily',
	'Atorvastatin 10mg daily',
	'Sertraline 50mg daily',
	'Cetirizine 10mg daily',
	'Hydrochlorothiazide 25mg daily',
	'Gabapentin 300mg TID',
	'Prednisone taper',
	'Amoxicillin 500mg TID',
	'Naproxen 250mg BID',
	'Clonazepam 0.5mg PRN',
	'Montelukast 10mg nightly',
	'Metoprolol 50mg BID',
];

const PAST_SURGERIES = [
	'Appendectomy',
	'C-section',
	'Gallbladder removal',
	'Knee surgery',
	'Tonsillectomy',
	'Hernia repair',
	'Wisdom teeth extraction',
	'Breast biopsy',
	'Sinus surgery',
	'Lasik surgery',
	'Spinal fusion',
	'Hip replacement',
	'ACL reconstruction',
	'Bunion surgery',
	'Rotator cuff repair',
	'Thyroidectomy',
	'Cataract surgery',
	'Mastectomy',
	'Prostate surgery',
	'Colonoscopy with polypectomy',
];

const BLEEDING_DISORDERS = [
	'Mild hemophilia',
	'Von Willebrand disease',
	'Platelet dysfunction',
	'Hemophilia A',
	'Vitamin K deficiency',
	'Factor V Leiden',
	'ITP',
	'Glanzmann’s thrombasthenia',
	'Hemophilia B',
	'Acquired hemophilia',
	'Antiphospholipid syndrome',
	'Disseminated intravascular coagulation',
	'Bernard–Soulier syndrome',
	'Hypoprothrombinemia',
	'Liver disease–induced coagulopathy',
	'Thrombocytopenia',
	'Ehlers-Danlos Syndrome',
	'Platelet storage pool disorder',
	'Alpha-2-antiplasmin deficiency',
	'Prothrombin gene mutation',
];

const HEART_CONDITIONS = [
	'Arrhythmia',
	'High cholesterol',
	'Congenital heart defect',
	'Heart murmur',
	'CAD',
	'Valve disorder',
	'Enlarged heart',
	'Angina',
	'Myocardial infarction history',
	'Pericarditis',
	'Hypertrophic cardiomyopathy',
	'Atrial fibrillation',
	'Heart valve prolapse',
	'Tachycardia',
	'Bradycardia',
	'CHF (congestive heart failure)',
	'Pulmonary hypertension',
	'Endocarditis',
	'Myocarditis',
	'Aortic aneurysm',
];

const RESPIRATORY_ISSUES = [
	'Mild asthma',
	'COPD',
	'Bronchitis',
	'Moderate asthma',
	'Emphysema',
	'Chronic cough',
	'Sleep apnea',
	'Pulmonary fibrosis',
	'Allergic rhinitis',
	'Sinusitis',
	'Pneumonia history',
	'Tuberculosis history',
	'Pleural effusion',
	'Lung nodules',
	'Sarcoidosis',
	'Bronchiectasis',
	'Occupational lung disease',
	'Cystic fibrosis',
	'Vocal cord dysfunction',
	'Reactive airway disease',
];

const AUTOIMMUNE_DISEASES = [
	'Lupus',
	'Rheumatoid arthritis',
	'Hashimoto’s thyroiditis',
	'Graves’ disease',
	'Type 1 diabetes',
	'Celiac disease',
	'Psoriasis',
	'Multiple sclerosis',
	'Sjögren’s syndrome',
	'Crohn’s disease',
	'Ulcerative colitis',
	'Ankylosing spondylitis',
	'Autoimmune hepatitis',
	'Myasthenia gravis',
	'Pemphigus vulgaris',
	'Scleroderma',
	'Vasculitis',
	'Addison’s disease',
	'Autoimmune uveitis',
	'Dermatomyositis',
];

const GUM_DISEASE_HISTORY = [
	'Gingivitis',
	'Periodontitis',
	'Pregnancy gingivitis',
	'Chronic periodontitis',
	'Mild gingivitis',
	'Aggressive periodontitis',
	'Severe gum recession',
	'Bleeding gums',
	'Deep pocketing',
	'Localized periodontitis',
	'Gum abscess',
	'Advanced periodontitis',
	'Recurrent gingivitis',
	'Gum inflammation from braces',
	'Hyperplasia',
	'Necrotizing periodontal disease',
	'Gingival overgrowth',
	'Bone loss',
	'Peri-implantitis',
	'Dry mouth-induced inflammation',
];

const GENETIC_CONDITIONS = [
	'Diabetes (maternal)',
	'Heart disease (paternal)',
	'Thalassemia',
	'Cystic fibrosis',
	'Hemophilia',
	'Sickle cell anemia',
	'Color blindness',
	'Asthma (familial)',
	'Neurofibromatosis',
	'Huntington’s disease',
	'Marfan syndrome',
	'Tay-Sachs',
	'Muscular dystrophy',
	'Albinism',
	'Down syndrome (family)',
	'Fragile X syndrome',
	'Phenylketonuria',
	'BRCA mutation',
	'Familial hypercholesterolemia',
	'Wilson’s disease',
];

const ORAL_CANCER_HISTORY = [
	'Suspicious lesion biopsied',
	'Family history of oral cancer',
	'Precancerous lesion',
	'Tongue discoloration',
	'Leukoplakia diagnosis',
	'Smoker with lesion',
	'Alcohol-related damage',
	'Chronic ulcer under tongue',
	'Abnormal gum growth',
	'Cheek mucosa thickening',
	'Lip lesion evaluated',
	'Hard palate mass',
	'Persistent sore throat',
	'White patch in mouth',
	'Red patch on gums',
	'Voice change',
	'Hoarseness with lesion',
	'Ulcerated growth on cheek',
	'Jaw pain with swelling',
	'Difficulty swallowing from lesion',
];

async function seed_database() {
	const database = 'iflair-dental-clinic-management-system';
	const table = 'medical_history';
	const insert_query_header = `INSERT INTO ${table} (patient_id, blood_type, allergies, chronic_illnesses, current_medication, past_surgeries, bleeding_disorders, heart_condition, respiratory_issues, autoimmune_disease, is_pregnant, gum_disease_history, genetic_conditions, oral_cancer_history) VALUES ?`;

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
		const chronic_illnesses = choose_random_element(0.3, CHRONIC_ILLNESSES);
		const number_of_medications = Math.floor(Math.random() * 5) + 1;
		const medications = [...CURRENT_MEDICATIONS]
			.sort(() => Math.random() - 0.5)
			.slice(0, number_of_medications)
			.join(', ');
		const current_medication = chronic_illnesses ? medications : null;

		const is_pregnant = Math.random() < 0.15 ? 1 : 0;

		rows.push([
			i + 1,
			choose_random_element(1, BLOOD_TYPES),
			choose_random_element(0.25, ALLERGIES),
			chronic_illnesses,
			current_medication,
			choose_random_element(0.2, PAST_SURGERIES),
			choose_random_element(0.2, BLEEDING_DISORDERS),
			choose_random_element(0.2, HEART_CONDITIONS),
			choose_random_element(0.2, RESPIRATORY_ISSUES),
			choose_random_element(0.2, AUTOIMMUNE_DISEASES),
			is_pregnant,
			choose_random_element(0.2, GUM_DISEASE_HISTORY),
			choose_random_element(0.2, GENETIC_CONDITIONS),
			choose_random_element(0.15, ORAL_CANCER_HISTORY),
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
