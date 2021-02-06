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

	return res.json(updatedPost);
}

export const deletePost = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).send('No post with that id');
	}

	await PostMessage.findByIdAndRemove(id);

	return res.json({ message: 'Post deleted successfully'});
}

export const likePost = async (req, res) => {
	const { id } = req.params;

	if (!req.userId) {
		return res.status(401)
	}

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).send('No post with that id');
	}

	const post = await PostMessage.findById(id);

	const isLiked = post.likes.find(id => id === req.userId.toString());

	if (!isLiked) {
		// like
		post.likes.push(req.userId);
	} else {
		// dislike
		post.likes = post.likes(id => id !== req.userId.toString());
	}

	const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

	return res.json(updatedPost);
}