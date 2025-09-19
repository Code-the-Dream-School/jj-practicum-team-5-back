const userAuth = require("../models/user");
const { StatusCodes } = require("http-status-codes");

const registerUser = async (req, res) => {
  const { first, last, email, password } = req.body;

  if (!first || !last || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Missing required fields." });
  }

  try {
    const existingUser = await userAuth.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await userAuth.create({ first, last, email, password });

    const token = user.createJWT();

    return res.status(StatusCodes.CREATED).json({
      success: true,
      token,
      user: {
        id: user._id,
        first: user.first,
        last: user.last,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);

    if (error.code === 11000 || error.keyPattern?.email) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: "Email address is already in use." });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ errors: messages });
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong creating the user." });
  }
};

module.exports = registerUser;
