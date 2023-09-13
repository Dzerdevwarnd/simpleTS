import express, { Request, Response } from 'express'
const app = express()
const port = process.env.PORT || 3000

const products = [
	{ id: 1, title: 'tomato' },
	{ id: 2, title: 'orange' },
]
const adresses = [{ value: 'Nezalejnasti 12' }, { value: 'Selickaga 11' }]

app.get('/products', (req: Request, res: Response) => {
	if (req.query.title) {
		let searchString = req.query.title.toString()
		res.send(products.filter(p => p.title.indexOf(searchString) > -1))
	} else {
		res.send(products)
	}
})

app.get('/products/:id', (req: Request, res: Response) => {
	let product = products.find(p => p.id === +req.params.id)
	if (product) {
		res.send(product)
	} else {
		res.send(404)
	}
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
