import express from 'express'
import multer from 'multer'
import cors from 'cors'
import path from 'path'

const app = express()
app.use(cors())

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      fs.mkdirSync(path.join(process.cwd(), 'uploads'))
    } catch (e) {}
    cb(null, path.join(process.cwd(), 'uploads'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
    cb(null, uniqueSuffix)
  },
})

const upload = multer({
  dest: 'uploads/',
  storage,
})

app.post('/upload', upload.single('file'), function (req, res, next) {
  console.log('req.file', req.file)
  console.log('req.body', req.body)

  res.end(
    JSON.stringify({
      message: 'success',
    }),
  )
})

console.log('Server running on port: http://localhost:3333/upload')

app.listen(3333)
