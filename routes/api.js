'use strict';
const axios = require('axios');
const User = require('../models/User');

const stockUrl =
	'https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock';

module.exports = function(app) {
	app.route('/api/stock-prices').get(async (req, res) => {
		const { stock, like } = req.query;
    try {      
      if (!stock) return res.json('required field missing');
    
      const ip = req.header['x-forwarded-for'] || req.connection.remoteAddress;
      let user = await fetchUser(ip);
      if (!user) user = await createUser(ip);
    
      if (like) await updateLike(user, stock);

      let stockData
      if (typeof stock === 'string') stockData = await getStock(stock);
      else if(typeof stock === 'object') stockData = await getStockArr(stock);

      res.json({ stockData });
    } catch (error) {
      console.error(error.message)
    }
	});
};

const updateLike = async (user, stock) => {
	try {
		if (typeof stock === 'object') {
      stock.forEach(async Stock => {
        const isLiked = checkLikes(user, Stock)
        if(isLiked) return
        await addStockToLikes(user, Stock)
      })      
    }
		else if (typeof stock === 'string'){
      const isLiked = checkLikes(user, stock)
      if(isLiked) return
			await addStockToLikes(user, stock)
    }    
	} catch (error) {
		console.error(error.message);
	}
};

const addStockToLikes = async (user, stock) => {
  const userId = user._id
  try {
    const newLikes = [
				...user.likes,
				stock.toUpperCase()
			];
    
    const query = { likes: newLikes };
		await User.findByIdAndUpdate(userId, query, { runValidators: true });
  } catch (error) {
    console.error(error.message)
  }  
}

const getStockArr = async stock => {
	try {
		const stock1 = stock[0].toUpperCase();
		const stock2 = stock[1].toUpperCase();
		const res1 = await axios.get(`${stockUrl}/${stock1}/quote`);
		const res2 = await axios.get(`${stockUrl}/${stock2}/quote`);

		const res1Likes = await User.find({ likes: { $in: [stock1] } }).exec();
		const res2Likes = await User.find({ likes: { $in: [stock2] } }).exec();
		const relLikes1 = res1Likes.length - res2Likes.length;
		const relLikes2 = res2Likes.length - res1Likes.length;
		return [
			{
				stock: res1.data.symbol,
				price: res1.data.latestPrice,
				rel_likes: relLikes1
			},
			{
				stock: res2.data.symbol,
				price: res2.data.latestPrice,
				rel_likes: relLikes2
			}
		];
	} catch (error) {
		console.error(error.message);
	}
};

const getStock = async stock => {
	try {
		const Stock = stock.toUpperCase();
		const res = await axios.get(`${stockUrl}/${Stock}/quote`);
		const resLikes = await User.find({ likes: { $in: [Stock] } }).exec();
		return {
			stock: res.data.symbol,
			price: res.data.latestPrice,
			likes: resLikes.length
		};
	} catch (error) {
		console.error(error.message);
	}
};

const fetchUser = async ip => {
	try {
		const username = generateUsername(ip);
		const user = await User.findOne({ ip: username }).exec();
		if (!user) return null;

		return user;
	} catch (error) {
		console.log(error.message);
	}
};

const createUser = async ip => {
	try {
		const username = generateUsername(ip);
		const user = new User({ ip: username });
		const newUser = await user.save();

		return newUser;
	} catch (error) {
		console.error(error.message);
	}
};

const checkLikes = (user, stock) => (user.likes.includes(stock.toUpperCase()))
const generateUsername = ip =>
	ip
		.split(/\.|:/)
		.filter(String)
		.join('x');
