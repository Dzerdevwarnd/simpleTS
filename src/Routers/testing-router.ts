import { Request, Response, Router } from 'express'

type RequestWithParams<P> = Request<P, {}, {}, {}>
type RequestWithBody<B> = Request<{}, {}, B, {}>
type RequestWithPB<P, B> = Request<P, {}, B, {}>

type ErrorMessageType = {
	message: string
	field: string
}

type ErrorType = {
	errorsMessages: ErrorMessageType[]
}

enum AvailableResolutions {
	P144 = 'P144',
	P240 = 'P240',
	P360 = 'P360',
	P480 = 'P480',
	P720 = 'P720',
	P1080 = 'P1080',
	P1440 = 'P1440',
	P2160 = 'P2160',
}

type VideoType = {
	id: number
	title: string
	author: string
	canBeDownloaded: boolean
	minAgeRestriction: number | null
	createdAt: string
	publicationDate: string
	availableResolutions: Array<AvailableResolutions>
}

import { videos } from './Videos-router'

export const testingRouter = Router({})

testingRouter.delete('/all-data', (req: Request, res: Response): void => {
	if (!videos) {
		res.sendStatus(404)
		return
	} else {
		videos.splice(0, videos.length)
		res.sendStatus(204)
		return
	}
})
