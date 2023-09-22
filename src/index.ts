import express from 'express'
import { videosRouter } from './Routers/Videos-router'
import { testingRouter } from './Routers/testing-router'

export const app = express()
const port = process.env.PORT || 3004

app.use(express.json())

app.use('/videos', videosRouter)
app.use('/testing', testingRouter)

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
