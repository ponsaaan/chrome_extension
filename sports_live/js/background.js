const BASE_URL = 'https://lzpwr97xdc.execute-api.ap-northeast-1.amazonaws.com/demo';
let count = 0;
let msgObject;
let requestArticle = ['hatena', 'qiita'];

// ユーザーの設定を読み込む
function readSettings() {
  // どの記事をリクエストするかの設定

  // 記事を流すスピードの設定

}

// APIを叩いて記事情報を取得する
async function getArticles() {
    // ID=1（hatenaの記事を取得）
    let hatena = await getHatena()
    // ID=2（qiitaの記事を取得）
    let qiita = await getQiita()

    return {
        'hatena': hatena,
        'qiita': qiita
    }
}

async function getQiita() {
    try {
        let res = await fetch(BASE_URL + '?ID=1');
        let json = await res.json();
        return json;
    } catch(error) {
        console.log(error)
    }
}

async function getHatena() {
    try {
        let res = await fetch(BASE_URL + '?ID=2');
        let json = await res.json();
        return json;
    } catch(error) {
        console.log(error)
    }
}

// 新しく値が入っているかをチェックする
function checker(msgObject) {

  // そもそも何もなければfalse
  if(msgObject == null || Object.keys(msgObject).length == 0) {
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
  return newMsg;
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

(async() => {
    // readSettings();
    msgObject = await getArticles();
    console.log(msgObject);
    // scriptからリクエストが飛んできたら実行される処理
    chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
      if(request.status == "start") {
        // ユーザーの設定情報から表示する記事をランダムに１つ読み込む
        let genreOfArticle = requestArticle[Math.floor(Math.random() * requestArticle.length)]
        let newMsg

        // 新しいメッセージを１つ取得
        if(msgObject != null && Object.keys(msgObject).length != 0 && checker(msgObject[genreOfArticle])) {
          newMsg = getter(msgObject[genreOfArticle]);
        } else {
          newMsg = null
        }

        if(newMsg) {
          // ストレージにメッセージを一件セットする
          setter(newMsg);
          sendResponse({ status: "go" });
        }
        console.log(newMsg)
        sendResponse({ status: "notGo" });
      }
      if(request.status == "article_settings") {
        requestArticle = request.request
        console.log(requestArticle)
      }
      sendResponse({ status: "invalid request" });
    });
})();

