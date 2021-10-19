const Modal = {
	open() {
		document.querySelector(".modal-overlay").classList.add("active")
	},
	close() {
		document.querySelector(".modal-overlay").classList.remove("active")
	},
}

const Storage = {
	get() {
		return (
			JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
		)
	},
	set(transactions) {
		localStorage.setItem(
			"dev.finances:transactions",
			JSON.stringify(transactions)
		)
	},
}

const Transaction = {
	all: Storage.get(),
	incomes() {
		let incomes = 0

		Transaction.all.forEach((t) => {
			if (t.amount > 0) incomes += t.amount
		})

		return incomes
	},
	expenses() {
		let expenses = 0

		Transaction.all.forEach((t) => {
			if (t.amount < 0) expenses += t.amount
		})

		return expenses
	},
	total() {
		return Transaction.incomes() + Transaction.expenses()
	},
	add(transaction) {
		Transaction.all.push(transaction)
		App.reload()
	},
	remove(index) {
		Transaction.all.splice(index, 1)
		App.reload()
	},
}

const DOM = {
	transactionContainer: document.querySelector("#data-table tbody"),
	addTransaction(transaction, index) {
		const tr = document.createElement("tr")
		tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
		tr.dataset.index = index

		DOM.transactionContainer.appendChild(tr)
	},
	innerHTMLTransaction(transaction, index) {
		const CSSClass = transaction.amount > 0 ? "income" : "expanse"

		const amount = Utils.formatCurrent(transaction.amount)

		const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSClass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação" />
            </td>
        `

		return html
	},
	updateBalance() {
		document.querySelector("#incomeDisplay").innerHTML =
			Utils.formatCurrent(Transaction.incomes())
		document.querySelector("#expenseDisplay").innerHTML =
			Utils.formatCurrent(Transaction.expenses())
		document.querySelector("#totalDisplay").innerHTML = Utils.formatCurrent(
			Transaction.total()
		)
		this.changeTotalColor()
	},
	changeTotalColor() {
		const total = document.querySelector(".card.total")

		Transaction.total() >= 0
			? total.classList.add("positive")
			: total.classList.remove("positive")
	},
	clearTransactions() {
		DOM.transactionContainer.innerHTML = ""
	},
}

const Utils = {
	formatCurrent(value) {
		const signal = Number(value) < 0 ? "-" : ""

		value = String(value).replace(/\D/g, "")

		value = Number(value) / 100

		value = value.toLocaleString("pt-BR", {
			style: "currency",
			currency: "BRL",
		})

		return signal + value
	},
	formatAmount(amount) {
		amount = Number(amount) * 100
		return Math.round(amount)
	},
	formatDate(date) {
		const splittedDate = date.split("-")
		return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
	},
}

const Form = {
	description: document.querySelector("input#description"),
	amount: document.querySelector("input#amount"),
	date: document.querySelector("input#date"),

	getValues() {
		return {
			description: this.description.value,
			amount: this.amount.value,
			date: this.date.value,
		}
	},
	validateFields() {
		const { description, amount, date } = this.getValues()

		if (
			description.trim() === "" ||
			amount.trim() === "" ||
			date.trim() === ""
		) {
			throw new Error("Por favor, preencha todos os campos.")
		}
	},
	formatData() {
		let { description, amount, date } = this.getValues()

		amount = Utils.formatAmount(amount)
		date = Utils.formatDate(date)

		return {
			description,
			amount,
			date,
		}
	},
	clearInputs() {
		this.description.value = ""
		this.amount.value = ""
		this.date.value = ""
	},
	saveTransaction(transaction) {
		Transaction.add(transaction)
	},
	submit(event) {
		event.preventDefault()

		try {
			this.validateFields()
			const transaction = this.formatData()
			this.saveTransaction(transaction)
			this.clearInputs()
			Modal.close()
		} catch (err) {
			alert(err.message)
		}
	},
}

const App = {
	init() {
		Transaction.all.forEach(DOM.addTransaction)

		DOM.updateBalance()

		Storage.set(Transaction.all)
	},
	reload() {
		DOM.clearTransactions()
		App.init()
	},
}

App.init()
