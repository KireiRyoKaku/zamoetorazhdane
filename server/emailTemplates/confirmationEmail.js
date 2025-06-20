/**
 * Email template for user registration confirmation
 * @param {Object} data - Data for the email template
 * @returns {String} HTML content for the email
 */
export function getConfirmationEmailHTML(data) {
  const { name, event, eventDate, eventTime, eventLocation, participation, phone, role, customRole, topics, source} = data;
  
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
      color: #333;
      max-width: 100%;
      margin: 0 auto;
      padding: 20px;
      background-color: #626F47;
    }
    .container {
      background-color: #626F47;
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
      background-color: #626F47;
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

    .bank-details {
      background-color: #f5f5f5;
      padding: 15px;
      margin: 15px 0;
      border-left: 4px solid #007bff;
      border-radius: 4px;
    }
    
    .filled-out-form {
      background-color: #f5f5f5;
      padding: 15px;
      margin: 15px 0;
      border-left: 4px solid #FFCF50;
      border-radius: 4px;
    }
      
    .social-links {
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
      color: #000;
      background-color: #FFCF50;
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
      <img src="cid:unique-logo-id" alt="За Моето Раждане Лого" style="max-width: 80%; height: auto;">
      <h1 style="color:white;">Успешно записване!</h1>
    </div>
    
    <div class="content">
      <p>Здравей <strong>${name}</strong>,</p>
      
      <p>Благодарим ти за интереса. Ти успешно се записа за "<strong>${event}</strong>" на <strong>${eventDate} от ${eventTime} часа</strong> в <strong>${eventLocation}</strong>.</p>
      
      <p>За да бъде регистрацията ти завършена, а мястото ти - резервирано, заплати таксата от <strong>${participation.slice(-6)}</strong> като използваш следните банкови данни:</p>
      
      <div class="bank-details">
        <p><strong>IBAN:</strong> BG32UNCR70001525456026</p>
        <p><strong>Титуляр:</strong> ПЕРИМАМА ЕООД</p>
        <p><strong>Основание:</strong> Среща на ${eventDate.slice(0, 10)}</p>
      </div>
      
      <p class="important">Имай предвид, че регистрацията ти ще бъде валидна само след постъпило плащане.</p>
      
      <p>При записването ти използва следните данни:</p>
      <div class="filled-out-form">
        <p><strong>Телефон:</strong> ${phone}</p>
        <p><strong>Форма на участие:</strong> ${participation}</p>        
        <p><strong>Аз съм:</strong> ${role || customRole || "Полето не беше попълнено"}</p>
        <p><strong>Имам деца на възраст:</strong> ${topics || "Полето не беше попълнено"}</p>
        <p><strong>От къде научи за "За моето раждане"?:</strong> ${source || "Полето не беше попълнено"}</p>
      </div>

      <p>СЛЕДИ СВОЯ ИМЕЙЛ - тук ще ти изпратим потвърждение или ще те известим, ако има промени.</p>
      
      <p>Благодарим ти!</p>
      
      <p>Екипът на "За Моето Раждане"</p>

      <div class="social-links">
            <p>Последвай ни в социалните мрежи!</p>
            <a href="https://www.instagram.com/zamoetorazhdane/" target="_blank">Instagram</a> |
            <a href="https://www.facebook.com/zamoetorazhdane" target="_blank">Facebook</a>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} За Моето Раждане. Всички права запазени.</p>
      <p>
        <a href="https://zamoetorazhdane.com">zamoetorazhdane.com</a> |
        <a href="mailto:zamoetorazhdane@gmail.com">zamoetorazhdane@gmail.com</a>
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
  const { name, event, eventDate, eventTime, eventLocation, participation, phone, role, customRole, topics, source} = data;
  
  return `Здравейте ${name},

Благодарим ти за регистрацията. Ти успешно се записа за "${event}" на ${eventDate}, ${eventTime} в ${eventLocation}.

За да бъде регистрацията ти завършена, а мястото ти - резервирано, заплати таксата от ${participation.slice(-6)} като използваш следните банкови данни:

IBAN: BG32UNCR70001525456026
Титуляр: ПЕРИМАМА ЕООД
Основание: Среща на ${eventDate.slice(0, 10)}

Имай предвид, че регистрацията ти ще бъде валидна САМО след постъпило плащане.
СЛЕДИ СВОЯ ИМЕЙЛ - там ще ти изпратим потвърждение или ще те известим, ако има промени.

Благодарим ти!

Екипът на За Моето Раждане
zamoetorazhdane.com`;
}



