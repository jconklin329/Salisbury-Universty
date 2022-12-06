"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = require("puppeteer");
async function scrapedCMTNews() {
    const url = 'https://www.cmt.com/news';
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--start-maximized'] });
    const page = await browser.newPage();
    await Promise.all([
        page.goto(url, {
            timeout: 0,
            waitUntil: "load",
        }),
        page.setViewport({ width: 1920, height: 2670 }),
    ]);
    const news = await page.evaluate(() => {
        const articles = document.querySelectorAll('div.item.article');
        const results = [];
        const textContent = (elem) => elem ? elem.innerText : '';
        articles.forEach(article => results.push({
            title: textContent(article.querySelector('div.header')),
            date: textContent(article.querySelector('div.meta')),
            image: article.querySelector('picture.image-holder').firstElementChild.getAttribute('srcset')
        }));
        return results;
    });
    await browser.close();
    return news;
}
async function printDemo() {
    const array = await scrapedCMTNews();
    for (let a of array) {
        console.log("\"" + a.title + "\"\n\ton " + a.date);
        console.log("\timg ref: " + a.image);
        console.log("");
    }
}
printDemo();
//# sourceMappingURL=cmt.js.map