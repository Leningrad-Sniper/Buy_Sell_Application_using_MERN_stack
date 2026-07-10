const Item = require('../models/Item');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Check File Type
const checkFileType = (file, cb) => {
    // Allowed file types
    const filetypes = /jpeg|jpg|png|gif/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
};

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadsPath = path.join(__dirname, '..', 'uploads');
        cb(null, uploadsPath);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'item-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image');

// Create new item with image
exports.createItem = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error('Upload Error:', err);
            return res.status(400).json({ message: err.message || 'Error uploading file' });
        }

        try {
            if (!req.user || !req.user._id) {
                if (req.file) {
                    await fs.unlink(req.file.path).catch(console.error);
                }
                return res.status(401).json({ message: 'User not authenticated' });
            }

            const { name, price, description, category } = req.body;
            
            // Validate price is a number
            const numericPrice = Number(price);
            if (isNaN(numericPrice)) {
                if (req.file) {
                    await fs.unlink(req.file.path);
                }
                return res.status(400).json({ message: 'Price must be a number' });
            }

            const item = new Item({
                name,
                price: numericPrice,
                description,
                category,
                seller: req.user._id,
                image: req.file ? `/uploads/${req.file.filename}` : null
            });

            await item.save();
            
            // Populate seller details before sending response
            const populatedItem = await Item.findById(item._id)
                .populate('seller', 'firstName lastName email');
            
            res.status(201).json({ 
                message: 'Item created successfully', 
                item: populatedItem 
            });
        } catch (error) {
            // Clean up uploaded file if there's an error
            if (req.file) {
                await fs.unlink(req.file.path).catch(console.error);
            }
            console.error('Item Creation Error:', error);
            res.status(500).json({ message: error.message });
        }
    });
};

// Get all items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find({ status: 'available' })
      .populate('seller', 'firstName lastName email');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get item by ID
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('seller', 'firstName lastName email');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search items
exports.searchItems = async (req, res) => {
  try {
    const { query, categories } = req.query;
    let searchQuery = { status: 'available' };

    if (query) {
      searchQuery.name = { $regex: query, $options: 'i' };
    }

    if (categories) {
      const categoryArray = categories.split(',');
      searchQuery.category = { $in: categoryArray };
    }

    const items = await Item.find(searchQuery)
      .populate('seller', 'firstName lastName')
      .sort('-createdAt');

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 