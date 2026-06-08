/**
 * scripts/init-data.js
 * 数据库初始化脚本 — 生成高质量样例数据
 *
 * 运行：node scripts/init-data.js
 * 输出：src/data/travels.json（50 条精选旅行数据）
 *
 * 数据分布：
 *   cultural  (人文) — 60% (30 条)
 *   adventure (冒险) — 14% (7 条)
 *   healing   (治愈) — 10% (5 条)
 *   extreme   (极限) — 8%  (4 条)
 *   mystery   (秘境) — 8%  (4 条)
 */

const fs = require('fs')
const path = require('path')

const MOODS = ['自由','震撼','治愈','孤独','热血','诗意','荒诞','静谧','复古','未来感']
const BUDGETS = ['¥','¥¥','¥¥¥']

// ============ 手工精选种子数据 ============

const SEEDS = [
  // ———— 人文 (30 条) ————
  { cat: 'cultural', title: '在摩洛哥菲斯古城跟老匠人学一天皮革染制', dest: '摩洛哥·菲斯' },
  { cat: 'cultural', title: '在缅甸蒲甘的千塔之间坐一次热气球', dest: '缅甸·蒲甘' },
  { cat: 'cultural', title: '在秘鲁马丘比丘等一场云开雾散的日出', dest: '秘鲁·库斯科' },
  { cat: 'cultural', title: '在土耳其卡帕多奇亚的洞穴里住一晚', dest: '土耳其·卡帕多奇亚' },
  { cat: 'cultural', title: '在乌兹别克斯坦丝绸之路驿站听一段史诗', dest: '乌兹别克斯坦·撒马尔罕' },
  { cat: 'cultural', title: '在印度瓦拉纳西的恒河边等待日出', dest: '印度·瓦拉纳西' },
  { cat: 'cultural', title: '在墨西哥亡灵节上与逝者共舞', dest: '墨西哥·瓦哈卡' },
  { cat: 'cultural', title: '在埃塞俄比亚岩石教堂听一场千年弥撒', dest: '埃塞俄比亚·拉利贝拉' },
  { cat: 'cultural', title: '在吴哥窟的废墟中看一场史诗日出', dest: '柬埔寨·暹粒' },
  { cat: 'cultural', title: '在京都的枯山水庭院里坐一下午', dest: '日本·京都' },
  { cat: 'cultural', title: '在伊朗伊斯法罕的清真寺穹顶下失语', dest: '伊朗·伊斯法罕' },
  { cat: 'cultural', title: '在耶路撒冷老城里走一次苦路十四站', dest: '以色列·耶路撒冷' },
  { cat: 'cultural', title: '在敦煌莫高窟的壁画前与千年前对视', dest: '中国·敦煌' },
  { cat: 'cultural', title: '在意大利庞贝古城的街道上想象末日', dest: '意大利·庞贝' },
  { cat: 'cultural', title: '在约旦佩特拉古城穿过一线天的蛇道', dest: '约旦·佩特拉' },
  { cat: 'cultural', title: '在希腊雅典卫城触摸帕特农神庙的石柱', dest: '希腊·雅典' },
  { cat: 'cultural', title: '在山西应县木塔下仰望千年榫卯', dest: '中国·山西' },
  { cat: 'cultural', title: '在伊斯坦布尔穿越亚欧大陆的渡轮上喝红茶', dest: '土耳其·伊斯坦布尔' },
  { cat: 'cultural', title: '在埃及卢克索神庙的巨像脚下听风声', dest: '埃及·卢克索' },
  { cat: 'cultural', title: '在泉州开元寺的菩提树下看一场南音', dest: '中国·泉州' },
  { cat: 'cultural', title: '在印度斋浦尔粉红之城里迷路一整天', dest: '印度·斋浦尔' },
  { cat: 'cultural', title: '在西班牙格拉纳达的阿尔罕布拉宫里冥想', dest: '西班牙·格拉纳达' },
  { cat: 'cultural', title: '在不丹虎穴寺悬在悬崖边听诵经', dest: '不丹·帕罗' },
  { cat: 'cultural', title: '在琅勃拉邦清晨布施的橘色队伍里寻找平静', dest: '老挝·琅勃拉邦' },
  { cat: 'cultural', title: '在景德镇的窑火边亲手拉一个陶胚', dest: '中国·景德镇' },
  { cat: 'cultural', title: '在里斯本的法朵酒馆里听一场命运之歌', dest: '葡萄牙·里斯本' },
  { cat: 'cultural', title: '在喀什老城的巷子里跟维吾尔匠人学打铜', dest: '中国·喀什' },
  { cat: 'cultural', title: '在布拉格查理大桥上等晨雾散去', dest: '捷克·布拉格' },
  { cat: 'cultural', title: '在圣彼得堡冬宫的长廊里独自漫步', dest: '俄罗斯·圣彼得堡' },
  { cat: 'cultural', title: '在加德满都的杜巴广场看活女神从窗前经过', dest: '尼泊尔·加德满都' },

  // ———— 冒险 (7 条) ————
  { cat: 'adventure', title: '在撒哈拉的星空下听一场沙漠交响', dest: '摩洛哥·撒哈拉' },
  { cat: 'adventure', title: '徒步穿越冰岛火山熔岩隧道', dest: '冰岛·雷克雅未克' },
  { cat: 'adventure', title: '划独木舟穿越越南下龙湾的迷雾', dest: '越南·下龙湾' },
  { cat: 'adventure', title: '在纳米比亚沙漠追逐濒危黑犀牛', dest: '纳米比亚·埃托沙' },
  { cat: 'adventure', title: '在智利百内国家公园走完W线', dest: '智利·百内' },
  { cat: 'adventure', title: '潜入马来西亚诗巴丹的深海悬崖', dest: '马来西亚·诗巴丹' },
  { cat: 'adventure', title: '在格陵兰岛划皮划艇穿越冰山', dest: '格陵兰·伊卢利萨特' },

  // ———— 治愈 (5 条) ————
  { cat: 'healing', title: '在北极圈玻璃屋里等一场极光', dest: '挪威·特罗姆瑟' },
  { cat: 'healing', title: '在日本白川乡合掌造醒来听雪落的声音', dest: '日本·白川乡' },
  { cat: 'healing', title: '在巴厘岛丛林深处的竹屋里练习冥想', dest: '印尼·巴厘岛' },
  { cat: 'healing', title: '在芬兰极夜中体验一次桑拿跳冰湖', dest: '芬兰·拉普兰' },
  { cat: 'healing', title: '在云南沙溪古镇跟着马帮走茶马古道', dest: '中国·云南' },

  // ———— 极限 (4 条) ————
  { cat: 'extreme', title: '在南极冰盖上露营听冰川崩裂', dest: '南极半岛' },
  { cat: 'extreme', title: '在挪威峡湾悬崖上搭帐篷过夜', dest: '挪威·吕瑟峡湾' },
  { cat: 'extreme', title: '在尼泊尔安娜普尔纳挑战5400米垭口', dest: '尼泊尔·博卡拉' },
  { cat: 'extreme', title: '在瓦努阿图火山口边缘看岩浆喷涌', dest: '瓦努阿图·塔纳岛' },

  // ———— 秘境 (4 条) ————
  { cat: 'mystery', title: '在格鲁吉亚梅斯蒂亚寻找失落塔楼', dest: '格鲁吉亚·梅斯蒂亚' },
  { cat: 'mystery', title: '在马达加斯加猴面包树大道漫步', dest: '马达加斯加·穆龙达瓦' },
  { cat: 'mystery', title: '在也门索科特拉岛看龙血树的外星地貌', dest: '也门·索科特拉岛' },
  { cat: 'mystery', title: '在吉尔吉斯斯坦雪山牧场做一周牧民', dest: '吉尔吉斯斯坦·松克尔湖' },
]

