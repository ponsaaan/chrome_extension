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
    let newMsg
    // 新しいメッセージがあるかどうかをチェック
    let existKey = checker(2019062301, 'value')

    // ID=2019062301, インデックスが0番目の新しいメッセージを取得
    if(existKey) {
      newMsg = getter(2019062301, 'value', existKey);
    } else {
      newMsg = '新しいメッセージはありません'
    }

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
function checker(id, value) {

  // idが違えばfalse
　if(id != 2019062301) {
    return;
  }

  // そもそも何もなければfalse
  if(Object.keys(msgDict[value]).length == 0) {
    return;
  }

  // メッセージが存在しなければfalse
  for(key in msgDict[value]) {
    if(msgDict[value][key].length == 0) {
      return;
    } else {
      return key
    }
  }
  return;
}

// 新しいメッセージを取得する
function getter(id, value, existKey) {

  let msgDescription = msgDict[value][existKey]
  // 配列の一番最初を取り出す
  newMsg = msgDescription[0]
  // 一度取り出したら削除
  msgDescription.shift()
  return newMsg
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
