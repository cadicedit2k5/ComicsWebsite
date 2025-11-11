import bcrypt from 'bcrypt';
import User from '../models/User.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import Session from '../models/Session.js';

const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export const register = async (req, res) => {
    try {
        const { username, password, email, firstName, lastName } = req.body;

        if (!username || !password || !email || !firstName || !lastName) {
            return res.status(400).json({ message: 'Vui lòng điền đủ username, password, email, firstName và lastName' });
        }
        // Kiem tra username da ton tai chua
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username đã tồn tại' });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10); // salt rounds = 10
        // Luu nguoi dung vao database
        const newUser = await User.create({
            username,
            password: hashedPassword,
            email,
            displayName: `${firstName} ${lastName}`,
        });

        // Tra ve phan hoi
        return res.status(201).json({
            message: 'Đăng ký thành công', user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error('Lỗi đăng ký người dùng:', error);
        return res.status(500).json({ message: 'Lỗi Server khi đăng ký!' });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ message: 'Vui lòng điền đủ username và password' });
        }

        // Kiem tra nguoi dung co ton tai khong
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Username tồn tại!' });
        }

        // Lay hash password tu database so sanh voi password nguoi dung nhap vao
        const isPasswordValid = await bcrypt.compare(password, user.password); // hash password tu db va password nguoi dung nhap vao

        // Kiem tra password co dung khong
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Mật khẩu không chính xác!' });
        }

        // Neu khop thi tao access token voi jwt
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_TTL }
        );

        // Tao refresh token
        const refreshToken = crypto.randomBytes(64).toString('hex');

        // Tao session de luu refresh token
        await Session.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
        });

        // Tra ve refresh token cho nguoi dung trong cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none", //backend, frontend deploy rieng
            maxAge: REFRESH_TOKEN_TTL,
        });

        // Tra ve access token cho nguoi dung trong response body
        return res.status(200).json({
            message: 'Đăng nhập thành công', accessToken,
        });
    } catch (error) {
        console.error('Lỗi đăng nhập người dùng:', error);
        return res.status(500).json({ message: 'Lỗi Server khi đăng nhập!' });
    }
};

export const logout = async (req, res) => {
    try {
        // Lay refresh token tu cookie
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Phiên làm việc không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.' });
        }

        // Xoa session trong database
        await Session.deleteOne({ refreshToken: refreshToken });

        // Xoa cookie refresh token tren trinh duyet
        res.clearCookie('refreshToken');

        // Tra ve phan hoi
        return res.sendStatus(204);
    } catch (error) {
        console.error('Lỗi đăng xuất người dùng:', error);
        return res.status(500).json({ message: 'Lỗi Server khi đăng xuất!' });
    }
};

export const refreshToken = async (req, res) => {
    try {
        // Lay refresh token tu cookie
        const token = req.cookies?.refreshToken;

        if (!token) {
            return res.status(401).json({ message: 'Không tìm thấy token làm mới.' });
        }
        // So voi refresh token trong db
        const session = await Session.findOne({ refreshToken: token });

        if (!session) {
            return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
        }
        // Kiem tra han refresh token
        if (session.expiresAt < new Date()) {
            return res.status(403).json({ message: 'Token đã hết hạn.' });
        }
        // Tao access token moi
        const accessToken = jwt.sign(
            { userId: session.userId },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_TTL }
        );

        // Tra ve access token moi
        return res.status(200).json({ accessToken });
    } catch (error) {
        console.error('Lỗi làm mới token:', error);
        return res.status(500).json({ message: 'Lỗi Server khi làm mới token!' });
    }
};