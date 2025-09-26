import fs from "fs";
import path from "path";

console.log(
  `🔄 Loading fresh confirmationEmail.js at ${new Date().toLocaleTimeString()}`,
);

// Use dynamic import to bypass caching
const { getConfirmationEmailHTML, getAdminNotificationHTML } = await import(
  `./emailTemplates/confirmationEmail.js?t=${Date.now()}`
);

// Scenario 1: Member - On-time registration (with payment deadline warning)
const memberOnTimeData = {
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
  paymentDeadline: "09.05.2025, 18:00",
  lateFee: "110 лв. (30 лв. членска отстъпка + 40 лв. x 2 участника)",
};

// Scenario 2: Member - Late registration (no deadline warning)
const memberLateData = {
  name: "Елена Георгиева",
  email: "elena.georgieva@example.com",
  event: "Детско хранене след 6 месеца",
  eventDate: "28.09.2025, неделя",
  eventTime: "10:00",
  eventLocation: "Пловдив, ул. Главная 10",
  phone: "+359 87 654 3210",
  source: "Препоръка от приятелка",
  isMember: true,
  finalPrice: "110 лв. (30 лв. членска отстъпка + 40 лв. x 2 участника)",
  participantCount: 3,
  participantNames: ["Елена Георгиева", "Десислава Стоянова", "Ивелина Димова"],
  participation: "Еднократно участие",
  paymentDeadline: null, // No deadline warning for late registrations
  lateFee: null,
};

// Scenario 3: Non-member - On-time registration (with payment deadline warning)
const nonMemberOnTimeData = {
  name: "Ива Николова",
  email: "iva.nikolova@example.com",
  event: "Подготовка за раждане",
  eventDate: "05.10.2025, неделя",
  eventTime: "14:00",
  eventLocation: "София, бул. Витоша 100",
  phone: "+359 88 555 7777",
  source: "Facebook страница",
  isMember: false,
  finalPrice: "105 лв. (35 лв. x 3 участника)",
  participantCount: 3,
  participantNames: ["Ива Николова", "Радостина Петкова", "Мила Георгиева"],
  participation: "Еднократно участие",
  paymentDeadline: "02.10.2025, 14:00",
  lateFee: "120 лв. (40 лв. x 3 участника)",
};

// Scenario 4: Non-member - Late registration (no deadline warning)
const nonMemberLateData = {
  name: "Калина Стефанова",
  email: "kalina.stefanova@example.com",
  event: "Бременност и раждане",
  eventDate: "29.09.2025, понеделник",
  eventTime: "19:00",
  eventLocation: "Варна, ул. Морска 15",
  phone: "+359 89 111 2222",
  source: "Google търсене",
  isMember: false,
  finalPrice: "120 лв. (40 лв. x 3 участника)",
  participantCount: 3,
  participantNames: [
    "Калина Стефанова",
    "Невена Йорданова",
    "Цветелина Маринова",
  ],
  participation: "Еднократно участие",
  paymentDeadline: null, // No deadline warning for late registrations
  lateFee: null,
};

// Generate all email previews
const memberOnTimeEmail = getConfirmationEmailHTML(memberOnTimeData);
const memberLateEmail = getConfirmationEmailHTML(memberLateData);
const nonMemberOnTimeEmail = getConfirmationEmailHTML(nonMemberOnTimeData);
const nonMemberLateEmail = getConfirmationEmailHTML(nonMemberLateData);

// Generate admin notifications for all scenarios
const memberOnTimeAdmin = getAdminNotificationHTML(memberOnTimeData);
const memberLateAdmin = getAdminNotificationHTML(memberLateData);
const nonMemberOnTimeAdmin = getAdminNotificationHTML(nonMemberOnTimeData);
const nonMemberLateAdmin = getAdminNotificationHTML(nonMemberLateData);

// Save all confirmation email files
fs.writeFileSync(
  path.join(process.cwd(), "email-preview-member-ontime.html"),
  memberOnTimeEmail,
);
fs.writeFileSync(
  path.join(process.cwd(), "email-preview-member-late.html"),
  memberLateEmail,
);
fs.writeFileSync(
  path.join(process.cwd(), "email-preview-nonmember-ontime.html"),
  nonMemberOnTimeEmail,
);
fs.writeFileSync(
  path.join(process.cwd(), "email-preview-nonmember-late.html"),
  nonMemberLateEmail,
);

// Save all admin notification files
fs.writeFileSync(
  path.join(process.cwd(), "admin-email-preview-member-ontime.html"),
  memberOnTimeAdmin,
);
fs.writeFileSync(
  path.join(process.cwd(), "admin-email-preview-member-late.html"),
  memberLateAdmin,
);
fs.writeFileSync(
  path.join(process.cwd(), "admin-email-preview-nonmember-ontime.html"),
  nonMemberOnTimeAdmin,
);
fs.writeFileSync(
  path.join(process.cwd(), "admin-email-preview-nonmember-late.html"),
  nonMemberLateAdmin,
);

console.log("📧 Complete Email Preview Files Generated:");
console.log("");
console.log("🔹 User Confirmation Emails:");
console.log(
  "   - email-preview-member-ontime.html (Member, On-time, 3 participants, WITH deadline warning)",
);
console.log(
  "   - email-preview-member-late.html (Member, Late, 3 participants, NO deadline warning)",
);
console.log(
  "   - email-preview-nonmember-ontime.html (Non-member, On-time, 3 participants, WITH deadline warning)",
);
console.log(
  "   - email-preview-nonmember-late.html (Non-member, Late, 3 participants, NO deadline warning)",
);
console.log("");
console.log("🔹 Admin Notification Emails:");
console.log("   - admin-email-preview-member-ontime.html");
console.log("   - admin-email-preview-member-late.html");
console.log("   - admin-email-preview-nonmember-ontime.html");
console.log("   - admin-email-preview-nonmember-late.html");
console.log("");
console.log("💰 Pricing Summary:");
console.log(
  "   - Member On-time: 95 лв. (25 + 35×2) → Late: 110 лв. (30 + 40×2)",
);
console.log("   - Non-member On-time: 105 лв. (35×3) → Late: 120 лв. (40×3)");
console.log("");
console.log("⚠️ Deadline Warnings:");
console.log("   - ON-TIME registrations: Show payment deadline warning");
console.log("   - LATE registrations: No deadline warning shown");
console.log("");
console.log("✅ All 8 email preview files generated successfully!");
