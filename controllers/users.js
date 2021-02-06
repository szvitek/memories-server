import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';
import { JWT_SECRET } from '../config.js';

export const signin = async (req, res ) => {
	const { email, password } = req.body;
	try {
		// find existing user
		const existingUser = await User.findOne({ email });
		if (!existingUser) {
			return res.status(404).json({ message: "User not found" });
		}

		// compare password
		// todo: should be a schema instance method
		const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
		if (!isPasswordCorrect) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// generate token
		// todo: should be a schema instance method
		const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, JWT_SECRET, { expiresIn: '1h' });

		return res.json({ result: existingUser, token }).status(200);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Something went wrong' });
	}
}

export const signup = async (req, res ) => {
	try {
		const { email, password, confirmPassword, firstName, lastName } = req.body;

		// check if user exist
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "User already exist" });
		}

		// check password
		if (password !== confirmPassword) {
			return res.status(400).json({ message: "Passwords don't match." });
		}

		// hash password
		// todo: should be automatic in the pre save hook
		const hashedPassword = await bcrypt.hash(password, 12);

		const newUser = await User.create({
			email,
			password: hashedPassword,
			name: `${firstName} ${lastName}`
		});
		// generate token
		// todo: should be a schema instance method
		const token = jwt.sign({ email: newUser.email, id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

		return res.json({ result: newUser, token }).status(200);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Something went wrong' });
	}
}
