import express from "express";
import {PrismaClient} from '@prisma/client';
import {sha256} from 'js-sha256';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const userRouter = express.Router();
userRouter.use(express.json());
const prisma = new PrismaClient();


userRouter.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required",
            });
        }

        const trimmedUsername = username.trim();

        const user = await prisma.adm_user.findFirst({
            where: {
                username: trimmedUsername,
            },
            include: {
                profile: true,
            },
        });

        // First, check if the user exists
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password",
            });
        }

        // Now, compare the usernames for exact case match
        if (user.username !== trimmedUsername) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password",
            });
        }

        // Hash the provided password
        const hashedPassword = sha256(password);

        // Compare passwords
        if (hashedPassword !== user.password) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password",
            });
        }

        // Generate token with expiration
        const token = jwt.sign(
            {
                userId: user.user_id,
                profileId: user.id_profile,
                name: user.profile.fullname, 
                gender: user.profile.gender, 
            },
            process.env.JWT_SECRET,
            // { expiresIn: '1m' }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});




userRouter.get('/token', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    const token = authHeader.split(" ")[1];
    try {
        const { userId, name, profileId, gender } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.adm_user.findUnique({
            where: { user_id: userId }
        });
        delete user.password;

        res.send({
            success: true,
            user,
            name,
            profileId,
            gender
        });
    } catch (err) {
        console.error(err);
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
});













export default userRouter