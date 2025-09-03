# Google Sheets Column Structure - Registration Data

After the latest update, the Google Sheets will now include the following columns:

## Column Layout:
- **Column A**: Participant Names (all participant names combined)
- **Column B**: Event Name
- **Column C**: Event Date (e.g., "15.01.2025, сряда")
- **Column D**: Email Address
- **Column E**: Number of Participants
- **Column F**: Phone Number
- **Column G**: Source (how they heard about the event)
- **Column H**: Registration Timestamp (ISO format)
- **Column I**: Event Time (e.g., "18:00")
- **Column J**: Member Status ("Да" for members, "Не" for non-members) ✨ **NEW**
- **Column K**: Final Price to be Paid (with pricing details) ✨ **NEW**

## New Price Information Examples:
- Member, 1 participant: "25 лв. (членска отстъпка)"
- Member, 3 participants: "65 лв. (25 лв. членска отстъпка + 35 лв. x 2 участника)"
- Non-member, 2 participants: "70 лв. (35 лв. x 2 участника)"
- Late registration (< 72h): Higher base price (40 лв. instead of 35 лв.)

## Pricing Logic:
- **Base Price**: 35 лв. per person (40 лв. if registration is less than 72 hours before event)
- **Member Discount**: First person gets 10 лв. discount (minimum 20 лв.)
- **Additional Participants**: Pay full base price regardless of member status

This enhancement provides administrators with complete financial information for each registration directly in the spreadsheet.
