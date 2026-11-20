import nodemailer from "nodemailer";

export const createGmailTransport = (gmail) =>
  nodemailer.createTransport({
    name: "Gmail API",
    version: "1.0.0",
    send(mail, callback) {
      mail.message.build((error, message) => {
        if (error) {
          callback(error);
          return;
        }

        gmail.users.messages
          .send(
            {
              userId: "me",
              requestBody: { raw: message.toString("base64url") },
            },
            { timeout: 20000, retry: false },
          )
          .then(({ data }) => callback(null, { messageId: data.id }))
          .catch(callback);
      });
    },
  });
