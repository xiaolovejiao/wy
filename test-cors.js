const COS = require('cos-nodejs-sdk-v5');
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// 腾讯云COS配置 - 使用环境变量
const config = {
  SecretId: process.env.COS_SECRET_ID,
  SecretKey: process.env.COS_SECRET_KEY,
  Bucket: process.env.COS_BUCKET || 'wy-1320748943',
  Region: process.env.COS_REGION || 'ap-guangzhou',
  BaseUrl: process.env.COS_BASE_URL || `https://${process.env.COS_BUCKET || 'wy-1320748943'}.cos.${process.env.COS_REGION || 'ap-guangzhou'}.myqcloud.com`
};

// 创建COS实例
const cos = new COS({
  SecretId: config.SecretId,
  SecretKey: config.SecretKey
});

// 创建HTTP服务器
const server = http.createServer((req, res) => {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // 处理OPTIONS请求
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }
  
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // 处理API请求
  if (pathname === '/api/test-cors') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true, message: 'CORS测试成功' }));
  }
  // 处理获取文件列表请求
  else if (pathname === '/api/files') {
    const prefix = parsedUrl.query.prefix || '';
    
    cos.getBucket({
      Bucket: config.Bucket,
      Region: config.Region,
      Prefix: prefix
    }, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: err.message }));
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          success: true,
          files: data.Contents.map(file => ({
            key: file.Key,
            size: file.Size,
            lastModified: file.LastModified,
            url: `${config.BaseUrl}/${file.Key}`
          }))
        }));
      }
    });
  }
  // 处理静态文件
  else if (pathname === '/' || pathname === '/index.html') {
    fs.readFile(path.join(__dirname, 'test-upload.html'), (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Error loading test page');
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

// 启动服务器
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`测试服务器运行在 http://localhost:${PORT}`);
}); 