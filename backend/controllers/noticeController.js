import Notice from '../models/Notice.js';

const getNotices = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const notices = await Notice.find(filter).sort({ createdAt: -1 }).limit(30);
    res.json({ success: true, notices });
  } catch (error) {
    next(error);
  }
};

export { getNotices };
