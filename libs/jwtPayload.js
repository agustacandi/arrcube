import jwt from 'jsonwebtoken';

export default function jwtPayload(token) {
	return new Promise((resolve) => {
		return jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
			if (err) return resolve(err);
			resolve(decoded);
		});
	});
}
