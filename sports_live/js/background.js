console.log("hello!!!!!!!!!");

let msgArray = []
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
    newMsg="新しいメッセージです"
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
