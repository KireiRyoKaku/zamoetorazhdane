/**
 * Email template for user registration confirmation
 * @param {Object} data - Data for the email template
 * @returns {String} HTML content for the email
 */
export function getConfirmationEmailHTML(data) {
  const { name, event, eventDate, eventTime, eventLocation, participation, phone, source, isMember, finalPrice, participantCount, participantNames} = data;
  
  return `<!DOCTYPE html>
<html lang="bg">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Успешно записване</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #4E5F4C;
      max-width: 100%;
      margin: 0 auto;
      padding: 20px;
      background-color: #B0C4B1;
    }
    .container {
      background-color: #B0C4B1;
      overflow: hidden;
      border-radius: 12px;
      box-sizing: border-box;
      padding: 20px;
      margin: 0 auto;
      text-align: center;
      width: 100%;
      max-width: 600px;
    }

    .header {
      background-color: #B0C4B1;
      text-align: center;
      margin-bottom: 20px;
      width: 100%;
    }

    .content {
      border-radius: 8px;
      padding: 20px;
      background-color: #fff;
      width: 90%;
      max-width: 500px;
      margin: 0 auto;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: inline-block;
      text-align: left;
    }

    .filled-out-form {
      background-color: #DEDBD2;
      padding: 15px;
      border-left: 4px solid #EDAFB8;
      margin: 15px 0;
    }

    .bank-details {
      background-color: #DEDBD2;
      padding: 15px;
      border-left: 4px solid #F7E1D7;
      margin: 15px 0;
      border-radius: 4px;
      text-align: center;
    }    .social-links {
      background-color: #f5f5f5;
      padding: 15px;
      margin: 15px 0;
      border-radius: 4px;
      text-align: center;
    }

    .bank-details p {
      margin: 5px 0;
    }

    .footer {
      text-align: center;
      font-size: 12px;
      color: #4E5F4C;
      background-color: #F7E1D7;
      padding: 20px;
      margin: 0 auto;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      border-radius: 12px;
    }

    .important {
      font-weight: bold;      
    }

    img {
      max-width: 100%;
      height: auto;
    }

    @media only screen and (max-width: 480px) {
      .container, .content {
        padding: 10px;
      }
      .content {
        width: 95%;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="cid:unique-logo-id" alt="Прегърната Лого" style="max-width: 50%; height: auto;">
      <h1 style="color:#F7E1D7;">Успешно записване!</h1>
    </div>
    
    <div class="content">
      <p>Здравей, </p>
      
      <p>Благодарим ти за интереса. Ти успешно се записа за "<strong>${event}</strong>" на <strong>${eventDate} от ${eventTime} часа</strong> в <strong>${eventLocation}</strong>.</p>
      
      <p>За да бъде регистрацията ти завършена, а мястото ти - резервирано, заплати таксата от <strong>${finalPrice}</strong> като използваш следните банкови данни:</p>
      
      ${isMember ? '<p style="color: #B0C4B1; font-weight: bold;">✓ Поздравления! Разпознахме те като член на общносттa. Крайната цена на резервацията ти е изчислена с отстъпка.</p>' : '<p>Не си член на общността. За да получиш отстъпка за следващи събития, <a href="https://zamoetorazhdane.com" style="color: #B0C4B1; font-weight: bold;">стани член</a>.</p>'}
      
      <div class="bank-details">
        <p><strong>IBAN:</strong> BG42STSA93000018035708</p>
        <p><strong>Получател:</strong> Катя Ушева</p>
        <p><strong>Основание:</strong> Среща на ${eventDate.slice(0, 10)}</p>
      </div>
      
      <p class="important">Имай предвид, че регистрацията ти ще бъде валидна само след постъпило плащане.</p>
      
      <p>При записването ти използва следните данни:</p>
      <div class="filled-out-form">
        <p><strong>Брой участници:</strong> ${participantCount}</p>
        ${participantCount > 1 ? `<p><strong>Допълнителни места:</strong> ${participantCount - 1} допълнителни участника</p>` : ''}
        ${(() => {
          if (participantNames && participantNames.length > 0) {
            const namedParticipants = [];
            for (let i = 0; i < participantCount; i++) {
              const participantName = participantNames[i] && participantNames[i].trim();
              if (participantName) {
                namedParticipants.push(participantName);
              } else {
                namedParticipants.push(`Участник ${i + 1}`);
              }
            }
            return `<p><strong>Участници:</strong> ${namedParticipants.join(', ')}</p>`;
          } else {
            return `<p><strong>Участник:</strong> ${name}</p>`;
          }
        })()}
        <p><strong>Телефон за връзка:</strong> ${phone}</p>
        <p><strong>От къде научи за "Прегърната"?:</strong> ${source || "Полето не беше попълнено"}</p>
      </div>

      <p>СЛЕДИ СВОЯ ИМЕЙЛ - тук ще ти изпратим потвърждение за твоята регистрация при постъпило плащане и ще те известим в случай на промени.</p>

      <p>Благодарим ти!</p>
      
      <p>Екипът на "Прегърната"</p>

      <div class="social-links">
            <p>Последвай ни в социалните мрежи!</p>
            <a href="https://www.instagram.com/embraced.mothersclub/" target="_blank">Instagram</a> |
            <a href="https://www.facebook.com/embraced.mothersclub" target="_blank">Facebook</a>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Прегърната. Всички права запазени.</p>
      <p>
        <a href="https://zamoetorazhdane.com">zamoetorazhdane.com</a> |
        <a href="mailto:embraced.mothersclub@gmail.com">embraced.mothersclub@gmail.com</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Get the plain text version of the confirmation email
 * @param {Object} data - Data for the email template
 * @returns {String} Plain text content for the email
 */
export function getConfirmationEmailText(data) {
  const { name, event, eventDate, eventTime, eventLocation, participation, phone, source, isMember, finalPrice, participantCount, participantNames} = data;
  
  return `Здравейте ${name},

Благодарим ти за регистрацията. Ти успешно се записа за "${event}" на ${eventDate}, ${eventTime} в ${eventLocation}.

За да бъде регистрацията ти завършена, а мястото ти - резервирано, заплати таксата от ${finalPrice} като използваш следните банкови данни:

${isMember ? '✓ Поздравления! Разпознахме те като член на общността и получаваш отстъпка.' : 'Не си член на общността. За да получиш отстъпка за следващи събития, посети zamoetorazhdane.com.'}

IBAN: BG42STSA93000018035708
Получател: Катя Ушева
Основание: Среща на ${eventDate.slice(0, 10)}

Имай предвид, че регистрацията ти ще бъде валидна САМО след постъпило плащане.

При записването ти използва следните данни:
Брой участници: ${participantCount}
${participantNames && participantNames.filter(n => n.trim()).length > 0 ? 
  `Участници: ${participantNames.filter(n => n.trim()).join(', ')}` : 
  `Участник: ${name}`}
${participantCount > 1 ? `Допълнителни места: ${participantCount - 1} допълнителни участника` : ''}
Телефон: ${phone}
От къде научи за "Прегърната"?: ${source || "Полето не беше попълнено"}

СЛЕДИ СВОЯ ИМЕЙЛ - там ще ти изпратим потвърждение или ще те известим, ако има промени.

Благодарим ти!

Екипът на Прегърната
zamoetorazhdane.com`;
}

/**
 * Generate admin notification email content
 * @param {Object} data - Registration data
 * @returns {String} Admin notification email content
 */
export function getAdminNotificationHTML(data) {
  const { name, event, eventDate, eventTime, eventLocation, phone, source, isMember, finalPrice, participantCount, participantNames, email } = data;
  
  // Format participant list
  let participantList = '';
  if (participantCount > 1 && participantNames && participantNames.filter(n => n.trim()).length > 0) {
    const validNames = participantNames.filter(n => n.trim());
    participantList = validNames.map((participant, index) => 
      `<li><strong>Участник ${index + 1}:</strong> ${participant}</li>`
    ).join('');
    
    // Add unnamed participants if count exceeds named participants
    if (participantCount > validNames.length) {
      for (let i = validNames.length; i < participantCount; i++) {
        participantList += `<li><strong>Участник ${i + 1}:</strong> Неизвестно име</li>`;
      }
    }
  } else {
    participantList = `<li><strong>Участник 1:</strong> ${name}</li>`;
  }

  // Pre-calculate member status styling to avoid template literal scoping issues
  const memberStatusBg = isMember ? '#d4edda' : '#f8d7da';
  const memberStatusColor = isMember ? '#155724' : '#721c24';
  const memberStatusText = isMember ? '✅ ЧЛЕН НА ОБЩНОСТТА' : '❌ НЕ Е ЧЛЕН НА ОБЩНОСТТА';

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
    .member-status {
      background-color: ${memberStatusBg};
      color: ${memberStatusColor};
      padding: 10px;
      border-radius: 4px;
      text-align: center;
      font-weight: bold;
      margin: 15px 0;
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
      <p><strong>Източник:</strong> ${source || 'Неизвестен'}</p>
    </div>

    <div class="member-status">
      ${memberStatusText}
    </div>

    <div class="price-info">
      💰 Цена за плащане: ${finalPrice}
    </div>

    <div class="timestamp">
      Регистрация получена на: ${new Date().toLocaleString('bg-BG')}
    </div>
  </div>
</body>
</html>`;
}

