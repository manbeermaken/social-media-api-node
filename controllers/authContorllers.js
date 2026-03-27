import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import redisClient from '../config/redis.js'
import bcrypt from 'bcrypt'

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
    const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET)
    return [accessToken, refreshToken]
}

export const login = async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username: username })
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid username or password" })
    }
    const [accessToken, refreshToken] = generateTokens(user._id)
    try {
        const SEVEN_DAYS = 60 * 60 * 24 * 7
        await redisClient.setEx(refreshToken, SEVEN_DAYS, user._id.toString())
        res.json({ accessToken, refreshToken })
    } catch (err) {
        console.log('Error during login: ', err);
        res.status(500).json({ message: err.message })
    }
}

export const refreshToken = async (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) { return res.status(401).json({ message: "Token not provided" }) }
    try {
        const tokenExists = await redisClient.get(refreshToken)
        if (!tokenExists) { return res.status(403).json({ message: "Invalid token" }) }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) { return res.status(403).json({ message: "Invalid token" }) }
            const userId = decoded.id
            const accessToken = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
            res.json({ accessToken })
        })
    } catch (err) {
        console.error("Redis error during refresh:", err)
        res.status(500).json({ message: "Server Error" })
    }
}

export const signup = async (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    })
    try {
        const newUser = await user.save()
        const [accessToken, refreshToken] = generateTokens(newUser._id)
        const SEVEN_DAYS = 60 * 60 * 24 * 7
        await redisClient.setEx(refreshToken, SEVEN_DAYS, user._id.toString())
        res.status(201).json({ accessToken, refreshToken })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

export const logout = async (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) { return res.status(401).json({ message: "Token not provided" }) }
    try {
        const tokenExists = await redisClient.get(refreshToken)
        if (!tokenExists) { return res.status(403).json({ message: "Invalid token" }) }
        await redisClient.del(refreshToken)
        res.status(204).send()
    } catch (err) {
        console.log("Redis error during logout: ", err)
        res.status(500).json({ message: "Server Error" })
    }
}