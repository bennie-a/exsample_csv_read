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
  let header = fileResult[0].split(',').map(key => {
    if(key == "Name") {
      key = "cardname";
    }
    return key;
  });
  // 先頭行の削除
  fileResult.shift();

  // CSVから情報を取得
  items = fileResult.map(item => {
    let datas = item.split(',');
    let result = {};
    for (const index in datas) {
      let key = header[index];
      result[key] = datas[index];
    }
    return result;
  });

  // 言語
  const langs = {"日本語":"[JP]","英語":"[EN]" };

// Foil/非Foil
  const isFoil = {"Yes":"【Foil】", "No": ""};

  //　CSVの内容を表示
  let textarea = "";
  for (item of items) {
    if (item.cardname != "") {
      cardname =  isFoil[item.Foil] +"【2×2】" +  item.cardname + langs[item['言語']] ;
      textarea += "," + cardname + ",,,," + item['価格'] + ",1,1," + item['公開']   + "\r\n";
    }
  }
  document.getElementById("cardnames").value = textarea;
  // tbody.innerHTML = tbody_html;

  message.innerHTML = items.length + "件のデータを読み込みました。"
  // $('#ex-name').load('expansion.html', function(data, status, object) {
  //   if(status === 'success') {
  //     console.log('読み込みが正常に行われました');
  //   }
  // });
}

// ファイル読み取り失敗時
fileReader.onerror = () => {
  items = [];
  message.innerHTML = "ファイル読み取りに失敗しました。"
}
