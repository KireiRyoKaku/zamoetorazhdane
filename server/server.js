import express from "express";
import ical from "node-ical";
import dotenv from "dotenv";
import cors from "cors";
import { google } from "googleapis";
import nodemailer from "nodemailer";
import {
  getConfirmationEmailHTML,
  getConfirmationEmailText,
} from "./emailTemplates/confirmationEmail.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Google Sheets client only if credentials are available
let client = null;
let sheetsAvailable = false;

try {
  if (process.env.PRIVATE_KEY_BASE64 && process.env.CLIENT_EMAIL) {
    const privateKey = Buffer.from(
      process.env.PRIVATE_KEY_BASE64,
      "base64",
    ).toString("utf-8");

    client = new google.auth.JWT(process.env.CLIENT_EMAIL, null, privateKey, [
      "https://www.googleapis.com/auth/spreadsheets",
    ]);

    sheetsAvailable = true;
    console.log("✅ Google Sheets API initialized");
  } else {
    console.warn(
      "⚠️ Google Sheets credentials not found - form submissions will be disabled",
    );
  }
} catch (error) {
  console.error("❌ Failed to initialize Google Sheets:", error.message);
}

const app = express();
const port = process.env.PORT || 5174;
const host = process.env.HOST || "0.0.0.0";

// CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // Development - allow localhost and local network
    if (process.env.NODE_ENV !== "production") {
      if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
        return callback(null, true);
      }

      // Allow any local network IP (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
      const localNetworkRegex =
        /^https?:\/\/(192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})(:\d+)?/;

      if (localNetworkRegex.test(origin)) {
        return callback(null, true);
      }
    }

    // Production - only allow specified domains
    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
      : [];

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn("❌ CORS blocked origin:", origin);
    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message,
  });
});

// Health check endpoint
app.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    environment: process.env.NODE_ENV || "development",
    sheetsAvailable: sheetsAvailable,
  });
});

/**
 * Handles GET requests to the "/events" endpoint, fetching and parsing calendar events from an ICS URL.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to send back the desired HTTP response.
 * @returns {void} Sends a JSON response containing an array of parsed calendar events or an error message.
 */
app.get("/events", async (req, res) => {
  const icsUrl = process.env.CALENDAR_ICS_URL; // Replace with your actual ICS URL
  const events = [];

  if (!icsUrl) {
    return res.status(500).json({ error: "Calendar URL not configured" });
  }

  ical.async.fromURL(icsUrl, {}, function (err, data) {
    if (err) {
      console.error("Error fetching or parsing ICS file:", err);
      return res
        .status(500)
        .json({ error: "Error fetching or parsing calendar data" });
    }

    for (let k in data) {
      if (Object.prototype.hasOwnProperty.call(data, k)) {
        const ev = data[k];
        if (ev.type == "VEVENT") {
          let summary = ev.summary;
          let type = "Regular";
          if (summary.startsWith("S:")) {
            summary = summary.substring(2).trim(); // Remove "S:" and trim any leading whitespace
            type = "Special";
          }
          if (summary.toLowerCase().startsWith("майчински кръг")) {
            type = "2";
          }
          if (summary.toLowerCase().startsWith("време за мама")) {
            type = "1";
          }

          // Create custom ID (cID)
          const originalId = ev.uid.split("@")[0];
          const midPoint = Math.floor(originalId.length / 2);
          const firstHalf = originalId.substring(0, midPoint);
          const secondHalf = originalId.substring(midPoint);
          const cID = secondHalf + firstHalf;

          events.push({
            summary: summary,
            dateOfEvent: (() => {
              const date = ev.start
                .toLocaleDateString("bg-bg", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  weekday: "long",
                })
                .replace(" г.", "");
              const [weekday, fullDate] = date.split(", ");
              return `${fullDate}, ${weekday}`;
            })(),
            dayOfEvent: ev.start.getDate(),
            description:
              ev.description?.trim() ||
              "Описанието за тази среща, все още се пише. Проверете по-късно пак!",
            ID: ev.uid,
            location:
              ev.location?.trim() ||
              "Локацията за тази среща все още избира 🌏 . Проверете по-късно пак!",
            timeStart: ev.start.toLocaleTimeString([], { timeStyle: "short" }),
            dateOfEventLocaleString: ev.start.toDateString(),
            timeEnd: ev.end.toLocaleTimeString([], { timeStyle: "short" }),
            type: type,
            cID: cID,
          });
        }
      }
    }
    // Sort events by date
    events.sort((a, b) => new Date(a.timeStart) - new Date(b.timeStart));

    // Set the content type to "application/json"
    res.setHeader("Content-Type", "application/json");
    res.json(events);
  });
});

// Email transporter setup
let transporter = null;
let emailAvailable = false;

try {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    emailAvailable = true;
    console.log("✅ Email service initialized");
  } else {
    console.warn(
      "⚠️ Email credentials not found - email notifications will be disabled",
    );
  }
} catch (error) {
  console.error("❌ Failed to initialize email service:", error.message);
}

