const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const DESTINATION_PATH = "./upload/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DESTINATION_PATH);
  },
  filename: (req, file, cb) => {
    // event img.jpg => event-img-6464646465.jpg

    const fileExt = path.extname(file.originalname);
    const fileName = file.originalname
      .replace(fileExt, "")
      .toLocaleLowerCase()
      .split(" ")
      .join("-") + "-" + Date.now();
    cb(null, fileName + fileExt);
  }
})

const upload = multer({
  // dest: DESTINATION_PATH,
  storage: storage,
  limits: {
    fileSize: 10000000,
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "avatar") {
      if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
      } else {
        cb(new Error("Only .jpg, .png or .jpeg format allowed!"));
      }

    } else if (file.fieldname === "doc") {
      if (file.mimetype === 'application/pdf') {
        cb(null, true)
      } else {
        cb(new Error("Only .pdf format allowed!"))
      }
    }
  }
});

app.get('/', (req, res) => {
  res.send('Server running')
})

// app.post('/', upload.single('avatar'), (req, res) => {
//   res.send("uploaded")
// })

// app.post('/', upload.array('avatar', 5), (req, res) => {
//   res.send("uploaded")
// })

app.post('/', upload.fields(
  [
    { name: 'avatar', maxCount: 1 },
    { name: 'doc', maxCount: 8 }
  ]
), (req, res) => {
  console.log(req.files);
  res.send("uploaded")
})


app.use((err, req, res, next) => {
  if (err) {
    if (err instanceof multer.MulterError) {
      res.send("upload filed")
    }

    res.status(500).send(err.message)
  } else {
    res.send("success")
  }
})

app.listen(3000, () => {
  console.log("app listening at port 3000");
})