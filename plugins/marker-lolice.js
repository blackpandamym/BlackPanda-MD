let handler = async (m, { conn, usedprefix }) => {
let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
conn.sendButton(m.chat, '*ππ¨ TE VA A CAER EL FEIπ¨π*', author, global.API('https://some-random-api.ml', '/canvas/lolice', { 
avatar: await conn.profilePictureUrl(who, 'image').catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png'),
}), [['β¨ππΎ π°πΌπΎ π»π°π π»πΎπ»πΈππ', `/loli`]], m)}

handler.help = ['lolice']
handler.tags = ['maker']
handler.command = /^(lolice)$/i
handler.limit = 1
export default handler
