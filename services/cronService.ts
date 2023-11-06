import cron from "node-cron";

export const scheduleTask = (time:string, fn: () => void) => {
	cron.schedule(time, function () {
		fn();
	  });
}