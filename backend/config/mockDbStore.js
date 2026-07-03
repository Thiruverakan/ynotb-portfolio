const fs = require('fs');
const path = require('path');

const MOCK_DB_DIR = path.join(__dirname, '.mockdb');

// Ensure database directory exists
if (!fs.existsSync(MOCK_DB_DIR)) {
  fs.mkdirSync(MOCK_DB_DIR, { recursive: true });
}

const getFilePath = (collection) => path.join(MOCK_DB_DIR, `${collection}.json`);

const readData = (collection) => {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error(`Error reading mock db file for ${collection}:`, error);
    return [];
  }
};

const writeData = (collection, data) => {
  const filePath = getFilePath(collection);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error writing mock db file for ${collection}:`, error);
  }
};

// Simple ID generator
const generateId = () => Math.random().toString(36).substring(2, 11) + Date.now().toString(36);

const mockDbStore = {
  find: (collection, query = {}) => {
    const data = readData(collection);
    return data.filter(item => {
      for (let key in query) {
        if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
  },

  findOne: (collection, query = {}) => {
    const data = readData(collection);
    return data.find(item => {
      for (let key in query) {
        if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    }) || null;
  },

  findById: (collection, id) => {
    const data = readData(collection);
    return data.find(item => item._id === id || item.id === id) || null;
  },

  create: (collection, itemData) => {
    const data = readData(collection);
    const newItem = {
      _id: generateId(),
      ...itemData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.push(newItem);
    writeData(collection, data);
    return newItem;
  },

  findByIdAndUpdate: (collection, id, itemData, options = {}) => {
    const data = readData(collection);
    const index = data.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;
    
    // Update fields
    const updatedItem = {
      ...data[index],
      ...itemData,
      updatedAt: new Date().toISOString()
    };
    data[index] = updatedItem;
    writeData(collection, data);
    return updatedItem;
  },

  findByIdAndDelete: (collection, id) => {
    const data = readData(collection);
    const index = data.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return false;
    
    data.splice(index, 1);
    writeData(collection, data);
    return true;
  },

  insertMany: (collection, itemsArray) => {
    const data = readData(collection);
    const seededItems = itemsArray.map(item => ({
      _id: generateId(),
      ...item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    const newData = [...data, ...seededItems];
    writeData(collection, newData);
    return seededItems;
  },

  deleteMany: (collection) => {
    writeData(collection, []);
    return { deletedCount: 0 };
  }
};

module.exports = mockDbStore;
