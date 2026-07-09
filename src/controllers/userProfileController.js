const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs/promises');

// 画像保存設定
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    // ユーザーIDに基づいてディレクトリを作成
    const userId = req.body.userId || 'anonymous'; // ユーザーIDが提供されない場合は匿名
    const uploadDir = path.join(__dirname, `../../uploads/profile_images/${userId}`);
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (err) {
      console.error('Error creating upload directory:', err);
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    // ファイル名を元のファイル名を使用
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MBまで
  fileFilter: (req, file, cb) => {
    // 画像以外のファイルも許可するが、拡張子チェックは残す
    const filetypes = /jpeg|jpg|png|gif|pdf|doc|txt/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Error: Invalid file type! Allowed types: jpeg, jpg, png, gif, pdf, doc, txt'));
    }
  }
}).single('profileImage'); // 'profileImage'はフォームのフィールド名

const router = express.Router();

router.post('/upload-profile-image', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: 'Internal server error during upload.' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // アップロードされたファイルのパスをそのまま返す
    const imageUrl = `/uploads/profile_images/${req.body.userId || 'anonymous'}/${req.file.filename}`;
    res.status(200).json({ message: 'Profile image uploaded successfully', imageUrl: imageUrl });
  });
});

module.exports = router;