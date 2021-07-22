import db from '../../../libs/db';
import authorization from '../../../middlewares/authorization';

export default async function handler(req, res) {
	if (req.method !== 'POST') return res.status(405).end();

	await authorization(req, res);

	const { title, content, author, name, imageUrl, admin } = req.body;

	const createPost = await db('posts').insert({
		title,
		content,
		author,
		name,
		imageUrl,
		admin,
	});

	const post = await db('posts').where({ id: createPost }).first();

	res.status(200);
	res.json({
		message: 'Post created successfully',
		post,
	});
}
