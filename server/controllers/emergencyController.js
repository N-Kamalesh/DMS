import {
  compressImage,
  getDistanceFromLatLonInKm,
  sendSMS,
} from "../lib/utils.js";
import Emergency from "../models/Emergency.js";
import EmergencyReport from "../models/Emergency.js";
import User from "../models/User.js";

export async function createEmergencyReport(req, res) {
  try {
    const { description, userEmail, images, location } = req.body;

    if (!description || !userEmail || !location) {
      return res.status(400).json({
        error: "Description, user email, and location are required.",
      });
    }

    const compressedImages = await Promise.all(
      images.map(async (base64String) => {
        const compressedBuffer = await compressImage(base64String);
        return compressedBuffer.toString("base64");
      })
    );

    const newReport = new EmergencyReport({
      description,
      userEmail,
      photos: compressedImages,
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
    return res.status(500).json({ error: error.message });
  }
}

export async function getAllEmergencies(req, res) {
  try {
    const emergencies = await EmergencyReport.find().select(
      "descrpition userEmail status location acknowledgment"
    );
    return res.status(200).json(emergencies);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}

export async function getEmergencyReportById(req, res) {
  try {
    const { id } = req.params;
    const emergency = await EmergencyReport.findById(id);
    console.log(id);

    if (!emergency) {
      return res.status(404).json({ error: "Emergency report not found" });
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
    return res.status(500).json({ error: error.message });
  }
}

export async function getNearbyEmergencies(req, res) {
  try {
    console.log(req.query);
    const { lat, lon, radius } = req.query;
    if (!lat || !lon || !radius) {
      return res
        .status(400)
        .json({ error: "Latitude, longitude, and radius are required." });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    const searchRadiusKm = parseFloat(radius);

    const statuses = ["pending", "approved"];
    const emergencies = await EmergencyReport.find({
      status: { $in: statuses },
    }).exec();

    const filteredEmergencies = emergencies.filter((emergency) => {
      const { latitude: lat, longitude: long } = emergency.location;
      const distance = getDistanceFromLatLonInKm(
        latitude,
        longitude,
        lat,
        long
      );
      return distance <= searchRadiusKm;
    });

    res.status(200).json(filteredEmergencies);
  } catch (error) {
    console.error("Error fetching nearby emergencies:", error);
    res.status(500).json({ error: "Failed to fetch nearby emergencies." });
  }
}

export async function acknowledgeEmergency(req, res) {
  try {
    const { id, email, option } = req.body;
    if (!id || !email) {
      return res.status(400).json({
        error: "Id and Email are required.",
      });
    }

    const emergency = await EmergencyReport.findById(id);
    if (!emergency) {
      return res.status(404).json({ error: "Emergency report not found" });
    }

    if (
      emergency.acceptedUsers.includes(email) ||
      emergency.rejectedUsers.includes(email)
    ) {
      return res
        .status(400)
        .json({ error: "User has already acknowledged this emergency." });
    }

    if (option === "reject") {
      emergency.acknowledgment.rejects += 1;
      emergency.rejectedUsers.push(email);
    } else if (option === "accept") {
      emergency.acknowledgment.accepts += 1;
      emergency.acceptedUsers.push(email);
    } else {
      return res.status(400).json({ error: "Invalid acknowledgment option." });
    }

    await emergency.save();
    res.status(200).json({ message: "Acknowledgment recorded successfully." });
  } catch (error) {
    console.error("Error fetching nearby emergencies:", error);
    res.status(500).json({ error: error.message });
  }
}

export async function addComment(req, res) {
  try {
    const { id, email, comment } = req.body;
    if (!id || !email || !comment) {
      return res
        .status(400)
        .json({ error: "ID, email, and comment are required." });
    }

    const emergency = await EmergencyReport.findById(id);
    if (!emergency) {
      return res.status(404).json({ error: "Emergency report not found" });
    }

    const newComment = {
      email,
      message: comment,
      timestamp: new Date(),
    };

    emergency.comments.push(newComment);

    await emergency.save();
    return res.status(200).json({ message: "Comment added successfully." });
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({ error: error.message });
  }
}

export async function updateStatus(req, res) {
  try {
    const { id, status } = req.body;
    if (!id || !status) {
      return res.status(400).json({ error: "Id and status are required." });
    }

    const emergency = await EmergencyReport.findById(id);
    if (!emergency) {
      return res.status(404).json({ error: "Emergency report not found" });
    }

    if (!["pending", "approved", "rejected"].includes(status))
      return res.status(400).json({ error: "Invalid status option." });

    emergency.status = status;
    if (status === "approved") {
      const users = await User.find().select();
      const filteredUsers = users.filter((user) => {
        const { latitude: lat, longitude: long } = user.location;
        const distance = getDistanceFromLatLonInKm(
          emergency.location.latitude,
          emergency.location.longitude,
          lat,
          long
        );
        return distance <= 2;
      });

      for (const user of filteredUsers) {
        if (user.mobile) {
          await sendSMS(user.mobile, emergency.description);
        }
      }
    }
    await emergency.save();
    return res.status(200).json({ message: "Status updated successfully." });
  } catch (error) {
    console.error("Error updating status:", error);
    return res.status(500).json({ error: error.message });
  }
}

export async function deleteEmergency(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Emergency ID is required" });
    }
    const emergency = await Emergency.findByIdAndDelete(id);
    if (!emergency) {
      return res.status(404).json({ error: "Emergency not found" });
    }
    return res.status(200).json({ message: "Emergency deleted successfully" });
  } catch (error) {
    console.error("Error in deleting emergency", error);
    return res.status(500).json({ error: error.message });
  }
}
