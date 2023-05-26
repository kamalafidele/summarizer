const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const logger = require('morgan');
const path = require('path');
const fs = require('fs');
const { PythonShell } = require('python-shell');

const SummarizerService = require('./src/services/SummarizerService');

dotenv.config();
const app = express();

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

app.post('/summarize', async (req, res) => {
    try {
      const { script } = req.body;
      const summary = await SummarizerService.summarizeWithApi(script);
      fs.writeFileSync('summary.txt', summary);

      const result = await PythonShell.run('entity-extraction.py', null);
      const entities = result[0].split('[')[1].split(']')[0].split(',');

      fs.unlinkSync('./summary.tx');

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