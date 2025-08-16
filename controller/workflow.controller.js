import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { serve } = require("@upstash/workflow/express");
import dayjs from "dayjs";

import Subscription from "../models/subscription.models.js";
import { sendReminderEmail } from "../utils/send-email.js";

const REMINDER = [7, 5, 2, 1];

export const sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;

  const subscription = await fetchSUbscription(context, subscriptionId);

  if (!subscription || subscription.status !== "active") return;

  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(
      `Renewal date has pass for subscription ${subscriptionId},stopping the workflow`
    );
    return;
  }

  for (const daysBefore of REMINDER) {
    const reminderDate = renewalDate.subtract(daysBefore, "day");
    if (reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(
        context,
        `Reminder ${daysBefore} days before`,
        reminderDate
      );
    }

   if(dayjs().isSame(reminderDate,"day")){
     await triggerReminder(
       context,
       `${daysBefore} days before reminder`,
       subscription
     );
   }
  }
});

async function fetchSUbscription(context, subscriptionId) {
  return await context.run("get subscription", async () => {
    return await Subscription.findById(subscriptionId).populate(
      "user",
      "name email"
    );
  });
}
async function sleepUntilReminder(context, label, date) {
  console.log(`Sleeping until ${label} reminder at ${date}`);
  await context.sleepUntil(label, date.toDate());
}

async function triggerReminder(context, label, subscription) {
  return context.run(label, async () => {
    console.log(`Trigging ${label} reminder`, subscription);
    await sendReminderEmail({
      to: subscription.user.email,
      type: label,
      subscription,
    });
  });
}
