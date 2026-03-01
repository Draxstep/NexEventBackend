import multer from 'multer';

const storage = multer.memoryStorage(); 

export const uploadImagen = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Formato no soportado. Solo JPG o PNG.'));
        }
    }
});