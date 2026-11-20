import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { getMetricsSnapshot } from '../config/metrics';

const STATES = ['disconnected', 'connected', 'connecting', 'disconnecting'];

// Liveness — is the process up? (used by orchestrators to restart crashed pods)
export function liveness(_req: Request, res: Response): void {
  res.status(200).json({ success: true, status: 'ok', uptime: process.uptime() });
}

// Readiness — can we serve traffic? (checks critical dependencies)
export async function readiness(_req: Request, res: Response): Promise<void> {
  const dbState = mongoose.connection.readyState;
  const dbHealthy = dbState === 1;

  let dbPingOk = false;
  if (dbHealthy && mongoose.connection.db) {
    try {
      await mongoose.connection.db.admin().ping();
      dbPingOk = true;
    } catch {
      dbPingOk = false;
    }
  }

  const ready = dbHealthy && dbPingOk;
  res.status(ready ? 200 : 503).json({
    success: ready,
    status: ready ? 'ready' : 'not_ready',
    checks: { database: { state: STATES[dbState] ?? 'unknown', ping: dbPingOk } },
  });
}

// Metrics — process + request stats for dashboards / scrapers
export function metrics(_req: Request, res: Response): void {
  res.status(200).json({ success: true, data: getMetricsSnapshot() });
}
