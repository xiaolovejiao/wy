const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const uploadRoutes = require('./routes/upload');

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 静态文件服务
app.use(express.static(path.join(__dirname, '../')));

// API路由
app.use('/api/upload', uploadRoutes);

// 所有其他请求返回index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

module.exports = app; 