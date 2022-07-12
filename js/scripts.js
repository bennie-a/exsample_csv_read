let fileInput = document.getElementById('csv_file');
let message = document.getElementById('message');
let fileReader = new FileReader();

// ファイル変更時イベント
fileInput.onchange = () => {
  message.innerHTML = "読み込み中..."

  let file = fileInput.files[0];
  fileReader.readAsText(file, "UTF-8");
};

// ファイル読み込み時
let items = [];
fileReader.onload = () => {
  // ファイル読み込み
  let fileResult = fileReader.result.split('\r\n');

  // 先頭行をヘッダとして格納
  let header = fileResult[0].split(',')
  // 先頭行の削除
  fileResult.shift();

  // CSVから情報を取得
  items = fileResult.map(item => {
    let datas = item.split(',');
    let result = {};
    for (const index in datas) {
      if (datas == null)  {
        continue;
      }
      let key = header[index];
      if(key === "Name") {
        key = "cardname";
      }
      if (key === "言語") {
        key = "lang";
      }
      result[key] = datas[index];
    }
    return result;
  });

  // テーブル初期化
  const langs = {"日本語":"[JP]","英語":"[EN]" };

  //　CSVの内容を表示
  let textarea = "";
  for (item of items) {
    if (item.cardname != "") {
      textarea += "【2×2】" + item.cardname + langs[item.lang] + "\r\n";
    }
  }
  document.getElementById("cardnames").value = textarea;
  // tbody.innerHTML = tbody_html;

  message.innerHTML = items.length + "件のデータを読み込みました。"
}

// ファイル読み取り失敗時
fileReader.onerror = () => {
  items = [];
  message.innerHTML = "ファイル読み取りに失敗しました。"
}
