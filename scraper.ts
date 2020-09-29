import puppeteer = require('puppeteer');
import chalk = require('chalk');

// from https://gist.github.com/silent-lad/374eea183f58be5e37962b4302f8970a#file-giantleap-js
const error = chalk.bold.red;
const success = chalk.keyword('green');

async function scrape(blueChamp: string, redChamp: string, lane: string) {
  const browser = await puppeteer.launch({ headless: true });
  try {
    // open a new page
    const page = await browser.newPage();
    // enter url in page
    const url = `https://lolalytics.com/lol/${blueChamp}/vs/${redChamp}/?lane=${lane}&vslane=${lane}`;
    console.log(url);
    await page.goto(url);
    await page.waitForSelector('div.ChampionHeader_stats__f84LW', {
        timeout: 1000
      });
    const info = await page.evaluate(() => {
      const header = document.querySelector('.ChampionHeader_stats__f84LW');
      return [
        parseFloat(header.children[0].children[0].innerHTML.slice(0, -1)),
        parseInt(header.children[1].children[0].innerHTML.replace(/,/g, '')
      ];
    });
    console.log(info);
    await browser.close();
    console.log(/*TODO: log the data */);
    console.log(success('Browser Closed'));
  } catch (err) {
    // Catch and display errors
    console.log(error(err));
    await browser.close();
  }
}

scrape('khazix', 'nunu', 'jungle');

async function getMatchup(blueChamp: string, redChamp: string, lane: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      const url = `https://lolalytics.com/lol/${blueChamp}?lane=${lane}&vs=${redChamp}&vslane=${lane}`;
      console.log(url);
      await page.goto(url);
      try {
        await page.waitForSelector('.ChampionHeader_headervs__25ruZ', {
          timeout: 5000,
        });
      } catch (err) {
        browser.close();
        return reject('no data!');
      }
      const wr = await page.evaluate(() => {
        let headerText = document.querySelector(
          '.ChampionHeader_headervs__25ruZ'
        );
        let winrate = headerText.children[5].children[0].innerHTML;
        winrate = winrate.substring(0, winrate.indexOf('%'));
        let numberGames = headerText.children[5].children[1].innerHTML;
        numberGames = numberGames.substring(0, numberGames.indexOf('<'));
        return [winrate, numberGames];
      });
      browser.close();
      return resolve(wr);
    } catch (err) {
      browser.close();
      return reject(err);
    }
  });
}

module.exports = { getMatchup };
