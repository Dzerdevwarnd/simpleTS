import request from 'supertest'
import { app } from '../../src/index1'
describe('/products	 ', () => {
	it('should', async () => {
		await request(app).get('/products').expect(200, [])
	})
})
