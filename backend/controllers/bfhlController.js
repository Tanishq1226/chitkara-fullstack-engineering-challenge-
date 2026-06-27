const config = require('../config');
const { processGraph } = require('../utils/graphHelper');

/**
 * Handle POST /bfhl request
 */
const postBfhl = (req, res) => {
  try {
    const data = req.body && req.body.data;
    
    // Process input data (defaulting to empty array if missing/invalid)
    const graphResults = processGraph(Array.isArray(data) ? data : []);

    const response = {
      user_id: config.USER_ID,
      email_id: config.EMAIL_ID,
      college_roll_number: config.COLLEGE_ROLL_NUMBER,
      hierarchies: graphResults.hierarchies,
      invalid_entries: graphResults.invalid_entries,
      duplicate_edges: graphResults.duplicate_edges,
      summary: graphResults.summary
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error in POST /bfhl:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
};

/**
 * Handle GET /bfhl request
 */
const getBfhl = (req, res) => {
  return res.status(200).json({
    operation_code: 1
  });
};

module.exports = {
  postBfhl,
  getBfhl
};
