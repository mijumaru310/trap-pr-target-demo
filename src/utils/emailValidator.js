import User from '../models/User';

/**
 * 指定されたメールアドレスが既に存在するかどうかをチェックします。
 * @param {string} email - チェックするメールアドレス。
 * @returns {Promise<boolean>} メールアドレスが存在すればtrue、そうでなければfalse。
 */
export const isEmailTaken = async (email) => {
  if (!email || typeof email !== 'string') {
    throw new Error('Invalid email provided.');
  }
  try {
    // 小文字に変換して比較することで、大文字小文字の違いを吸収します。
    const user = await User.findOne({ email: { $regex: new RegExp(`^${email.toLowerCase()}$`, 'i') } });
    return !!user;
  } catch (error) {
    console.error('Error checking email existence:', error);
    throw new Error('Failed to check email existence.');
  }
};
