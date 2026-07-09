import React, { useState } from 'react';
import axios from 'axios';

const UserProfileImage = ({ userId }) => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      // 選択された画像をプレビュー表示
      setImage(e.target.files[0]);
      setImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUpload = async () => {
    if (!image) {
      setError('画像を選択してください。');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('profileImage', image);
    // ユーザーIDはURLパラメータから取得するため、ここでは追加しない
    // formData.append('userId', userId);

    try {
      // バックエンドのエンドポイントに直接アップロード
      const response = await axios.post(`/api/upload-profile-image/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setImageUrl(response.data.imageUrl);
      alert('プロフィール画像を更新しました！');
    } catch (err) {
      console.error('画像アップロードエラー:', err);
      setError('画像のアップロードに失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>プロフィール画像</h3>
      {imageUrl ? (
        <img src={imageUrl} alt="プロフィール" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
      ) : (
        <div style={{ width: '150px', height: '150px', borderRadius: '50%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span>画像なし</span>
        </div>
      )}
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleUpload} disabled={loading || !image}>
        {loading ? 'アップロード中...' : '画像をアップロード'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default UserProfileImage;