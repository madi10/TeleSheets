//CONFIG
var BOT_TOKEN = "5580616658:AAHZqO5QxNO9qtr" //BOT TOKEN ANDA
var SS_URL = "https://docs.google.com/spreadsheets/d/1gEY/edit#gid=0" //URL SPREADSHEET
var SHEET_NAME = "DAFTAR" //NAMA SHEET
var USERS = [
  490227369
] //CHAT ID, bisa lebih dari 1


//BEGIN
var SHEET = SpreadsheetApp.openByUrl(SS_URL).getSheetByName(SHEET_NAME);

function doGet(e) {
  return HtmlService.createHtmlOutput('<h1>OK</h1>')
}

function doPost(e) {
  if (e.postData.type == "application/json") {
    let update = JSON.parse(e.postData.contents);
    if (update) {
      commands(update)
      return true
    }
  }
}

function commands(update) {

  let chatId = update.message.chat.id;
  let first_name = update.message.chat.first_name;
  let text = update.message.text || '';
  let tanggal = new Date().toLocaleString();

  if (USERS.includes(chatId)) {

    if (text.startsWith("/start")) {
      sendMessage({
        chat_id: chatId,
        text: "Input data dengan cara \n/new [kodeharga] [#kodeseri] [persamaan1, persamaan2 dst]"
      })
    } else if (text.startsWith("/new")) {
      let persamaan,
        kodeharga,
        kodeseri,
        stext = text.split(' ')

      kodeharga = stext[1];
      kodeseri = stext[2].startsWith('#') ? stext[2].replace('#', '') : '';
      stext.splice(0, 3);
      persamaan = stext.join(' ')


      if (kodeharga && kodeseri && persamaan) {
        insert_value([
          tanggal,
          kodeseri,
          persamaan,
          kodeharga,
          chatId,
          first_name
        ], SHEET)

        sendMessage({
          chat_id: chatId,
          text: 'Berhasil di Simpan.'
        })

      } else {
        sendMessage({
          chat_id: chatId,
          text: 'Gagal. Pastikan sesuai format. \n/new [kodeharga] [#kodeseri] [persamaan1, persamaan2 dst]'
        })
      }
    }
  }
}

function sendMessage(postdata) {
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(postdata),
    'muteHttpExceptions': true
  };
  UrlFetchApp.fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage', options);
}
