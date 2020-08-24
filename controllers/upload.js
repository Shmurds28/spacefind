const upload = require("../middleware/upload");


//upload single file
const uploadFile = async (req, res, next) => {
  try {
    await upload.uploadFilesMiddleware(req, res);

    // console.log(req.file);
    if (req.file == undefined) {
      return res.send(`You must select a file.`);
    }

    return next();
  } catch (error) {
    console.log(error);
    return res.send(`Error when trying upload image: ${error}`);
  }
};

//upload multiple files
const uploadFiles = async (req, res, next) => {
  try {
    await upload.uploadMultiFilesMiddleware(req, res);
    
    console.log(req.files);
    if (req.files == undefined)
      return res.send("You must select a file");

    // if (req.files.length <= 0) {
    //   return res.send(`You must select at least 1 file.`);
    // }

    return next();
  } catch (error) {
    console.log(error);

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.send("Too many files to upload.");
    }
    return res.send(`Error when trying upload many files: ${error}`);
  }
};


module.exports = {
  uploadFile: uploadFile,
  uploadFiles: uploadFiles
};