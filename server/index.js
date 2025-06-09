const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const uploadRoutes = require('./routes/upload');

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 打印环境信息
console.log('服务器启动中...');
console.log('环境变量:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: PORT,
  // 检查COS配置是否存在（不打印敏感信息）
  COS_CONFIG_EXISTS: !!process.env.COS_SECRET_ID && !!process.env.COS_SECRET_KEY
});

// 中间件
app.use(cors({
  origin: '*', // 允许所有来源，可以根据需要限制
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('创建上传目录:', uploadDir);
}

// 静态文件服务
app.use(express.static(path.join(__dirname, '../')));

// API路由
app.use('/api/upload', uploadRoutes);

// API状态检查
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

// 所有其他请求返回index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

module.exports = app; 