import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

export const uploadProfileImage = async (fileBuffer, mimetype, userId) => {
  // ユーザーIDをファイル名に含めることで、後で検索しやすくする
  const filename = `profile-images/${userId}-${uuidv4()}-${Date.now()}.${mimetype.split('/')[1]}`;
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filename,
    Body: fileBuffer,
    ContentType: mimetype,
    ACL: 'public-read' // 公開設定でアップロード
  };

  try {
    const data = await s3.upload(params).promise();
    // オブジェクトの公開URLを直接返す
    const publicUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;
    return { success: true, url: publicUrl, key: filename };
  } catch (error) {
    console.error('Error uploading image to S3:', error);
    return { success: false, message: 'Failed to upload image.' };
  }
};