import * as puppeteer from 'puppeteer';
import { text } from 'stream/consumers';

interface MTV {
    title: string,
    date: string,
    image: string,
}

async function scrapedMTVNews(): Promise<MTV[]> {
    const url = 'https://www.mtv.com/news';
    const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--start-maximized']});
    const page = await browser.newPage();
    await Promise.all([
        page.goto(url, {
            timeout: 0,
            waitUntil: "load",
        }),
        page.setViewport({width: 1920, height: 2555}),
    ]);

    const news = await page.evaluate(() => {
        const articles = document.querySelectorAll('div.item.article');
        const results: MTV[] = [];
        const textContent = (elem: any) => elem ? elem.innerText : '';
        articles.forEach(article => results.push(
            {
                title: textContent(article.querySelector('div.header')),
                date: textContent(article.querySelector('div.meta')),
                image: article.querySelector('picture.image-holder').firstElementChild.getAttribute('srcset')

            }
        ))
        return results;
    })
    await browser.close();
    return news;    
}

async function printDemo() {
    const array = await scrapedMTVNews();
    for (let a of array) {
        console.log("\"" + a.title + "\"\n\ton " + a.date);
        console.log("\timg ref: " + a.image);
        console.log("");
    }
}

printDemo();