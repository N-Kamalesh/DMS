import express from "express";
import {
  createEmergencyReport,
  getEmergencyReportById,
  getNearbyEmergencies,
} from "../controllers/emergencyController.js";

const router = express.Router();

router.get("/", getNearbyEmergencies);
router.get("/:id", getEmergencyReportById);
router.post("/", createEmergencyReport);

export default router;
