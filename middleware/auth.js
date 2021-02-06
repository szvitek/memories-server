import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

const auth = async (req, res, next) => {
	try {
		const token = req.headers?.authorization?.split(" ")[1];
		const isCustomAuth = token.length < 500; // google token is longer than 500 chars

		let decodedData;
		if(token && isCustomAuth) {
			decodedData = jwt.verify(token, JWT_SECRET);
			req.userId = decodedData?.id;
		} else {
			decodedData = jwt.decode(token);
			req.userId = decodedData?.sub;
		}

		next();
	} catch (error) {
		console.log(error);
		next(error.message)
	}
}

export default auth;