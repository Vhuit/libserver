const BookBorrow = require('../models/BookBorrow');
const BookItem = require('../models/BookItem');
const User = require('../models/User');

exports.createTransaction = async (req, res, next) => {
    try {
        const {
            itemId,
            userId
        } = req.body;
    } catch (error) {
        next(error);
    }
}