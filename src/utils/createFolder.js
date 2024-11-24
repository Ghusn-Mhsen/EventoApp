    const fs = require('fs').promises;
    
    // Check if the destination folder exists, create it if not
    const createFolder = async (path) => {
        try {
            await fs.access(path);
        } catch (err) {
            await fs.mkdir(path, {
                recursive: true
            });
        }
    }
    module.exports = createFolder;