let media = 'https://i.imgur.com/NRv6b71.jpeg'
let handler = async (m, { conn, command }) => {
let str = `
βββγπΦΌ αΉππ―πππππ!sβΉβ·β»βΉπΉβα΅α΅α΅β»α΄Ήα΄°γβ
ββ ΰΉΫ£ΫΝ‘ΝΫππ¨π₯πΰ¦ΰ§£Ν‘Να·Φ³α· π π½ππππππππΏπ(πΌ) πΌ ππΌπ πΎπππππΌπ ππππΎππΌπππ
ππππππΎππΌπ πΌπΎπΎπππππ
βββββΧβΧβΧβΧβ
βββ *GITHUB*
ββ*${md}*
βββββΧβΧβΧβΧβ
βββ *YOUTUBE*
ββ${yt}
βββββΧβΧβΧβΧβ
ββSi tienen dudas, sugerencias, o preguntas solo escriban por Instagram.*\n
*If you have doubts, suggestions or questions just write on Instagram
βββββΧβΧβΧβΧβββ
`.trim()
  
conn.sendHydrated(m.chat, str, wm, media, 'https://github.com/Yovanihades1212/HADES-BOT-MDV2.git', 'πΆπΈππ·ππ±', null, null, [
['ππππππ', '.estado'],
['ππππ', '/menu']
], m,)}

handler.command = /^cuentasoficiales|cuentasoficiales\$/i
handler.exp = 35
handler.limit = 1
export default handler
