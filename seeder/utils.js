export function get_random_element(array) {
	return array[Math.floor(Math.random() * array.length)];
}

export function choose_random_element(probability, array) {
	if (Math.random() < probability) {
		return get_random_element(array);
	}
	return null;
}

export function calculate_age(birthDate) {
	const today = new Date();
	const birth = new Date(birthDate);

	let age = today.getFullYear() - birth.getFullYear();
	const has_birthday_this_year =
		today.getMonth() > birth.getMonth() ||
		(today.getMonth() === birth.getMonth() &&
			today.getDate() >= birth.getDate());

	if (!has_birthday_this_year) {
		age--;
	}

	return age;
}
