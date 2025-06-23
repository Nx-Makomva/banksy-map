const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const { fromEnv } = require('@aws-sdk/credential-provider-env');
const multerS3 = require('multer-s3');

// Set-up AWS access - keys referenced in .env
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: fromEnv() 
});


// multer for file uploads
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'public-read', // public files to be displayed on the frontend 
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = uniqueSuffix + '-' + file.originalname;
      cb(null, filename);
    }
  }),
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB file size limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) { //makes sure the type of the file is image
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

module.exports = upload;