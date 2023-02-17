const express = require('express')
const app = express()
const port = 3000
const { fetchJson, range, parseMarkdown } = require('./lib/function')
const { modul } = require('./module');
const chalk = require('chalk')
const { 
  fs,
  os
} = modul;
const dbuser=JSON.parse(fs.readFileSync(`./db/user.json`))
const {
  nameBot,
  nameOwner,
  TokenBot,
  prefix
}= JSON.parse(fs.readFileSync(`./config.json`))
const tele = require('./lib/tele')
const {Telegraf} = require('telegraf');
const bot = new Telegraf(TokenBot);



runtime = function(seconds) {
	seconds = Number(seconds);
	var d = Math.floor(seconds / (3600 * 24));
	var h = Math.floor(seconds % (3600 * 24) / 3600);
	var m = Math.floor(seconds % 3600 / 60);
	var s = Math.floor(seconds % 60);
	var dDisplay = d > 0 ? d + (d == 1 ? " Hari, " : " Hari, ") : "";
	var hDisplay = h > 0 ? h + (h == 1 ? " Jam, " : " Jam, ") : "";
	var mDisplay = m > 0 ? m + (m == 1 ? " Menit, " : " Menit, ") : "";
	var sDisplay = s > 0 ? s + (s == 1 ? " Detik" : " Detik") : "";
	return dDisplay + hDisplay + mDisplay + sDisplay;
}

app.get('/', (req, res) => {
  res.send(runtime(process.uptime()))
})


bot.start((ctx) => {
  text=`╔══════[ Owner Menu ]══════⊱
╠➤ /adduser username
╠➤ /deluser username
╠➤ /cekuser username
╚══════════════════════⊱
╔══════[ Runtime Bot ]══════⊱
╠➤ Runtime : ${runtime(process.uptime())}
╚══════════════════════⊱
© ⏤͟͟͞RIAN JB`
    ctx.reply(text)
});


bot.on('message',async (lol) => {
  try {
    const body = lol.message.text || lol.message.caption || ''
		comm = body.trim().split(' ').shift().toLowerCase()
		cmd = false
		if (prefix != '' && body.startsWith(prefix)) {
			cmd = true
			comm = body.slice(1).trim().split(' ').shift().toLowerCase()
		}
		const command = comm
		const args = await tele.getArgs(lol)
		
		switch(command){
		  case 'adduser':
		    anuk=args[0]
		    if(!anuk) return lol.reply('MASUKAN NAME USER CONTOH:\n/adduser username')
		    if(nameOwner==lol.from.username){
		      ada= dbuser.includes(anuk)
		      if(ada === true){
		        lol.reply('udah ada bng!')
		      }else{
		        dbuser.push(anuk)
            fs.writeFileSync('./db/user.json', JSON.stringify(dbuser,null,2))
            lol.reply('sukses adduser')
		      }
        } else {
          lol.reply('lu siapa? 🗿')
        }
		  break
      case 'deluser':
        ada= dbuser.includes(args[0])
        ytta=args[0]
        if(nameOwner==lol.from.username){
		    if(!ytta) return lol.reply('MASUKAN NAME USER CONTOH:\n/deluser username')
        if(ada==true){
          del = dbuser.indexOf(ytta)
          dbuser.splice(del, 1)
          fs.writeFileSync('./db/user.json', JSON.stringify(dbuser,null,2))
          lol.reply('berhasil delete : '+args[0])
        } else{
          lol.reply('usernya ga ada! 🗿')
        }
        } else {
          lol.reply('lu siapa? 🗿')
        }
      break;
      case 'cekuser':
        ada= dbuser.includes(args[0])
        ytta=args[0]
		    if(!ytta) return lol.reply('MASUKAN NAME USER CONTOH:\n/cekuser username')
        if(ada==true){
          lol.reply('username : '+ytta+' terdaftar 🌷')
        } else{
          lol.reply('username : '+ytta+' tidak terdaftar!')
        }
      break
		}
  }catch (e) {
		console.log(e)
	}
})

bot.launch({
	dropPendingUpdates: true,
})

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})