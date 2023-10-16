import serverless from 'serverless-http'
import express, { Router } from "express"

const api = express()
const router = Router()
api.use("/api/", router)

export const handler = serverless(api)