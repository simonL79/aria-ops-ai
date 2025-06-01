
export class DeploymentScheduler {
  static calculateNextRun(frequency: string, time: string): string {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    
    let nextRun = new Date();
    nextRun.setHours(hours, minutes, 0, 0);
    
    // If the time has already passed today, schedule for next occurrence
    if (nextRun <= now) {
      switch (frequency) {
        case 'daily':
          nextRun.setDate(nextRun.getDate() + 1);
          break;
        case 'weekly':
          nextRun.setDate(nextRun.getDate() + 7);
          break;
        case 'monthly':
          nextRun.setMonth(nextRun.getMonth() + 1);
          break;
        default:
          nextRun.setDate(nextRun.getDate() + 1);
      }
    }
    
    return nextRun.toISOString();
  }
}
