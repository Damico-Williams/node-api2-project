const express = require("express")
const router = require("./router")


const server = express()
const port = 5000

server.use(express.json())
server.use(router)


server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
})