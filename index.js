const express = require('express');

const path = require('path');
const fs = require('fs').promises;
const fss = require('fs');

const libre = require('libreoffice-convert');
libre.convertAsync = require('util').promisify(libre.convert);

const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const cors = require('cors');

const app = express();

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(express.static('uploads'));

//start app 
const port = process.env.PORT || 9000;

let pdfnumber = 1;


app.listen(port, () =>
  console.log(
    `nodejs-convert-file-server listening at http://localhost:${port}`,
  ),
);

app.get('/', (req,res) => {
    res.send("Hi Bandar Al-hamwan")
});



app.post('/upload-avatar', async (req, res) => {
    pdfnumber++;
    console.log(pdfnumber);
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let avatar = req.files.avatar;
            
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            await avatar.mv('./uploads/' + avatar.name);

            // start converting
            const ext = '.pdf'
            const inputPath = path.join(__dirname, '/uploads/' + avatar.name);
            console.log(avatar.name)
            const outputPath = path.join(__dirname, `./uploads/pdfFile${ext}`);

            // Read file
            const docxBuf = await fs.readFile(inputPath);

            // Convert it to pdf format with undefined filter (see Libreoffice docs about filter)
            let pdfBuf = await libre.convertAsync(docxBuf, ext, undefined);
            
            // Here in done you have pdf file which you can save or transfer in another stream
            await fs.writeFile(outputPath, pdfBuf);
            // end converting

            //send response
            var file = fss.createReadStream('./uploads/pdfFile.pdf');
            var stat = fss.statSync('./uploads/pdfFile.pdf');
            res.setHeader('Content-Length', stat.size);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=pdfFile.pdf');
            file.pipe(res)
        }
    } catch (err) {
        res.status(500).send(err);
    }
});


app.get('/wordToPdf', (req, res) => {
    
    var file = fss.createReadStream('./uploads/pdfFile.pdf');
    var stat = fss.statSync('./uploads/pdfFile.pdf');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=pdfFile.pdf');
    file.pipe(res);
    //res.send(data);

  });