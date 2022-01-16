import express from "express"
import cors from "cors"
import morgan from "morgan"
import restaurants from "./api/restaurants.route.js"

const app = express()

const customToken = (tokens, req, res) =>
  JSON.stringify({
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: tokens.status(req, res),
    contentLen: tokens.res(req, res, "content-length") || "-",
    responseTime: `${tokens["response-time"](req, res)} ms`,
  })

app.use(cors())
app.use(express.json())
app.use(morgan(customToken))

app.use("/api/v1/restaurants", restaurants)
app.use("*", (_req, res) => res.status(404).json({ error: "not found" }))

export default app
