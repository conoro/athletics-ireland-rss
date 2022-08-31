import axios from 'axios';
import cheerio from 'cheerio';
import { Feed } from "feed";

export class AthleticsIrelandScraper {
    async scrapeNews(url: string) {

        const feed = new Feed({
            title: "Athletics Ireland News Feed",
            description: "RSS feed for Athletics Ireland website",
            id: "https://www.athleticsireland.ie/news",
            link: "https://www.athleticsireland.ie/news",
            language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
            image: "https://www.athleticsireland.ie/images/news/AI_Logo.jpg",
            favicon: "https://www.athleticsireland.ie/favicon.ico",
            copyright: "2019 © Athletics Ireland. All Rights Reserved.",
            updated: new Date(), // optional, default = today
            generator: "AWS Lambda", // optional, default = 'Feed for Node.js'
            feedLinks: {
              rss: "https://example.com/rss"
            },
            author: {
              name: "Athletics Ireland",
              email: "admin@athleticsireland.ie",
              link: "https://www.athleticsireland.ie/about/contact-us/meet-the-team"
            }
          });

        const response = await axios.get(url);
        const html = response.data;

        const $ = cheerio.load(html);
        $(".news-story").each(function() {
            let story = $(this).find("h3").first().find("a").first();
            let postLink = story.attr("href");
            let postText = story.text();
            //console.log(postText);
            //console.log(postLink);
            let pubdate = $(this).find("span.date").first().text();
            let dateElements = pubdate.split(" / ");
            let publishDateTime = new Date(Number(dateElements[2]) + 2000, Number(dateElements[1])-1, Number(dateElements[0]));
            //console.log(publishDateTime);
            let imageURL =  $(this).find("img").attr("src");
            console.log(imageURL);

            feed.addItem({
                title: postText,
                id: postLink,
                link: postLink,
                description: postText,
                content: postText,
                author: [
                  {
                    name: "Athletics Ireland",
                    email: "admin@athleticsireland.ie",
                    link: "https://www.athleticsireland.ie/about/contact-us/meet-the-team"
                  }
                ],
                date: publishDateTime
              });

        });
        //console.log(feed.rss2());
    }
}

async function main() {
    const scraper = new AthleticsIrelandScraper();
    await scraper.scrapeNews("https://www.athleticsireland.ie/news");
}

main();
