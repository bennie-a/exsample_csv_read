let fileInput = document.getElementById('csv_file');
let message = document.getElementById('message');
let fileReader = new FileReader();
$('#err').hide();
// ファイル変更時イベント
fileInput.onchange = () => {
  message.innerHTML = "読み込み中..."

  let file = fileInput.files[0];
  // ファイル名取得
  let filename = file.name;

  //ファイル拡張子取得
  let extension = filename.substr(filename.indexOf("."), 4);
  if (extension != ".txt") {
    toErr('タブ区切りの.txtファイルを選択してください。');
    return;
  }
  fileReader.readAsText(file, "UTF-8");
};

// ファイル読み込み時
let items = [];
fileReader.onload = () => {

  // ファイル読み込み
  let fileResult = fileReader.result.split('\r\n');

  // 先頭行をヘッダとして格納
  let header = fileResult[0].split('\t');
  // 先頭行の削除
  fileResult.shift();

  // CSVから情報を取得
  items = fileResult.map(item => {
    let datas = item.split('\t');
    let result = {};
    for (const index in datas) {
      let key = header[index];
      result[key] = datas[index];
    }
    return result;
  });

  let formats = {"スタンダード":"4243329", "パイオニア": "4243326", "モダン":"4243328", "レガシー":"4243325"};
  //expansion.xmlの読み込み
  $.ajax({
    url: 'xml/expansion.xml',
    type: 'GET',
    dataType: 'XML',
    cache: false,
    success:function(data) {
      var expansions = [];
      $(data).find('row').each(function() {
        var paras = $(this).find('para').map(function(index) {
          var array = [];
          if (index == 1 || index == 3 || index == 4) {
            array.push($(this).text());
          }
          return array;
      });
      expansions.push(paras);
      });
      //TSVの内容を表示
      let textarea = "";
      for (item of items){
        let name = item['商品名'];
        if (name == null) {
          continue;
        }
        let id = item['商品ID'];
        name = name.replaceAll('\"', '');
        let attrs = name.split(/【(.*?)】/).filter(function(value){
          if (value == '' || value == 'Foil') {
            return;
          }
          return value;
        });
        let attr = attrs[0];
        let category = expansions.filter(function(value) {
          if (value[0] == attr) {
            return value[1];
          }
        });
        // カテゴリIDの取得
        let exIds = [];
        let formatId = formats[category[0][2]];
        if (formatId != null) {
          exIds.push(formatId);
        }
        exIds.push(category[0][1]);
        textarea += id + ',' + name + ", " +exIds.join(",") + "\r\n";
      }
      $('textarea').text(textarea);
      message.innerHTML = items.length + "件のデータを読み込みました。";
    },
    error:function(err) {
      console.log(err);
    }
  });
}

// ファイル読み取り失敗時
fileReader.onerror = () => {
  items = [];
  message.innerHTML = "ファイル読み取りに失敗しました。"
}

function toErr(msg) {
  $('#msg').hide();
  $('#err-massage').text(msg);
  $('#err').show();
}
