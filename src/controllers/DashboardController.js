const Profile = require("../model/Profile")
const Job = require("../model/Job")
const JobUtils = require("../utils/JobUtils")

module.exports = {
	index(req, res) {
		const Jobs = Job.get()

		const statusCount = {
			progress: 0,
			done: 0,
			total: Jobs.length,
		}

		let jobTotalHours = 0
		const updatedJobs = Jobs.map((job) => {
			const remaining = JobUtils.remainingDays(job)
			const status = remaining <= 0 ? "done" : "progress"

			statusCount[status]++

			jobTotalHours =
				status == "progress"
					? jobTotalHours + Number(job.dailyHours)
					: jobTotalHours

			return {
				...job,
				remaining,
				status,
				budget: JobUtils.calculateBudget(job, Profile.get().hourValue),
			}
		})

		const freeHours = Profile.get().hoursPerDay - jobTotalHours

		return res.render("index", {
			profile: Profile.get(),
			jobs: updatedJobs,
			statusCount,
			freeHours,
		})
	},
}
