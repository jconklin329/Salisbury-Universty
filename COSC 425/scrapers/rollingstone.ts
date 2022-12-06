import * as puppeteer from 'puppeteer';

interface RollingStone {
    title: string,
    image: string,
}

async function scrapeRollingStoneNews(): Promise<RollingStone[]> {
    const url = 'https://www.rollingstone.com/music/music-news/';
    const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--start-maximized']});
    const page = await browser.newPage();
    await Promise.all([
        page.goto(url, {
            timeout: 0,
            waitUntil: "load",
        }),
        page.setViewport({width: 1920, height: 4720}),
    ]);

    const news = await page.evaluate(() => {
        const articles = document.querySelectorAll('div.story');
        const results: RollingStone[] = [];
        const textContent = (elem: any) => elem ? elem.innerText : '';
        articles.forEach(article => results.push(
            {
                title: textContent(article.querySelector('.c-title__link')),
                image: article.querySelector('img').getAttribute('src'),
            }
        ))
        return results;
    })
    await browser.close();
    return news;
}

async function printDemo() {
    const array = await scrapeRollingStoneNews();
    for (let a of array) {
        console.log("\"" + a.title + "\"");
        console.log("\timg ref: " + a.image);
        console.log("");
    }
}

printDemo();