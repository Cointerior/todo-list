const express = require("express")
const router = express.Router()
const { 
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
 } = require("../controllers/task")


router.route("/")
   .get(getAllTasks)
   .post(createTask)

router.route("/:id")
    .patch(updateTask)
    .get(getTask)
    .delete(deleteTask)

module.exports = router
