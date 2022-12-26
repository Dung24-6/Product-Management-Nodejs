const router = require('express').Router()
const ProductController = require('../controllers/ProductController')
const { uploadImage } = require('../middlewares/Upload')
const uploadController = require('../controllers/UploadController')

router.post('/', ProductController.create)
router.get('/:page', ProductController.read)
router.get('/', ProductController.read)
router.patch('/:id', ProductController.update)
router.delete('/:id', ProductController.delete)

router.post('/image', uploadImage('products'), uploadController.uploadImage)

module.exports = router
