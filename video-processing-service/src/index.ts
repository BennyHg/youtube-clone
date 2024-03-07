import express from 'express';
import Ffmpeg from 'fluent-ffmpeg';
import { send } from 'process';

const app = express();
app.use(express.json());

app.post('/process-video', (req, res) => {
  // Get path of the input video file from the request body
  const inputFilePath = req.body.inputFilePath;
  const outputFilePath = req.body.outputFilePath;

  // Error handling
  if (!inputFilePath) {
    res.status(400).send("Bad Request: Missing input file path.")
  } else if (!outputFilePath) {
    res.status(400).send("Bad Request: Missing output file path.")
  }

  // Converting video
  Ffmpeg(inputFilePath)
    .outputOptions("-vf", "scale=-1:360") //360p
    .on("end", () => {
      res.status(200).send("Video processed successfully.")
    })
    .on("error", (err) => {
      console.log(`An error occurred: ${err.message}`);
      res.status(500).send(`Internal Server Error: ${err.message}`)
    })
    .save(outputFilePath);
});

const port = process.env.PORT || 3000; //port could be undefined so we set port to 3000
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});