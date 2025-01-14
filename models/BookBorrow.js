const mongooese = require('mongoose');

const BookBorrowSchema = new mongooese.Schema({
    itemID: { type: mongooese.Schema.Types.ObjectId, ref: 'BookItem' },
    userID: { type: mongooese.Schema.Types.ObjectId, ref: 'User' },
    dateBorrowed: { type: Date, default: Date.now },
    dateReturn: { type: Date, default: undefined },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

module.exports = mongooese.model('BookBorrow', BookBorrowSchema);