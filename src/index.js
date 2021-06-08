// import { readFileSync } from 'fs';
// import { createSecureServer } from 'http2';
import path from 'path';
import { createServer } from 'http';
import express from 'express';
import { config } from 'dotenv';
// import helmet from 'helmet';
import { JSDOM } from 'jsdom';
import DataURI from 'datauri';

import { PORT } from './constants';
import initializeSockets from './socket';

config();
const app = express();
const httpServer = createServer(app);
// const http2Server = createSecureServer({
//   allowHTTP1: false,
//   key: readFileSync("/tmp/key.pem"),
//   cert: readFileSync("/tmp/cert.pem")
// });

// app.use(helmet()); // restricted request for blob
app.use(express.static(path.join(process.cwd(), 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'index.html'));
});

// const io = initializeSockets(httpServer);
const datauri = new DataURI();

function setupAuthoritativePhaser() {
  JSDOM.fromFile(path.join(process.cwd(), 'authoritative_server', 'index.html'), {
    runScripts: "dangerously", // To run the scripts in the html file
    resources: "usable", // Also load supported external resources
    pretendToBeVisual: true // So requestAnimatinFrame events fire
  }).then((dom) => {

    // createObjectURL and revokeObjectURL functions are not implemented in JSDOM
    dom.window.URL.createObjectURL = (blob) => {
      if (blob) {
        return datauri.format(
          blob.type,
          blob[Object.getOwnPropertySymbols(blob)[0]]._buffer
        ).content;
      }
    };
    dom.window.URL.revokeObjectURL = (objectURL) => { };

    dom.window.gameLoaded = () => {
      dom.window.io = initializeSockets(httpServer);
      httpServer.listen(PORT, () => {
        console.log(`Server listening on ${httpServer.address().port}`);
      });
    };
  }).catch((error) => {
    console.log(error.message);
  });
}

setupAuthoritativePhaser();
