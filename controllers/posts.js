import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js';

export const getPosts = async (req, res ) => {
	try {
		const postMessages = await PostMessage.find();

		return res.json(postMessages);
	} catch (err) {
		return res.json({ message: error.message });
	}
}

export const createPost = async (req, res ) => {
	const post = req.body;
	const newPost = new PostMessage(post);
	try {
		await newPost.save();
		return res.json(newPost).status(201);
	} catch (error) {
		return res.status(409).json({ message: error.message });
	}
}

export const updatePost = async (req, res) => {
	const { id: _id } = req.params;
	const post = req.body;

	if (!mongoose.Types.ObjectId.isValid(_id)) {
		return res.status(404).send('No post with that id');
	}

	const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, { new: true });

	res.json(updatedPost)
}