import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { google } from "googleapis";
import {
  formatConfirmationPrice,
  getConfirmationEmailHTML,
} from "./emailTemplates/confirmationEmail.js";

process.env.CLIENT_EMAIL = "service@example.test";
process.env.PRIVATE_KEY_BASE64 = Buffer.from("test-key").toString("base64");
process.env.SHEETS_ID = "test-sheet";
process.env.EMAIL_PROVIDER = "gmail";
process.env.GMAIL_CLIENT_ID = "test-client";
process.env.GMAIL_CLIENT_SECRET = "test-secret";
process.env.GMAIL_REFRESH_TOKEN = "test-refresh-token";
process.env.SENDER_EMAIL = "sender@example.test";
process.env.ADMIN_EMAIL = "admin@example.test";
process.env.REPLY_TO = "sender@example.test";

let sheetsError;
let mailError;
let jwtOptions;
const sentMessages = [];
const savedRows = [];

google.auth.JWT = class {
  constructor(options) {
    jwtOptions = options;
  }
  async authorize() {}
};
google.auth.OAuth2 = class {
  setCredentials() {}
};
google.sheets = () => ({
  spreadsheets: {
    values: {
      async append(options) {
        if (sheetsError) throw new Error("Sheets unavailable");
        savedRows.push(options.resource.values[0]);
      },
    },
  },
});
google.gmail = () => ({
  users: {
    messages: {
      async send(options, requestOptions) {
        if (mailError) throw new Error("Gmail unavailable");
        sentMessages.push({ options, requestOptions });
        return { data: { id: "test-message" } };
      },
    },
  },
});

const { app } = await import("./server.js");
let server;
let url;

before(async () => {
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  url = `http://127.0.0.1:${server.address().port}/submit-form`;
});

after(async () => {
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
});

const submit = () =>
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test User",
      email: "participant@example.test",
      event: "Test event",
      eventDate: "28.11.2026",
      eventTime: "11:30",
      participantCount: 1,
      participantNames: ["Test User"],
    }),
  });

test("confirmation email includes the updated bank details and event date", () => {
  const data = {
    name: "Test User",
    event: "Test event",
    eventDate: "28.11.2026, събота",
    eventTime: "11:30",
    eventLocation: "Sofia",
    phone: "123",
    finalPrice: formatConfirmationPrice(18, 1, true),
    participantCount: 1,
    participantNames: ["Test User"],
  };
  const html = getConfirmationEmailHTML(data);

  assert.match(html, /IBAN:<\/strong> BG66UNCR70001526933500/);
  assert.match(html, /src="cid:brand-name-id" alt="Прегърната"/);
  assert.match(html, /Получател:<\/strong> Прегърната ООД/);
  assert.match(html, /Основание:<\/strong> Събитие на 28\.11\.2026<\/p>/);
  assert.match(html, /Сума:<\/strong> 18 € \(🕊️ EARLY BIRD\)/);
  assert.doesNotMatch(html, /BG42STSA93000018035708|Катя Ушева/);
  assert.match(
    getConfirmationEmailHTML({ ...data, eventDate: "28.11.2026" }),
    /Основание:<\/strong> Събитие на 28\.11\.2026<\/p>/,
  );
});

test("confirmation prices put the total before the tier and preserve multi-person pricing", () => {
  assert.equal(formatConfirmationPrice(18, 1, true), "18 € (🕊️ EARLY BIRD)");
  assert.equal(formatConfirmationPrice(21, 1, false), "21 € (⏰ LAST MINUTE)");
  assert.equal(
    formatConfirmationPrice(18, 2, true),
    "36 € (🕊️ EARLY BIRD) (18 € x 2 участника)",
  );
  assert.equal(
    formatConfirmationPrice(21, 2, false),
    "42 € (⏰ LAST MINUTE) (21 € x 2 участника)",
  );
});

test("saves registration and sends both MIME emails through Gmail", async () => {
  const response = await submit();
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.equal(result.emailSent, true);
  assert.equal(jwtOptions.email, "service@example.test");
  assert.equal(jwtOptions.key, "test-key");
  assert.deepEqual(jwtOptions.scopes, ["https://www.googleapis.com/auth/spreadsheets"]);
  assert.equal(savedRows.length, 1);
  assert.equal(sentMessages.length, 2);
  assert.equal(sentMessages[0].options.userId, "me");
  assert.equal(sentMessages[0].requestOptions.retry, false);
  const mime = Buffer.from(sentMessages[0].options.requestBody.raw, "base64url").toString();
  assert.match(mime, /To: participant@example\.test/);
  assert.match(mime, /Content-ID: <unique-logo-id>/);
  assert.match(mime, /Content-ID: <brand-name-id>/);
});

test("reports a failed Sheets save without sending emails", async () => {
  sheetsError = true;
  const response = await submit();
  assert.equal(response.status, 503);
  assert.equal((await response.json()).success, false);
  assert.equal(sentMessages.length, 2);
  sheetsError = false;
});

test("reports email failure after saving without presenting it as email success", async () => {
  mailError = true;
  const response = await submit();
  const result = await response.json();
  assert.equal(response.status, 200);
  assert.equal(result.success, true);
  assert.equal(result.emailSent, false);
  assert.equal(savedRows.length, 2);
});
