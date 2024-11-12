import sharp from "sharp";
import twilio from "twilio";

export async function compressImage(base64String) {
  const buffer = Buffer.from(base64String.split(",")[1], "base64");
  const compressedBuffer = await sharp(buffer)
    .resize(800)
    .jpeg({ quality: 80 })
    .toBuffer();
  return compressedBuffer;
}

const EARTH_RADIUS_KM = 6371;

export const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const toRadians = (deg) => (deg * Math.PI) / 180;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const radLat1 = toRadians(lat1);
  const radLat2 = toRadians(lat2);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(radLat1) * Math.cos(radLat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
};

export async function sendSMS(number, description) {
  const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
  try {
    const message = await client.messages.create({
      body: "EMERGENCY IN YOUR AREA \n\n" + description,
      from: process.env.TWILIO_NUMBER,
      to: "+91" + number,
    });
    console.log(`Message sent! SID: ${message.sid}`);
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
}
