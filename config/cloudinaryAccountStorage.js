import {v2 as cloudinary} from 'cloudinary';
import {CloudinaryStorage} from 'multer-storage-cloudinary';


export const accountStorage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'products'
    }
})