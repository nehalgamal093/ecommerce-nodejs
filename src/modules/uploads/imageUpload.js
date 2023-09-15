import { imageUploader } from "./imageUploader.js";


export function imageCoverUpload(req,res,next) {
    const upload = imageUploader(
        ["image/jpeg","image/jpg","image/png"],
        1000000,
        1,
        "ONLY .jpeg .jpg or .png format allowed"
    );

    upload.any()(req,res,(err)=>{
        if(err){
            res.status(500).json({
                errors:{
                    imgCover:{
                        msg:err.message
                    }
                }
            })
        }else {
            next()
        }
    })
}