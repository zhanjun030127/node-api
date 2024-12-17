// 导入数据库连接对象
const db = require("../db/index");

// 注册用户的处理函数
exports.setUpdata= (req, res) => {

    if (!req.file) {  
        return res.cc('没有文件上传',400); // No file uploaded  
    }  

    const fileType = req.file.mimetype;  
    if (!fileType.startsWith('image/')) {  
        return res.cc('Uploaded file is not an image',400); 
    }  

    // Optionally, you can also check the file size on the server side  
    const fileSizeLimit = 2 * 1024 * 1024; // 2MB  
    if (req.file.size > fileSizeLimit) {  
        return res.cc('Uploaded file exceeds the limit of 2MB',400);
    }  

    return res.cc('上传成功',200)
};