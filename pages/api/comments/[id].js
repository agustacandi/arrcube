import db from '../../../libs/db';
import authorization from '../../../middlewares/authorization';

export default async function handler(req, res) {
	if (req.method !== 'GET') return res.status(405).end();

	await authorization(req, res);

	const { id } = req.query;

	const comment = await db('comments').where({ postId: id });

	if (!comment) return res.status(404).end();

	res.status(200);
	res.json({
		message: 'Here your post!',
		comment,
	});
}
