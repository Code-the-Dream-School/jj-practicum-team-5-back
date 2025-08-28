const userProgressData = require('../models/progress');  
const { StatusCodes } = require('http-status-codes');

const postProgressData = async (req, res) => {
  const { progressStatus } = req.body;

  if (!progressStatus) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Missing required field: progressStatus.' });
  }

  try {
    const task = await userProgressData.create({ progressStatus }); 

    res.status(StatusCodes.CREATED).json({ message: 'Progress saved successfully', task });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Something went wrong while saving progress.' });
  }
};

module.exports = postProgressData;
