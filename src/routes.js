const express = require("express")
const routes = express.Router()

const views = __dirname + "/views/"

const Profile = {
	data: {
		name: "Igor Rocha",
		avatar: "https://github.com/igorroc.png",
		monthlyBudget: 5000,
		hoursPerDay: 5,
		daysPerWeek: 5,
		vacationPerYear: 4,
		hourValue: 75,
	},
	controllers: {
		index(req, res) {
			return res.render(views + "profile", { profile: Profile.data })
		},
		update(req, res) {
			const weeksPerYear = 52

			const data = req.body

			const freeWeeks = weeksPerYear - Profile.data.vacationPerYear
			const weeksPerMonth = freeWeeks / 12

			const weekTotalHours = data.hoursPerDay * data.daysPerWeek

			const monthlyTotalHours = weeksPerMonth * weekTotalHours

			data.hourValue = data.monthlyBudget / monthlyTotalHours

			Profile.data = {
				...Profile.data,
				...data,
			}

			return res.redirect("/profile")
		},
	},
}

const Job = {
	data: [
		{
			id: 1,
			name: "Pizzaria Guloso",
			dailyHours: 2,
			totalHours: 1,
			createdAt: Date.now(),
		},
		{
			id: 2,
			name: "OneTwo Project",
			dailyHours: 3,
			totalHours: 47,
			createdAt: Date.now(),
		},
	],
	controllers: {
		index(req, res) {
			const updatedJobs = Job.controllers.reloadJobs()

			return res.render(views + "index", {
				profile: Profile.data,
				jobs: updatedJobs,
			})
		},
		create(req, res) {
			return res.render(views + "job")
		},
		save(req, res) {
			const lastId = Job.data[Job.data.length - 1]?.id || 0

			const job = req.body

			job.createdAt = Date.now()
			job.dailyHours = Number(job.dailyHours)
			job.totalHours = Number(job.totalHours)

			Job.data.push({
				id: lastId + 1,
				name: job.name,
				dailyHours: job.dailyHours,
				totalHours: job.totalHours,
				createdAt: job.createdAt,
			})

			return res.redirect("/")
		},
		reloadJobs() {
			const updatedJobs = Job.data.map((job) => {
				const remaining = Job.services.remainingDays(job)
				const status = remaining <= 0 ? "done" : "progress"

				return {
					...job,
					remaining,
					status,
					budget: Job.services.calculateBudget(
						job,
						Profile.data.hourValue
					),
				}
			})

			return updatedJobs
		},
		show(req, res) {
			const updatedJobs = Job.controllers.reloadJobs()

			const jobId = req.params.id

			const job = updatedJobs.find(
				(job) => Number(job.id) === Number(jobId)
			)

			if (!job) {
				return res.send("Job not found")
			}

			job.budget = Job.services.calculateBudget(
				job,
				Profile.data.hourValue
			)

			return res.render(views + "job-edit", { job })
		},
		update(req, res) {
			const updatedJobs = Job.controllers.reloadJobs()

			const jobId = req.params.id

			const job = updatedJobs.find(
				(job) => Number(job.id) === Number(jobId)
			)

			if (!job) {
				return res.send("Job not found")
			}

			const updatedJob = {
				...job,
				name: req.body.name,
				totalHours: req.body.totalHours,
				dailyHours: req.body.dailyHours,
			}

			Job.data = Job.data.map((job) => {
				if (Number(job.id) === Number(jobId)) {
					job = updatedJob
				}

				return job
			})

			return res.redirect("/")
		},
		delete(req, res) {
			const updatedJobs = Job.controllers.reloadJobs()

			const jobId = req.params.id

			Job.data = Job.data.filter(
				(job) => Number(job.id) !== Number(jobId)
			)

			return res.redirect("/")
		},
	},
	services: {
		remainingDays(job) {
			const remainingDays = Number(
				(job.totalHours / job.dailyHours).toFixed()
			)
			const createdDate = new Date(job.createdAt)
			const dueDay = createdDate.getDate() + remainingDays
			const dueDate = createdDate.setDate(dueDay)
			const timeDiff = dueDate - Date.now()
			const dayInMs = 1000 * 60 * 60 * 24
			const dayDiff = Math.floor(timeDiff / dayInMs)

			return dayDiff
		},
		calculateBudget: (job, hourValue) => hourValue * job.totalHours,
	},
}

routes.get("/", Job.controllers.index)

routes.get("/job", Job.controllers.create)
routes.post("/job", Job.controllers.save)

routes.get("/job/:id", Job.controllers.show)
routes.post("/job/:id", Job.controllers.update)
routes.post("/job/delete/:id", Job.controllers.delete)

routes.get("/profile", Profile.controllers.index)
routes.post("/profile", Profile.controllers.update)

module.exports = routes
