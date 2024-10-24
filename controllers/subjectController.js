const Subject = require('../models/Subject');

// Add one or more subjects - called by BookController.
exports.addSubjects = async (session, subjects, next) => {
    try {
        // Loop each subject and create new subject document.
        const savedSubjects = await Promise.all(subjects.map(async (subject) => {
            const existingSubject = await Subject.findOne({
                subjectName: subject.subjectName
            }).session(session);
            if (existingSubject) {
                return existingSubject;
            } else {
                const newSubject = new Subject({
                    subjectName: subject.subjectName,
                    description: subject.description
                });
                return await newSubject.save({ session });
            }
        }));
        // return array of subjects
        return savedSubjects;
    } catch (error) {
        next(error);
        throw error;
    }
}

// add a subject separatedly
exports.addSubject = async (req, res, next) => {
    try {
        const {
            subjectName,
            description
        } = req.body;
        const newSubject = new Subject({
            subjectName,
            description
        });
        await newSubject.save();
        res.status(201).json(newSubject);
    } catch (error) {
        next(error);
    }
}

// get all subjects from db
exports.getSubjects = async (req, res, next) => {
    try {
        const subjects = await Subject.find();
        res.status(200).json(subjects);
    } catch (error) {
        next(error);
    }
}

// update a subject by ID
exports.updateSubject = async (req, res, next) => {
    try {
        const updatedSubject = await Subject.findByIdAndUpdate(req.params.id, req.body);
        if (!updatedSubject)
            return res.status(404).json("Subject not found");
        res.status(201).json(updatedSubject);
    } catch (error) {
        next(error);
    }
}

// delete a subject by ID
exports.deleteSubject = async (req, res, next) => {
    try {
        const deletedSubject = await Subject.findByIdAndDelete(req.params.id);
        if (!deletedSubject)
            return res.status(404).json("Subject not found");
        res.status(200).json("Deleted subject successfully");
    }
    catch (error) {
        next(error);
    }
}

// Find a subject by ID 
exports.getSubjectByID = async (req, res, next) => {
    try {
        const foundSubject = await Subject.findById(req.params.id);
        if (!foundSubject)
            return res.status(404).json("Subject not found");
        res.status(200).json(foundSubject);
    } catch (error) {
        next(error);
    }
}

// Find a subject by desc. content
exports.getSubjectByDesc = async (req, res, next) => {
    try {
        const findingText = req.query.des;
        console.log(findingText);
        // res.send(`The text is: ${findingText}`);
        const foundSubject = await Subject.find({
            description: { $regex: findingText, $options: 'i' }
        })
        if (!foundSubject)
            return res.status(404).json("Subject not fount")
        res.status(200).json(foundSubject);
    }
    catch (error) {
        next(error);
    }
}