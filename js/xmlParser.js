export function parse(items, func) {
  // expansion.xmlの読み込み
  $.ajax({
    url: 'expansion.xml',
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
      for (item of items) {
        if (item.cardname != "") {
          console.log();
          var ex = expansions[item['エキスパンション']];
          cardname =  isFoil[item.Foil] + ex +  item.cardname;
          var lang = langs[item['言語']] ;
          var en_name = item['英名'];
          if (lang == '[EN]') {
            cardname +=  "/" + en_name;
          }
          cardname += lang;
          pic1 = en_name.toLowerCase().replace("\'", "").replace(" ", "_");
          pic2 = pic1 + "_rev";
          textarea += "," + cardname + ",,,," + item['価格'] + ",1" + "," + item['枚数'] + "," +
                      item['公開'] +  "," + pic1 + ".jpg," + pic2 + ".jpg\r\n";
        }
      }
      document.getElementById("cardnames").value = textarea;
    },
    error:function(err) {
      console.log(err);
    }
  });
}
