const remote = require("electron").remote;

let buildpath = require("path").join;

let path = remote.app.getAppPath();

let imonke = require("imonke");

const name = require(
    buildpath(
        path, 
        "/monkelib/values.js",
    ),
).config.name;

document.title = name + " Feed";

const createCss = async (path) => {
    let myCss = document.createElement("link");
    myCss.type = "text/css";
    myCss.rel = "stylesheet";
    myCss.href = path;
    return myCss;
}; // Creates a css element

const css = async () => {
    let scripts = document.getElementById("scripts");
    let index = [
        createCss(
            buildpath(
                path, 
                "/monkeshare/centered-content.css"
            ),
        ),
        createCss(
            buildpath(
                path, 
                "/monkeshare/shared-lib.css"
            ),
        ),
    ];
    for (let value in index) {
        scripts.appendChild(
            await index[value],
        );
    };
}; // Adds some css scripts to an element

const awaitTasks = async (tasks) => {
    for (let index in tasks) {
        await tasks[index];
    };
}; //Awaits a list of async functions

const createFeed = async () => {
    let feed = document.createElement("div");
    return feed;
}; // Creates a feed object using a div tag

const br = () => {
    return document.createElement("br");
}; // Creates a break html tag

const createFeedObject = async (data) => {
    let tasks = [];

    let user = new imonke.User(
        {
            id: data.author,
        },
    );
    
    tasks.push(
        user.get()
    );

    let FeedObject = document.createElement("div");

    const addFeedValues = (values) => {
        for (let value in values) {
            FeedObject.appendChild(
                values[value],
            );
        };
    };

    FeedObject.className += "container";

    let pfp = document.createElement("img");

    pfp.className += "Monkepfp centered-content";

    let authorName = document.createElement("span");
	
    authorName.className += "MonkeText";
	
    await awaitTasks(tasks);

    authorName.innerText = user._data.nick;

    pfp.innerText += user._data.nick

    pfp.src = buildpath(
        path, 
        "/monkeshare/imonke.png",
    );
	
	
    let likebutton = document.createElement("img");

    likebutton.className += "Monkepfp centered-content";
    
    likebutton.src = buildpath(
        path, 
        "/monkeshare/up.png",
    );
	
    let likecounter = document.createElement("span");
	    
    likecounter.className += "CounterText";
	
    likecounter.innerText = data.like_count.toString();
	
	
    let dislikebutton = document.createElement("img");

    dislikebutton.className += "Monkepfp centered-content";
	
    dislikebutton.src = buildpath(
        path, 
        "/monkeshare/down.png",
    );
	
    let dislikecounter = document.createElement("span");
	
    dislikecounter.className += "CounterText";
	
    dislikecounter.innerText = data.dislike_count.toString();
	

    let post = document.createElement("img");

    post.alt = "Monke";

    post.className += "centered-content Monkepic";

    post.src = data.file_url;

    addFeedValues(
        [
            br(),
            br(),
            post,
            br(),
            br(),
            pfp,
            authorName,
	        likebutton,
	        likecounter,
	        dislikebutton,
	        dislikecounter,
            br(),
        ],
    );
    return FeedObject;
}; // Creates the feed object (Picture, pfp, user)

const feed = async () => {

    let feedOverview = await createFeed();

    let MonkeFeedObject = new imonke.Feed(
        {
            feed: "all",
        },
    );

    let MonkeFeedPromised = MonkeFeedObject.get();

    document.getElementById("feed").appendChild(feedOverview);

    let tasks = [];

    let MonkeFeed = await MonkeFeedPromised;
    
    for (let index in MonkeFeed) {
        tasks.push(
            createFeedObject(
                MonkeFeed[index]._data,
            ),
        );
    };

    for (let task in tasks) {
        let promised = await tasks[task];
        feedOverview.appendChild(
            promised,
        );
    };
}; // Creates the feed overview and parses feed content from iMonke

css();
feed();
