module.exports = {
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
}
