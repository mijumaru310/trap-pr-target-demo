const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads/profile_images');

// アップロードディレクトリが存在しない場合は作成
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // ユーザーが指定したパスにファイルを保存できるようにする
    const targetDir = req.body.uploadPath ? path.join(uploadDir, req.body.uploadPath) : uploadDir;
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    // ファイル名をユーザーが指定できるようにする
    const originalname = req.body.filename || file.originalname;
    cb(null, originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // 画像ファイルのみを許可
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MBまで
});

module.exports = upload;