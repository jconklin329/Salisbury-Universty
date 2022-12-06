"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = require("puppeteer");
async function scrapeBillboardNews() {
    const url = 'https://www.billboard.com/c/music/music-news/';
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--start-maximized'] });
    const page = await browser.newPage();
    await Promise.all([
        page.goto(url, {
            timeout: 0,
            waitUntil: "load",
        }),
        page.setViewport({ width: 1920, height: 4050 }),
    ]);
    const news = await page.evaluate(() => {
        const articles = document.querySelectorAll('div.a-story-grid');
        const results = [];
        const textContent = (elem) => elem ? elem.innerText : '';
        articles.forEach(article => results.push({
            title: textContent(article.querySelector('.c-title')),
            author: textContent(article.querySelector('.c-tagline')),
            date: textContent(article.querySelector('time.c-timestamp')),
            image: article.querySelector('img').getAttribute('src'),
        }));
        return results;
    });
    await browser.close();
    return news;
}
async function printDemo() {
    const array = await scrapeBillboardNews();
    for (let a of array) {
        console.log("\"" + a.title + "\"\n\tby " + a.author + ", " + a.date);
        console.log("\timg ref: " + a.image);
        console.log("");
    }
}
printDemo();
//# sourceMappingURL=billboard.js.map