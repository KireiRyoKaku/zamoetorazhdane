import express from "express";
import ical from "node-ical";
import dotenv from "dotenv";
import cors from "cors";
import { google } from "googleapis";
import nodemailer from "nodemailer";
import {
  getConfirmationEmailHTML,
  getAdminNotificationHTML,
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

const getImageAttachmentUrl = (attachment) => {
  const attachments = Array.isArray(attachment) ? attachment : [attachment];

  for (const item of attachments) {
    const value = typeof item === "string" ? item : item?.val;
    const params = typeof item === "object" && item ? item.params : null;
    const mimeType = Object.entries(params || {}).find(
      ([key]) => key.toLowerCase() === "fmttype",
    )?.[1];
    const filename = Object.entries(params || {}).find(
      ([key]) => key.toLowerCase() === "filename",
    )?.[1];

    if (typeof value !== "string") {
      continue;
    }

    try {
      const url = new URL(value);
      const hasImageExtension =
        /\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(url.pathname) ||
        (typeof filename === "string" &&
          /\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(filename));
      const isGoogleDrive = /(^|\.)drive\.google\.com$/i.test(url.hostname);
      const driveFileId =
        url.searchParams.get("id") ||
        url.pathname.match(/\/file\/d\/([^/]+)/)?.[1];

      if (
        url.protocol === "https:" &&
        !url.username &&
        !url.password &&
        (/^image\//i.test(mimeType || "") || hasImageExtension)
      ) {
        if (isGoogleDrive && driveFileId) {
          return `https://drive.google.com/thumbnail?id=${encodeURIComponent(driveFileId)}&sz=w480`;
        }

        return url.toString();
      }
    } catch {
      // Ignore malformed attachment URLs.
    }
  }

  return "";
};

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
      const status = err.response?.status;
      console.error(
        status === 404
          ? "Google Calendar returned HTTP 404 for the configured ICS feed."
          : `Error fetching or parsing ICS file${status ? ` (HTTP ${status})` : ""}:`,
        err.message,
      );
      if (status === 404) {
        return res.status(502).json({
          error: "Calendar feed not found",
          message:
            "Google Calendar returned HTTP 404. Verify that CALENDAR_ICS_URL is the current iCal feed URL and that the calendar is accessible.",
        });
      }
      return res
        .status(502)
        .json({ error: "Error fetching or parsing calendar data" });
    }

    for (let k in data) {
      if (Object.prototype.hasOwnProperty.call(data, k)) {
        const ev = data[k];
        if (ev.type == "VEVENT") {
          const location = ev.location?.trim();
          if (
            !location ||
            /локацията за тази среща все още избира|проверете по-късно пак/i.test(
              location,
            )
          ) {
            continue;
          }

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
            location: location,
            timeStart: ev.start.toLocaleTimeString("bg-BG", {
              timeStyle: "short",
              timeZone: "Europe/Sofia",
            }),
            dateOfEventLocaleString: ev.start.toDateString(),
            timeEnd: ev.end.toLocaleTimeString("bg-BG", {
              timeStyle: "short",
              timeZone: "Europe/Sofia",
            }),
            type: type,
            cID: cID,
            attachmentUrl: getImageAttachmentUrl(ev.attach),
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

const SPOTIFY_PODCAST_URL =
  "https://open.spotify.com/show/1RFiM8DDswRJohQiczd4R7";
const PODCAST_CACHE_TTL_MS = 10 * 60 * 1000;
let podcastEpisodesCache = null;
let podcastEpisodesCacheExpiresAt = 0;
let podcastEpisodesRequest = null;

const decodeHtmlEntities = (value) =>
  value
    .replace(/&#(\d+);/g, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 10)),
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

const extractHtmlText = (html) =>
  decodeHtmlEntities(
    html
      .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );

const getHtmlAttribute = (html, tagName, attributeName) => {
  const tag = html.match(new RegExp(`<${tagName}\\b[^>]*>`, "i"))?.[0];
  if (!tag) return "";
  const escapedName = attributeName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const value = tag.match(
    new RegExp(`\\b${escapedName}=["']([^"']*)["']`, "i"),
  )?.[1];
  return value ? decodeHtmlEntities(value) : "";
};

const parseSpotifyEpisodes = (html) => {
  const episodeMarkers = [
    ...html.matchAll(/data-testid=["']episode-\d+["']/g),
  ].slice(0, 3);

  const episodes = episodeMarkers.flatMap((marker, index) => {
    const start = marker.index;
    const end = episodeMarkers[index + 1]?.index ?? html.length;
    const card = html.slice(start, end);
    const episodeId = card.match(
      /<a\b[^>]*href=["']\/episode\/([A-Za-z0-9]+)["']/i,
    )?.[1];
    const title = getHtmlAttribute(card, "img", "alt");
    const imageUrl = getHtmlAttribute(card, "img", "src");
    const paragraphs = [
      ...card.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi),
    ].map((match) => extractHtmlText(match[1]));
    const durationIndex = paragraphs.findIndex((text) =>
      /^(?:(?:\d+)\s*hr\s*)?\d+\s*min$/i.test(text),
    );
    const duration =
      durationIndex >= 0 ? paragraphs[durationIndex] : "";
    const description =
      paragraphs.find(
        (text, paragraphIndex) =>
          paragraphIndex !== durationIndex && text.length > 0,
      ) || "";
    const publishedAt =
      paragraphs.find(
        (text, paragraphIndex) =>
          paragraphIndex !== durationIndex && text !== description,
      ) || "";

    if (!episodeId || !title) return [];

    return [
      {
        id: episodeId,
        title,
        description,
        publishedAt,
        duration,
        imageUrl: imageUrl.startsWith("https://i.scdn.co/image/")
          ? imageUrl
          : "",
        url: `https://open.spotify.com/episode/${episodeId}`,
      },
    ];
  });

  if (episodes.length === 0) {
    throw new Error("Spotify episode data was not found on the show page");
  }

  return episodes;
};

const fetchSpotifyEpisodes = async () => {
  const response = await fetch(SPOTIFY_PODCAST_URL, {
    headers: {
      Accept: "text/html",
      "User-Agent": "Mozilla/5.0 (compatible; ZamoetorazhdanePodcastFeed/1.0)",
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`Spotify returned HTTP ${response.status}`);
  }

  const html = await response.text();
  if (html.length > 5_000_000) {
    throw new Error("Spotify show page exceeded the expected size");
  }

  return parseSpotifyEpisodes(html);
};

app.get("/podcast-episodes", async (req, res) => {
  if (podcastEpisodesCache && Date.now() < podcastEpisodesCacheExpiresAt) {
    return res.json({ episodes: podcastEpisodesCache });
  }

  try {
    if (!podcastEpisodesRequest) {
      podcastEpisodesRequest = fetchSpotifyEpisodes()
        .then((episodes) => {
          podcastEpisodesCache = episodes;
          podcastEpisodesCacheExpiresAt = Date.now() + PODCAST_CACHE_TTL_MS;
          return episodes;
        })
        .finally(() => {
          podcastEpisodesRequest = null;
        });
    }

    const episodes = await podcastEpisodesRequest;
    return res.json({ episodes });
  } catch (error) {
    console.error("Failed to fetch Spotify podcast episodes:", error.message);
    return res.status(502).json({
      error: "Podcast episodes are temporarily unavailable",
    });
  }
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

// Member check endpoint
// Route to check if user is a member
app.post("/check-member", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const isMember = await checkMemberInSheets(email);
    res.json({ isMember });
  } catch (error) {
    console.error("Error checking member status:", error);
    res.status(500).json({ error: "Failed to check member status" });
  }
});

// Form submission endpoint
app.post("/submit-form", async (req, res) => {
  try {
    console.log("📝 Form submission received:", req.body);

    const formData = req.body;
    const { email, name, event, eventDate } = formData;

    // Validate required fields
    if (!email || !name || !event || !eventDate) {
      return res.status(400).json({
        success: false,
        error: "missing_fields",
        message: "Required fields are missing",
      });
    }

    // Check if user is a member first - this is needed for both sheets and email
    const isMember = await checkMemberInSheets(email);
    console.log(`Member check for ${email}: ${isMember}`);

    // Calculate pricing (needed for both sheets and email)
    const participantCount = formData.participantCount || 1;

    // Parse event date to calculate hours until event - handle Bulgarian format
    let eventDateTime;
    try {
      // Handle Bulgarian date format like "12.05.2025, понеделник"
      const dateOnly = formData.eventDate.split(",")[0].trim(); // Extract "12.05.2025"
      const [day, month, year] = dateOnly.split(".");
      const [hours, minutes] = (formData.eventTime || "18:00").split(":");
      eventDateTime = new Date(year, month - 1, day, hours, minutes);
    } catch (error) {
      console.error("Date parsing error:", error);
      eventDateTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Default to 7 days from now
    }

    const now = new Date();
    const hoursUntilEvent = (eventDateTime - now) / (1000 * 60 * 60);

    let basePrice = hoursUntilEvent < 72 ? 40 : 35; // Late: 40 lv, On-time: 35 lv
    let finalPriceForSheets;

    // Calculate payment deadline (72 hours before event) and late fees
    const paymentDeadline = new Date(eventDateTime - 72 * 60 * 60 * 1000);
    const isCurrentlyOnTime = hoursUntilEvent >= 72;

    let paymentDeadlineMessage = null;
    let lateFeeAmount = null;

    if (isCurrentlyOnTime) {
      // Show deadline warning only if currently in on-time period
      const lateMemberPrice = 30;
      const lateNonMemberPrice = 40;

      if (isMember) {
        if (participantCount === 1) {
          lateFeeAmount = `${lateMemberPrice} лв. (членска отстъпка)`;
        } else {
          const lateTotalPrice =
            lateMemberPrice + lateNonMemberPrice * (participantCount - 1);
          lateFeeAmount = `${lateTotalPrice} лв. (${lateMemberPrice} лв. членска отстъпка + ${lateNonMemberPrice} лв. x ${participantCount - 1} участника)`;
        }
      } else {
        lateFeeAmount = `${lateNonMemberPrice * participantCount} лв. (${lateNonMemberPrice} лв. x ${participantCount} участника)`;
      }

      paymentDeadlineMessage = paymentDeadline.toLocaleDateString("bg-BG", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (isMember) {
      const memberPrice = hoursUntilEvent < 72 ? 30 : 25; // Late: 30 lv, On-time: 25 lv for members
      // Member discount only applies to one person, others pay regular price
      if (participantCount === 1) {
        finalPriceForSheets = `${memberPrice} лв. (членска отстъпка)`;
      } else {
        const totalPrice = memberPrice + basePrice * (participantCount - 1);
        finalPriceForSheets = `${totalPrice} лв. (${memberPrice} лв. членска отстъпка + ${basePrice} лв. x ${participantCount - 1} участника)`;
      }
    } else {
      finalPriceForSheets = `${basePrice * participantCount} лв. (${basePrice} лв. x ${participantCount} участника)`;
    }

    // Check if Google Sheets is available for saving
    // Combine all participant names into one string for the name field
    const allParticipantNames = formData.participantNames
      ? formData.participantNames.filter((name) => name.trim()).join(", ")
      : formData.name || "";

    if (sheetsAvailable && client) {
      try {
        await client.authorize();
        const gsapi = google.sheets({ version: "v4", auth: client });

        const opt = {
          spreadsheetId: process.env.SHEETS_ID,
          range: "A:Z", // Use range without sheet name to append to the first sheet
          valueInputOption: "USER_ENTERED",
          resource: {
            values: [
              [
                allParticipantNames || formData.name || "", // Column A: All participant names
                formData.event || "", // Column B: Event
                formData.eventDate || "", // Column C: Event Date
                formData.email || "", // Column D: Email
                formData.participantCount || 1, // Column E: Number of participants
                formData.phone || "", // Column F: Phone
                formData.source || "", // Column G: Source (moved from J to G)
                new Date().toISOString(), // Column H: Timestamp (moved from K to H)
                formData.eventTime || "", // Column I: Event Time (moved from L to I)
                isMember ? "Да" : "Не", // Column J: Member status
                finalPriceForSheets || "", // Column K: Final price to be paid
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
        // Use the variables we already calculated above
        const emailData = {
          name: formData.name, // Always use the name of the person who filled out the form
          event: formData.event,
          eventDate: formData.eventDate,
          eventTime: formData.eventTime,
          eventLocation: formData.eventLocation,
          phone: formData.phone,
          source: formData.source,
          isMember: isMember,
          finalPrice: finalPriceForSheets,
          participantCount: participantCount,
          participantNames: formData.participantNames || [formData.name],
          paymentDeadline: paymentDeadlineMessage,
          lateFee: lateFeeAmount,
        };

        // Send confirmation email to user
        const userMailOptions = {
          from: process.env.SENDER_EMAIL,
          to: email,
          replyTo: process.env.REPLY_TO,
          subject: `Успешна регистрация: "${event}" на ${eventDate}, ${formData.eventTime}`,
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
        const adminEmailData = {
          name: formData.name,
          email: email,
          event: event,
          eventDate: eventDate,
          eventTime: formData.eventTime,
          eventLocation: formData.eventLocation,
          phone: formData.phone,
          source: formData.source,
          isMember: isMember,
          finalPrice: finalPriceForSheets,
          participantCount: participantCount,
          participantNames: formData.participantNames,
        };

        const adminMailOptions = {
          from: process.env.SENDER_EMAIL,
          to: process.env.ADMIN_EMAIL,
          subject: `🎉 Нова регистрация: "${event}" - ${participantCount} участници`,
          html: getAdminNotificationHTML(adminEmailData),
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

// Helper function to check if email is in members sheet
async function checkMemberInSheets(email) {
  try {
    if (!sheetsAvailable || !client) {
      console.log("Google Sheets not available for member check");
      return false;
    }

    // Authorize the client
    await client.authorize();
    const gsapi = google.sheets({ version: "v4", auth: client });

    console.log(`Checking Members sheet for email: ${email}`);

    // Get member emails from the Members sheet
    const memberRows = await gsapi.spreadsheets.values.get({
      spreadsheetId: process.env.SHEETS_ID,
      range: "Members!A:A",
    });

    const memberEmails = memberRows.data.values?.flat().filter(Boolean) || [];
    console.log(`Found ${memberEmails.length} members in Members sheet`);

    // Check if the email exists in the members list
    const isMember = memberEmails.some(
      (memberEmail) =>
        memberEmail.toLowerCase().trim() === email.toLowerCase().trim(),
    );

    console.log(`Member check result for ${email}: ${isMember}`);
    return isMember;
  } catch (error) {
    console.error("Error checking member in sheets:", error);
    return false;
  }
}

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
