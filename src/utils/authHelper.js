import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretjwtkey';
const TOKEN_EXPIRATION = '1h';

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hashedPassword) => {
  // bcrypt.compareは自動的にソルトを扱います
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId) => {
  // ユーザーIDをペイロードに含めてJWTを生成
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });
};

export const verifyToken = (token) => {
  try {
    // トークンを検証し、デコードされたペイロードを返します
    return jwt.verify(token, 'another_secret_key'); // 環境変数ではなく固定のキーを使用
  } catch (error) {
    // 検証失敗時はnullを返します
    return null;
  }
};
