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
  if (extension != ".txt" && extension != ".tsv") {
    toErr('タブ区切りの.txtファイルかtsvファイルを選択してください。');
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
  let header = fileResult[0].split('\t').map(key => {
    if(key == "Name") {
      key = "cardname";
    }
    return key;
  });
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

  // 言語
  const langs = {"日本語":"[JP]","英語":"[EN]", "繁体中国語":"[CT]" };

// Foil/非Foil
  const isFoil = {"Yes":"【Foil】", "No": ""};

  //　CSVの内容を表示
  let textarea = "";
  // expansion.xmlの読み込み
  $.ajax({
    url: 'xml/expansion.xml',
    type: 'GET',
    dataType: 'XML',
    cache: false,
    success:function(data) {
      var expansions = [];
      $(data).find('row').each(function() {
        var url = $(this).find('ulink').attr('url');
        var paras = $(this).find('para').map(function() {
          return $(this).text();
        });
        expansions[url] = "【" + paras[1] + "】";
      });
      let item_count = 0;
      for (item of items) {
        if (item.Status != 'BASE登録予定') {
          continue;
        }
        if (item.cardname != "") {
          var ex = expansions[item['エキスパンション']];
          cardname =  isFoil[item.Foil] + ex +  item.cardname;
          var lang = langs[item['言語']] ;
          var en_name = item['英名'];
          if (lang == '[EN]') {
            cardname +=  "/" + en_name;
          }
          cardname += lang;
          pic1 = en_name.replace("\'", "").replaceAll(" ", "_");
          pic2 = pic1 + "_rev";
          textarea += "," + cardname + ",,,," + item['価格'] + ",1" + "," + item['枚数'] + "," +
                      '1' +  "," + toJpg(pic1) + "," + toJpg(pic2) + "\r\n";
          item_count++
        }
      }
      document.getElementById("cardnames").value = textarea;
      // tbody.innerHTML = tbody_html;
      message.innerHTML = item_count + "件のデータを読み込みました。";
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

function toJpg(str) {
    return str + '-min.jpg';
}
function toErr(msg) {
  $('#msg').hide();
  $('#err-massage').text(msg);
  $('#err').show();

}
