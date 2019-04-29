console.log("hello!!");

// とりあえず静的に保存
let msgArray = []
var file = 'sample.json';
var xhr = new XMLHttpRequest();
xhr.open('GET', chrome.runtime.getURL(file), true);

xhr.onload = function() {
  if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
    msgArray = JSON.parse(xhr.responseText);
  }
};
xhr.send();

// scriptからリクエストが飛んできたら実行される処理
chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
  if(request.status == "start") {
    var newMsg = checker();
    if(newMsg) {
      setter(newMsg);
      sendResponse({ status: "go" });
    } else {
      sendResponse({ status: "notGo" });
    }
  }
  sendResponse({ status: "invalid request" });
});

// 新しく値が入っているかをチェックする
function checker() {
  var newMsg;
  if(true) {
    // 配列の左から順番に取り出す.
    if(msgArray.length > 0) {
      newMsg = msgArray[0]
      // 一度取り出したら削除
      msgArray.shift()
    } else {
      newMsg="新しいメッセージはありません"
    }
  }
  return newMsg;
}

// storageにメッセージを保存する。
// storageにはいくつも保存できる？
// ここではmsgというkeyで一つだけ保存する想定
function setter(msg) {
  if (!msg) {
    return;
  }
  // Save it using the Chrome extension storage API.
  chrome.storage.sync.set({'msg': msg}, function() {
  });
}
