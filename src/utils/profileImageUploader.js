import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // ユーザーIDに基づいてディレクトリを動的に作成
    const userId = req.body.userId || 'default'; // ユーザーIDが提供されない場合は'default'を使用
    const uploadDir = path.join(__dirname, '../../uploads/profileImages', userId);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // ファイル名を直接使用（ユニーク化なし）
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // 許可されるMIMEタイプをチェック
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']; // PDFも許可してみる
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 10 } // ファイルサイズ制限を10MBに緩和
});

export default upload;