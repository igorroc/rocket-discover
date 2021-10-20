const Job = require("../model/Job")
const JobUtils = require("../utils/JobUtils")
const Profile = require("../model/Profile")

module.exports = {
	
	create(req, res) {
		return res.render("job")
	},
	save(req, res) {
        const jobs = Job.get()
		const lastId = jobs[jobs.length - 1]?.id || 0

		const job = req.body

		job.createdAt = Date.now()
		job.dailyHours = Number(job.dailyHours)
		job.totalHours = Number(job.totalHours)

		jobs.push({
			id: lastId + 1,
			name: job.name,
			dailyHours: job.dailyHours,
			totalHours: job.totalHours,
			createdAt: job.createdAt,
		})

		return res.redirect("/")
	},
	show(req, res) {
		const jobs = Job.get()

		const jobId = req.params.id

		const job = jobs.find((job) => Number(job.id) === Number(jobId))

		if (!job) {
			return res.send("Job not found")
		}

		job.budget = JobUtils.calculateBudget(job, Profile.get().hourValue)

		return res.render("job-edit", { job })
	},
	update(req, res) {
		const jobs = Job.get()

		const jobId = req.params.id

		const job = jobs.find((job) => Number(job.id) === Number(jobId))

		if (!job) {
			return res.send("Job not found")
		}

		const updatedJob = {
			...job,
			name: req.body.name,
			totalHours: req.body.totalHours,
			dailyHours: req.body.dailyHours,
		}

		const newJobs = jobs.map((job) => {
			if (Number(job.id) === Number(jobId)) {
				job = updatedJob
			}

			return job
		})

        Job.set(newJobs)

		return res.redirect("/")
	},
	delete(req, res) {
		const jobId = req.params.id

        Job.delete(jobId)

		return res.redirect("/")
	},
}
