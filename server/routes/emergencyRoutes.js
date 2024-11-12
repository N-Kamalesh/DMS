import express from "express";
import {
  acknowledgeEmergency,
  addComment,
  createEmergencyReport,
  deleteEmergency,
  getAllEmergencies,
  getEmergencyReportById,
  getNearbyEmergencies,
  updateStatus,
} from "../controllers/emergencyController.js";

const router = express.Router();

router.get("/", getNearbyEmergencies);
router.get("/all", getAllEmergencies);
router.get("/:id", getEmergencyReportById);
router.post("/", createEmergencyReport);
router.post("/acknowledge", acknowledgeEmergency);
router.post("/comment", addComment);
router.patch("/status", updateStatus);
router.delete("/:id", deleteEmergency);

export default router;
