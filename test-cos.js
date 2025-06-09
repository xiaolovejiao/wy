const COS = require('cos-nodejs-sdk-v5');
const fs = require('fs');

// 腾讯云COS配置 - 使用环境变量
const cos = new COS({
  SecretId: process.env.COS_SECRET_ID,
  SecretKey: process.env.COS_SECRET_KEY
});

// 测试获取存储桶列表
cos.getService(function(err, data) {
  console.log('获取存储桶列表：');
  if (err) {
    console.error('错误:', err);
  } else {
    console.log('成功:', data);
  }
});

// 测试获取存储桶中的文件列表
cos.getBucket({
  Bucket: process.env.COS_BUCKET || 'wy-1320748943',
  Region: process.env.COS_REGION || 'ap-guangzhou'
}, function(err, data) {
  console.log('\n获取存储桶中的文件列表：');
  if (err) {
    console.error('错误:', err);
  } else {
    console.log('成功:', data);
  }
});

// 测试上传一个测试文件
const testFilePath = './test-file.txt';
fs.writeFileSync(testFilePath, '这是一个测试文件', 'utf8');

cos.putObject({
  Bucket: process.env.COS_BUCKET || 'wy-1320748943',
  Region: process.env.COS_REGION || 'ap-guangzhou',
  Key: 'test-file.txt',
  Body: fs.createReadStream(testFilePath)
}, function(err, data) {
  console.log('\n上传测试文件：');
  if (err) {
    console.error('错误:', err);
  } else {
    console.log('成功:', data);
    console.log('文件访问地址:', `https://${process.env.COS_BUCKET || 'wy-1320748943'}.cos.${process.env.COS_REGION || 'ap-guangzhou'}.myqcloud.com/test-file.txt`);
  }
}); 