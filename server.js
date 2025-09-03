const express = require('express');
const multer  = require('multer');
const fs      = require('fs');
const { exec }= require('child_process');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/convert', upload.single('audio'), (req, res) => {
  const inFile  = req.file.path;
  const outFile = `${inFile}.mp3`;

  exec(`ffmpeg -f s16le -ar 24000 -ac 1 -i ${inFile} -codec:a libmp3lame -qscale:a 2 ${outFile}`,
    err => {
      if (err) return res.status(500).send('ffmpeg error');
      res.download(outFile, 'audio.mp3', () => {
        fs.unlinkSync(inFile);
        fs.unlinkSync(outFile);
      });
    });
});

app.listen(3000, () => console.log('Up on 3000'));