/**
 * Generate plain text admin notification email
 * @param {Object} data - Registration data  
 * @returns {String} Plain text admin notification
 */
export function getAdminNotificationText(data) {
  const { name, event, eventDate, eventTime, eventLocation, phone, source, isMember, finalPrice, participantCount, participantNames, email } = data;
  
  // Format participant list
  let participantList = '';
  if (participantCount > 1 && participantNames && participantNames.filter(n => n.trim()).length > 0) {
    const validNames = participantNames.filter(n => n.trim());
    participantList = validNames.map((participant, index) => 
      `  ${index + 1}. ${participant}`
    ).join('\n');
    
    // Add unnamed participants if count exceeds named participants
    if (participantCount > validNames.length) {
      for (let i = validNames.length; i < participantCount; i++) {
        participantList += `\n  ${i + 1}. Неизвестно име`;
      }
    }
  } else {
    participantList = `  1. ${name}`;
  }

  // Pre-calculate member status text
  const memberStatusText = isMember ? '✅ ЧЛЕН' : '❌ НЕ Е ЧЛЕН';

  return `🎉 НОВА РЕГИСТРАЦИЯ ЗА СЪБИТИЕ!

📅 СЪБИТИЕ: ${event}
📍 ЛОКАЦИЯ: ${eventLocation}
📆 ДАТА: ${eventDate}
🕐 ЧАС: ${eventTime}

👥 УЧАСТНИЦИ (общо ${participantCount}):
${participantList}

📞 КОНТАКТНА ИНФОРМАЦИЯ:
Имейл: ${email}
Телефон: ${phone}
Източник: ${source || 'Неизвестен'}

💳 СТАТУС НА ЧЛЕНСТВО: ${memberStatusText}
💰 ЦЕНА ЗА ПЛАЩАНЕ: ${finalPrice}

---
Регистрация получена на: ${new Date().toLocaleString('bg-BG')}`;
}
