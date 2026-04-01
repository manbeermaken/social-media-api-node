import express from "express";
import { login, logout, refreshToken, signup } from "../controllers/authContorllers.ts";

const router = express.Router()

router.post('/login',login)

router.delete('/logout',logout)

router.post('/signup',signup)

router.post('/refresh',refreshToken)

export default router