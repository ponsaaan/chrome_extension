const TRANSMISSION_INTERVAL_MS = 8000;
const DISPLAY_TIME_MS = 10000;

$('body').before('<div id="dammie"></div>');
$('body').before('<div id="flash"></div>');

// 1分ごとにbackgroundと通信を行う処理
setInterval(() => {
  sender();
  console.log("ループ中");
}, TRANSMISSION_INTERVAL_MS);

// backgroundにリクエストを送る処理
function sender() {
  chrome.runtime.sendMessage({ status: "start" }, (response) => {
  
    if(response.status == "go") {
      console.log("displayメソッドを実行します");
      display();
    } else if(response.status == "notGo") {
      console.log("新しいメッセージがありません");
    } else {
      console.log("不正なリクエストです");
    }
  });
}

// storageに'msg'というkeyで保存されているメッセージを取得して表示する
function display() {
  chrome.storage.sync.get(['msg'], (result) => {
    let answerText = result.msg;
    console.log("storageから" + answerText + "を取得しました");
    console.log("#flashを書き換えます");
    handleMsg(answerText);
  });
}

function handleMsg(msg) {
  // 全てgoogle.comへのリンクを設定する
  const DIV = document.createElement('div');
  const A_TAG = document.createElement('a');
  A_TAG.setAttribute('href', 'https://www.google.com/');
  A_TAG.innerText = msg;
  DIV.appendChild(A_TAG)

  const EFFECT = [{
    left: window.innerWidth + 'px'
  }, {
    left: -DIV.offsetWidth + 'px'
  }]

  const TIMING = {}
  TIMING.duration = (DISPLAY_TIME_MS) * (window.innerWidth + DIV.offsetWidth) / window.innerWidth
  TIMING.iterations = 1
  TIMING.easing = 'linear'

  // メッセージのフォント
  DIV.style.position = 'fixed'
  DIV.style.left = window.innerWidth + 'px'
  DIV.style.top = 5 + 'px'
  DIV.style.fontSize = 16 + 'px'
  DIV.style.fontWeight = 'bold'
  DIV.style.color = '#000000'
  DIV.style.whiteSpace = 'pre'
  DIV.style.zIndex = 2147483647

  document.body.appendChild(DIV)

  // 右から左へ流すアニメーション
  // アニメーションが終わるタイミングでメッセージを削除
  DIV.animate(EFFECT, TIMING).onfinish = () => {
    document.body.removeChild(DIV)
  }
}


