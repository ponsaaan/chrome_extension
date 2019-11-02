const TRANSMISSION_INTERVAL_MS = 10000;
const DISPLAY_TIME_MS = 8000;

$('body').before('<div id="dammie"></div>');
$('body').before('<div id="flash"></div>');

// 定期にbackgroundと通信を行う処理
setInterval(() => {
  sender();
}, TRANSMISSION_INTERVAL_MS);

// backgroundにリクエストを送る処理
function sender() {
  chrome.runtime.sendMessage({ status: "start" }, (response) => {
    if(response.status == "go") {
      // ストレージにセットされたメッセージを表示する
      display();
    } else if(response.status == "notGo") {
      console.log("新しいメッセージがありません");
    } else {
      console.error("不正なリクエストです");
    }
  });
}

function display() {
  let responseTitle = "";
  let link = "";
  // storageに'msg'というkeyで保存されているメッセージを取得する
  chrome.storage.sync.get(['msg'], (result) => {
    msgJson = result.msg;
    responseTitle = msgJson['title']
    link = msgJson['link']
    handleMsg(responseTitle, link);
  });
}

function handleMsg(msg, link) {
  const DIV = document.createElement('div');
  const A_TAG = document.createElement('a');
  A_TAG.setAttribute('href', link);
  A_TAG.setAttribute('target', '_blank');
  A_TAG.setAttribute('rel', 'noopener noreferrer');
  A_TAG.style.color = "#FFFFFF"
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
  DIV.style.top = 2 + 'px'
  DIV.style.fontSize = 16 + 'px'
  
  DIV.style.fontWeight = 'bold'
  DIV.style.whiteSpace = 'pre'
  DIV.style.zIndex = 2147483647

  document.body.appendChild(DIV)

  // 右から左へ流すアニメーション
  // アニメーションが終わるタイミングでメッセージを削除
  DIV.animate(EFFECT, TIMING).onfinish = () => {
    document.body.removeChild(DIV)
  }
}


