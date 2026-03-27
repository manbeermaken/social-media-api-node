import express from "express";
import { createPost, deletePost, getAllPosts, getPost, updatePost } from "../controllers/postsControllers.js";

const router = express.Router()

router.get('/', getAllPosts)

router.get('/:id', getPost)

router.post('/', createPost)

router.patch('/:id', updatePost)

router.delete('/:id', deletePost)



export default router