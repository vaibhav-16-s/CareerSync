import cron from 'node-cron';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { closeExpiredInternships } from './closeExpiredInternships';
import { sendDeadlineReminders } from './deadlineReminders';

/**
 * Registers scheduled background jobs.
 *
 * Guarded by ENABLE_SCHEDULED_JOBS so that in a multi-instance deployment the
 * jobs run on exactly one instance — otherwise every pod would fire the same
 * cron, sending duplicate deadline reminders to each student.
 */
export function startJobs(): void {
  if (!env.enableScheduledJobs) {
    logger.info('Scheduled jobs disabled on this instance (ENABLE_SCHEDULED_JOBS=false)');
    return;
  }

  // Every hour: close internships past their deadline
  cron.schedule('0 * * * *', () => {
    void closeExpiredInternships().catch((err) =>
      logger.error('closeExpiredInternships failed', err)
    );
  });

  // Every day at 09:00: deadline reminders for saved internships
  cron.schedule('0 9 * * *', () => {
    void sendDeadlineReminders().catch((err) =>
      logger.error('sendDeadlineReminders failed', err)
    );
  });

  logger.info('Background jobs scheduled');
}
