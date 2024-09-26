const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const db = require('../config/database');  
const Product = require('../models/productModel');

// Upload CSV Controller
exports.uploadCSV = (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = path.join(__dirname, '..', req.file.path);
  const products = [];

  // Stream the uploaded file and parse the CSV
  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      if (row['Campaign Name'] && row['Ad Group ID'] && row['FSN ID'] && row['Product Name']) {
        try {
          const product = {
            campaign_name: row['Campaign Name'],
            ad_group_id: row['Ad Group ID'],
            fsn_id: row['FSN ID'],
            product_name: row['Product Name'],
            ad_spend: parseFloat(row['Ad Spend']) || 0,
            views: parseInt(row['Views'], 10) || 0,
            clicks: parseInt(row['Clicks'], 10) || 0,
            direct_revenue: parseFloat(row['Direct Revenue']) || 0,
            indirect_revenue: parseFloat(row['Indirect Revenue']) || 0,
            direct_units: parseInt(row['Direct Units'], 10) || 0,
            indirect_units: parseInt(row['Indirect Units'], 10) || 0
          };

          products.push(product);
        } catch (error) {
          console.error('Error parsing CSV row:', error.message);
        }
      }
    })
    .on('end', async () => {
      try {
        // Insert the products into the database
        db.serialize(() => {
          const stmt = db.prepare(`
            INSERT INTO products (
              campaign_name, ad_group_id, fsn_id, product_name,
              ad_spend, views, clicks, direct_revenue, indirect_revenue,
              direct_units, indirect_units
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);

          products.forEach((product) => {
            stmt.run(
              product.campaign_name,
              product.ad_group_id,
              product.fsn_id,
              product.product_name,
              product.ad_spend,
              product.views,
              product.clicks,
              product.direct_revenue,
              product.indirect_revenue,
              product.direct_units,
              product.indirect_units
            );
          });
          stmt.finalize();
        });

        console.log('Data inserted into the database:', products);

        // Delete the uploaded file after processing
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting file:', err.message);
          }
        });

        res.status(200).send('CSV uploaded and data inserted into the database.');
      } catch (error) {
        console.error('Database insertion error:', error.message);
        res.status(500).send('Error inserting data into the database.');
      }
    })
    .on('error', (err) => {
      res.status(500).send('Error processing CSV file.');
    });
};


// Helper function to build the response
const buildResponse = async (filterKey, filterValue, additionalFilters, res) => {
  try {
    const filters = { [filterKey]: filterValue, ...additionalFilters };
    const statistics = await Product.getProductStatistics(filters);
    
    if (statistics) {
      res.status(200).json({
        [filterKey]: filterValue,
        statistics
      });
    } else {
      res.status(404).json({ message: 'No data found for the specified filters.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving product statistics' });
  }
};


// API 1: Retrieve product statistics filtered by Campaign Name
exports.reportByCampaign = (req, res) => {
  const { campaign_name, ad_group_id, fsn_id, product_name } = req.body;
  buildResponse('campaign_name', campaign_name, { ad_group_id, fsn_id, product_name }, res);
};


// API 2: Retrieve product statistics filtered by Ad Group ID
exports.reportByAdGroupID = (req, res) => {
  const { ad_group_id, campaign_name, fsn_id, product_name } = req.body;
  buildResponse('ad_group_id', ad_group_id, { campaign_name, fsn_id, product_name }, res);
};

// API 3: Retrieve product statistics filtered by FSN ID
exports.reportByFSNID = (req, res) => {
  const { fsn_id, campaign_name, ad_group_id, product_name } = req.body;
  buildResponse('fsn_id', fsn_id, { campaign_name, ad_group_id, product_name }, res);
};


// API 4: Retrieve product statistics filtered by Product Name
exports.reportByProductName = (req, res) => {
  const { product_name, campaign_name, ad_group_id, fsn_id } = req.body;
  buildResponse('product_name', product_name, { campaign_name, ad_group_id, fsn_id }, res);
};
