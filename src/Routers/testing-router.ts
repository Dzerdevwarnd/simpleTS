import { Request, Response, Router } from 'express'
import { videos } from '../Repositories/videos-repository'

export const testingRouter = Router({})

testingRouter.delete('/all-data', (req: Request, res: Response): void => {
	if (!videos || videos.length === 0) {
		res.sendStatus(404)
		return
	} else {
		videos.splice(0, videos.length)
		res.sendStatus(204)
		return
	}
})
