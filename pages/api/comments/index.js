import db from '../../../libs/db';
import authorization from '../../../middlewares/authorization';

export default async function handler(req, res) {
	if (req.method !== 'GET') return res.status(405).end();

	await authorization(req, res);

	const comments = await db('comments');

	res.status(200);
	res.json({
		message: 'Here your comments!',
		comments,
	});
}
