const regEx = require("../config/regEx")
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const badReq = require("../error/badReq")
const unAuth = require("../error/unAuth")


const createUser = async (req, res) => {
  const { email, password, username } = req.body
  if (!email || !password || !username) throw new badReq("You need to provide an email, username and password")
  const match = regEx.test(email)
  if (!match) {
    throw new badReq("Enter a valid email")
  }
  const foundUser = await User.findOne({ email })
  if (foundUser) {
    throw new badReq("Email already exist")
  }
  const hashPwd = await bcrypt.hash(password, 10)
  const newUser = await User.create({
    email: email,
    password: hashPwd,
    username: username 
  })
  console.log(newUser)
  res.status(201).json({ newUser })
}

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new badReq("Email and password is required")
  }
  const foundUser = await User.findOne({ email }).exec()
  if (!foundUser) {
    throw new badReq("Email not registered")
  }
  const match = await bcrypt.compare(password, foundUser.password)
  if(!match) {
    throw new unAuth("Incorrect password")
  }
  
  const accessToken = jwt.sign(
    { "userId": foundUser._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
    )
    
  const refreshToken = jwt.sign(
    { "email": foundUser.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "4d" }
    )
  foundUser.refreshToken = refreshToken
  const result = await foundUser.save()
  res.cookie("jwt", refreshToken, { httpOnly: true, maxAge: 4*24*60*60*1000, sameSite: "None", secure: true})
  res.status(200).json({ accessToken })
}

const logout = async (req, res) => {
  const cookies = req.cookies
  if(!cookies?.jwt) res.status(401).json({ msg: "no cookie" })
  const refreshToken = cookies.jwt
  console.log(refreshToken)
  const foundUser = await User.findOne({ refreshToken }).exec()
  console.log(foundUser)
  if(!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true })
    console.log("okay")
  } else {
    foundUser.refreshToken = " "
    
    const result = await foundUser.save()
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true })
    res.status(204).json({ foundUser })
    console.log("Cleared cookie")
  }
}

module.exports = { createUser, login, logout}