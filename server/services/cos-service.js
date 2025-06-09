const COS = require('cos-nodejs-sdk-v5');
const fs = require('fs');
const path = require('path');
const cosConfig = require('../config/cos-config');

// 创建COS实例
const cos = new COS({
  SecretId: cosConfig.SecretId,
  SecretKey: cosConfig.SecretKey
});

// 打印配置信息用于调试
console.log('COS配置信息:', {
  Bucket: cosConfig.Bucket,
  Region: cosConfig.Region,
  BaseUrl: cosConfig.BaseUrl,
  SecretIdExists: !!cosConfig.SecretId,
  SecretKeyExists: !!cosConfig.SecretKey
});

/**
 * 上传文件到腾讯云COS
 * @param {Object} file - 文件对象
 * @param {String} folder - 存储的文件夹路径
 * @returns {Promise} - 返回上传结果
 */
const uploadFile = (file, folder = '') => {
  return new Promise((resolve, reject) => {
    // 生成唯一的文件名
    const fileName = `${Date.now()}-${file.originalname}`;
    const key = folder ? `${folder}/${fileName}` : fileName;

    console.log('开始上传文件:', {
      fileName,
      folder,
      key,
      fileSize: file.size,
      filePath: file.path,
      mimeType: file.mimetype
    });

    cos.putObject({
      Bucket: cosConfig.Bucket,
      Region: cosConfig.Region,
      Key: key,
      Body: fs.createReadStream(file.path),
      ContentLength: file.size,
      ContentType: file.mimetype,
      onProgress: function(progressData) {
        console.log('上传进度:', JSON.stringify(progressData));
      }
    }, (err, data) => {
      // 删除临时文件
      fs.unlink(file.path, (unlinkErr) => {
        if (unlinkErr) {
          console.error('删除临时文件失败:', unlinkErr);
        }
      });

      if (err) {
        console.error('上传文件失败:', err);
        reject(err);
      } else {
        console.log('上传文件成功:', data);
        // 返回文件的访问URL
        const fileUrl = `${cosConfig.BaseUrl}/${key}`;
        resolve({
          fileUrl,
          fileName,
          key
        });
      }
    });
  });
};

/**
 * 删除COS上的文件
 * @param {String} key - 文件的key
 * @returns {Promise} - 返回删除结果
 */
const deleteFile = (key) => {
  return new Promise((resolve, reject) => {
    console.log('开始删除文件:', key);
    
    cos.deleteObject({
      Bucket: cosConfig.Bucket,
      Region: cosConfig.Region,
      Key: key
    }, (err, data) => {
      if (err) {
        console.error('删除文件失败:', err);
        reject(err);
      } else {
        console.log('删除文件成功:', data);
        resolve(data);
      }
    });
  });
};

/**
 * 获取文件列表
 * @param {String} prefix - 前缀路径
 * @returns {Promise} - 返回文件列表
 */
const listFiles = (prefix = '') => {
  return new Promise((resolve, reject) => {
    console.log('获取文件列表:', prefix);
    
    cos.getBucket({
      Bucket: cosConfig.Bucket,
      Region: cosConfig.Region,
      Prefix: prefix
    }, (err, data) => {
      if (err) {
        console.error('获取文件列表失败:', err);
        reject(err);
      } else {
        console.log('获取文件列表成功:', data);
        resolve(data.Contents);
      }
    });
  });
};

module.exports = {
  uploadFile,
  deleteFile,
  listFiles
}; 