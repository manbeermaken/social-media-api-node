import Post from "../models/Post.js";
import User from "../models/User.js";

const getPostFromId = async (req, res, next) => {
    let post
    try {
        post = await Post.findById(req.params.id)
        if (post === null) {
            return res.status(404).json({ message: "cannot find post" })
        }
    } catch (e) {
        if (e.name === 'CastError') { return res.status(400).json({ message: "Invalid post ID format" }) }
        return res.status(500).json({ message: e.message })
    }
    req.post = post
    next()
}

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getPost = [getPostFromId, (req, res) => {
    res.json(req.post)
}]

const getUserPosts = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
        if (!user) { return res.status(404).json({ message: 'User not found' }) }

        const posts = await Post.find({ authorId: user._id })
        res.status(200).json(posts)

    } catch (err) {
        console.error("Error in getUserPosts:", err)
        res.status(500).json({ message: err.message })
    }
}

const createPost = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userId })
        if (!user) { return res.status(404).json({ message: "User not found" }) }

        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            authorId: user._id,
            authorName: user.username
        })
        
        const newPost = await post.save()
        res.status(201).json(newPost)
    } catch (err) {
        return res.status(400).json({ message: err.message })
    }
}

const updatePost = [getPostFromId, async (req, res) => {
    if (req.post.authorId.toString() !== req.userId.toString()) { return res.status(403).json({ message: "not allowed" }) }
    if (req.body.title != null) {
        req.post.title = req.body.title
    }
    if (req.body.content != null) {
        req.post.content = req.body.content
    }
    try {
        const updatedPost = await req.post.save()
        res.json(updatedPost)
    } catch (e) {
        res.status(400).json({ message: e.message })
    }
}]

const deletePost = [getPostFromId, async (req, res) => {
    if (req.post.authorId.toString() !== req.userId.toString()) { return res.status(403).json({ message: "not allowed" }) }
    try {
        await req.post.deleteOne()
        res.json({ message: "deleted post" })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}]

export { getAllPosts, getPost, createPost, updatePost, deletePost, getUserPosts }