import pdf from 'pdf-parse';
import axios from 'axios';
import logger from '../../utils/logger.js';

const parsePdfFromUrl = async (url) => {
  try {
    const { data } = await axios.get(url, { responseType: 'arraybuffer', timeout: 20000 });
    const parsed = await pdf(Buffer.from(data));
    return { text: parsed.text, pages: parsed.numpages };
  } catch (error) {
    logger.error(`PDF parsing failed for ${url}: ${error.message}`);
    return { text: '', pages: 0, error: error.message };
  }
};

export { parsePdfFromUrl };
