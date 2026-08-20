import multer from "multer";


/*
============================================================
MEMORY STORAGE
============================================================

The file is temporarily kept in memory.

We do NOT save it to the server filesystem.

The buffer is passed directly to Cloudinary.
============================================================
*/

const storage = multer.memoryStorage();


/*
============================================================
FILE FILTER
============================================================

MVP supported documents:

- PDF
- JPEG
- PNG
============================================================
*/

const fileFilter = (req, file, callback) => {

    const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
    ];


    if (
        allowedTypes.includes(
            file.mimetype
        )
    ) {

        callback(null, true);

        return;

    }


    callback(
        new Error(
            "Only PDF, JPG and PNG files are allowed."
        )
    );

};


/*
============================================================
UPLOAD CONFIGURATION
============================================================
*/

const upload = multer({

    storage,

    fileFilter,

    limits: {

        /*
        10 MB maximum file size
        */

        fileSize:
            10 * 1024 * 1024,

    },

});


export default upload;