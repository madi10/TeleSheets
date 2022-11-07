//CONFIG
var BOT_TOKEN = "5737307503:AAE9I2nSV4gN9f5m" //BOT TOKEN ANDA
var SS_URL = "https://docs.google.com/spreadsheets/d/1pS6qgQ1zfPI/edit#gid=0" //URL SPREADSHEET
var SHEET_NAME = "Masuk" //NAMA SHEET
var USERS = [
  49022,
  60541
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

    if (text.startsWith("/mulai")) {
      sendMessage({
        chat_id: chatId,
        text: "Input data dengan cara \n/masuk [#Harga] [Keterangan1, Keterangan2 dst]"
      })
    } else if (text.startsWith("/masuk")) {
      let Keterangan,
        Harga,
        stext = text.split(' ')

      Harga = stext[1].startsWith('#') ? stext[1].replace('#', '') : '';
      stext.splice(0, 2);
      Keterangan = stext.join(' ')


      if (Harga && Keterangan) {
        insert_value([
          tanggal,
          Harga,
          Keterangan,
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
          text: 'Gagal. Pastikan sesuai format. \n/masuk [#Harga] [Keterangan1, Keterangan2 dst]'
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
