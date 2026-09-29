import { processScheduledBlogContent } from "./services/scheduler.service.js";

const INTERVAL = 60 * 1000;

let schedulerStarted = false;
let schedulerTimer = null;

export const startBlogScheduler = () => {
  if (schedulerStarted) {
    return schedulerTimer;
  }

  schedulerStarted = true;

  const run = async () => {
    try {
      const result = await processScheduledBlogContent();

      if (result.postsPublished > 0 || result.commentsPublished > 0) {
        console.log("[Blog Scheduler]", result);
      }
    } catch (error) {
      console.error("[Blog Scheduler]", error);
    }
  };

  run();

  schedulerTimer = setInterval(run, INTERVAL);

  console.log("[Blog Scheduler] Started.");

  return schedulerTimer;
};
