const BookItem = require('../models/BookItem');
const Book = require('../models/Book');

exports.getBookItems = async (req, res, next) => {
    try {
        const bookItems = await BookItem.find();
        res.status(200).json(bookItems);
    } catch (error) {
        next(error);
    }
}

exports.getBookItemByID = async (req, res, next) => {
    try {
        const bookItem = await BookItem.findById(req.params.id);
        if (!bookItem) {
            return res.status(404).json({ error: "Book Item not found" });
        }
        res.status(404).json(bookItem);
    } catch (error) {
        next(error);
    }
}

// Add a new Book Item
exports.addBookItem = async (req, res, next) => {
    try {
        const bookItem = req.body;
        const saved = await itemProcess(bookItem, next);
        res.status(201).json(saved);
    } catch (error) {
        next(error);
    }
}

const itemProcess = async (item, next) => {
    try {
        const checkItem = await BookItem.findOne({
            book: item.book._id,
            itemLabel: item.itemLabel
        })
        if (checkItem) {
            return res.status(409).json({ message: "Book Item existed" });
        }
        const book = await Book.findById(item.book._id);
        if (!book) {
            return res.status(404).json({ error: "Book does not exists in DB" });
        }
        const prepLabel = ((await BookItem.find({
            book: item.book._id
        })).length + 1).toString().padStart(3, 'I00');
        const newItem = new BookItem({
            itemLabel: prepLabel,
            book: item.book._id,
            itemStatus: item.itemStatus
        });
        const saved = await newItem.save();
        return saved;
    } catch (error) {
        next(error);
    }
}

// Add Items by number
exports.addNumberItems = async (req, res, next) => {
    try {
        const bookItems = req.body;
        let i = 0;
        const items = [];
        while (i < bookItems.items) {
            const item = await itemProcess(bookItems, next);
            items.push(item);
            i++;
        }
        res.status(201).json(items);
    } catch (error) {
        next(error)
    }
}

exports.updateItemByID = async (req, res, next) => {
    try {
        const body = req.body;
        const exist = await BookItem.findById(req.params.id);
        if (!exist) {
            return res.status(404).json({ error: "Item not found" });
        }
        exist.itemStatus = body.itemStatus;
        exist.updatedAt = Date.now();
        await exist.save();
        res.status(201).json(exist);
    } catch (error) {
        next(error);
    }
}