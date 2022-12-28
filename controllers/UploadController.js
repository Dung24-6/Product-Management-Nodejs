class UploadController {
    //   [POST] /admin/upload/image
    uploadImage = async (req, res) => {
      const { file } = req;
      const urlImage = `/storage/uploads/${file.fieldname}/${file.filename}`;
  
      res.send(urlImage);
    };
  }
  
  module.exports = new UploadController();