const userAuth = require('../models/user');
const { StatusCodes } = require('http-status-codes');

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Missing required fields.' });
  }

  try {
    const user = await userAuth.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: 'Incorrect email.' });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: 'Incorrect password.' });
    }

    const token = user.createJWT();
    res
      .cookie('jid', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60, 
      })
      .status(StatusCodes.OK)
      .json({ success: true });

    console.log('Logging in user:', user.email);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Something went wrong during login.' });
  }
};

module.exports = loginUser;
