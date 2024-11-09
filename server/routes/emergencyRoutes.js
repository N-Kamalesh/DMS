import express from "express";
import {
  createEmergencyReport,
  getEmergencyReportById,
} from "../controllers/emergencyController.js";

const router = express.Router();

router.get("/:id", getEmergencyReportById);
router.post("/", createEmergencyReport);

export default router;
