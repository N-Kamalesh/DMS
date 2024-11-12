import express from "express";
import {
  addNotification,
  deleteNotification,
  getAllNotifications,
} from "../controllers/notificationController.js";

const router = express.Router();

router.post("/", addNotification);
router.get("/", getAllNotifications);
router.delete("/:id", deleteNotification);

export default router;
