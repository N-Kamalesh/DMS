import Notification from "../models/Notification.js";

export async function getAllNotifications(req, res) {
  try {
    const notifications = await Notification.find().select();
    res.status(200).json(notifications);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

export async function deleteNotification(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Notification ID is required" });
    }
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    return res
      .status(200)
      .json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

export async function addNotification(req, res) {
  try {
    const { title, desc } = req.body;
    if (!title || !desc) {
      return res.status(400).json({ error: "Tiltle and desc are necessary" });
    }
    const newNotification = await Notification({
      title,
      desc,
    });

    await newNotification.save();
    return res.status(201).json({
      message: "Notification created successfully!",
      reportId: newNotification._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
