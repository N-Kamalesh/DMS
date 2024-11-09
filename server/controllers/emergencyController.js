import { compressImage } from "../lib/utils.js";
import EmergencyReport from "../models/Emergency.js";

export async function createEmergencyReport(req, res) {
  try {
    const { description, userEmail, images, location } = req.body;

    if (!description || !userEmail || !location) {
      return res.status(400).json({
        message: "Description, user email, and location are required.",
      });
    }

    // Compress and store images
    const compressedImages = await Promise.all(
      images.map(async (base64String) => {
        const compressedBuffer = await compressImage(base64String);
        return compressedBuffer.toString("base64"); // Store as base64 string
      })
    );

    // Create a new emergency report
    const newReport = new EmergencyReport({
      description,
      userEmail,
      photos: compressedImages, // Store the compressed base64 strings
      location,
      acknowledgment: { accepts: 0, rejects: 0 },
      comments: [],
    });

    await newReport.save();

    return res.status(201).json({
      message: "Emergency report created successfully!",
      reportId: newReport._id,
    });
  } catch (error) {
    console.error("Error creating emergency report:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getEmergencyReportById(req, res) {
  try {
    const { id } = req.params;
    const emergency = await EmergencyReport.findById(id);

    if (!emergency) {
      return res.status(404).json({ message: "Emergency report not found" });
    }

    const formattedPhotos = emergency.photos.map(
      (photo) => `data:image/jpeg;base64,${photo}`
    );

    const emergencyData = {
      ...emergency.toObject(),
      photos: formattedPhotos,
    };

    return res.status(200).json(emergencyData);
  } catch (error) {
    console.error("Error fetching emergency report:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
