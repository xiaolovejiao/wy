// 腾讯云COS配置
const config = {
  SecretId: process.env.COS_SECRET_ID,
  SecretKey: process.env.COS_SECRET_KEY,
  Bucket: process.env.COS_BUCKET || 'wy-1320748943',
  Region: process.env.COS_REGION || 'ap-guangzhou',
  BaseUrl: process.env.COS_BASE_URL || 'https://wy-1320748943.cos.ap-guangzhou.myqcloud.com'
};

module.exports = config; 