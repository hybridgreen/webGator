
import { XMLParser } from "fast-xml-parser";
import { type Feed, type User, type Post } from "../lib/db/schema";
import { createPost, getPostsbyFeedid, getPostsUrls } from "../lib/db/queries/posts";
import { resetDB } from "src/lib/db/queries/users";
import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds";

type RSSFeed = {
    channel: {
        title: string;
        link: string;
        description: string;
        item: RSSItem[];
    };
};
export type RSSItem = {
    title: string,
    link: string,
    description: string,
    pubDate: string,
};

// utilities

async function fetchFeed(feedURL: string): Promise<RSSFeed> {
    // fetching the raw XML
    const settings: RequestInit = {
        method: "GET",
        headers: { 'User-Agent': 'gator' }
    };

    const response = await fetch(feedURL, settings);
    const responseString = await response.text();
    const parser = new XMLParser();

    const xml = parser.parse(responseString); // parse to XML
    const RSSObj: RSSFeed = { // empty RSS object to be filled in
        channel: {
            title: "",
            link: "",
            description: "",
            item: []
        }
    }

    let channel = xml.rss?.channel ?? xml.channel;

    if (!channel) {
        throw new Error('[fetchFeed] response object does not contain a channel field.');
    }

    if (channel.title && channel.link && channel.description) {
        if (channel.title !== '' && channel.link !== '' && channel.description !== '') {
            RSSObj.channel.title = channel.title;
            RSSObj.channel.link = channel.link;
            RSSObj.channel.description = channel.description;
        }
        else {
            throw new Error('[fetchFeed] channel object fields are empty.');
        }

        if (Array.isArray(channel.item)) {
            for (const item of channel.item) {
                const result = processItem(item);
                if (result) {
                    RSSObj.channel.item.push(result);
                }
            }
        }
        else if (channel.item) {
            const result = processItem(channel.item);
            if (result) {
                RSSObj.channel.item.push(result);
            }
        }
        else {
            RSSObj.channel.item = [];
        }

    }
    else {
        throw new Error('[fetchFeed] channel object does not contain the required field.');
    }
    return RSSObj;
}
function processItem(item: any): RSSItem | undefined {
    if (item.title && item.title.trim() !== ''
        && item.link && item.link.trim() !== ''
        && item.description.trim() !== '' && item.description
        && item.pubDate.trim() !== '' && item.pubDate) {
        const rssItem = {
            title: item.title,
            link: item.link,
            description: item.description,
            pubDate: item.pubDate
        }
        return rssItem;
    }
    return undefined;
}
async function scrapeFeeds() {
    const feed = await getNextFeedToFetch();
    if (!feed) {
        console.log(`No feeds to fetch.`);
        return;
    }
    console.log(`Found a feed to fetch!`);

    await markFeedFetched(feed.id);

    const feedData = await fetchFeed(feed.url);

    console.log(
        `Feed ${feed.name} collected, ${feedData.channel.item.length} posts found`,
    );
    const allPosts = await getPostsUrls();
    //console.log(allPosts);

    for (const item of feedData.channel.item) {
        if (!allPosts.includes(item.link)) {
            console.log('New post added:', (await createPost(feed, item)).title);
        }

    }
}
function parseDuration(durationStr: string) {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);
    if (!match) return;

    if (match.length !== 3) return;

    const value = parseInt(match[1], 10);
    const unit = match[2];
    switch (unit) {
        case "ms":
            return value;
        case "s":
            return value * 1000;
        case "m":
            return value * 60 * 1000;
        case "h":
            return value * 60 * 60 * 1000;
        default:
            return;
    }
}
function handleError(err: unknown) {
    console.error(
        `Error scraping feeds: ${err}`,
    );
}

// Agnostic Command handlers 
export async function resetHandler(cmdName: string) {
    console.log('Resetting database');
    await resetDB();
}
export async function aggHandler(cmdName: string, ...args: string[]) {

    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <time_between_reqs>`);
    }

    const timeArg = args[0];
    const timeBetweenRequests = parseDuration(timeArg);
    if (!timeBetweenRequests) {
        throw new Error(
            `invalid duration: ${timeArg} — use format 1h 30m 15s or 3500ms`,
        );
    }

    console.log(`Collecting feeds every ${timeArg}...`);

    // run the first scrape immediately
    scrapeFeeds().catch(handleError);

    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);
    }, timeBetweenRequests);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });
}


