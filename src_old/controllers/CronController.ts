import { green, yellow, white } from 'colors';
import { CronJob } from 'cron';

const cronjobs = new Map<string, CronJob>();
export class CronController {
	/**
	 * Adds and starts a new cron job
	 */
	public static async addCron(
		job_id: string,
		cronTime: string,
		onTick: () => unknown,
	) {
		const job = CronJob.from({
			cronTime,
			onTick: async () => {
				console.info(`Running cron ${job_id} (${cronTime})`);
				onTick();
			},
			start: true,
		});
		cronjobs.set(job_id, job);
		console.info(
			green(`Registered cron ${white(job_id)} (${yellow(cronTime)})`),
		);
	}
	/**
	 * Pauses a cron job by its ID
	 */
	public static async pauseCron(job_id: string) {
		console.info(`Pausing cron ${job_id}`);
		const job = cronjobs.get(job_id);
		if (job == null) return false;
		await job.stop();
		return true;
	}
	/**
	 * Resumes a paused cron job by its ID
	 */
	public static async resumeCron(job_id: string) {
		console.info(`Resuming cron ${job_id}`);
		const job = cronjobs.get(job_id);
		if (job == null) return false;
		job.start();
		return true;
	}
	/**
	 * Removes a cron job by its ID
	 */
	public static async removeCron(job_id: string) {
		console.info(`Removing cron ${job_id}`);
		const job = cronjobs.get(job_id);
		if (job == null) return false;
		await job.stop();
		cronjobs.delete(job_id);
		console.info(`Removed cron ${job_id}`);
		return true;
	}
	/**
	 * Returns all registered cron jobs
	 */
	public static get jobs() {
		return cronjobs;
	}
}
