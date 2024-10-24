const Language = require('../models/language');

// Robustly called by the Book Controller to add one or more languages to the Language collection
exports.addLanguages = async (session, languages, next) => {
    try {
        // Check if the language exists, if not create new language
        const savedLanguages = await Promise.all(
            languages.map(async (language) => {
                const existingLanguage = await Language.findOne({
                    language: language.language
                }).session(session);
                if (existingLanguage) {
                    return existingLanguage;
                } else {
                    const newLanguage = new Language({
                        language: language.language,
                        abriviation: language.abriviation
                    });
                    return await newLanguage.save({ session });
                }
            })
        )
        return savedLanguages;
    } catch (error) {
        next(error);
        throw error;
    }
}

// Add a language
exports.addLanguage = async (req, res, next) => {
    try {
        const {
            language,
            abriviation
        } = req.body;
        const newLanguage = new Language({
            language,
            abriviation
        });
        await newLanguage.save();
        res.status(201).json(newLanguage);
    } catch (error) {
        next(error);
    }
}

// Get all Languages
exports.getLanguages = async (req, res, next) => {
    try {
        const languages = await Language.find();
        res.status(200).json(languages);
    } catch (error) {
        next(error);
    }
}

// Update Language by ID
exports.updateLanguage = async (req, res, next) => {
    try {
        const language = await Language.findByIdAndUpdate(req.params.id, req.body);
        if (!language)
            return res.status(404).json("Language not found");
        res.status(200).json(language);
    } catch (error) {
        next(error);
    }
}

// Delete Language by ID
exports.deleteLanguage = async (req, res, next) => {
    try {
        const language = await Language.findByIdAndDelete(req.params.id)
        if (!language)
            return res.status(404).json("Language not found");
        res.status(200).json("Language deleted successfully");
    } catch (error) {
        next(error);
    }
}

// Get Language by ID
exports.getLanguage = async (req, res, next) => {
    try {
        const language = await Language.findById(req.params.id);
        if (!language)
            return res.status(404).json("Language not found");
        res.status(200).json(language);
    } catch (error) {
        next(error);
    }
}

// Get language by Abriviation
exports.getLangByAbr = async (req, res, next) => {
    try {
        const language = await Language.findOne({
            abriviation: req.params.abr
        });
        if (!language)
            return res.status(404).json("Language not found");
        res.status(200).json(language);
    } catch (error) {
        next(error);
    }
}

// Get language by Name
exports.getLangByName = async (req, res, next) => {
    try {
        const language = await Language.findOne({
            language: req.params.lang
        })
        if (!language)
            return res.status(404).json("Language not found");
        res.status(200).json(language);
    } catch (error) {
        next(error);
    }
}