const PALETTES = [
  ['#1a0a0a','#3d1a1a','#8b3a3a','#d4a06a','#f0d0a0'],
  ['#0a1a2e','#162a4e','#2a5a9e','#7ab8e0','#d0e8f8'],
  ['#1a1a0a','#3a3a1a','#7a7a2a','#baba5a','#f0f0d0'],
  ['#0d1b2a','#1b2a3d','#3a5a7a','#7a9aba','#e0e8f0'],
  ['#2d1b00','#5c3d1a','#b8860b','#f5d08c','#fff8e7'],
  ['#0a2a1a','#1a4a3a','#2a8a5a','#7ad8a0','#d0f8e0'],
  ['#1a0a2e','#2a1a5e','#6a3aae','#b07aee','#e0d0ff'],
  ['#0a1a1a','#1a3a3a','#2a7a7a','#5ababa','#d0f0f0'],
  ['#1a1a1a','#3a2828','#6a4040','#c08060','#f0c0a0'],
]

const TIPS = [
  '最佳季节：3-5月，建议提前1个月预订',
  '最佳季节：6-8月，建议提前3个月预订',
  '最佳季节：9-11月，建议提前半年预订',
  '最佳季节：12-2月，建议提前2个月预订',
  '全年皆宜，但避开当地节假日',
  '春秋两季最佳，提前2周预订即可',
]

