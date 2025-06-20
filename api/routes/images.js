import express from 'express';
import AWS from 'aws-sdk';

const router = express.Router();
const s3 = new AWS.S3();

router.get('/:key', (req, res) => {
  const key = decodeURIComponent(req.params.key);

  res.redirect(`https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`);
  

});

export default router;