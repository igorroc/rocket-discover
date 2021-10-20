const Profile = require("../model/Profile")

module.exports = {
	index(req, res) {
		return res.render("profile", { profile: Profile.get() })
	},
	update(req, res) {
		const weeksPerYear = 52

		const data = req.body

		const freeWeeks = weeksPerYear - Profile.get().vacationPerYear
		const weeksPerMonth = freeWeeks / 12

		const weekTotalHours = data.hoursPerDay * data.daysPerWeek

		const monthlyTotalHours = weeksPerMonth * weekTotalHours

		data.hourValue = data.monthlyBudget / monthlyTotalHours

		Profile.set({
			...Profile.get(),
			...data,
		})

		return res.redirect("/profile")
	},
}
