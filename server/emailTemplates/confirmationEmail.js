export function formatConfirmationPrice(unitPrice, participantCount, isEarlyBird) {
  const tier = isEarlyBird ? "🕊️ EARLY BIRD" : "⏰ LAST MINUTE";
  const breakdown = participantCount > 1
    ? ` (${unitPrice} € x ${participantCount} участника)`
    : "";
  return `${unitPrice * participantCount} € (${tier})${breakdown}`;
}

/**
 * Email template for user registration confirmation
 * @param {Object} data - Data for the email template
 * @returns {String} HTML content for the email
 */
export function getConfirmationEmailHTML(data) {
  const {
    name,
    event,
    eventDate,
    eventTime,
    eventLocation,
    phone,
    source,
    finalPrice,
    participantCount,
    participantNames,
  } = data;

  return `<!DOCTYPE html>
<html lang="bg">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Успешно записване</title>
</head>
<body style="margin: 0; padding: 0; background-color: #d4dee0; color: #393750; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #d4dee0;">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px;">
          <tr>
            <td align="center" style="background-color: #6c698d; padding: 30px 24px; border-radius: 20px 20px 0 0;">
              <img src="cid:unique-logo-id" alt="Лого" width="120" style="display: block; width: 120px; max-width: 50%; height: auto; margin: 0 auto;">
              <img src="cid:brand-name-id" alt="Прегърната" width="215" style="display: block; width: 215px; max-width: 80%; height: auto; margin: 12px auto 0;">
              <h1 style="margin: 20px 0 0; color: #ffffff; font-family: Georgia, serif; font-size: 30px; line-height: 1.2;">Успешно записване!</h1>
            </td>
          </tr>
          <tr>
            <td style="background-color: #ffffff; padding: 28px 24px;">
      <p>Здравей ${name}! </p>
      
      <p>Благодарим ти за интереса и записването за:</p>

      <div style="background-color: #f7e1d7; border-radius: 14px; padding: 16px; margin: 20px 0; text-align: center;">
        <p> "<strong>${event}</strong>"
        <br>на <strong>${eventDate} </strong>
        <br>от <strong>${eventTime} часа</strong> 
        <br>в <strong>${eventLocation}</strong>.</p>
      </div>

      <p>За да бъде регистрацията ти завършена, а мястото ти - резервирано, заплати таксата от <strong>${finalPrice}</strong> като използваш следните банкови данни:</p>
      
      <div style="background-color: #f9edef; border-left: 4px solid #edafb8; border-radius: 12px; padding: 16px; margin: 20px 0; overflow-wrap: anywhere;">
        <p style="margin: 4px 0;"><strong>IBAN:</strong> BG66UNCR70001526933500</p>
        <p style="margin: 4px 0;"><strong>Получател:</strong> Прегърната ООД</p>
        <p style="margin: 4px 0;"><strong>Основание:</strong> Събитие на ${eventDate.split(",")[0].trim()}</p>
        <p style="margin: 4px 0;"><strong>Сума:</strong> ${finalPrice}</p>
      </div>
      
      ${data.paymentDeadline && data.lateFee ? `<p><strong>⚠️ Важно:</strong> Ако преводът не бъде направен до ${data.paymentDeadline}, дължимата сума е ${data.lateFee}.</p>` : ""}
      
      <p><strong>Моля, имай предвид, че регистрацията ти ще бъде валидна само след постъпило плащане.</strong></p>
      
      <p>При записването ти използва следните данни:</p>
      <div style="background-color: #edf2f3; border-left: 4px solid #6c698d; border-radius: 12px; padding: 16px; margin: 20px 0;">
        <p><strong>Брой участници:</strong> ${participantCount}</p>
        ${participantCount > 1 ? `<p><strong>Допълнителни места:</strong> ${participantCount - 1} допълнителни участника</p>` : ""}
        ${(() => {
          if (participantNames && participantNames.length > 0) {
            const namedParticipants = [];
            for (let i = 0; i < participantCount; i++) {
              const participantName =
                participantNames[i] && participantNames[i].trim();
              if (participantName) {
                namedParticipants.push(participantName);
              } else {
                namedParticipants.push(`Участник ${i + 1}`);
              }
            }
            return `<p><strong>Участници:</strong> ${namedParticipants.join(", ")}</p>`;
          } else {
            return `<p><strong>Участник:</strong> ${name}</p>`;
          }
        })()}
        <p><strong>Телефон за връзка:</strong> ${phone}</p>
        <p><strong>От къде научи за "Прегърната"?:</strong> ${source || "Полето не беше попълнено"}</p>
      </div>

      <p><strong>Следи своя мейл</strong> - тук ще ти изпратим потвърждение за твоята регистрация при постъпило плащане и ще те известим в случай на промени.</p>

      <p>Благодарим ти!</p>
      
      <p><br>Слънчев ден,
      <br>eкипът на "Прегърната"</p>

      <div style="background-color: #f7e1d7; border-radius: 14px; padding: 12px 16px; margin: 24px 0 0; text-align: center;">
            <p>Последвай ни в социалните мрежи!</p>
            <a href="https://www.instagram.com/embraced.mothersclub/" target="_blank" style="color: #514d76;">Instagram</a> |
            <a href="https://www.facebook.com/embraced.mothersclub" target="_blank" style="color: #514d76;">Facebook</a>
      </div>
            </td>
          </tr>
          <tr>
            <td align="center" style="background-color: #edafb8; color: #393750; padding: 20px; border-radius: 0 0 20px 20px; font-size: 12px;">
      <p>© ${new Date().getFullYear()} Прегърната. Всички права запазени.</p>
      <p>
        <a href="https://zamoetorazhdane.com" style="color: #393750;">zamoetorazhdane.com</a> |
        <a href="mailto:embraced.mothersclub@gmail.com" style="color: #393750;">embraced.mothersclub@gmail.com</a>
      </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Generate admin notification email content
 * @param {Object} data - Registration data
 * @returns {String} Admin notification email content
 */
export function getAdminNotificationHTML(data) {
  const {
    name,
    event,
    eventDate,
    eventTime,
    eventLocation,
    phone,
    source,
    finalPrice,
    participantCount,
    participantNames,
    email,
  } = data;

  // Format participant list
  let participantList = "";
  if (
    participantCount > 1 &&
    participantNames &&
    participantNames.filter((n) => n.trim()).length > 0
  ) {
    const validNames = participantNames.filter((n) => n.trim());
    participantList = validNames
      .map(
        (participant, index) =>
          `<li><strong>Участник ${index + 1}:</strong> ${participant}</li>`,
      )
      .join("");

    // Add unnamed participants if count exceeds named participants
    if (participantCount > validNames.length) {
      for (let i = validNames.length; i < participantCount; i++) {
        participantList += `<li><strong>Участник ${i + 1}:</strong> Неизвестно име</li>`;
      }
    }
  } else {
    participantList = `<li><strong>Участник 1:</strong> ${name}</li>`;
  }

  return `<!DOCTYPE html>
<html lang="bg">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Нова регистрация за ${event}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      background-color: #B0C4B1;
      color: white;
      padding: 20px;
      margin: -30px -30px 30px -30px;
      border-radius: 8px 8px 0 0;
    }
    .event-details {
      background-color: #f8f9fa;
      padding: 20px;
      border-left: 4px solid #B0C4B1;
      margin: 20px 0;
      border-radius: 0 4px 4px 0;
    }
    .participant-list {
      background-color: #fff3cd;
      padding: 15px;
      border-left: 4px solid #ffc107;
      margin: 20px 0;
      border-radius: 0 4px 4px 0;
    }
    .participant-list ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    .participant-list li {
      margin: 5px 0;
    }
    .contact-info {
      background-color: #e7f3ff;
      padding: 15px;
      border-left: 4px solid #0084ff;
      margin: 20px 0;
      border-radius: 0 4px 4px 0;
    }
    .price-info {
      font-size: 1.2em;
      font-weight: bold;
      text-align: center;
      color: #B0C4B1;
      margin: 20px 0;
    }
    .timestamp {
      font-size: 0.9em;
      color: #666;
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Нова регистрация за "${event}"!</h1>
    </div>

    <div class="event-details">
      <h3>📅 Детайли за събитието:</h3>
      <p><strong>Събитие:</strong> ${event}</p>
      <p><strong>Дата:</strong> ${eventDate}</p>
      <p><strong>Час:</strong> ${eventTime}</p>
      <p><strong>Локация:</strong> ${eventLocation}</p>
    </div>

    <div class="participant-list">
      <h3>👥 Участници (общо ${participantCount}):</h3>
      <ul>
        ${participantList}
      </ul>
    </div>

    <div class="contact-info">
      <h3>📞 Контактна информация:</h3>
      <p><strong>Имейл:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Телефон:</strong> ${phone}</p>
      <p><strong>Източник:</strong> ${source || "Неизвестен"}</p>
    </div>

    <div class="price-info">
      💰 Цена за плащане: ${finalPrice}
    </div>

    <div class="timestamp">
      Регистрация получена на: ${new Date().toLocaleString("bg-BG")}
    </div>
  </div>
</body>
</html>`;
}
