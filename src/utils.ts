
import { setUser, readConfig } from "./config";
import {createUser, getUser, resetDB, getUsers, getUserbyID} from 'src/lib/db/queries/users'
import { XMLParser } from "fast-xml-parser";
import { addFeed, fetchFeeds } from "./lib/db/queries/feeds";
import { type Feed , type User} from "./lib/db/schema";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
    title: string,
    link: string,
    description: string,
    pubDate: string
};


// utilities

async function fetchFeed(feedURL:string): Promise<RSSFeed>{
    // fetching the raw XML
    const settings : RequestInit= {
        method:"GET",
        headers: {'User-Agent': 'gator'}
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

    if(!channel){
        throw new Error('[fetchFeed] response object does not contain a channel field.');
    }

    if(channel.title && channel.link && channel.description){
        if(channel.title !== '' && channel.link !== '' && channel.description !== ''){
            RSSObj.channel.title = channel.title;
            RSSObj.channel.link = channel.link;
            RSSObj.channel.description = channel.description;}
        else{
            throw new Error('[fetchFeed] channel object fields are empty.');
        }
        
        if(Array.isArray(channel.item)){
            for(const item of channel.item){
                const result = processItem(item);
                if(result){
                    RSSObj.channel.item.push(result);
                }
            }
        }
        else if(channel.item){
            const result = processItem(channel.item);
                if(result){
                    RSSObj.channel.item.push(result);
                }
        }
        else{
            RSSObj.channel.item = [];
        }

    }
    else{
        throw new Error('[fetchFeed] channel object does not contain the required field.');
    }
    return RSSObj;
}

function processItem(item: any): RSSItem | undefined{
    if(item.title && item.title.trim() !== '' 
    && item.link && item.link.trim() !== '' 
    && item.description.trim() !== '' && item.description
    && item.pubDate.trim() !== ''  && item.pubDate){
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
function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.created_at}`);
  console.log(`* Updated:       ${feed.updated_at}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}

// Command handlers 
export async function loginHandler (cmdName: string, ...args: string[]){
    if (args.length === 0){
        console.log('Invalid arguments, please provide a usernamme');
        process.exit(1);
    }
    if (args.length > 1 ){
        console.log(`Extra arguments provided. Your username is ${args[0]}`);
    }
    if(!await getUser(args[0])){
        throw new Error('User does not exist, please enter a valid user.')
    }
    setUser(args[0]);
    console.log(`User ${args[0]}, logged in successfully`);
}
export async function registerUserHandler(cmdName:string, ...args: string[]) {
    //console.log("Reached registerUserHandler");
    if (args.length === 0){
        throw new Error('Invalid arguments, please provide a username');
    }
    const name = args[0]
    if(await getUser(name)){
        throw new Error('User already exists');
    }
    else{
        //console.log('No user found. calling createUser');
        await createUser(name);
        setUser(name);
        console.log(`User ${name} created successfully`);
        console.log(await getUser(name));
    }
}
export async function resetHandler(cmdName:string) {
    console.log('Resetting database');
    await resetDB();
}
export async function listHandler(cmdName:string) {
    const userNames = await getUsers();
    for (const obj of userNames[0]){
        if(obj.name === readConfig().currentUserName){
            console.log('*',obj.name, '(current)');
        }
        else{
            console.log('*',obj.name);
        }

    };
}
export async function aggHandler(cmdName:string) {
    const rssFeed = await fetchFeed('https://www.wagslane.dev/index.xml');
    console.log(rssFeed);
    for(const item of rssFeed.channel.item){
        console.log(item);
    }
}
export async function addFeedHandler(cmdName: string, ...args:string[]){
    if(!readConfig().currentUserName){
        throw new Error('Error, no user logged in.')
    }
    const name = args[0];
    if(!name || name.trim()=== ''){
        throw new Error('Error adding Feed. Please provide a username');
    }
    const url = args[1];
    if(!url || url.trim()=== ''){
        throw new Error('Error adding Feed. Please provide a URL.');
    }
    const user = await getUser(readConfig().currentUserName);

    if(!user){
        throw new Error('Error, user not found.')
    }
    //const feed = await fetchFeed(url.trim());

    const feed = await addFeed(name, url, user.id);
    printFeed(feed, user);
}
export async function feedsHandler(cmdName:string) {


    const feeds = await fetchFeeds();
    //console.log('[Debug]','Feed: ',feeds);
    
    for(const item of feeds){
        //console.log(item.name, item.user_id);
        const user = await getUserbyID(item.user_id)
        //console.log('Fetched user:', user);
        printFeed(item, user);
    }

}
