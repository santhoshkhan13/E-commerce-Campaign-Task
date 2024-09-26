const express = require('express');
const multer = require('multer');
const { uploadCSV,reportByAdGroupID,reportByCampaign,reportByFSNID,reportByProductName } = require('../controllers/productController');
const router = express.Router();

const upload = multer({ dest: 'uploads/' }); 


router.post('/upload-csv', upload.single('file'), uploadCSV); 

router.post('/campaign', reportByCampaign);
router.post('/adGroupID',reportByAdGroupID);
router.post('/fsnID', reportByFSNID);
router.post('/productName', reportByProductName);

module.exports = router;
