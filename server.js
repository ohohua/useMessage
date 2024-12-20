import express from 'express'
import multer from 'multer'
import path from 'path'

const app = express()
const port = 3000

// Set up storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  },
})

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  },
}).single('myFile')

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb('Error: Images Only!')
  }
}

// Public folder
app.use(express.static('./public'))

// Upload endpoint
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).send({ message: err })
    } else {
      if (req.file == undefined) {
        res.status(400).send({ message: 'No file selected!' })
      } else {
        res.send({ message: 'File uploaded!', file: `uploads/${req.file.filename}` })
      }
    }
  })
})

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`)
})
