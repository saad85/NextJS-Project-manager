// sms.ts
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;

console.log("accountSid", accountSid);
console.log("authToken", authToken);
console.log(
  "process.env.TWILIO_PHONE_NUMBER ",
  process.env.TWILIO_PHONE_NUMBER
);
const client = twilio(accountSid, authToken);

export const sendSms = async (to: string, message: string) => {
  console.log("to ", to);
  console.log("message ", message);
  console.log(
    "process.env.TWILIO_PHONE_NUMBER ",
    process.env.TWILIO_PHONE_NUMBER
  );
  return await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER, // your Twilio number
    to, // must be verified number if you're still in trial
  });
};
