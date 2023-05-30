const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const logger = require('morgan');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const pdf = require('pdf-parse');

const SummarizerService = require('./src/services/SummarizerService');


dotenv.config();
const app = express();
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
      cb(null, 'saved_file.pdf')
  }
})

const upload = multer({ storage });

const { PORT, HOST, ENV_MODE } = process.env;

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true, limit: '50mb', parameterLimit: 50000 }));
app.use(express.json({ limit: '50mb', extended: true }));
app.use(express.static('public'));
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, '/public/home.html'));
});

app.post('/summarize', upload.single('file'),async (req, res) => {
    try {
      let { script = null } = req.body;
      const { file = null } = req;

      if (file && !file.originalname.includes('.pdf')) {
        fs.unlinkSync(file.path);
        return res.status(400).json({ error: 'The file must be pdf' });
    }

     if (file) {
      let dataBuffer = fs.readFileSync('./uploads/saved_file.pdf');
      const { text } = await pdf(dataBuffer);
      script = text;

      fs.unlinkSync(file.path);
     }

      const summary = await SummarizerService.summarizeWithLangchain(script);
      const entitiesStr =  await SummarizerService.extractEntitiesWithAPI(summary);
    
      const entities = entitiesStr.split('[')[1].split(']')[0].split(',');
      return res.status(200).json({ summary, entities });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: e });
    }
});

app.use((req, res) => res.status(404).json({ error: 'We cannot get what you are looking for!' }));

app.listen(PORT, () => {
    const SERVER_URL = ENV_MODE === 'dev' ? `${HOST}:${PORT}` : `${HOST}`;
    console.log(`SERVER RUNNING ON ${SERVER_URL}`);
});