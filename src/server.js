const express = require("express")
const server = express()
const routes = require("./routes")
const path = require("path")

// Usar template engine
server.set("view engine", "ejs")

// Mudar a pasta views
server.set("views", path.join(__dirname, "views"))

// Habilitar arquivos estaticos
server.use(express.static("public"))

// Usar o req.body
server.use(express.urlencoded({ extended: true }))

// Puxar as rotas
server.use(routes)

server.listen(3000, () => console.log("🚀 Server is running on http://localhost:3000"))
