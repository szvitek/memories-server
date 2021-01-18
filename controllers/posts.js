import PostMessage from '../models/postMessage.js';

export const getPosts = async (req, res ) => {
	try {
		const postMessages = await PostMessage.find();

		return res.json(postMessages);
	} catch (err) {
		return res.json({ message: error.message });
	}
}

export const createPosts = async (req, res ) => {
	const post = req.body;
	const newPost = new PostMessage(post);
	try {
		await newPost.save();
		return res.json(newPost).status(201);
	} catch (error) {
		return res.status(409).json({ message: error.message });
	}
}