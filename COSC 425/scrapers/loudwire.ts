import * as puppeteer from 'puppeteer';

interface Loudwire {
    title: string,
    date: string,
    image: string,
}

async function scrapeLoudwireNews(): Promise<Loudwire[]> {
    const url = 'https://loudwire.com/category/news/';
    const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--start-maximized']});
    const page = await browser.newPage();
    await Promise.all([
        page.goto(url, {
            timeout: 0,
            waitUntil: "load",
        }),
        page.setViewport({width: 1920, height: 3460}),
    ]);

    const news = await page.evaluate(() => {
        const websiteBody = document.querySelector('div.blogroll-inner');
        const articles = websiteBody.querySelectorAll('article');
        const results: Loudwire[] = [];
        const textContent = (elem: any) => elem ? elem.innerText : '';
        articles.forEach(article => results.push(
            {
                title: textContent(article.querySelector('.title')),
                date: textContent(article.querySelector('time')),
                image: article.querySelector('.theframe').getAttribute('style').substring(23, 
                       article.querySelector('.theframe').getAttribute('style').length - 3),
            }
        ))
        return results;
    })
    await browser.close();
    return news;
}

async function printDemo() {
    const array = await scrapeLoudwireNews();
    for (let a of array) {
        console.log("\"" + a.title + "\"\n\ton " + a.date);
        console.log("\timg ref: " + a.image);
        console.log("");
    }
}

printDemo();