const router = require('express').Router()
const ProductController = require('../controllers/ProductController')
const { uploadImage } = require('../middlewares/Upload')
const uploadController = require('../controllers/UploadController')
var multer = require('multer');
var upload = multer({dest:'./public/storage/image'});

router.post('/create',upload.single('image'), ProductController.create)
router.get('/:page', ProductController.read)
router.get('/', ProductController.read)
router.patch('/:id', ProductController.update)
router.delete('/:id', ProductController.delete)

router.post('/image', uploadImage('products'), uploadController.uploadImage)

module.exports = router
