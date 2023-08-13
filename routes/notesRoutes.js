const express = require("express");

const notesController = require("../controller/notesController");
const VerifyJwt = require("../middlewares/verifyJwt");

const router = express.Router();

router.use(VerifyJwt);
router
  .route("/")
  .get(notesController.getAllNotes)
  .post(notesController.createNewNote)
  .patch(notesController.updateNote)
  .delete(notesController.deleteNote);

module.exports = router;
