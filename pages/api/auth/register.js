import db from '../../../libs/db';
import bcrypt from 'bcryptjs';
import authorization from '../../../middlewares/authorization';

export default async function handler(req, res) {
	if (req.method !== 'POST') return res.status(405).end();

	const { name, username, email, password, imageUrl, admin } = req.body;

	const salt = bcrypt.genSaltSync(10);

	const hashedPassword = bcrypt.hashSync(password, salt);

	const registerUser = await db('users').insert({
		name,
		username,
		email,
		password: hashedPassword,
		imageUrl,
		admin,
	});

	const user = await db('users').where({ id: registerUser }).first();

	res.status(200);
	res.json({
		message: 'User registered successfully!',
		user,
	});
}
