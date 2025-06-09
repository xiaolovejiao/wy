const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const uploadRoutes = require('./routes/upload');

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 打印环境信息
console.log('服务器启动环境:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: PORT,
  CWD: process.cwd(),
  VERCEL_ENV: process.env.VERCEL_ENV,
  VERCEL_URL: process.env.VERCEL_URL
});

// 中间件
app.use(cors({
  origin: '*', // 允许所有来源访问
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  console.log('创建上传目录:', uploadDir);
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 静态文件服务
app.use(express.static(path.join(__dirname, '../')));

// API路由
app.use('/api/upload', uploadRoutes);

// 测试路由
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API服务器正常工作',
    env: process.env.NODE_ENV,
    time: new Date().toISOString()
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'production' ? '详情请查看服务器日志' : err.message
  });
});

// 所有其他请求返回index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// 启动服务器
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
  });
}

module.exports = app; 