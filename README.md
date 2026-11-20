Future Features

## Gmail API email delivery

The server can send email over HTTPS using the Gmail API, which works on Render's
Free plan. Configure Render to use Node.js 22 or newer for the backend. The Gmail
account authorizing the application must own `SENDER_EMAIL` or have it configured
as a verified Gmail send-as address.

1. In Google Cloud, enable the Gmail API and configure the OAuth consent screen.
   If the app is in testing mode, add the sending account as a test user.
2. Create a Web application OAuth client and add
   `https://developers.google.com/oauthplayground` as an authorized redirect URI.
3. In [OAuth 2.0 Playground](https://developers.google.com/oauthplayground),
   enable **Use your own OAuth credentials**, enter that client's credentials,
   authorize the scope `https://www.googleapis.com/auth/gmail.send` as the sending
   account, and exchange the authorization code for a refresh token.
4. Privately set `EMAIL_PROVIDER=gmail`, `GMAIL_CLIENT_ID`,
   `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`, `SENDER_EMAIL`, `REPLY_TO`,
   and `ADMIN_EMAIL` in Render's environment settings. Keep the existing Sheets
   variables and configure `ANELIA_CONTACT_EMAIL` if required. Redeploy.

Never commit or share the OAuth credentials or refresh token. Refresh tokens for
external OAuth apps in testing mode normally expire after seven days; review
[Google's OAuth token limits](https://developers.google.com/identity/protocols/oauth2#expiration)
and production verification requirements before relying on this setup.

1. Offer ICS-calender-event or whole calender to add to own Calender
2. Ново членство VS вече имам членство

1. As a customer I want a title Page that can be scrolled down, so to see
the most important content of the website in one go. 

2. As a customer of Pregrunata, i need a seperate Webpage where all the Services 
of the Pregurnata so to get an idea of the offers and directly get that service that would be good me.

3. Instead of Partners, we should have a Webpage "Cattalouge of Specialists" where the Customer can get an overview of all the PromoCodes that can be available for specific Professionals when becoming a member of Pregurnata. 

3. Rearraning Website:
    - Program to be renamed to Calendar, and stay the same
    - Change Design: Focus more on the Events in the Calender, not the calender itself with the dates. 
    - Events to be changed to Services, with sub-pages for every Service
    -  Title Page
        - Carousel
        
4. New Modul that 


Website referrences:
www.theonetribe.com
www.marinabancheva.com