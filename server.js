const express = require('express'),
    app = express(),
    puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'downloads')));
const allowedOrigins = ['https://www.example.com']; // Replace with your website's URL

// Configure CORS
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Unauthorized'));
    }
  },
};

//app.use(cors(corsOptions));
app.get('/ping', async (req, res) => {
console.log('pinged');
res.send('pong');
});
app.get("/api/:prompt", async (request, response) => {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page._client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: path.resolve(__dirname, 'downloads') // Specify the desired download folder path
  });
  const direct = path.resolve(__dirname, 'downloads');
  //  fs.readdir(direct, (err, files) => {
  //if (err) {
  //  console.error('Error reading directory:', err);
  //  return;
 // }

  //console.log('Files in directory:');
  //files.forEach(file => {
  //  console.log(file);
  //});
//});
    
    await page.goto('https://editor.fusionbrain.ai');
      await page.waitForSelector('button._5VvP5');
      await page.click('button._5VvP5');
    await page.waitForSelector('div._78Teq');
    await page.click('div._78Teq');
    const textareaSelector = 'textarea';
  const textToFill = request.params.prompt;
  await page.type(textareaSelector, textToFill);
    await page.waitForSelector('button.I9yBt');
    await page.click('button.I9yBt');
    const buttonClassName = '.I9yBt'; // Replace with the actual class name of the button
  await page.waitForFunction(
    (buttonClassName) => {
      const button = document.querySelector(buttonClassName);
      return button && !button.disabled;
    },
    {},
    buttonClassName
  );
    await page.waitForSelector('button.wdanV');
    await page.click('button.wdanV');
    await page.waitForSelector('button.I9yBt');
    await page.click('button.I9yBt');
fs.readdir(direct, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  let latestFile = null;
  let latestTimestamp = 0;

  files.forEach(file => {
    const filePath = `${direct}/${file}`;
    
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error('Error getting file stats:', err);
        return;
      }

      if (stats.mtimeMs > latestTimestamp) {
        latestTimestamp = stats.mtimeMs;
        latestFile = file;
      }

      // After iterating through all files, print the name of the latest file
      if (file === files[files.length - 1]) {
        console.log('Latest file:', latestFile);
        
        serve(latestFile);
      }
    });
  });
});
    function serve(file){
      const img = path.join(__dirname, `downloads/${file}`);
      fs.readFile(img, (err, data) => {
    if (err) {
      console.error('Error reading image:', err);
      response.status(500).send('Internal Server Error');
      return;
    }

    // Set the appropriate headers for the image response
    response.setHeader('Content-Type', 'image/png');
    response.setHeader('Content-Length', data.length);

    // Send the image data
    response.send(data);
  });
    }
    await browser.close();
      function emptyDirectory(directoryPath) {
  try {
    // Check if the directory exists
    if (!fs.existsSync(directoryPath)) {
      console.log(`Directory "${directoryPath}" does not exist.`);
      return;
    }

    // Get all files and subdirectories in the directory
    const files = fs.readdirSync(directoryPath);

    // Iterate over each file and subdirectory
    for (const file of files) {
      const filePath = path.join(directoryPath, file);

      // Check if it's a file or a subdirectory
      const isFile = fs.statSync(filePath).isFile();

      // If it's a file, delete it
      if (isFile) {
        fs.unlinkSync(filePath);
      }
      // If it's a subdirectory, recursively empty it
      else {
        emptyDirectory(filePath);
        fs.rmdirSync(filePath);
      }
    }

    console.log(`Directory "${directoryPath}" has been emptied.`);
  } catch (err) {
    console.error(`Error emptying directory: ${err}`);
  }
}

// Usage example
const directoryPath = path.join(__dirname, 'downloads/');
emptyDirectory(directoryPath);
  } catch (error) {
    response.status(503).end(error.message);
  }
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
