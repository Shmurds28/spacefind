const util = require("util");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

// var storage = new GridFsStorage({
//   url: "mongodb://localhost/space_find",
//   options: { useNewUrlParser: true, useUnifiedTopology: true },
//   destination: (req, file, cb) => { 
// 		cb(null, 'uploads') 
// 	},
//   file: (req, file) => {
//     const match = ["image/png", "image/jpeg"];

//     if (match.indexOf(file.mimetype) === -1) {
//       const filename = `${Date.now()}-bezkoder-${file.originalname}`;
//       return filename;
//     }
//     return {
//         bucketName: "photos",
//         filename: `${Date.now()}-bezkoder-${file.originalname}`
//       };
//     }
//   });

var storage = multer.diskStorage({ 
	destination: (req, file, cb) => { 
		cb(null, 'routes/uploads') ;
	}, 
	filename: (req, file, cb) => { 
		cb(null, file.fieldname + '-' + Date.now()) ;
	} 
}); 

  var uploadFile = multer({ storage: storage }).single("file");
var uploadFilesMiddleware = util.promisify(uploadFile);


module.exports = uploadFilesMiddleware;