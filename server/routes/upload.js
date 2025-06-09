const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadFile, deleteFile, listFiles } = require('../services/cos-service');

// 确保临时上传目录存在
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置multer存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 限制10MB
});

// 测试路由
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: '上传API工作正常',
    timestamp: new Date().toISOString()
  });
});

// 上传头像
router.post('/avatar', upload.single('avatar'), async (req, res) => {
  try {
    console.log('收到头像上传请求');
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: '没有文件上传' });
    }

    console.log('头像文件信息:', req.file);
    
    const result = await uploadFile(req.file, 'avatars');
    console.log('头像上传结果:', result);
    
    res.json({
      success: true,
      fileUrl: result.fileUrl,
      key: result.key
    });
  } catch (error) {
    console.error('上传头像失败:', error);
    res.status(500).json({ success: false, message: '上传失败', error: error.message });
  }
});

// 上传相册封面
router.post('/album-cover', upload.single('cover'), async (req, res) => {
  try {
    console.log('收到相册封面上传请求');
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: '没有文件上传' });
    }

    console.log('相册封面文件信息:', req.file);
    
    const result = await uploadFile(req.file, 'albums');
    console.log('相册封面上传结果:', result);
    
    res.json({
      success: true,
      fileUrl: result.fileUrl,
      key: result.key
    });
  } catch (error) {
    console.error('上传相册封面失败:', error);
    res.status(500).json({ success: false, message: '上传失败', error: error.message });
  }
});

// 上传相册照片
router.post('/photo', upload.single('photo'), async (req, res) => {
  try {
    console.log('收到照片上传请求');
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: '没有文件上传' });
    }

    const albumId = req.body.albumId || 'default';
    console.log('照片文件信息:', req.file, '相册ID:', albumId);
    
    const result = await uploadFile(req.file, `photos/${albumId}`);
    console.log('照片上传结果:', result);
    
    res.json({
      success: true,
      fileUrl: result.fileUrl,
      key: result.key
    });
  } catch (error) {
    console.error('上传照片失败:', error);
    res.status(500).json({ success: false, message: '上传失败', error: error.message });
  }
});

// 上传时光轴图片
router.post('/timeline', upload.single('image'), async (req, res) => {
  try {
    console.log('收到时光轴图片上传请求');
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: '没有文件上传' });
    }

    console.log('时光轴图片文件信息:', req.file);
    
    const result = await uploadFile(req.file, 'timeline');
    console.log('时光轴图片上传结果:', result);
    
    res.json({
      success: true,
      fileUrl: result.fileUrl,
      key: result.key
    });
  } catch (error) {
    console.error('上传时光轴图片失败:', error);
    res.status(500).json({ success: false, message: '上传失败', error: error.message });
  }
});

// 删除文件
router.delete('/file', async (req, res) => {
  try {
    const { key } = req.body;
    console.log('收到删除文件请求, key:', key);
    
    if (!key) {
      return res.status(400).json({ success: false, message: '缺少文件key' });
    }

    await deleteFile(key);
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('删除文件失败:', error);
    res.status(500).json({ success: false, message: '删除失败', error: error.message });
  }
});

// 获取文件列表
router.get('/files', async (req, res) => {
  try {
    const { prefix } = req.query;
    console.log('收到获取文件列表请求, prefix:', prefix);
    
    const files = await listFiles(prefix || '');
    res.json({
      success: true,
      files: files.map(file => ({
        key: file.Key,
        size: file.Size,
        lastModified: file.LastModified,
        url: `${require('../config/cos-config').BaseUrl}/${file.Key}`
      }))
    });
  } catch (error) {
    console.error('获取文件列表失败:', error);
    res.status(500).json({ success: false, message: '获取文件列表失败', error: error.message });
  }
});

module.exports = router; 