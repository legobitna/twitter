let inputArea = document.getElementById("inputArea");
let remainArea = document.getElementById("remain");
let MAX_NUM = 140;
let remaining = MAX_NUM;
let tweetList = [];
let idNum = 0;
inputArea.addEventListener("input", countLetter);

function countLetter() {
  remaining = MAX_NUM - inputArea.value.length;
  if (remaining < 0) {
    remainArea.style.color = "red";
  } else {
    remainArea.innerHTML = `${remaining}is remainning`;
  }
}

function post() {
  let message = inputArea.value;
  let splitedMessage = message.split(" ");

  const messageFormatting = splitedMessage.map((word) => {
    let formatmessage = "";
    if (word.startsWith("#")) {
      formatmessage += `<a onclick="findHashTag('${word}')" href="#" style="color:blue">${word}</a>`;
    } else if (word.startsWith("@")) {
      formatmessage += `<span style="color:blue">${word}</span>`;
    } else if (
      word.endsWith(".jpg") ||
      word.endsWith(".JPG") ||
      word.endsWith(".png") ||
      word.endsWith(".PNG") ||
      word.endsWith(".gif") ||
      word.endsWith(".GIF")
    ) {
      formatmessage += `<img class="imgRneder" src="${word}">`; // or you can use iframe
    } else {
      formatmessage += word;
    }
    return formatmessage;
  });

  const findHashTag = splitedMessage.filter((word) => word.startsWith("#"));

  let tweet = {
    id: idNum,
    contents: messageFormatting,
    hasTags: findHashTag,
    isLiked: false,
    isRetweet: false,
    retweets: [],
    parent: null,
  };
  idNum++;

  tweetList.push(tweet);
  inputArea.value = "";
  remaining = MAX_NUM;
  remainArea.innerHTML = `${remaining}is remainning`;
  render(tweetList);
}

function render(array) {
  let html = "";
  console.log("array", array);
  array.map((tweet, idx) => {
    let retweetHtml;
    if (tweet.parent !== null) {
      let parentTweet = array.find((item) => item.id == tweet.parent);
      console.log("pp", parentTweet);
      retweetHtml = `<p id="contents" style="border:3px solid red; margin-left:10px;">${parentTweet.contents.reduce(
        (sum, word) => sum + " " + word
      )}</p>`;
    }
    html += `
    <div style="border:3px solid blue; margin-bottom:10px;">
        <span id="contents">${tweet.contents.reduce(
          (sum, word) => sum + " " + word
        )}</span>
        ${
          tweet.parent == null
            ? `<a href="#" onclick="reTweet(${tweet.id})">
            retweet
          </a>`
            : ""
        }
        
        <a href="#" onclick="like(${tweet.id})">${
      tweet.isLiked ? "dislike" : "like"
    }</a>
        <a href="#" onclick="tweetDelete(${tweet.id})">delete</a>
        <div>${retweetHtml ? retweetHtml : ""}</div></div>`;

    return html;
  });

  document.getElementById("resultArea").innerHTML = html;
}

function findHashTag(word) {
  console.log(word);
  let filteredList = tweetList.filter((tweet) => tweet.hasTags.includes(word));
  console.log("tags list", filteredList);
  render(filteredList);
}

function like(num) {
  let thisTweet = tweetList.find((tweet) => tweet.id == num);
  thisTweet.isLiked = !thisTweet.isLiked;
  console.log(thisTweet);
  render(tweetList);
}

function tweetDelete(num) {
  let thisTweet = tweetList.find((tweet) => tweet.id == num);
  if (thisTweet.parent != null) {
    let parentTweet = tweetList.find((tweet) => tweet.id == thisTweet.parent);
    parentTweet.retweets = parentTweet.retweets.filter(
      (id) => id != thisTweet.parent
    );
  }
  if (thisTweet.retweets != null) {
    tweetList = tweetList.filter(
      (tweet) => !thisTweet.retweets.includes(tweet.id)
    );
  }

  tweetList = tweetList.filter((tweet) => tweet != thisTweet);
  render(tweetList);
}

function reTweet(num) {
  let thisTweet = tweetList.find((tweet) => tweet.id == num);
  let newTweet = {
    id: idNum++,
    contents: ["retweet"],
    hasTags: [],
    isLiked: false,
    isRetweet: true,
    retweets: [],
    parent: thisTweet.id,
  };
  tweetList.push(newTweet);
  thisTweet.isRetweet = true;
  console.log("after retweet", tweetList);
  thisTweet.retweets.push(newTweet.id);
  render(tweetList);
}
