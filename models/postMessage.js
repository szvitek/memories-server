import mongoose from 'mongoose';

/*
todo: - relation between post and user
todo: - name should be read via the ralation
*/
const postSchema = mongoose.Schema({
	title: String,
	message: String,
	name: String,
	creator: String,
	tags: [String],
	selectedFile: String,
	likes: {
		type: [String],
		default: []
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

const PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;