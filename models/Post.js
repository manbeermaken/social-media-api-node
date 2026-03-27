import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Post content is required']
  },
  // author: {
  //   // This stores the MongoDB ObjectId of the user who created the post
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User', 
  //   required: true
  // },
},{
    timestamps: true
})

const Post = mongoose.model('Post',postSchema)
export default Post