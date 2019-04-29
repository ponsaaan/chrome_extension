
$('body').before('<div id="dammie"></div>');
$('body').before('<div id="flash"></div>');

// 1分ごとにbackgroundと通信を行う処理
setInterval(function(){
  sender();
  console.log("ループ中");
},10000);

// backgroundにリクエストを送る処理
function sender() {
  chrome.runtime.sendMessage({ status: "start" }, function (response) {
  
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
  chrome.storage.sync.get(['msg'], function(result) {
    var answerText = result.msg;
    console.log("storageから" + answerText + "を取得しました");
    console.log("#flashを書き換えます");
    handleMsg(answerText);
  });
}

function handleMsg(msg) {
  const t = document.createElement('div');
  const effect = [{
    left: window.innerWidth + 'px'
  }, {
    left: -t.offsetWidth + 'px'
  }]
  const timing = {}
  timing.duration = (10000) * (window.innerWidth + t.offsetWidth) / window.innerWidth
  timing.iterations = 1
  timing.easing = 'linear'

  // メッセージのフォント
  t.innerText = msg;
  t.style.position = 'fixed'
  t.style.left = window.innerWidth + 'px'
  t.style.top = 5 + 'px'
  t.style.fontSize = 16 + 'px'
  t.style.fontWeight = 'bold'
  t.style.color = '#000000'
  t.style.whiteSpace = 'pre'
  t.style.zIndex = 2147483647

  document.body.appendChild(t)

  // 右から左へ流すアニメーション
  // アニメーションが終わるタイミングでメッセージを削除
  t.animate(effect, timing).onfinish = function () {
    document.body.removeChild(t)
  }
}


