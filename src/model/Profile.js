let data = {
	name: "Igor Rocha",
	avatar: "https://github.com/igorroc.png",
	monthlyBudget: 5000,
	hoursPerDay: 5,
	daysPerWeek: 5,
	vacationPerYear: 4,
	hourValue: 75,
}

module.exports = {
	get() {
		return data
	},
	set(newData) {
		data = newData
	},
}
