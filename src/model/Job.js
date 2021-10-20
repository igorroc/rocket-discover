let data = [
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
]

module.exports = {
	get() {
		return data
	},
	set(newData) {
		data = newData
	},
	delete(id) {
		data = data.filter((job) => Number(job.id) !== Number(id))
	},
}
