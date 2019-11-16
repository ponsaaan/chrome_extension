$(() => {
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
      return true;
    });
  }

  function handleMsg(msg, link) {
    // メッセージを流す箱を用意
    const DIV = document.createElement('div');
    const A_TAG = document.createElement('a');
    DIV.setAttribute('class', 'message');
  //  DIV.style.position = 'fixed'
  //  DIV.style.left = window.innerWidth + 'px'
  //  DIV.style.top = 2 + 'px'
  //  DIV.style.fontSize = 16 + 'px'
  //  DIV.style.fontWeight = 'bold'
  //  DIV.style.whiteSpace = 'pre'
  //  DIV.style.zIndex = 2147483647
    A_TAG.setAttribute('target', '_blank');
    A_TAG.setAttribute('rel', 'noopener noreferrer');
    A_TAG.style.color = "#FFFFFF";
    A_TAG.setAttribute('href', link);
    A_TAG.innerText = msg;
  //
    const EFFECT = [{
      left: window.innerWidth + 'px'
    }, {
      left: -DIV.offsetWidth + 'px'
    }]
  //
    const TIMING = {}
    TIMING.duration = (DISPLAY_TIME_MS) * (window.innerWidth + DIV.offsetWidth) / window.innerWidth
    TIMING.iterations = 1
    TIMING.easing = 'linear'

    DIV.appendChild(A_TAG);
    document.body.appendChild(DIV)

    // 右から左へ流すアニメーション
    // アニメーションが終わるタイミングでメッセージを削除
    $(() => {
      $('.message').animate(EFFECT, TIMING);
      // アニメーションが終了した時の処理
      $('.message').on('animationend', () => {
        document.body.removeChild($('.message'));
        flowMessage();
      });
      // ホバー時にアニメーションを止める
      $('.message').on({
        'mouseenter' : function(){
            $('.message').pause();
        },
        'mouseleave' : function(){
            $('.message').resume();
        }
      });
    });
  }
  flowMessage();
});
