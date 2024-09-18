import express from 'express'
import cors from 'cors'
import multer from 'multer'
import csvToJson from 'convert-csv-to-json'

const app = express();
const port = 3000;

const storage = multer.memoryStorage()
const upload = multer({ storage })

let userData: Array<Record <string, string>> = []

app.use(cors());

app.post('/api/upload', upload.single('file'), async (req, res) => {

    const { file } = req

    if (!req.file) {
        return res.status(500).json({ message: 'No file uploaded' });
    }

    if(file?.mimetype !== 'text/csv') {
        return res.status(500).json({ message: 'Invalid file type' });
    }

    let json: Array<Record <string, string>> = []
    try {
        const rawCsv = Buffer.from(file.buffer).toString('utf-8')
        json = csvToJson.csvStringToJson(rawCsv)
    } catch (error) {
        return res.status(500).json({ message: 'Error parsing CSV file' });
    }

    userData = json
    return res.status(200).json({ data: json, message: 'File uploaded successfully' });
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port} 🚀`)
})


app.get('/api/users', async (req, res) => {
   const { q }  = req.query

    if(!q) {
        return res.status(500).json({message: 'Query param `q` is required'});
    }

    if(!Array.isArray(q)){
        return res.status(500).json({message: 'Query param `q` must be an array'});
    }

    const search = q.toString().toLowerCase()
    const filterData = userData.filter(row => {
        return Object
        .values(row)
        .some(value => value.toLowerCase().includes(search))
    })

    return res.status(200).json({data: filterData});
});