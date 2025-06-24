const express = require("express");

const router = express.Router();

router.get('/:key', (req, res) => {
  console.log("We got through to the image route function")
  const key = decodeURIComponent(req.params.key);
  console.log("This is the key in image.js decoded: ", key)

  res.redirect(`https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`);
  
});

module.exports = router;