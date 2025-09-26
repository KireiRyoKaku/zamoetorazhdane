import fs from "fs";
import path from "path";

console.log(
  `🔄 Loading fresh confirmationEmail.js at ${new Date().toLocaleTimeString()}`,
);

// Use dynamic import to bypass caching
const {
  getConfirmationEmailHTML,
  getConfirmationEmailText,
  getAdminNotificationHTML,
  getAdminNotificationText,
} = await import(`./emailTemplates/confirmationEmail.js?t=${Date.now()}`);

// Sample data for multiple participants - member with discount (on-time pricing)
const sampleDataMultiple = {
  name: "Мария Иванова",
  email: "maria.ivanova@example.com",
  event: "Време за мама - Емоционално благополучие",
  eventDate: "12.05.2025, понеделник",
  eventTime: "18:00",
  eventLocation: "София, ул. Пиротска 5",
  phone: "+359 88 123 4567",
  source: "Instagram - профил на Прегърната",
  isMember: true,
  finalPrice: "95 лв. (25 лв. членска отстъпка + 35 лв. x 2 участника)",
  participantCount: 3,
  participantNames: ["Мария Иванова", "Анна Петрова", "Светлана Димитрова"],
  participation: "Еднократно участие",
};

// Sample data for single participant - non-member (on-time pricing)
const sampleDataSingle = {
  name: "Елена Георгиева",
  email: "elena.georgieva@example.com",
  event: "Бременност и раждане",
  eventDate: "15.05.2025, четвъртък",
  eventTime: "19:00",
  eventLocation: "Пловдив, ул. Главная 10",
  phone: "+359 87 654 3210",
  source: "Препоръка от приятелка",
  isMember: false,
  finalPrice: "35 лв.", // Non-member on-time pricing
  participantCount: 1,
  participantNames: ["Елена Георгиева"],
  participation: "Еднократно участие",
};

// Generate email previews
const confirmationMultiple = getConfirmationEmailHTML(sampleDataMultiple);
const confirmationSingle = getConfirmationEmailHTML(sampleDataSingle);
const adminMultiple = getAdminNotificationHTML(sampleDataMultiple);

// Save HTML files
fs.writeFileSync(
  path.join(process.cwd(), "email-preview-multiple.html"),
  confirmationMultiple,
);
fs.writeFileSync(
  path.join(process.cwd(), "email-preview-single.html"),
  confirmationSingle,
);
fs.writeFileSync(
  path.join(process.cwd(), "admin-email-preview-multiple.html"),
  adminMultiple,
);

console.log("📧 Email Preview Files Generated:");
console.log(
  "   - email-preview-multiple.html (3 participants, member, on-time)",
);
console.log(
  "   - email-preview-single.html (1 participant, non-member, on-time)",
);
console.log("   - admin-email-preview-multiple.html");
console.log(
  "💰 New Pricing: On-time 35/25 лв, Late 40/30 лв (non-member/member)",
);
