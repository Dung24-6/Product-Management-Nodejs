/* eslint-disable prefer-destructuring */
require('dotenv').config()
const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('connect-flash')
const cors = require('cors')
const MongoStore = require('connect-mongo')(session)
const userModel = require('./models/User')
const bodyParser = require('body-parser')
const { uploadImage } = require('./middlewares/Upload')
const uploadController = require('./controllers/UploadController')

const router = require('./routes/index')
var multer = require('multer')

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var upload = multer({ storage: storage })

// Database Connection
mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Database 😍'))

// App Engine
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use('public', express.static('public'))
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(cookieParser())
app.use(
  session({
    secret: process.env.SECRET_KEY,
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true },
    store: new MongoStore({
      mongooseConnection: db,
      collection: 'session'
    })
  })
)

app.post('/user', async (req, res) => {
  const u = new userModel(req.body)
  try {
    await u.save()
    res.send(u)
  } catch (error) {
    res.status.send(error)
  }
})
//Upload anh khi chua dang nhap 
app.post('/image', uploadImage('image'), uploadController.uploadImage)


app.use(flash())
app.use((req, res, next) => {
  const successFlashMessageArr = req.flash('success')
  const errorFlashMessageArr = req.flash('error')
  res.locals.successMsg = successFlashMessageArr[0]
  res.locals.errorMsg = errorFlashMessageArr[0]
  next()
})

app.use('/', router)

// Development Server
const PORT = process.env.PORT || 5000 //
app.listen(PORT, () => {
  console.log(`Application started on port: http://localhost:${PORT} 🔥`)
})
