"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = require("puppeteer");
const chalk = require("chalk");
const constants_1 = require("./constants");
const fs = require("fs");
// from https://gist.github.com/silent-lad/374eea183f58be5e37962b4302f8970a#file-giantleap-js
const error = chalk.bold.red;
const success = chalk.keyword('green');
async function scrape(champ) {
    const browser = await puppeteer.launch({ headless: true });
    const lanes = ['top', 'jungle', 'middle', 'bottom', 'support'];
    let allMatchupsForOneChamp = {};
    try {
        for (const lane of lanes) {
            // open a new page
            const url = `https://lolalytics.com/lol/${champ}/counters/?lane=${lane}&tier=all&patch=30&vslane=${lane}`;
            try {
                const page = await browser.newPage();
                // enter url in page
                await page.goto(url);
                try {
                    await page.waitForSelector('div.Counter_wr__Jxax6', {
                        timeout: 5000,
                    });
                }
                catch (err) {
                    throw new Error(`No matchup data found at ${url}`);
                }
                const info = await page.evaluate(() => {
                    const counters = document.querySelectorAll('.Counter_wrapper__2DHzU');
                    let matchups = [];
                    counters.forEach((counter) => {
                        matchups.push({
                            vs: counter.children[1].innerHTML,
                            winrate: parseFloat(counter
                                .getElementsByClassName('Counter_wr__Jxax6')[0]
                                .innerHTML.slice(0, -1)),
                            numGames: parseInt(counter
                                .getElementsByClassName('Counter_games__QHwIK')[0]
                                .innerHTML.replace(/,/g, '')),
                        });
                    });
                    return matchups;
                });
                allMatchupsForOneChamp[lane] = info;
            }
            catch (err) {
                console.log(error(err));
                allMatchupsForOneChamp[lane] = null;
            }
        }
    }
    catch (err) {
        // Catch errors with browser launching
        console.log(error(err));
    }
    finally {
        await browser.close();
        console.log(success(champ + ': Browser closed!'));
    }
    return allMatchupsForOneChamp;
}
async function saveAsDictionary() {
    let i = 1;
    let final = {};
    while (constants_1.champNames.length) {
        const champs = constants_1.champNames.splice(0, 10);
        let promises = [];
        for (const champ of champs) {
            promises.push(scrape(champ));
        }
        const resolved = await Promise.all(promises);
        resolved.forEach((value, index) => {
            final[champs[index]] = value;
        });
    }
    const finalString = JSON.stringify(final);
    fs.writeFile(`final.json`, finalString, (err) => {
        if (err) {
            console.log(error(err));
        }
        else {
            console.log(`final.json written`);
            i++;
        }
    });
}
saveAsDictionary();
module.exports = { scrape };
