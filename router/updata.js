const multer = require('multer');  
const express = require("express");  
const path = require('path');  

// 创建文章分类模块  
const router = express.Router();  
const artCate_handler = require("../router_handler/updata");  

// 配置 multer 存储选项  
const storage = multer.diskStorage({  
    destination: function (req, file, cb) {  
        cb(null, 'uploads/img/'); // 保存路径  
    },  
    filename: function (req, file, cb) {  
        cb(null, Date.now() + path.extname(file.originalname)); // 使用时间戳作为文件名  
    }  
});  

// 返回已上传的所有切片名
const createUploadedList = async (fileHash) => {
    // 如果存在这个目录则返回这个目录下的所有切片
    // fse.readdir返回一个数组，其中包含指定目录中的文件名。
    return fse.existsSync(getChunkDir(fileHash))
      ? await fse.readdir(getChunkDir(fileHash))
      : []
}

// 创建 multer 实例  
const upload = multer({   
    storage: storage,  
    limits: { fileSize: 2 * 1024 * 1024 } // 限制文件大小为 2MB  
}); 
// 创建上传接口  
router.post('/img', upload.single('image'),artCate_handler.setUpdata);
router.post('/verify', async (req, res) => {
    try {
      const data = await resolvePost(req)
      const { fileHash, fileName } = data
  
      // 文件名后缀
      const ext = extractExt(fileName)
      // 最终文件路径
      const filePath = path.resolve(UPLOAD_DIR, `${fileHash}${ext}`)
  
      // 如果已经存在文件则标识文件已存在，不需要再上传
      if (fse.existsSync(filePath)) {
        res.send({
          code: 0,
          data: {
            shouldUpload: false,
            uploadedList: [],
          },
          msg: '已存在该文件',
        })
      } else {
        // 否则则返回文件已经存在切片给前端
        // 告诉前端这些切片不需要再上传
        res.send({
          code: 0,
          data: {
            shouldUpload: true,
            uploadedList: await createUploadedList(fileHash),
          },
          msg: '需要上传文件/部分切片',
        })
      }
    } catch (err) {
      res.send({ code: -1, msg: '上传失败', data: err })
    }
})
// 将路由对象共享出去  
module.exports = router;

  