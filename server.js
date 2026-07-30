const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8420;

// Middleware
app.use(cors());
app.use(express.json());

// Setup storage directories
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const DB_FILE = path.join(__dirname, 'db.json');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

// Ensure unique filenames for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});
const upload = multer({ storage });

// Serve static directory (the frontend)
app.use('/uploads', express.static(UPLOADS_DIR));
app.use(express.static(__dirname));

// DB Helpers
function getDb() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}
function saveDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// API Routes

// 1. Create a surprise
app.post('/api/surprises', upload.array('photos', 8), (req, res) => {
  try {
    const files = req.files;
    const body = JSON.parse(req.body.data); // Frontend sends JSON string in 'data' field

    const photoPaths = files.map(f => '/uploads/' + f.filename);

    const surprise = {
      uid: body.uid,
      userEmail: body.userEmail,
      gfName: body.gfName,
      bfName: body.bfName,
      message: body.message,
      specialDate: body.specialDate,
      theme: body.theme,
      music: body.music,
      photos: photoPaths,
      createdAt: new Date().toISOString()
    };

    const db = getDb();
    db.push(surprise);
    saveDb(db);

    res.json({ success: true, uid: surprise.uid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save surprise' });
  }
});

// 2. Get a surprise
app.get('/api/surprises/:id', (req, res) => {
  const db = getDb();
  const surprise = db.find(s => s.uid === req.params.id);
  if (surprise) {
    res.json(surprise);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n💖 LoveBox Backend Running at http://127.0.0.1:${PORT}`);
});
