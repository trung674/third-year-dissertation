import fs from 'fs-extra';
import moment from 'moment';
import AWS from 'aws-sdk';
AWS.config.loadFromPath('./aws-config.json');
const s3 = new AWS.S3();

const bucketName = 'recording.uploads';

function writeToDisk(audio) {
    let dateTime = moment().format('YYYYMMDDHHmm');
    const fileExtension = 'wav';
    const fileName = `${audio.word}_${audio.username}_${audio.recordingID}_${dateTime}.${fileExtension}`;
    const filePath = `./uploads/${audio.username}/${audio.recordingID}/${fileName}`;
    const filePathAWS = `uploads/${audio.username}/${audio.recordingID}/${fileName}`;
    let fileBuffer;
    let dataURL = audio.dataURL.split(',').pop();

    fileBuffer = Buffer.from(dataURL, 'base64');
    fs.outputFileSync(filePath, fileBuffer);
    s3.putObject({Bucket: bucketName, Key: filePathAWS , Body: fileBuffer, ContentEncoding: 'base64', ContentType: 'audio/wav'}, function(err, data) {
      if (err) {
        console.error(err);
      } else {
        console.log('uploading to S3 successfully !');
      }
    });
    console.log('filePath', filePath);
}

// define constructor function that gets `io` send to it
module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('incomingdata', (data) => {
            // console.log(data.audio.dataURL);
            writeToDisk(data.audio);
            // console.log(data);
        });
    });
};
