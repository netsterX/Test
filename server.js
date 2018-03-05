const express = require('express'),
    app = express(),
    puppeteer = require('puppeteer');

app.get("/", async (request, response) => {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('https://developers.google.com/web/tools/puppeteer');
    await page.screenshot({path: 'puppeteer.png'});
    await browser.close();
    response.sendFile('puppeteer.png');
  } catch (error) {
    console.log(error);
  }
});

var listener = app.listen(4000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});