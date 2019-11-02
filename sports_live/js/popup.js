$("input[type=checkbox]").on("change", () => {
  let request = [];
  let $checkbox = $('input[type=checkbox]')
  let length_of_settings = $checkbox.length
  // 設定をリクエストに詰め込む
  for (var i = 0; i < length_of_settings; i++) {
    // i番目のチェックボックスがチェックされているかを判定
    if ($checkbox[i].checked) {
      request.push($checkbox[i].value)
    }
  }
  // backgroundにリクエストを飛ばす
  chrome.runtime.sendMessage({ status: "article_settings", request: request }, (response) => {
  });
});