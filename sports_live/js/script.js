const TRANSMISSION_INTERVAL_MS = 10000;
const DISPLAY_TIME_MS = 8000;

$('body').before('<div id="dammie"></div>');
$('body').before('<div id="flash"></div>');

// backgroundにリクエストを送る処理
function flowMessage() {
  chrome.runtime.sendMessage({ status: "start" }, (response) => {
    if(response.status == "go") {
      // ストレージにセットされたメッセージを取得する
      getter();
    } else if(response.status == "notGo") {
      console.log('表示するメッセージがありません');
    } else {
      console.error('不正なリクエストです');
    }
    return true;
  });
}

// storageのメッセージを取得する処理
function getter() {
  let value = {
    responseTitle: '',
    link: ''
  }
  // storageに'msg'というkeyで保存されているメッセージを取得する
  chrome.storage.sync.get(['msg'], (result) => {
    msgJson = result.msg;
    value.responseTitle = msgJson['title']
    value.link = msgJson['link']
    handleMsg(value.responseTitle, value.link);
  });
}

function handleMsg(msg, link) {
  // メッセージを流す箱を用意
  const DIV = document.createElement('div');
  const A_TAG = document.createElement('a');
  A_TAG.setAttribute('href', link);
  A_TAG.setAttribute('target', '_blank');
  A_TAG.setAttribute('rel', 'noopener noreferrer');
  A_TAG.style.color = "#FFFFFF";
  A_TAG.innerText = msg;
  DIV.appendChild(A_TAG);

  const EFFECT = [{
    left: window.innerWidth + 'px'
  }, {
    left: -DIV.offsetWidth + 'px'
  }]

  const TIMING = {}
  TIMING.duration = (DISPLAY_TIME_MS) * (window.innerWidth + DIV.offsetWidth) / window.innerWidth
  TIMING.iterations = 1
  TIMING.easing = 'linear' 

  // DIVのフォント
  DIV.setAttribute('class', 'message');
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
  // ホバー時にアニメーションを止める
  DIV.hover() = () => {
    $('.message').delay(10000);
  }
}

function innerMethod() {
  return new Promise(function(resolve, reject) {
  setTimeout(function() {resolve("test"); }, 10000);});
}
// 非同期処理をPromiseを使わずに記述
async function sample() {
  window.alert("これは非同期処理です。Promiseと同じです。");
  const result = await innerMethod(); // innerMethodを呼び出し、innerMethodがresolveを行うまで処理を待機する
  return "success";
}

let flag = true;
// while(flag) {
//   // backgroundと通信してメッセージを取得する
//   (async() => {
//     await flowMessage();
//     sample().then(function(result) {
//       window.alert(result);
//     });
//   })();
// }
