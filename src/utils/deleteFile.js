const fs = require('fs').promises;
const path = require("path");



const deleteFile = async function (filePath) {

  const absolutePath = path.join(__dirname, '../../public', filePath);
  console.log("Deleting file at:", absolutePath);


  try {
    await fs.unlink(absolutePath);
    console.log('File deleted successfully');
  } catch (err) {
    console.error('Error deleting file:', err.message);
    throw err;
  }
};
module.exports = deleteFile;