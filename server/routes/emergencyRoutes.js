import express from "express";
import {
  acknowledgeEmergency,
  addComment,
  createEmergencyReport,
  getEmergencyReportById,
  getNearbyEmergencies,
} from "../controllers/emergencyController.js";

const router = express.Router();

router.get("/", getNearbyEmergencies);
router.get("/:id", getEmergencyReportById);
router.post("/", createEmergencyReport);
router.post("/acknowledge", acknowledgeEmergency);
router.post("/comment", addComment);

export default router;
