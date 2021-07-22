import db from '../../../libs/db';
import authorization from '../../../middlewares/authorization';

export default async function handler(req, res) {
	if (req.method !== 'POST') return res.status(405).end();

	await authorization(req, res);

	const { comment, postId, username, name, imageUrl, admin } = req.body;

	const createPost = await db('comments').insert({
		comment,
		postId,
		username,
		name,
		imageUrl,
		admin,
	});

	const userComment = await db('comments').where({ id: createPost }).first();

	res.status(200);
	res.json({
		message: 'Post created successfully',
		userComment,
	});
}