const QUOTES = [
  '不走出去，以为眼前就是世界。',
  '旅行的意义不在于抵达，而在于出发。',
  '有些风景，必须亲自去看。',
  '我们旅行，不是为了逃避生活，而是为了不让生活逃避我们。',
  '世界上最不可思议的事情，是你真的来了。',
  '在所有地图之外，有另一种活法。',
  '古迹不说话，但它们记住了所有路过的人。',
  '走的路越多，越觉得世界值得认真对待。',
  '文明是一层一层叠起来的，你得亲自踩上去。',
]

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

const travels = SEEDS.map((seed, idx) => {
  const m1 = pick(MOODS)
  let m2 = pick(MOODS); while (m2 === m1) m2 = pick(MOODS)
  const palette = PALETTES[idx % PALETTES.length]
  const budget = BUDGETS[idx % BUDGETS.length]
  const uniqueness = 25 + Math.floor(Math.random() * 15)
  const depth = 20 + Math.floor(Math.random() * 15)
  const visualImpact = 15 + Math.floor(Math.random() * 10)

  return {
    id: `${seed.cat}-${idx + 1}`,
    title: seed.title,
    subtitle: `在${seed.dest.split('·')[0]}，重新认识${seed.cat === 'cultural' ? '人类文明' : seed.cat === 'adventure' ? '自己的勇气' : seed.cat === 'healing' ? '内心的宁静' : seed.cat === 'extreme' ? '生命的极限' : '世界的未知'}`,
    category: seed.cat,
    unbelievableIndex: uniqueness + depth + visualImpact,
    indexBreakdown: { uniqueness, depth, visualImpact },
    primaryMood: m1,
    secondaryMood: m2,
    heroImage: `https://picsum.photos/seed/flypig${idx + 1}h/1200/800`,
    cardImage: `https://picsum.photos/seed/flypig${idx + 1}c/600/800`,
    colorPalette: palette,
    narrative: {
      intro: `${seed.dest} | 有些体验无法被算法推荐`,
      story: [
        '你来到这里，不是因为攻略上说"必打卡"。',
        '你来，是因为听说这里有一种东西——在别处正在消失的东西。',
        '也许是匠人的手温，也许是千百年前的石头上还留着凿痕。',
        '你静下来，终于听见了——那些比文字更古老的叙述。',
        '离开时你发现：你看世界的眼光，被一个地方轻轻地改变了。',
      ],
      travelerQuote: pick(QUOTES),
      tip: pick(TIPS),
    },
    destination: seed.dest,
    duration: pick(['3天2晚','5天4晚','7天6晚','10天9晚','14天13晚']),
    bestSeason: pick(['3-5月','6-8月','9-11月','12-2月','全年皆宜']),
    budget,
  }
})

const outPath = path.join(__dirname, '..', 'src', 'data', 'travels.json')
fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, JSON.stringify(travels, null, 2), 'utf8')

const cats = {}
travels.forEach(t => { cats[t.category] = (cats[t.category] || 0) + 1 })
console.log(`✅ Generated ${travels.length} high-quality travels → src/data/travels.json`)
Object.entries(cats).forEach(([k, v]) =>
  console.log(`   ${k}: ${v} (${Math.round(v / travels.length * 100)}%)`)
)
console.log('\n✅ 5+ hand-curated sample entries with real destinations and titles')
