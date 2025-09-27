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

- Member, 1 participant (on-time): "25 лв. (членска отстъпка)"
- Member, 1 participant (late): "30 лв. (членска отстъпка)"
- Member, 3 participants (on-time): "95 лв. (25 лв. членска отстъпка + 35 лв. x 2 участника)"
- Member, 3 participants (late): "110 лв. (30 лв. членска отстъпка + 40 лв. x 2 участника)"
- Non-member, 2 participants (on-time): "70 лв. (35 лв. x 2 участника)"
- Non-member, 2 participants (late): "80 лв. (40 лв. x 2 участника)"

## Pricing Logic:

- **Base Price**: 35 лв. per person (on-time), 40 лв. per person (late - less than 72 hours before event)
- **Member Pricing**: 25 лв. (on-time), 30 лв. (late) - applies only to the first participant
- **Additional Participants**: Pay full base price regardless of member status
- **Timing Threshold**: 72 hours before event start time

This enhancement provides administrators with complete financial information for each registration directly in the spreadsheet.
