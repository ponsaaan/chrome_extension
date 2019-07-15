console.log("hello!!");

// とりあえず静的に保存
let msgDict = {}
let url = 'https://pu1yzwrjuh.execute-api.ap-northeast-1.amazonaws.com/prod?ID=2019062301'

var request = new XMLHttpRequest();
request.open('GET', url);
request.onreadystatechange = function () {
    if (request.readyState != 4) {
        // リクエスト中
    } else if (request.status != 200) {
        // 失敗
    } else {
        // 取得成功
        msgDict = request.responseText;
        // json化のためにstringの中身を調整
        msgDict = msgDict.replace('value', ', "value"')
        msgDict = msgDict.replace('ID', '"ID"')
        msgDict = JSON.parse(msgDict)
    }
};

request.send(null);

// scriptからリクエストが飛んできたら実行される処理
chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
  if(request.status == "start") {
    var newMsg = checker(msgDict["ID"]);
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
function checker(id) {
  if(id == 2019062301) {
      var newMsg;
      msgValue = msgDict["value"]
      if(Object.keys(msgValue).length > 0) {
        var msgDescription = msgValue["1回表"]

        // 配列の左から順番に取り出す.
        if(msgDescription.length > 0) {
          newMsg = msgDescription[0]
          // 一度取り出したら削除
          msgDescription.shift()
        } else {
          newMsg="新しいメッセージはありません"
        }
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
