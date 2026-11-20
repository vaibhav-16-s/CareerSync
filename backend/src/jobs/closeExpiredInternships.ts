import { Internship } from '../models/Internship';
import { InternshipStatus } from '../types';
import { logger } from '../config/logger';

export async function closeExpiredInternships(): Promise<void> {
  const now = new Date();
  const result = await Internship.updateMany(
    { status: InternshipStatus.ACTIVE, deadline: { $lt: now } },
    { $set: { status: InternshipStatus.CLOSED } }
  );
  if (result.modifiedCount > 0) {
    logger.info(`Closed ${result.modifiedCount} expired internships`);
  }
}
