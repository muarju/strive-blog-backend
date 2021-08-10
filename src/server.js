import express from "express"
import listEndpoints from "express-list-endpoints"
import authorsRouter from "./services/authors/index.js"

const server = express()

const port = 3001

server.use(express.json())

// *************** ROUTES *****************
server.use("/authors", authorsRouter)



console.table(listEndpoints(server))

server.listen(port, () => {
  console.log("Server listening on port " + port)
})
