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
export const videos: any[] = [
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

export const videosRepository = {
	findVideo(id: number | null) {
		let video: VideoType | undefined = videos.find(
			(video): boolean => video.id === id
		)
		if (video) {
			return video
		} else {
			return
		}
	},
	createVideo(body: {
		title: string
		author: string
		availableResolutions: AvailableResolutions[]
	}) {
		const createdAt: Date = new Date()
		let publicationDate: Date = new Date()

		publicationDate.setDate(createdAt.getDate() + 1)

		const newVideo: VideoType = {
			id: +new Date(),
			canBeDownloaded: false,
			minAgeRestriction: null,
			createdAt: createdAt.toISOString(),
			publicationDate: publicationDate.toISOString(),
			title: body.title,
			author: body.author,
			availableResolutions: body.availableResolutions,
		}
		return newVideo
	},

	updateVideo(
		body: {
			title: string
			author: string
			availableResolutions: AvailableResolutions[]
			canBeDownloaded: boolean
			minAgeRestriction: number
			publicationDate: string
		},
		params: { id: number }
	) {
		const id: number = +params.id
		let video: VideoType | undefined = videos.find(
			(video): boolean => video.id === id
		)
		if (!video) {
			return
		} else {
			video.canBeDownloaded = body.canBeDownloaded
			video.minAgeRestriction = body.minAgeRestriction
			video.publicationDate = body.publicationDate
			video.title = body.title
			video.author = body.author
			video.availableResolutions = body.availableResolutions
			return video
		}
	},
	deleteVideo(params: { id: number }) {
		const id: number = +params.id
		let video: VideoType | undefined = videos.find(
			(video): boolean => video.id === id
		)
		let index: number = videos.findIndex(n => n.id === id)
		if (!video) {
			return
		} else {
			videos.splice(index, 1)
			return 204
		}
	},
}