// Form submission endpoint
app.post("/submit-form", async (req, res) => {
  try {
    console.log("📝 Form submission received:", req.body);

    const formData = req.body;
    const { email, participation, name, event, eventDate } = formData;

    // Validate required fields
    if (!email || !name || !event || !eventDate) {
      return res.status(400).json({
        success: false,
        error: "missing_fields",
        message: "Required fields are missing",
      });
    }

    // Check if Google Sheets is available for duplicate checking and saving
    if (sheetsAvailable && client) {
      try {
        await client.authorize();
        const gsapi = google.sheets({ version: "v4", auth: client });

        // Check for duplicates
        const checkResult = await gsapi.spreadsheets.values.get({
          spreadsheetId: process.env.SHEETS_ID,
          range: "Sheet1!A:F",
        });

        const rows = checkResult.data.values || [];
        let foundDuplicate = false;

        for (let i = 1; i < rows.length; i++) {
          // Skip header row
          const row = rows[i];
          if (row.length < 4) continue;

          const rowEmail = row[3] ? row[3].trim().toLowerCase() : "";
          const rowEvent = row[1] ? row[1].trim() : "";
          const rowEventDate = row[2] ? row[2].trim() : "";
          const normalizedEmail = email.trim().toLowerCase();

          if (
            rowEmail === normalizedEmail &&
            rowEvent === event &&
            rowEventDate === eventDate
          ) {
            foundDuplicate = true;
            break;
          }
        }

        if (foundDuplicate) {
          return res.status(400).json({
            success: false,
            error: "duplicate_registration",
            message: `Вече съществува регистрация за събитието "${event}" на ${eventDate} с имейл адреса ${email}.`,
          });
        }

        // Save to Google Sheets
        const opt = {
          spreadsheetId: process.env.SHEETS_ID,
          range: "Sheet1!A:Z",
          valueInputOption: "USER_ENTERED",
          resource: {
            values: [
              [
                formData.name || "",
                formData.event || "",
                formData.eventDate || "",
                formData.email || "",
                formData.phone || "",
                formData.participation || "",
                formData.topics || "",
                formData.role === "Друго"
                  ? formData.customRole || "Друго"
                  : formData.role || "",
                formData.source || "",
                new Date().toISOString(),
                formData.eventTime || "",
              ],
            ],
          },
        };

        await gsapi.spreadsheets.values.append(opt);
        console.log("✅ Data saved to Google Sheets");
      } catch (sheetError) {
        console.error("❌ Google Sheets error:", sheetError.message);
        // Continue with email sending even if sheets fail
      }
    } else {
      console.warn("⚠️ Google Sheets not available - skipping save to sheets");
    }

    // Send confirmation emails if email service is available
    if (emailAvailable && transporter) {
      try {
        const emailData = {
          name: formData.name,
          event: formData.event,
          eventDate: formData.eventDate,
          eventTime: formData.eventTime,
          eventLocation: formData.eventLocation,
          participation: formData.participation,
          phone: formData.phone,
          role: formData.role,
          customRole: formData.customRole,
          topics: formData.topics,
          source: formData.source,
        };

        // Send confirmation email to user
        const userMailOptions = {
          from: process.env.SENDER_EMAIL,
          to: email,
          replyTo: process.env.REPLY_TO,
          subject: `Успешна регистрация: "${event}" на ${eventDate}, ${formData.eventTime}`,
          text: getConfirmationEmailText(emailData),
          html: getConfirmationEmailHTML(emailData),
          attachments: [
            {
              filename: "logo.png",
              path: path.join(__dirname, "logo-white-outline.png"),
              cid: "unique-logo-id",
            },
          ],
        };

        // Send notification email to admin
        const adminMailOptions = {
          from: process.env.SENDER_EMAIL,
          to: process.env.ADMIN_EMAIL,
          subject: "Нова регистрация за събитие",
          text: `Нова регистрация за събитие!\n\nИме: ${name}\nИмейл: ${email}\nТелефон: ${formData.phone}\nСъбитие: ${event}\nДата: ${eventDate}\nУчастие: ${participation}\nТеми: ${formData.topics}\nРоля: ${formData.role}\nИзточник: ${formData.source}`,
        };

        await transporter.sendMail(userMailOptions);
        await transporter.sendMail(adminMailOptions);
        console.log("✅ Confirmation emails sent");
      } catch (emailError) {
        console.error("❌ Email error:", emailError.message);
        // Don't fail the whole request if email fails
      }
    } else {
      console.warn(
        "⚠️ Email service not available - skipping email notifications",
      );
    }

    res.json({
      success: true,
      message: "Form submitted successfully",
      services: {
        sheets: sheetsAvailable,
        email: emailAvailable,
      },
    });
  } catch (error) {
    console.error("❌ Error processing form submission:", error);
    res.status(500).json({
      success: false,
      error: "server_error",
      message: "Internal server error",
    });
  }
});

// Start the server
app.listen(port, host, () => {
  console.log(`🚀 Server running on ${host}:${port}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 Local: http://localhost:${port}`);

  if (process.env.NODE_ENV !== "production") {
    console.log(`🌐 Network: http://${host}:${port}`);
  }

  console.log(`� Services available:`);
  console.log(`  - Google Sheets: ${sheetsAvailable ? "✅" : "❌"}`);
  console.log(`  - Email: ${emailAvailable ? "✅" : "❌"}`);
});
