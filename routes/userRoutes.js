//external imports

const express = require("express");

const VerifyJwt = require("../middlewares/verifyJwt");
const userController = require("../controller/userController");

//creating router
const router = express.Router();

router.use(VerifyJwt);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
