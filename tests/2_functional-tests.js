const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const route = '/api/stock-prices';

suite('Functional Tests', function() {
	let stockLike = 0;
	test('Viewing one stock: GET request to /api/stock-prices/', done => {
		const stockReq = 'goog';
		const request = `?stock=${stockReq}`;
		chai
			.request(server)
			.get(`${route}${request}`)
			.end((err, res) => {
				assert.isNull(err);
				assert.equal(res.status, 200, 'must be a successfull request');
				assert.equal(res.type, 'application/json', 'reponse must be json');
				assert.isObject(res.body, 'response must be an object');
				assert.property(
					res.body,
					'stockData',
					'body must have an property called stockData'
				);
				const stockData = res.body.stockData;
				assert.isObject(stockData, 'stockData must be an Object');
				assert.property(
					stockData,
					'stock',
					'stockData must have a property of stock'
				);
				assert.property(
					stockData,
					'price',
					'stockData must have a property of price'
				);
				assert.property(
					stockData,
					'likes',
					'stockData must have a property of likes'
				);
				const { stock, price, likes } = stockData;
				assert.isString(stock, 'stock must be a string');
				assert.equal(
					stock,
					stockReq.toUpperCase(),
					`stock must be what has been requested for: ${stockReq.toUpperCase()}`
				);
				assert.isNumber(price, 'price must be a number');
				assert.isNumber(likes, 'likes must be a number');
				stockLike = likes;
				done();
			});
	});

	test('Viewing one stock and liking it: GET request to /api/stock-prices/', done => {
		const stockReq = 'goog';
		const request = `?stock=${stockReq}&like=true`;
		chai
			.request(server)
			.get(`${route}${request}`)
			.end((err, res) => {
				assert.isNull(err);
				assert.equal(res.status, 200, 'must be a successfull request');
				assert.equal(res.type, 'application/json', 'reponse must be json');
				assert.isObject(res.body, 'response must be an object');
				assert.property(
					res.body,
					'stockData',
					'body must have an property called stockData'
				);
				const stockData = res.body.stockData;
				assert.isObject(stockData, 'stockData must be an Object');
				assert.property(
					stockData,
					'stock',
					'stockData must have a property of stock'
				);
				assert.property(
					stockData,
					'price',
					'stockData must have a property of price'
				);
				assert.property(
					stockData,
					'likes',
					'stockData must have a property of likes'
				);
				const { stock, price, likes } = stockData;
				assert.isString(stock, 'stock must be a string');
				assert.equal(
					stock,
					stockReq.toUpperCase(),
					`stock must be what has been requested for: ${stockReq.toUpperCase()}`
				);
				assert.isNumber(price, 'price must be a number');
				assert.isNumber(likes, 'likes must be a number');
				assert.equal(
					likes,
					stockLike + 1,
					'likes must have been increased by now'
				);
				stockLike++;
				done();
			});
	});

	test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', done => {
		const stockReq = 'goog';
		const request = `?stock=${stockReq}&like=true`;
		chai
			.request(server)
			.get(`${route}${request}`)
			.end((err, res) => {
				assert.isNull(err);
				assert.equal(res.status, 200, 'must be a successfull request');
				assert.equal(res.type, 'application/json', 'reponse must be json');
				assert.isObject(res.body, 'response must be an object');
				assert.property(
					res.body,
					'stockData',
					'body must have an property called stockData'
				);
				const stockData = res.body.stockData;
				assert.isObject(stockData, 'stockData must be an Object');
				assert.property(
					stockData,
					'stock',
					'stockData must have a property of stock'
				);
				assert.property(
					stockData,
					'price',
					'stockData must have a property of price'
				);
				assert.property(
					stockData,
					'likes',
					'stockData must have a property of likes'
				);
				const { stock, price, likes } = stockData;
				assert.isString(stock, 'stock must be a string');
				assert.equal(
					stock,
					stockReq.toUpperCase(),
					`stock must be what has been requested for: ${stockReq.toUpperCase()}`
				);
				assert.isNumber(price, 'price must be a number');
				assert.isNumber(likes, 'likes must be a number');
				assert.equal(
					likes,
					stockLike,
					'likes must not have increased for the second time'
				);
				done();
			});
	});

	test('Viewing two stocks: GET request to /api/stock-prices/', done => {
		const stockReq1 = 'aapl',
			stockReq2 = 'tsla';
		const request = `?stock=${stockReq1}&stock=${stockReq2}`;
		chai
			.request(server)
			.get(`${route}${request}`)
			.end((err, res) => {
				assert.isNull(err);
				assert.equal(res.status, 200, 'must be a successfull request');
				assert.equal(res.type, 'application/json', 'reponse must be json');
				assert.isObject(res.body, 'response must be an object');
				assert.property(
					res.body,
					'stockData',
					'body must have an property called stockData'
				);
				const StockData = res.body.stockData;
				assert.isArray(StockData, 'stockData must be an Array');
				assert.equal(
					StockData.length,
					2,
					'stockData must have data about two stocks'
				);
				StockData.forEach(stockData => {
					assert.property(
						stockData,
						'stock',
						'stockData must have a property of stock'
					);
					assert.property(
						stockData,
						'price',
						'stockData must have a property of price'
					);
					assert.property(
						stockData,
						'rel_likes',
						'stockData must have a property of rel_likes'
					);
					const { stock, price, rel_likes } = stockData;
					assert.isString(stock, 'stock must be a string');
					assert.isNumber(price, 'price must be a number');
					assert.isNumber(rel_likes, 'rel_likes must be a number');
				});
				assert.equal(
					StockData[0].stock,
					stockReq1.toUpperCase(),
					`stock must be what has been requested for: ${stockReq1.toUpperCase()}`
				);
				assert.equal(
					StockData[1].stock,
					stockReq2.toUpperCase(),
					`stock must be what has been requested for: ${stockReq2.toUpperCase()}`
				);
				done();
			});
	});

	test('Viewing two stocks and liking them: GET request to /api/stock-prices/', done => {
		const stockReq1 = 'aapl',
			stockReq2 = 'tsla';
		const request = `?stock=${stockReq1}&stock=${stockReq2}&like=true`;
		chai
			.request(server)
			.get(`${route}${request}`)
			.end((err, res) => {
				assert.isNull(err);
				assert.equal(res.status, 200, 'must be a successfull request');
				assert.equal(res.type, 'application/json', 'reponse must be json');
				assert.isObject(res.body, 'response must be an object');
				assert.property(
					res.body,
					'stockData',
					'body must have an property called stockData'
				);
				const StockData = res.body.stockData;
				assert.isArray(StockData, 'stockData must be an Array');
				assert.equal(
					StockData.length,
					2,
					'stockData must have data about two stocks'
				);
				StockData.forEach(stockData => {
					assert.property(
						stockData,
						'stock',
						'stockData must have a property of stock'
					);
					assert.property(
						stockData,
						'price',
						'stockData must have a property of price'
					);
					assert.property(
						stockData,
						'rel_likes',
						'stockData must have a property of rel_likes'
					);
					const { stock, price, rel_likes } = stockData;
					assert.isString(stock, 'stock must be a string');
					assert.isNumber(price, 'price must be a number');
					assert.isNumber(rel_likes, 'rel_likes must be a number');
				});
				assert.equal(
					StockData[0].stock,
					stockReq1.toUpperCase(),
					`stock must be what has been requested for: ${stockReq1.toUpperCase()}`
				);
				assert.equal(
					StockData[1].stock,
					stockReq2.toUpperCase(),
					`stock must be what has been requested for: ${stockReq2.toUpperCase()}`
				);
				done();
			});
	});
});
