const jwt = require("jsonwebtoken")
const User = require("../models/User")
const unAuth = require("../error/unAuth")
const { StatusCodes } = require("http-status-codes")

const refresh = async (req, res) => {
  const cookie = req.cookies
  if(!cookie?.jwt) {
    throw new unAuth("No cookie")
  }
  const refreshToken = cookie.jwt
  const foundUser = await User.findOne({ refreshToken}).exec()
  if (!foundUser) {
    throw new unAuth("no user found")
  }
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if(err || foundUser.email !== decoded.email) {
        console.log(err)
      }
      const accessToken = jwt.sign(
        { "userId": foundUser._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
        )
        console.log(accessToken)
        res.status(StatusCodes.OK).json({ accessToken })
    }
    )
}

module.exports = refresh