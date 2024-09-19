"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const convert_csv_to_json_1 = __importDefault(require("convert-csv-to-json"));
const app = (0, express_1.default)();
const port = 3000;
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
let userData = [];
app.use((0, cors_1.default)());
app.post('/api/file', upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { file } = req;
    if (!file) {
        return res.status(500).json({ message: 'No file uploaded' });
    }
    const validMineTypes = ['text/csv', 'application/vnd.ms-excel'];
    if (!validMineTypes.includes(file.mimetype)) {
        return res.status(500).json({ message: 'Invalid file type' });
    }
    let json = [];
    try {
        const rawCsv = Buffer.from(file.buffer).toString('utf-8');
        json = convert_csv_to_json_1.default.fieldDelimiter(',').csvStringToJson(rawCsv);
        console.log(rawCsv);
    }
    catch (error) {
        return res.status(500).json({ message: 'Error parsing CSV file' });
    }
    userData = json;
    return res.status(200).json({ data: json, message: 'File uploaded successfully' });
}));
app.get('/api/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { q } = req.query;
    if (!q) {
        return res.status(500).json({ message: 'Query param `q` is required' });
    }
    if (Array.isArray(q)) {
        return res.status(500).json({ message: 'Query param `q` must be an array' });
    }
    const search = q.toString().toLowerCase();
    const filterData = userData.filter(row => {
        return Object
            .values(row)
            .some(value => value.toLowerCase().includes(search));
    });
    return res.status(200).json({ data: filterData });
}));
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port} 🚀`);
});
