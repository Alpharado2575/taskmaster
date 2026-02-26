const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

const router = express.Router();

/* GET semua task user */
router.get("/", auth, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
});

router.get("/:id", auth, async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!task) {
    return res.status(404).json({ message: "Task tidak ditemukan" });
  }

  res.json(task);
});


/* CREATE task */
router.post("/", auth, async (req, res) => {
  const task = await Task.create({
    title: req.body.title,
    userId: req.user.id,
  });
  res.json(task);
});

/* UPDATE task */
router.put("/:id", auth, async (req, res) => {
  await Task.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Task berhasil diupdate" });
});

/* DELETE task */
router.delete("/:id", auth, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task berhasil dihapus" });
});

module.exports = router;
