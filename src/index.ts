import express, { Request, Response } from 'express'

export const app = express()
const port = process.env.PORT || 3004

app.use(express.json())

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

const videos: any[] = [
	{
		id: 1,
		title: 'test',
		author: 'string',
		canBeDownloaded: true,
		minAgeRestriction: null,
		createdAt: '2023-09-15T08:36:39.218Z',
		publicationDate: '2023-09-15T08:36:39.218Z',
		availableResolutions: [AvailableResolutions.P144],
	},
]

app.get('/videos', (req: Request, res: Response): void => {
	res.status(200).send(videos)
})

app.get(
	'/videos/:id',
	(req: RequestWithParams<{ id: number }>, res: Response): void => {
		const id: number = +req.params.id
		const video: VideoType | undefined = videos.find(
			(video): boolean => video.id === id
		)
		if (!video) {
			res.sendStatus(404)
			return
		}
		res.send(video)
	}
)

app.post(
	'/videos',
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

		const createdAt: Date = new Date()
		let publicationDate: Date = new Date()

		publicationDate.setDate(createdAt.getDate() + 1)

		const newVideo: VideoType = {
			id: +new Date(),
			canBeDownloaded: false,
			minAgeRestriction: null,
			createdAt: createdAt.toISOString(),
			publicationDate: publicationDate.toISOString(),
			title,
			author,
			availableResolutions,
		}

		videos.push(newVideo)
		res.status(201).send(newVideo)
	}
)

app.put(
	'/videos/:id',
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

		const id: number = +req.params.id
		let video: VideoType = videos.find((video): boolean => video.id === id)
		if (video) {
			video.title = title
			video.author = author
			video.availableResolutions = availableResolutions
			video.canBeDownloaded = canBeDownloaded
			video.minAgeRestriction = minAgeRestriction
			video.publicationDate = publicationDate
			res.status(204).send(video)
			return
		} else {
			res.sendStatus(404)
			return
		}
	}
)

app.delete(
	'/videos/:id',
	(req: RequestWithParams<{ id: number }>, res: Response): void => {
		const id: number = +req.params.id
		let video: VideoType | undefined = videos.find(
			(video): boolean => video.id === id
		)
		let index: number = videos.findIndex(n => n.id === id)
		if (!video) {
			res.sendStatus(404)
			return
		} else {
			videos.splice(index, 1)
			res.send(204)
			return
		}
	}
)

app.delete('/testing/all-data', (req: Request, res: Response): void => {
	if (!videos) {
		res.sendStatus(404)
		return
	} else {
		videos.splice(0, videos.length)
		res.send(204)
		return
	}
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
