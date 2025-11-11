import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectedRoute = async (req, res, next) => {
    try {
        // Lấy token từ header Authorization
        const authHeader = req.headers["authorization"];

        // Xác nhận token hợp lệ và giải mã nó
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: "Không tìm thấy access token" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Tìm người dùng trong cơ sở dữ liệu (dung id từ token đã giải mã)
        const user = await User.findById(decoded.userId).select('-password'); // Loại bỏ trường mật khẩu
        // Gán thông tin người dùng vào req.user
        req.user = user;
        // Gọi hàm next() để chuyển sang middleware tiếp theo
        next();
    } catch (error) {
        // Xử lý lỗi Giải mã/Hết hạn
        let errorMessage = "Access token không hợp lệ.";
        if (error.name === 'TokenExpiredError') {
            errorMessage = "Access token đã hết hạn. Vui lòng làm mới token.";
        }

        return res.status(403).json({ message: errorMessage });
    }
};
