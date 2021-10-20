const Database = require("./config")

const initDB = {
	async init() {
		const db = await Database()

		await db.exec(`CREATE TABLE profile(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            avatar TEXT,
            monthlyBudget INT,
            hoursPerDay INT,
            daysPerWeek INT,
            vacationPerYear INT,
            hourValue INT
            )
        `)

		await db.exec(`CREATE TABLE jobs(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            dailyHours INT,
            totalHours INT,
            createdAt DATETIME
            )
        `)

		await db.run(`INSERT INTO profile (
            name,
            avatar,
            monthlyBudget,
            hoursPerDay,
            daysPerWeek,
            vacationPerYear
            ) VALUES (
                "Igor Rocha",
                "https://github.com/igorroc.png",
                3000,
                5,
                4,
                12
            );
        `)

		await db.run(`INSERT INTO jobs (
            name,
            dailyHours,
            totalHours,
            createdAt
            ) VALUES (
                "GuiaServe",
                2,
                1,
                1617514376018
            );
        `)

		await db.run(`INSERT INTO jobs (
            name,
            dailyHours,
            totalHours,
            createdAt
            ) VALUES (
                "TecnoJR",
                3,
                47,
                1617524376018
            )
        `)

		await db.close()
	},
}

initDB.init()
