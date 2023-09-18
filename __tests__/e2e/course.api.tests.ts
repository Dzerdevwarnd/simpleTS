import request from 'supertest'
import { app } from '../../src'
describe('/products	 ', () => {
	it('should', async () => {
		await request(app)
			.get('/videos')
			.expect(200, [
				{
					id: 1,
					title: 'test',
					author: 'string',
					canBeDownloaded: true,
					minAgeRestriction: null,
					createdAt: '2023-09-15T08:36:39.218Z',
					publicationDate: '2023-09-15T08:36:39.218Z',
					availableResolutions: ['P144'],
				},
			])
	})
})
