const COS = require('cos-nodejs-sdk-v5');
const fs = require('fs');
const path = require('path');
const cosConfig = require('../config/cos-config');

// 创建COS实例
const cos = new COS({
  SecretId: cosConfig.SecretId,
  SecretKey: cosConfig.SecretKey
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

    cos.putObject({
      Bucket: cosConfig.Bucket,
      Region: cosConfig.Region,
      Key: key,
      Body: fs.createReadStream(file.path),
      ContentLength: file.size,
      ContentType: file.mimetype,
    }, (err, data) => {
      // 删除临时文件
      fs.unlink(file.path, (unlinkErr) => {
        if (unlinkErr) {
          console.error('删除临时文件失败:', unlinkErr);
        }
      });

      if (err) {
        reject(err);
      } else {
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
    cos.deleteObject({
      Bucket: cosConfig.Bucket,
      Region: cosConfig.Region,
      Key: key
    }, (err, data) => {
      if (err) {
        reject(err);
      } else {
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
    cos.getBucket({
      Bucket: cosConfig.Bucket,
      Region: cosConfig.Region,
      Prefix: prefix
    }, (err, data) => {
      if (err) {
        reject(err);
      } else {
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