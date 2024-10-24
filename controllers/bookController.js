const Book = require("../models/Book");
const { addAuthors } = require("./authorController");
const { addSubjects } = require("./subjectController");
const { addLanguages } = require("./languageController");
const { default: mongoose } = require("mongoose");

// add new book
exports.addBook = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Destructure book information and authors from the request body
    const {
      title,
      authors = [],
      isbn,
      callNumber,
      publishedYear,
      publisherID,
      collation,
      classification,
      contentType,
      mediaType,
      carrierType,
      edition,
      specialDetailInfo,
      statementOfResp,
      fileAttached,
      subjects = [],
      languages = []
    } = req.body;

    // Check if the book already exists
    const existingBook = await Book.findOne({
      $or: [ // Check if any of these fields match
        { title: title },
        { isbn: isbn },
        { callNumber: callNumber }]
    }).session(session);
    if (existingBook) {
      await session.abortTransaction();
      return res.status(409).json({ error: 'Book already exists' });
    }
    // Add authors and subjects, and retrieve their ObjectIds 
    const savedAuthors = await addAuthors(session, authors, next);
    const authorIDs = savedAuthors.map(author => author._id);  // Extract author IDs

    const savedSubjects = await addSubjects(session, subjects, next);
    const subjectIDs = savedSubjects.map(subject => subject._id);  // Extract subject IDs

    const savedLanguages = await addLanguages(session, languages, next);
    const languageIDs = savedLanguages.map(language => language._id);  // Extract language IDs

    // Create and save the book with referenced author and subject IDs
    const newBook = new Book({
      title,
      isbn,
      callNumber,
      publishedYear,
      publisherID,
      collation,
      classification,
      contentType,
      mediaType,
      carrierType,
      edition,
      specialDetailInfo,
      statementOfResp,
      fileAttached,
      languages: languageIDs, // Add the array of language IDs as references
      authors: authorIDs, // Add the array of author IDs as references
      subjects: subjectIDs // Add the array of subject IDs as references
    });

    await newBook.save({ session });

    // Commit the transaction if everything is successful
    await session.commitTransaction();

    // Return the new book document
    res.status(201).json(newBook);

  } catch (error) {

    // Rollback the transaction in case of an error, remove all changes
    await session.abortTransaction();

    // Return error message to client
    res.status(500).json({ error: error.message });
    throw error;
  } finally {
    // Close the session.
    session.endSession();
  }
};


exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find()
      .populate('authors', '_id authorName')
      .populate('subjects', '_id subjectName')
      .populate('languages', '_id language');
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
    next(error);
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const updateBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updateBook) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json(updateBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
    next(error);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const deleteBook = await Book.findByIdAndDelete(
      req.params.id
    );
    if (!deleteBook)
      return res.status(404).json("Book not found");
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
    next(error);
  }
}

exports.getBookByID = async (req, res, next) => {
  try {
    const findBookByID = await Book.findById(req.params.id);
    if (!findBookByID)
      return res.status(404).json({ error: "Book not found" });
    res.status(200).json(findBookByID);
  } catch (error) {
    res.status(500).json({ error: error.message });
    next(error);
  }
}

// get book by title (case insensitive - not exact match)
exports.getBookByTitle = async (req, res, next) => {
  try {
    const bookFound = await Book.find({
      title: { $regex: new RegExp(req.params.title, 'i') }
    }).populate('authors', '_id authorName')
      .populate('subjects', '_id subjectName')
      .populate('languages', '_id language');
    if (!bookFound.length) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json(bookFound);
  } catch (error) {
    res.status(500).json({ error: error.message });
    next(error);
  }
}