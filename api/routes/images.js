const express = require("express");

const router = express.Router();

router.get('/:key', (req, res) => {
  const key = decodeURIComponent(req.params.key);

  res.redirect(`https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`);
  
});

module.exports = router;