import Journal from '../models/Journal.js';

const getJournals = async (req, res, next) => {
  try {
    const { search } = req.query;
    const filter = { user: req.user._id };
    let query = Journal.find(filter).sort({ createdAt: -1 });
    if (search) {
      query = query.find({ $text: { $search: search } });
    }
    const journals = await query;
    res.json({ success: true, journals });
  } catch (error) {
    next(error);
  }
};

const createJournal = async (req, res, next) => {
  try {
    const journal = await Journal.create({ user: req.user._id, ...req.body });
    res.status(201).json({ success: true, journal });
  } catch (error) {
    next(error);
  }
};

const updateJournal = async (req, res, next) => {
  try {
    const journal = await Journal.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
    if (!journal) {
      res.status(404);
      throw new Error('Journal not found');
    }
    res.json({ success: true, journal });
  } catch (error) {
    next(error);
  }
};

const deleteJournal = async (req, res, next) => {
  try {
    const journal = await Journal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!journal) {
      res.status(404);
      throw new Error('Journal not found');
    }
    res.json({ success: true, message: 'Journal deleted' });
  } catch (error) {
    next(error);
  }
};

export { getJournals, createJournal, updateJournal, deleteJournal };
