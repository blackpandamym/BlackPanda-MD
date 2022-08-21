process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
import './config.js';
import { createRequire } from "module"; 
import path, { join } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { platform } from 'process'
import * as ws from 'ws';
import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch } from 'fs';
import yargs from 'yargs';
import { spawn } from 'child_process';
import lodash from 'lodash';
import chalk from 'chalk';
import syntaxerror from 'syntax-error';
import { tmpdir } from 'os';
import { format } from 'util';
import { makeWASocket, protoType, serialize } from './lib/simple.js';
import { Low, JSONFile } from 'lowdb';
import { mongoDB, mongoDBV2 } from './lib/mongoDB.js';
import store from './lib/store.js'
const { useSingleFileAuthState, DisconnectReason } = await import('@adiwajshing/baileys')
const { CONNECTING } = ws
const { chain } = lodash
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

protoType()
serialize()

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') { return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString() }; global.__dirname = function dirname(pathURL) { return path.dirname(global.__filename(pathURL, true)) }; global.__require = function require(dir = import.meta.url) { return createRequire(dir) }

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '')

global.timestamp = { start: new Date }

const __dirname = global.__dirname(import.meta.url)

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.prefix = new RegExp('^[' + (opts['prefix'] || 'xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-HhhHBb.aA').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')

global.db = new Low(
/https?:\/\//.test(opts['db'] || '') ?
new cloudDBAdapter(opts['db']) : /mongodb(\+srv)?:\/\//i.test(opts['db']) ?
(opts['mongodbv2'] ? new mongoDBV2(opts['db']) : new mongoDB(opts['db'])) :
new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}database.json`))

global.DATABASE = global.db // Backwards Compatibility
global.loadDatabase = async function loadDatabase() {
if (global.db.READ) return new Promise((resolve) => setInterval(async function () {
if (!global.db.READ) {
clearInterval(this)
resolve(global.db.data == null ? global.loadDatabase() : global.db.data)
}
}, 1 * 1000))
if (global.db.data !== null) return
global.db.READ = true
await global.db.read().catch(console.error)
global.db.READ = null
global.db.data = {
users: {},
chats: {},
stats: {},
msgs: {},
sticker: {},
settings: {},
...(global.db.data || {})
}
global.db.chain = chain(global.db.data)
}
loadDatabase()

global.authFile = `${opts._[0] || 'session'}.data.json`
const { state, saveState } = useSingleFileAuthState(global.authFile)

const connectionOptions = {
printQRInTerminal: true,
auth: state,
browser: ['PandaBot-MD','Edge','1.0.0'],
}

global.conn = makeWASocket(connectionOptions)
conn.isInit = false

if (!opts['test']) {
if (global.db) setInterval(async () => {
if (global.db.data) await global.db.write()
if (opts['autocleartmp'] && (global.support || {}).find) (tmp = [os.tmpdir(), 'tmp'], tmp.forEach(filename => cp.spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete'])))
}, 30 * 1000)}

if (opts['server']) (await import('./server.js')).default(global.conn, PORT)

function clearTmp() {
const tmp = [tmpdir(), join(__dirname, './tmp')]
const filename = []
tmp.forEach(dirname => readdirSync(dirname).forEach(file => filename.push(join(dirname, file))))
return filename.map(file => {
const stats = statSync(file)
if (stats.isFile() && (Date.now() - stats.mtimeMs >= 1000 * 60 * 3)) return unlinkSync(file) // 3 minutes
return false
})}

async function connectionUpdate(update) {
let pp = './src/nuevobot.jpg'
const { connection, lastDisconnect, isNewLogin } = update
if (isNewLogin) conn.isInit = true
const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
if (code && code !== DisconnectReason.loggedOut && conn?.ws.readyState !== CONNECTING) {
console.log(await global.reloadHandler(true).catch(console.error))
global.timestamp.connect = new Date
}
if (global.db.data == null) loadDatabase()
if (connection == 'open') {
console.log(chalk.yellow('𝙲𝙾𝙽𝙴𝙲𝚃𝙰𝙳𝙾 𝙲𝙾𝚁𝚁𝙴𝙲𝚃𝙰𝙼𝙴𝙽𝚃𝙴 𝙰𝙻 𝚆𝙷𝙰𝚃𝚂𝙰𝙿𝙿'))
await conn.sendHydrated(`56998636785@s.whatsapp.net`, `ℍ𝕠𝕝𝕒 𝕤𝕠𝕝𝕠 𝕡𝕒𝕣𝕒 𝕒𝕟𝕦𝕟𝕔𝕚𝕒𝕣 𝕤𝕠𝕓𝕣𝕖 𝕖𝕤𝕥𝕖 𝕟𝕦𝕖𝕧𝕠 𝕓𝕠𝕥 𝕒𝕔𝕥𝕚𝕧𝕠 ✅`, author, pp, null, null, null, null, [['💎𝙾𝚆𝙽𝙴𝚁🎟️', '/owner'], ['🕋𝙼𝙴𝙽𝚄 𝙿𝚁𝙸𝙽𝙲𝙸𝙿𝙰𝙻💎', '#menu']])
await conn.groupAcceptInvite('EG4rrKHyaE8Fg43YYowlso')}}

process.on('uncaughtException', console.error)

let isInit = true;
let handler = await import('./handler.js')
global.reloadHandler = async function (restatConn) {
try {
const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error)
if (Object.keys(Handler || {}).length) handler = Handler
} catch (e) {
console.error(e)
}
if (restatConn) {
const oldChats = global.conn.chats
try { global.conn.ws.close() } catch { }
conn.ev.removeAllListeners()
global.conn = makeWASocket(connectionOptions, { chats: oldChats })
isInit = true
}
if (!isInit) {
conn.ev.off('messages.upsert', conn.handler)
conn.ev.off('group-participants.update', conn.participantsUpdate)
conn.ev.off('groups.update', conn.groupsUpdate)
conn.ev.off('message.delete', conn.onDelete)
conn.ev.off('connection.update', conn.connectionUpdate)
conn.ev.off('creds.update', conn.credsUpdate)
}
  
 conn.welcome = '𝐇𝐨𝐥𝐚ঔৣֳ᷌᷈͜͡ @user\n𝙽Ú𝙼𝙴𝚁𝙾 𝙳𝙴 𝙼𝙸 𝙲𝚁𝙴𝙰𝙳𝙾𝚁:\n│http://wa.me/56998636785\n𝙴𝙽 𝙴𝚂𝚃𝙴 𝙶𝚁𝚄𝙿𝙾 𝙿𝚄𝙴𝙳𝙴𝚂 𝙴𝙽𝙲𝙾𝙽𝚃𝚁𝙰𝚁\n𝑨𝒎𝒊𝒈𝒐 𝒚 𝒆𝒏𝒆𝒎𝒊𝒈𝒐𝒔\n😈𝑴𝒖𝒄𝒉𝒐 𝒃𝒂𝒓𝒅𝒐 𝒔𝒊 𝒏𝒐 𝒒𝒖𝒊𝒆𝒓𝒆𝒔 𝒒𝒖𝒆 𝒕𝒆 𝒃𝒂𝒓𝒅𝒆𝒆𝒏 𝒏𝒊 𝒆𝒏𝒕𝒓𝒆𝒔\n🤪𝑮𝒆𝒏𝒕𝒆𝒔 𝒊𝒏𝒎𝒂𝒅𝒖𝒓𝒂𝒔 𝒙𝑫\n𝑶𝒋𝒊𝒕𝒐:\n𝓡𝓮𝓬𝓾𝓮𝓻𝓭𝓪𝓼 𝓼𝓮𝓰𝓾𝓲𝓻 𝓵𝓪𝓼 𝓻𝓮𝓰𝓵𝓪𝓼 𝓵𝓪𝓼 𝓻𝓮𝓰𝓵𝓪𝓼 𝓹𝓪𝓻𝓪 𝓺𝓾𝓮 𝓷𝓸 𝓽𝓮 𝓮𝓵𝓲𝓶𝓲𝓷𝓮𝓷 𝓬𝓸𝓶𝓸 𝓾𝓷 𝓰𝓪𝔂'
  conn.bye = '┌──「@user」\n(っ◔◡◔)っ ♥ Este fan de kunno se salio ♥'
conn.spromote = '「@user」\nA̳h̳o̳r̳a̳ ̳s̳e̳ ̳v̳o̳l̳v̳i̳o̳ ̳a̳d̳m̳i̳n̳s̳ ̳d̳e̳ ̳e̳s̳t̳e̳ ̳g̳r̳u̳p̳o̳'
conn.sdemote = '「@user」\nA̳s̳ ̳d̳e̳j̳a̳d̳o̳ ̳d̳e̳ ̳a̳d̳m̳i̳n̳s̳ ̳d̳e̳ ̳e̳s̳t̳e̳ ̳g̳r̳u̳p̳o̳'
conn.sSubject = '*𝔖𝔢 𝔠𝔞𝔪𝔟𝔦𝔬 𝔠𝔬𝔯𝔯𝔢𝔠𝔱𝔞𝔪𝔢𝔫𝔱𝔢 𝔢𝔩 𝔫𝔬𝔪𝔟𝔯𝔢 𝔡𝔢 𝔢𝔰𝔱𝔢 𝔤𝔯𝔲𝔭𝔬*\n*𝔑𝔲𝔢𝔳𝔬 𝔫𝔬𝔪𝔟𝔯𝔢:* @subject'
  conn.sDesc = '*𝔖𝔢 𝔠𝔞𝔪𝔟𝔦𝔬 𝔠𝔬𝔯𝔯𝔢𝔠𝔱𝔞𝔪𝔢𝔫𝔱𝔢 𝔩𝔞 𝔡𝔢𝔰𝔠𝔯𝔦𝔭𝔠𝔦𝔬𝔫 𝔡𝔢𝔩 𝔤𝔯𝔲𝔭𝔬*\n𝔑𝔲𝔢𝔳𝔞 𝔯𝔢𝔤𝔩𝔞𝔰:* @desc'
  conn.sIcon = '𝔖𝔢 𝔠𝔞𝔪𝔟𝔦𝔬 𝔠𝔬𝔯𝔯𝔢𝔠𝔱𝔞𝔪𝔢𝔫𝔱𝔢 𝔩𝔞 𝔣𝔬𝔱𝔬 𝔡𝔢 𝔭𝔢𝔯𝔣𝔦𝔩 @user'
  conn.sRevoke = '*𝔖𝔢 𝔠𝔞𝔪𝔟𝔦𝔬 𝔢𝔩 𝔢𝔫𝔩𝔞𝔠𝔢 𝔡𝔢 𝔤𝔯𝔲𝔭𝔬 𝔠𝔬𝔯𝔯𝔢𝔠𝔱𝔞𝔪𝔢𝔫𝔱𝔢!*\n𝙻𝙸𝙽𝙺 𝙽𝚄𝙴𝚅𝙾:* @revoke\n└────ׂ─ׂ─ׂ─ׂ───'

conn.handler = handler.handler.bind(global.conn)
conn.participantsUpdate = handler.participantsUpdate.bind(global.conn)
conn.groupsUpdate = handler.groupsUpdate.bind(global.conn)
conn.onDelete = handler.deleteUpdate.bind(global.conn)
conn.connectionUpdate = connectionUpdate.bind(global.conn)
conn.credsUpdate = saveState.bind(global.conn, true)
conn.ev.on('messages.upsert', conn.handler)
conn.ev.on('group-participants.update', conn.participantsUpdate)
conn.ev.on('groups.update', conn.groupsUpdate)
conn.ev.on('message.delete', conn.onDelete)
conn.ev.on('connection.update', conn.connectionUpdate)
conn.ev.on('creds.update', conn.credsUpdate)
isInit = false
return true
}

const pluginFolder = global.__dirname(join(__dirname, './plugins/index'))
const pluginFilter = filename => /\.js$/.test(filename)
global.plugins = {}
async function filesInit() {
for (let filename of readdirSync(pluginFolder).filter(pluginFilter)) {
try {
let file = global.__filename(join(pluginFolder, filename))
const module = await import(file)
global.plugins[filename] = module.default || module
} catch (e) {
conn.logger.error(e)
delete global.plugins[filename]
}}}
filesInit().then(_ => Object.keys(global.plugins)).catch(console.error)

global.reload = async (_ev, filename) => {
if (pluginFilter(filename)) {
let dir = global.__filename(join(pluginFolder, filename), true)
if (filename in global.plugins) {
if (existsSync(dir)) conn.logger.info(` updated plugin - '${filename}'`)
else {
conn.logger.warn(`deleted plugin - '${filename}'`)
return delete global.plugins[filename]
}
} else conn.logger.info(`new plugin - '${filename}'`)
let err = syntaxerror(readFileSync(dir), filename, {
sourceType: 'module',
allowAwaitOutsideFunction: true
})
if (err) conn.logger.error(`syntax error while loading '${filename}'\n${format(err)}`)
else try {
const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`))
global.plugins[filename] = module.default || module
} catch (e) {
conn.logger.error(`error require plugin '${filename}\n${format(e)}'`)
} finally {
global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
}}}
Object.freeze(global.reload)
watch(pluginFolder, global.reload)
await global.reloadHandler()
async function _quickTest() {
let test = await Promise.all([
spawn('ffmpeg'),
spawn('ffprobe'),
spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
spawn('convert'),
spawn('magick'),
spawn('gm'),
spawn('find', ['--version'])
].map(p => {
return Promise.race([
new Promise(resolve => {
p.on('close', code => {
resolve(code !== 127)
})}),
new Promise(resolve => {
p.on('error', _ => resolve(false))
})])}))
let [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test
let s = global.support = { ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find }
Object.freeze(global.support)
}
_quickTest()
.then()
.catch(console.error)
