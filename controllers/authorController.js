const Author = require('../models/Author');

// Add one or more authors to the Author collection - controlled by the Book
exports.addAuthors = async (session, authors, next) => {
    try {
        // Loop through each author in the array and create new Author documents
        const savedAuthors = await Promise.all(
            authors.map(async (author) => {
                const existingAuthor = await Author.findOne({
                    authorName: author.authorName
                }).session(session);
                if (existingAuthor) {
                    return existingAuthor;
                } else {
                    const newAuthor = new Author({
                        authorName: author.authorName,
                        birthday: author.birthday,
                        authorBio: author.authorBio
                    });
                    const savedAuthor = await newAuthor.save({ session })
                    return savedAuthor;
                }
            })
            // Save each author and return the document
        )

        // Return array of saved authors (with _id fields)
        return savedAuthors;

    } catch (error) {
        console.log(error.message);
        next(error);
        throw error;
    }
};

// Add author separatedly
exports.addAuthor = async (req, res, next) => {
    try {
        const {
            authorName,
            birthday,
            authorBio
        } = req.body;

        // Check if the author already exists
        const existingAuthor = await Author.findOne({
            authorName,
            birthday
        });
        if (existingAuthor) {
            return res.status(409).json("Author already exists");
        }

        const newAuthor = new Author({
            authorName,
            birthday,
            authorBio
        });

        await newAuthor.save();
        res.status(201).json(newAuthor);
    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error);
    }
}

// Get all Author
exports.getAuthors = async (req, res, next) => {
    try {
        const authors = await Author.find();
        res.status(200).json(authors);
    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error);
    }
}

// Update Author by ID
exports.updateAuthor = async (req, res, next) => {
    try {
        const updatingBody = req.body;
        const updateAuthor = await Author.findById(req.params.id);
        if (!updateAuthor)
            return res.status(404).json("Author not found");
        updateAuthor.authorName = updatingBody.authorName;
        updateAuthor.birthday = updatingBody.birthday;
        updateAuthor.authorBio = updatingBody.authorBio;
        updateAuthor.updatedAt = Date.now();
        await updateAuthor.save();
        res.status(200).json(updateAuthor);
    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error);
    }
};

// Delete Author by ID
exports.deleteAuthor = async (req, res, next) => {
    try {
        console.log(req.params.id);
        const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
        if (!deletedAuthor)
            return res.status(404).json("Author not found");
        res.status(200).json("Successful deleted");
    } catch (error) {
        res.status(500).json({ error: error.message });
        next();
    }
}

// Get author by ID
exports.getAuthorByID = async (req, res, next) => {
    try {
        const getAuthByID = await Author.findById(req.params.id);
        if (!getAuthByID)
            return res.status(404).json("Author not found");
        res.status(200).json(getAuthByID);
    } catch (error) {
        // res.status(500).json({ error: error.message });
        next(error);
    }
}

// get author by name and birthyear
exports.getAuthorByName = async (req, res, next) => {
    try {
        const { authorName, birthyear } = req.params;
        const author = await Author.findOne({ author: authorName });
        if (birthyear) {

        }
        if (!author) {
            return res.status(404).json("Author not found");
        }
        res.status(200).json(author);
    } catch (err) {
        next(err);
    }
}