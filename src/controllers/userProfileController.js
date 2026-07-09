import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    // 認証済みのユーザーIDをセッションから取得 (例: req.user.id)
    const userId = req.user.id; // 認証ミドルウェアで設定されていると仮定
    if (!userId) {
      return cb(new Error('ユーザー認証が必要です。'), false);
    }
    // ユーザーIDをパスの一部として利用
    const uploadPath = path.join(__dirname, '..', '..', 'uploads', String(userId));
    await fs.mkdir(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // 元のファイル名とユーザーIDを組み合わせてユニークなファイル名を生成
    const uniqueSuffix = Date.now() + '-' + uuidv4();
    const fileExtension = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('許可されていないファイルタイプです。JPEG, PNG, GIFのみアップロードできます。'), false);
    }
  }
});

// プロフィール画像アップロードAPI
router.post('/profile-image', upload.single('profileImage'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'ファイルがアップロードされていません。' });
  }

  // 認証済みのユーザーIDをセッションから取得 (例: req.user.id)
  const userId = req.user.id; // 認証ミドルウェアで設定されていると仮定

  if (!userId) {
    return res.status(401).json({ message: '認証されたユーザーIDが無効です。' });
  }

  try {
    // ファイルパスはMulterによって既に決定されているため、ここではデータベースに保存するパスを構築
    const filePathForDb = `/uploads/${userId}/${req.file.filename}`;

    // データベースにファイルパスを保存する処理 (例: user.profileImagePath = filePathForDb)
    // await User.findByIdAndUpdate(userId, { profileImagePath: filePathForDb });

    res.status(200).json({ message: 'プロフィール画像が正常にアップロードされました。', filePath: filePathForDb });
  } catch (error) {
    console.error('プロフィール画像のアップロード中にエラーが発生しました:', error);
    res.status(500).json({ message: 'サーバーエラーによりアップロードに失敗しました。' });
  }
});

export default router;