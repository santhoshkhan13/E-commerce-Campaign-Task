const db = require('../config/database');

const Product = {  
  getProductStatistics: (filters) => {
    return new Promise((resolve, reject) => {
      let query = `SELECT 
                      SUM(ad_spend) AS total_ad_spend, 
                      SUM(views) AS total_views, 
                      SUM(clicks) AS total_clicks, 
                      SUM(direct_revenue + indirect_revenue) AS total_revenue,
                      SUM(direct_units + indirect_units) AS total_orders
                   FROM products WHERE 1=1`;

      // Add filters dynamically
      const params = [];
      if (filters.campaign_name) {
        query += ' AND campaign_name = ?';
        params.push(filters.campaign_name);
      }
      if (filters.ad_group_id) {
        query += ' AND ad_group_id = ?';
        params.push(filters.ad_group_id);
      }
      if (filters.fsn_id) {
        query += ' AND fsn_id = ?';
        params.push(filters.fsn_id);
      }
      if (filters.product_name) {
        query += ' AND product_name = ?';
        params.push(filters.product_name);
      }

      // Execute the query
      db.get(query, params, (err, row) => {
        if (err) {
          return reject(err);
        }
        if (row) {
          // Calculate additional metrics
          const ctr = (row.total_clicks / row.total_views) * 100 || 0;//incase it's not came use 0
          const roas = (row.total_revenue / row.total_ad_spend) || 0;

          // Return formatted statistics
          resolve({
            ad_spend: row.total_ad_spend,
            views: row.total_views,
            clicks: row.total_clicks,
            ctr: ctr.toFixed(2), 
            total_revenue: row.total_revenue,
            total_orders: row.total_orders,
            roas: roas.toFixed(2)  
          });
        } else {
          resolve(null);
        }
      });
    });
  }
};

module.exports = Product;
