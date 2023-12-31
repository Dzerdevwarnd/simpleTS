import { Request, Response, Router } from 'express'
import { videosRepository } from '../Repositories/videos-repository'

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

import { videos } from '../Repositories/videos-repository'

export const videosRouter = Router({})

videosRouter.get('/', (req: Request, res: Response): void => {
	res.status(200).send(videos)
})

videosRouter.get(
	'/:id',
	(req: RequestWithParams<{ id: number }>, res: Response): void => {
		const foundVideo = videosRepository.findVideo(+req.params.id)
		if (!foundVideo) {
			res.sendStatus(404)
			return
		} else {
			res.status(200).send(foundVideo)
			return
		}
	}
)

videosRouter.post(
	'/',
	(
		req: RequestWithBody<{
			title: string
			author: string
			availableResolutions: AvailableResolutions[]
		}>,
		res: Response
	): void => {
		let errors: ErrorType = {
			errorsMessages: [],
		}
		let { title, author, availableResolutions } = req.body

		if (!title || !title.length || title.trim().length > 40) {
			errors.errorsMessages.push({ message: 'Invalid title', field: 'title' })
		}

		if (!author || !author.length || author.trim().length > 20) {
			errors.errorsMessages.push({ message: 'Invalid author', field: 'author' })
		}

		if (Array.isArray(availableResolutions)) {
			availableResolutions.map((r: AvailableResolutions): void => {
				!AvailableResolutions[r] &&
					errors.errorsMessages.push({
						message: 'Invalid availableResolutions',
						field: 'availableResolutions',
					})
			})
		} else {
			availableResolutions = []
		}

		if (errors.errorsMessages.length) {
			res.status(400).send(errors)
			return
		}

		const newVideo = videosRepository.createVideo(req.body)

		videos.push(newVideo)
		res.status(201).send(newVideo)
	}
)

videosRouter.put(
	'/:id',
	(
		req: RequestWithPB<
			{ id: number },
			{
				title: string
				author: string
				availableResolutions: AvailableResolutions[]
				canBeDownloaded: boolean
				minAgeRestriction: number
				publicationDate: string
			}
		>,
		res: Response
	): void => {
		let errors: ErrorType = {
			errorsMessages: [],
		}
		let {
			title,
			author,
			availableResolutions,
			canBeDownloaded,
			minAgeRestriction,
			publicationDate,
		} = req.body

		if (!title || !title.length || title.trim().length > 40) {
			errors.errorsMessages.push({ message: 'Invalid title', field: 'title' })
		}

		if (!author || !author.length || author.trim().length > 20) {
			errors.errorsMessages.push({ message: 'Invalid author', field: 'author' })
		}

		if (Array.isArray(availableResolutions)) {
			availableResolutions.map((r: AvailableResolutions): void => {
				!AvailableResolutions[r] &&
					errors.errorsMessages.push({
						message: 'Invalid availableResolutions',
						field: 'availableResolutions',
					})
			})
		} else {
			availableResolutions = []
		}

		if (!canBeDownloaded || typeof canBeDownloaded !== 'boolean') {
			errors.errorsMessages.push({
				message: 'Invalid canBeDownloaded',
				field: 'canBeDownloaded',
			})
		}

		if (
			!minAgeRestriction ||
			minAgeRestriction > 18 ||
			minAgeRestriction < 1 ||
			typeof minAgeRestriction !== 'number'
		) {
			errors.errorsMessages.push({
				message: 'Invalid Age',
				field: 'minAgeRestriction',
			})
		}

		if (!publicationDate || !publicationDate.length) {
			errors.errorsMessages.push({
				message: 'Invalid publicationDate',
				field: 'publicationDate',
			})
		}

		if (errors.errorsMessages.length) {
			res.status(400).send(errors)
			return
		}

		let video = videosRepository.updateVideo(req.body, req.params)
		if (video) {
			res.status(204).send(video)
			return
		} else {
			res.sendStatus(404)
			return
		}
	}
)

videosRouter.delete(
	'/:id',
	(req: RequestWithParams<{ id: number }>, res: Response): void => {
		let result = videosRepository.deleteVideo(req.params)
		if (!result) {
			res.sendStatus(404)
			return
		} else {
			res.send(204)
			return
		}
	}
)
