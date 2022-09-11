const unAuth = require("../error/unAuth")
const jwt = require("jsonwebtoken")

const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorisation || req.headers.authorization
  if(!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new unAuth("invalid token")
  }
  const token = authHeader.split(" ")[1]
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        res.status(401).json({ msg: "expired token" })
      }
      req.user = decoded.userId
      console.log(req.user)
      next()
    }
    )
}

module.exports = verifyJwt