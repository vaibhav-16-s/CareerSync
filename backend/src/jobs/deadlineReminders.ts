import { SavedInternship } from '../models/SavedInternship';
import { Internship } from '../models/Internship';
import { createNotification } from '../services/notification.service';
import { InternshipStatus, NotificationType } from '../types';
import { logger } from '../config/logger';

/**
 * Notifies students about saved internships whose deadline is within 48 hours.
 * Idempotent: each saved internship is reminded at most once (tracked via
 * deadlineReminderSentAt), so running daily does not spam the same student.
 */
export async function sendDeadlineReminders(): Promise<void> {
  const now = new Date();
  const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  const closing = await Internship.find({
    status: InternshipStatus.ACTIVE,
    deadline: { $gte: now, $lte: in48h },
  }).select('_id title deadline');

  if (!closing.length) return;

  // O(1) lookup instead of a linear scan per saved item.
  const byId = new Map(closing.map((c) => [c._id.toString(), c]));
  const closingIds = closing.map((c) => c._id);

  // Only un-reminded saves (idempotency).
  const saved = await SavedInternship.find({
    internshipId: { $in: closingIds },
    deadlineReminderSentAt: null,
  })
    .populate('studentId', 'userId')
    .limit(5000);

  let sent = 0;
  for (const item of saved) {
    const student = item.studentId as unknown as { userId?: unknown };
    const internship = byId.get(item.internshipId.toString());
    if (!student?.userId || !internship) continue;

    await createNotification({
      userId: student.userId as never,
      type: NotificationType.SYSTEM,
      title: 'Deadline approaching',
      body: `"${internship.title}" closes soon. Apply before the deadline.`,
      data: { internshipId: internship._id },
    });
    item.deadlineReminderSentAt = new Date();
    await item.save();
    sent += 1;
  }
  logger.info(`Sent ${sent} deadline reminders`);
}
