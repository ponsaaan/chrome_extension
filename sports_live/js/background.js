const BASE_URL = 'https://lzpwr97xdc.execute-api.ap-northeast-1.amazonaws.com/demo'
// とりあえず静的に保存
let msgObject;
let count = 0

msgObject = getArticles();

// scriptからリクエストが飛んできたら実行される処理
chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if(request.status == "start") {
    console.log(msgObject)

    let newMsg
    // 新しいメッセージがあるかどうかをチェック
    let isExistMsg = checker(msgObject)

    // 新しいメッセージを１つ取得
    if(isExistMsg) {
      newMsg = getter(msgObject);
    } else {
      newMsg = '新しいメッセージはありません'
    }

    if(newMsg) {
      // ストレージにメッセージを一件セットする
      setter(newMsg);
      sendResponse({ status: "go" });
    } else {
      sendResponse({ status: "notGo" });
    }
  }
  sendResponse({ status: "invalid request" });
});

// APIを叩いて記事情報を取得する
function getArticles() {
    let request = new XMLHttpRequest();
    request.open('GET', BASE_URL);
    request.onreadystatechange = () => {
        if (request.readyState != 4) {
            // リクエスト中
            msgObject = null;
        } else if (request.status != 200) {
            // 失敗
            console.error('通信に失敗しました');
            msgObject = null;
        } else {
            // 取得成功
            let msgString = request.responseText;
            msgObject = JSON.parse(msgString)
        }
    }
    request.send(null);
    return msgObject;
}

// 新しく値が入っているかをチェックする
function checker(msgArray) {

  // そもそも何もなければfalse
  if(msgArray.length == 0) {
    return false;
  }
  return true;
}

// 新しいメッセージを取得する
function getter(msgArray) {
  // 配列の一番最初を取り出す
  newMsg = msgArray[0]
  // 一度取り出したら削除
  msgArray.shift()
  return newMsg
}

// storageにメッセージを保存する。
// storageにはいくつも保存できる？
// ここではmsgというkeyで一つだけ保存する想定
function setter(msg) {
  if (!msg) {
    return;
  }
  // Chrome extension storage APIを使って保存する
  chrome.storage.sync.set({'msg': msg}, () => {
  });
}
