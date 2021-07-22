import db from '../../../libs/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
	if (req.method !== 'POST') return res.status(405).end();

	const { username, password } = req.body;

	const checkUser = await db('users').where({ username }).first();

	if (!checkUser) return res.status(401).end();

	const checkPassword = await bcrypt.compare(password, checkUser.password);

	if (!checkPassword) return res.status(401).end();

	const token = jwt.sign(
		{
			id: checkUser.id,
			name: checkUser.name,
			username: checkUser.username,
			email: checkUser.email,
			imageUrl: checkUser.imageUrl,
			admin: checkUser.admin,
		},
		process.env.SECRET_KEY,
		{
			expiresIn: '7 days',
		}
	);

	res.status(200);
	res.json({
		message: 'Login successfully',
		token,
	});
}
