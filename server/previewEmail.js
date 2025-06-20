import fs from 'fs';
import path from 'path';
import { getConfirmationEmailHTML } from './emailTemplates/confirmationEmail.js';

// Sample data for preview
const sampleData = {
  name: "Мария Иванова",
  event: "Време за мама",
  eventDate: "12.05.2025, понеделник",
  eventTime: "18:00",
  eventLocation: "София, ул. Пиротска 5",
  participation: "Еднократно участие - 30 лв.",
  phone: "+359 88 123 4567",
  // role: "Майка",
  // customRole: "Бъдеща майка",
  topics: "0-1 години",
  source: "Instagram",
};

// Generate HTML
const emailHTML = getConfirmationEmailHTML(sampleData);

// Save to file
const outputPath = path.join(process.cwd(), 'email-preview.html');
fs.writeFileSync(outputPath, emailHTML);

console.log(`Email preview saved to: ${outputPath}`);