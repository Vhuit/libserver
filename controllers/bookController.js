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

// get all books to API
exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find()
      .populate('authors', '_id authorName')
      .populate('subjects', '_id subjectName')
      .populate('languages', '_id language');
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

// update book by ID from PUT request
exports.updateBook = async (req, res, next) => {
  try {
    const body = req.body;
    const updateBook = await Book.findById(req.params.id);
    if (!updateBook) {
      return res.status(404).json({ error: "Book not found" });
    }
    const existing = await Book.findOne({
      title: { $regex: new RegExp(body.title, 'i') },
      isbn: body.isbn,
      callNumber: body.callNumber,
      seriesTitle: body.seriesTitle,
      authors: body.authors,
      subjects: body.subjects
    })
    if (existing && existing._id.toString() !== req.params.id) {
      return res.status(404).json({ error: "The same information exists" })
    }
    updateBook.title = body.title;
    updateBook.isbn = body.isbn;
    updateBook.callNumber = body.callNumber;
    updateBook.publishedYear = body.publishedYear;
    updateBook.collation = body.collation;
    updateBook.classification = body.classification;
    updateBook.contentType = body.contentType;
    updateBook.mediaType = body.mediaType;
    updateBook.carrierType = body.carrierType;
    updateBook.edition = body.edition;
    updateBook.specialDetailInfo = body.specialDetailInfo;
    updateBook.statementOfResp = body.statementOfResp;
    updateBook.fileAttached = body.fileAttached;
    updateBook.authors = body.authors;
    updateBook.subjects = body.subjects;
    updateBook.languages = body.languages;
    updateBook.updatedAt = Date.now();
    await updateBook.save();
    res.status(200).json(updateBook);
  } catch (error) {
    next(error);
  }
};

// delete a book by ID
exports.deleteBook = async (req, res, next) => {
  try {
    const deleteBook = await Book.findByIdAndDelete(
      req.params.id
    );
    if (!deleteBook)
      return res.status(404).json("Book not found");
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    next(error);
  }
}

// Find a book by its ID
exports.getBookByID = async (req, res, next) => {
  try {
    const findBookByID = await Book.findById(req.params.id)
      .populate('authors', '_id authorName')
      .populate('subjects', '_id subjectName')
      .populate('languages', '_id language');
    if (!findBookByID)
      return res.status(404).json({ error: "Book not found" });
    res.status(200).json(findBookByID);
  } catch (error) {
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
    next(error);
  }
}

// get book by ISBN
exports.getBookByISBN = async (req, res, next) => {
  try {
    const bookFound = await Book.find({
      isbn: req.params.isbn
    }).populate('authors', '_id authorName')
      .populate('subjects', '_id subjectName')
      .populate('languages', '_id language');
    if (!bookFound.length) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json(bookFound);
  } catch (error) {
    next(error);
  }
}

// get Book by call number
exports.getBookByCallNumber = async (req, res, next) => {
  try {
    const bookFound = await Book.find({
      callNumber: req.params.callN
    }).populate('authors', '_id authorName')
      .populate('subjects', '_id subjectName')
      .populate('languages', '_id language');
    if (!bookFound.length) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json(bookFound);
  } catch (error) {
    next(error);
  }
}

// get books by author ID
exports.getBooksByAuthorID = async (req, res, next) => {
  try {
    const books = await Book.find({
      authors: req.params.auID
    }).populate('authors', '_id authorName')
      .populate('subjects', '_id subjectName')
      .populate('languages', '_id language');
    if (!books.length) {
      return res.status(404).json({ error: "Books not found" });
    }
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
}

// get books by subject ID
exports.getBooksBySubjectID = async (req, res, next) => {
  try {
    const books = await Book.find({
      subjects: req.params.subjD
    }).populate('authors', '_id authorName')
      .populate('subjects', '_id subjectName')
      .populate('languages', '_id language');
    if (!books.length) {
      return res.status(404).json({ error: "Books not found" });
    }
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
}

// get books by language ID
exports.getBooksByLanguageID = async (req, res, next) => {
  try {
    const books = await Book.find({
      languages: req.params.lang
    }).populate('authors', '_id authorName')
      .populate('subjects', '_id subjectName')
      .populate('languages', '_id language');
    if (!books.length) {
      return res.status(404).json({ error: "Books not found" });
    }
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
}

// get books by publisher ID
exports.getBooksByPublisherID = async (req, res, next) => {
  try {
    const books = await Book.find({
      publisherID: req.params.pubID
    }).populate('authors', '_id authorName')
      .populate('subjects', '_id subjectName')
      .populate('languages', '_id language');
    if (!books.length) {
      return res.status(404).json({ error: "Books not found" });
    }
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
}

// get books by published year
exports.getBooksByPublishedYear = async (req, res, next) => {
  try {
    const books = await Book.find({
      publishedYear: req.params.pubYear
    }).populate('authors', '_id authorName')
      .populate('subjects', '_id subjectName')
      .populate('languages', '_id language');
    if (!books.length) {
      return res.status(404).json({ error: "Books not found" });
    }
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
}

// get books by classification
exports.getBooksByClassification = async (req, res, next) => {
  try {
    const books = await Book.find({
      classification: req.params.class
    }).populate('authors', '_id authorName')
      .populate('subjects', '_id subjectName')
      .populate('languages', '_id language');
    if (!books.length) {
      return res.status(404).json({ error: "Books not found" });
    }
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
}

// get books by series title
exports.getBooksBySeriesTitle = async (req, res, next) => {
  try {
    const books = await Book.find({
      seriesTitle: req.params.sTitle
    }).populate('authors', '_id authorName')
      .populate('subjects', '_id subjectName')
      .populate('languages', '_id language');
    if (!books.length) {
      return res.status(404).json({ error: "Books not found" });
    }
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
} // Checking again
