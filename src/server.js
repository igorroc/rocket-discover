const express = require("express")
const server = express()
const routes = require("./routes")

// Usar template engine
server.set("view engine", "ejs")

// Habilitar arquivos estaticos
server.use(express.static("public"))

// Usar o req.body
server.use(express.urlencoded({ extended: true }))

// Puxar as rotas
server.use(routes)

server.listen(3000, () => console.log("🚀 Server is running on port 3000"))
