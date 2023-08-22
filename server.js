const express = require('express'),
    app = express(),
    puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');


app.get("/", async (request, response) => {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page._client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: path.resolve(__dirname, 'downloads') // Specify the desired download folder path
  });
    await page.goto('https://editor.fusionbrain.ai');
      await page.waitForSelector('button._5VvP5');
      await page.click('button._5VvP5');
    await page.waitForSelector('div._78Teq');
    await page.click('div._78Teq');
    const textareaSelector = 'textarea';
  const textToFill = 'cute cat';
  await page.type(textareaSelector, textToFill);
    await page.waitForSelector('button.I9yBt');
    await page.click('button.I9yBt');
    
    
    await page.waitForEvent('download');
    response.type('png').send(await page.screenshot());
    await browser.close();
  } catch (error) {
    response.status(503).end(error.message);
  }
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});