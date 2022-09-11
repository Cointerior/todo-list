const Task = require("../models/Task")
const badReq = require("../error/badReq")
const unAuth = require("../error/unAuth")
const regExId = require("../config/regExId")

const createTask = async (req, res) => {
  const createdBy = req.user
  if(!createdBy) {
    throw new unAuth("You need to log in")
  }
  const { task, status } = req.body
  console.log(req)
  if (!task) {
    throw new badReq("Provide a task")
  }
  const result = await Task.create({
    task,
    status,
    createdBy
  })
  res.status(201).json({ result })
}
  
const getAllTasks = async (req, res) => {
  const createdBy = req.user
  if(!createdBy) {
    throw new badReq("You need to log in")
  }
  const result = await Task.find({ createdBy: createdBy }).sort("createdAt")
  res.status(200).json({ result })
}

const updateTask = async (req, res) => {
  const { id } = req.params
  const { task, status } = req.body
  const createdBy = req.user
  if(!createdBy) {
    throw new unAuth("You need to log in")
  }
  if(!id) {
    throw new badReq("You need to provide an id")
  }
  const valid = regExId.test(id)
  if(!valid) {
    throw new badReq("Enter a valid id")
  }
  console.log("Hi")
  const foundUser = await Task.findOne({ _id: id, createdBy: createdBy }).exec()
  if(!foundUser) {
    throw new unAuth(`You have no task with id: ${id}`)
  }
  console.log("Hello")
  const result = await Task.findByIdAndUpdate({ _id: id, createdBy}, req.body, { new: true })
 /* if(status) return foundUser.status = status
  console.log("H")
  if(task) return foundUser.task = task
  console.log("d")
  const result = await foundUser.save() */
  res.status(200).json({ result })
}

const deleteTask = async (req, res) => {
  const createdBy = req.user
  if(!createdBy) {
    throw new unAuth("You need to log in")
  }
  const { id } = req.params
  if(!id) {
    throw new badReq("You need to provide and id")
  }
  const valid = regExId.test(id)
  if(!valid) {
    throw new badReq("Enter a valid id")
  }
  const foundUser = await Task.findOneAndDelete({ _id: id, createdBy })
  if(!foundUser) {
    throw new unAuth(`You have no task with id: ${id}`)
  }
  console.log("Hiii")
  res.status(204).json({ msg: "Task deleted" })
}

const getTask = async (req, res) => {
  const createdBy = req.user
  if(!createdBy) {
    throw new unAuth("You need to log in")
  }
  const { id } = req.params
  if(!id) {
    throw new badReq("You need to provide and id")
  }
  const valid = regExId.test(id)
  if(!valid) {
    throw new badReq("Enter a valid id")
  }
  const result = await Task.findOne({ _id: id, createdBy}).exec()
  if(!result) {
    throw new unAuth(`You have no task with id: ${id}`)
  }
  res.status(200).json({ result })
}

module.exports = { 
  createTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask
 }