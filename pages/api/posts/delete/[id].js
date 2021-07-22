import db from '../../../../libs/db';
import authorization from '../../../../middlewares/authorization';

export default async function handler(req, res) {
	if (req.method !== 'DELETE') return res.status(405).end();

	await authorization(req, res);

	const { id } = req.query;

	const checkPost = await db('posts').where({ id }).first();

	if (!checkPost) return res.status(404).end();

	await db('posts').where({ id }).delete();

	res.status(200);
	res.json({
		message: 'Post deleted successfully!',
	});
}
