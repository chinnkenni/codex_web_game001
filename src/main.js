const STORAGE_KEY = "witchkeni.fogharbor.runs.v3";
const ACTION_MEMORY_KEY = "witchkeni.fogharbor.action-memory.v1";
const CLUE_READ_KEY = "witchkeni.fogharbor.clue-read.v1";
const START_MINUTES = 180;
const MAX_ECHOES = 24;
const MAX_BAG = 8;
const MAX_STAT = 8;
const MAX_AWAKENING = 18;
const MAX_MORALITY = 6;
const CHECK_DIE_SIDES = 12;
const BASE_CHECK_STAT = 4;
const DICE_TARGET_CACHE = new Map();
const DEFAULT_SCENE_ART = "./assets/story/receipt-bureau.webp";
const AUDIO_ASSETS = {
  ambience: "./assets/audio/old-city-ambience.wav",
  pressure: "./assets/audio/awakening-pressure.wav",
  success: "./assets/audio/receipt-success.wav",
  fail: "./assets/audio/receipt-fail.wav",
  broadcast: "./assets/audio/baitaju-broadcast.mp3",
  shenyan: "./assets/audio/shenyan-warning.mp3"
};
const AUDIO_CUE_DURATIONS = {
  success: 2.8,
  fail: 3.2
};
const VOICE_CARD_CUES = {
  listen_window: { cue: "broadcast" },
  pack_fast: { cue: "shenyan", on: "fail" }
};
const SCENE_ART = {
  home: "./assets/story/receipt-home.webp",
  clinic: "./assets/story/receipt-clinic.webp",
  market: "./assets/story/receipt-market.webp",
  lane: "./assets/story/receipt-lane.webp",
  overpass: "./assets/story/receipt-overpass.webp",
  station: "./assets/story/receipt-station.webp",
  tunnel: "./assets/story/receipt-tunnel.webp",
  checkpoint: "./assets/story/receipt-checkpoint.webp",
  reservoir: "./assets/story/receipt-reservoir.webp",
  shelter: "./assets/story/receipt-shelter.webp"
};

if (new URLSearchParams(window.location.search).get("fresh") === "1") {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(ACTION_MEMORY_KEY);
  localStorage.removeItem(CLUE_READ_KEY);
  window.history.replaceState(null, "", window.location.pathname);
}

const refs = {
  app: document.querySelector("#app"),
  landingScreen: document.querySelector("#landingScreen"),
  startGameButton: document.querySelector("#startGameButton"),
  landingClueButton: document.querySelector("#landingClueButton"),
  timerValue: document.querySelector("#timerValue"),
  loopValue: document.querySelector("#loopValue"),
  awakeningPanel: document.querySelector("#awakeningPanel"),
  statsPanel: document.querySelector("#statsPanel"),
  inventoryPanel: document.querySelector("#inventoryPanel"),
  echoPanel: document.querySelector("#echoPanel"),
  mapGrid: document.querySelector("#mapGrid"),
  phasePill: document.querySelector("#phasePill"),
  sceneTitle: document.querySelector("#sceneTitle"),
  storyText: document.querySelector("#storyText"),
  actionsPanel: document.querySelector("#actionsPanel"),
  runLog: document.querySelector("#runLog"),
  archivePanel: document.querySelector("#archivePanel"),
  topMenuButton: document.querySelector("#topMenuButton"),
  topMenuPanel: document.querySelector("#topMenuPanel"),
  menuInventoryPanel: document.querySelector("#menuInventoryPanel"),
  menuEchoPanel: document.querySelector("#menuEchoPanel"),
  menuRunLogPanel: document.querySelector("#menuRunLogPanel"),
  visualPanel: document.querySelector(".visual-panel"),
  storyPanel: document.querySelector(".story-panel"),
  sceneArtImage: document.querySelector("#sceneArtImage"),
  audioButton: document.querySelector("#audioButton"),
  topClueButton: document.querySelector("#topClueButton"),
  clueButton: document.querySelector("#clueButton"),
  archiveButton: document.querySelector("#archiveButton"),
  archiveTitle: document.querySelector("#archiveTitle"),
  archiveModal: document.querySelector("#archiveModal"),
  archiveModalContent: document.querySelector("#archiveModalContent"),
  closeArchiveButton: document.querySelector("#closeArchiveButton"),
  cluePage: document.querySelector("#cluePage"),
  cluePageContent: document.querySelector("#cluePageContent"),
  newLoopButton: document.querySelector("#newLoopButton"),
  clearEchoButton: document.querySelector("#clearEchoButton"),
  loreButton: document.querySelector("#loreButton"),
  loreModal: document.querySelector("#loreModal"),
  closeLoreButton: document.querySelector("#closeLoreButton"),
  judgmentModal: document.querySelector("#judgmentModal"),
  judgmentContent: document.querySelector("#judgmentContent"),
  settlementModal: document.querySelector("#settlementModal"),
  settlementContent: document.querySelector("#settlementContent"),
  closeSettlementButton: document.querySelector("#closeSettlementButton"),
  feedbackModal: document.querySelector("#feedbackModal"),
  feedbackContent: document.querySelector("#feedbackContent"),
  feedbackCloseButton: document.querySelector("#feedbackCloseButton"),
  audioPromptModal: document.querySelector("#audioPromptModal"),
  enableAudioPromptButton: document.querySelector("#enableAudioPromptButton"),
  skipAudioPromptButton: document.querySelector("#skipAudioPromptButton")
};

const STATS = [
  { key: "body", name: "力量", group: "肉体" },
  { key: "cover", name: "敏捷", group: "肉体" },
  { key: "food", name: "智力", group: "精神" },
  { key: "mind", name: "意志", group: "精神" }
];

const CHECK_STAT_BY_KIND = {
  aid: "mind",
  loot: "cover",
  tech: "food",
  risk: "body",
  signal: "food",
  stealth: "cover",
  access: "food",
  memory: "mind",
  ruthless: "body",
  route: "cover",
  shelter: "mind"
};

const ALIGNMENT_BY_KIND = {
  aid: "good",
  shelter: "good",
  ruthless: "evil",
  final: "neutral",
  memory: "neutral",
  signal: "neutral",
  tech: "neutral",
  route: "neutral",
  stealth: "neutral",
  access: "neutral",
  loot: "neutral",
  risk: "neutral"
};

const ALIGNMENT_LABELS = {
  good: "抑制",
  neutral: "常规",
  evil: "觉醒"
};

const ITEMS = {
  water: { name: "井水瓶", size: 1, tags: ["food"], text: "瓶口封着红纸，水面倒映的不是这间屋子。" },
  ration: { name: "供桌糕", size: 1, tags: ["food"], text: "压得很硬的米糕，像旧城外城留下的干粮。" },
  med: { name: "白瓷药盒", size: 1, tags: ["heal"], text: "盒底贴着白塔局封签，写着“归位样本勿离线”。" },
  battery: { name: "铜壳电池", size: 1, tags: ["tech"], text: "电池外壳被沈砚刻过短波频点。" },
  crowbar: { name: "棺钉撬", size: 2, tags: ["force"], text: "撬棍尾端缠着褪色红绳，适合撬开旧城密道栅门。" },
  radio: { name: "白塔短波", size: 2, tags: ["signal"], text: "调频时会漏出沈砚的断续笑声和白塔局警报。" },
  pass: { name: "旧城令帖", size: 1, tags: ["access"], text: "半张门神贴，背面写着旧臣识别的王印暗号。" },
  flare: { name: "朱砂信号棒", size: 1, tags: ["signal"], text: "亮起来像一炷倒着烧的香，也像白塔局最后的撤离灯。" },
  coat: { name: "白塔隔离衣", size: 1, tags: ["cover"], text: "像雨衣，也像孝服，胸口有被撕掉的白塔局编号。" },
  key: { name: "归位铜钥", size: 1, tags: ["access"], text: "齿纹像一行倒写的王命，握久了会想起不属于现世的门。" },
  photo: { name: "壁画残照", size: 0, tags: ["memory"], text: "照片里壁画的脸被烟熏掉一半，剩下的轮廓让你不舒服。" }
};

const STARTING_ITEMS = { water: 1, ration: 1 };
const SAFE_DROP_ORDER = ["ration", "water", "battery", "med", "flare", "coat"];

const RELICS = {
  route: { name: "门槛三道灰", text: "第一张【归位】检定更稳。" },
  shelter: { name: "灶后木楔", text: "开局敏捷 +1。" },
  aid: { name: "白瓷药盒", text: "第一次受伤时力量回稳 +1。" },
  ruthless: { name: "冷掉的棺钉", text: "觉醒类选择更容易，但意志 -1。" },
  signal: { name: "白塔错频", text: "信号类选择额外给 1 线索。" },
  memory: { name: "旧王纸钱", text: "每局多出现一个回声事件。" }
};

const ENDING_CATALOG = [
  { id: "perfect", title: "王权托付", hint: "找到能替你守住旧城的人。", tier: "稀有结局" },
  { id: "human", title: "以人离城", hint: "保住人的判断，拒绝坐上王座。", tier: "主线结局" },
  { id: "king", title: "旧王归位", hint: "让旧城停下，也把自己留给旧城。", tier: "主线结局" },
  { id: "weird", title: "怪异出城", hint: "用更快、更冷的方式打开密道。", tier: "偏离结局" },
  { id: "depleted", title: "能力耗尽", hint: "任一属性归零，路线会提前崩盘。", tier: "失败结局" },
  { id: "timeout", title: "弃城封锁完成", hint: "倒计时归零，封锁先一步合拢。", tier: "失败结局" },
  { id: "collapse", title: "雾里倒下", hint: "还没抵达密道，旧城先认回了你。", tier: "失败结局" },
  { id: "lost", title: "未完成归位", hint: "没有走完，但留下了一道浅痕。", tier: "中断结局" }
];

const ACHIEVEMENTS = [
  {
    id: "first_trace",
    title: "第一道旧痕",
    text: "完成任意一次归位。",
    test: () => true
  },
  {
    id: "first_escape",
    title: "看见城外",
    text: "抵达内城密道并完成任一主线结局。",
    test: ({ ending }) => ["perfect", "human", "king", "weird"].includes(ending.id)
  },
  {
    id: "still_human",
    title: "还像人",
    text: "以人的身份离开旧城。",
    test: ({ ending }) => ending.id === "human"
  },
  {
    id: "trusted_general",
    title: "有人代守",
    text: "把王权托付给大将军。",
    test: ({ ending }) => ending.id === "perfect"
  },
  {
    id: "too_late",
    title: "迟到的人",
    text: "在封锁完成后留在旧城。",
    test: ({ ending }) => ending.id === "timeout"
  },
  {
    id: "thin_thread",
    title: "最后二十分钟",
    text: "倒计时不足二十分钟时仍抵达密道。",
    test: ({ ending }) => ["perfect", "human", "king", "weird"].includes(ending.id) && state.minutes <= 20
  },
  {
    id: "over_woke",
    title: "另一套秩序",
    text: "觉醒过深时完成一局。",
    test: () => state.heat >= 10
  },
  {
    id: "full_route",
    title: "五处旧城",
    text: "单局走过五个以上地点。",
    test: () => new Set([...state.visited, state.node]).size >= 5
  }
];

const STORY_ENDING_IDS = ["king", "human", "weird", "perfect", "timeout", "depleted"];

const ENDING_STORIES = {
  king: {
    title: "旧王归位",
    body:
      "你把手按上王座残纹，归位怪异终于完整服从你。\n\n旧城停止吞噬雾港，现世恢复平静。但王座下的密道从你身后合拢，你知道自己再也不是现世的人。"
  },
  human: {
    title: "以人离城",
    body:
      "你没有坐上王座。你对沈砚说，旧城已经是过去式，你醒来的能力要守护现世，而不是替过去收尸。\n\n密道尽头，雾港的风第一次像现实世界的风。"
  },
  weird: {
    title: "怪异出城",
    body:
      "密道为你打开，沈砚的短波永远静了。\n\n你逃出了雾港。可归位怪异已经学会把人从世界上移开，白塔局在城外看见你时，没有一个人敢先叫你的名字。"
  },
  perfect: {
    title: "王权托付",
    body:
      "大将军接过王印时，死城的火声第一次退远。\n\n旧城没有再向现世回身，雾港像从没发生过怪异事件一样恢复了秩序。只有你口袋里那枚空白令帖还在发热，像第二季才会打开的门。"
  },
  timeout: {
    title: "弃城封锁完成",
    body:
      "你看见了密道方向的灯，也看见城外隔离线一段段合拢。\n\n迟到不是死亡，但在雾港，迟到会让世界忘记你曾经存在。"
  },
  depleted: {
    title: "能力耗尽",
    body:
      "密道还在前方，但某项能力先断了。\n\n雾没有追上来，旧城也没有关门；只是你已经付不出下一次选择的代价。"
  }
};

const CLUE_THREADS = [
  {
    id: "lockdown",
    title: "弃城封锁",
    head: "上午九点，白塔局把雾港交给倒计时。",
    hidden: "白塔局不是在救城，而是在承认城已经守不住。",
    segments: [
      {
        title: "断讯先响",
        unlock: { cards: ["listen_window"] },
        text: "广播确认「旧城回身」收容失败。封锁不是天气预警，而是白塔局最后一道隔离线。",
        cards: ["listen_window"]
      },
      {
        title: "局长留下的口径",
        unlock: { cards: ["reset_power"] },
        text: "电房里残留的录音说明，白塔局很早就知道你不只是普通调查员。",
        cards: ["reset_power"]
      },
      {
        title: "迟到会被归档",
        unlock: { endings: ["timeout"] },
        text: "倒计时归零后，失败不是突然死亡，而是雾港把你从现世记录里擦掉。",
        endings: ["timeout"]
      }
    ]
  },
  {
    id: "shenyan",
    title: "沈砚与剖真",
    head: "他叫你回来，却没有把真正的理由说完。",
    hidden: "沈砚不是等你救他，他在等一个结论。",
    segments: [
      {
        title: "旧包里的诱饵",
        unlock: { cards: ["pack_fast"] },
        text: "旧包把壁画、短波和逃生目标塞到同一个起点里。沈砚让你回来，是因为他知道你会认这些东西。",
        cards: ["pack_fast"]
      },
      {
        title: "剖真记录",
        unlock: { cards: ["tune_radio"] },
        text: "短波记录露出沈砚的本命怪异。他追的不是答案本身，而是证明答案必须成立。",
        cards: ["tune_radio"]
      },
      {
        title: "决裂的出口",
        unlock: { endings: ["weird"] },
        text: "当你把沈砚也当作路上的障碍，归位就不再只是修正错位。",
        cards: ["cut_truth"],
        endings: ["weird"]
      }
    ]
  },
  {
    id: "king",
    title: "旧王身份",
    head: "旧城没有追错人，只是你一开始听不懂它叫的名字。",
    hidden: "孤儿感不是身世缺口，而是你本来就没有现世的原位。",
    segments: [
      {
        title: "门先认你",
        unlock: { cards: ["bar_door"] },
        text: "童谣和归位铜钥把第一道门打开。旧城像在确认一个迟到很久的人。",
        cards: ["bar_door"]
      },
      {
        title: "壁画对上脸",
        unlock: { cards: ["trade_ring"] },
        text: "鬼市把壁画残照换成旧王来历：王座空了三百年，外城火从那夜开始。",
        cards: ["trade_ring"]
      },
      {
        title: "坐回王座",
        unlock: { endings: ["king"] },
        text: "归位能让旧城停下，但王座也会留下坐上去的人。",
        cards: ["read_scratches", "claim_throne"],
        endings: ["king"]
      }
    ]
  },
  {
    id: "human",
    title: "人的选择",
    head: "你不一定要用旧城给你的名字活下去。",
    hidden: "救助和说服不是绕路，它们是在证明你仍把人当人。",
    segments: [
      {
        title: "旧医官的令帖",
        unlock: { cards: ["help_doctor"] },
        text: "白瓷药盒换来旧城令帖，也换来一条更像人的路线。",
        cards: ["help_doctor"]
      },
      {
        title: "旧卒的证词",
        unlock: { cards: ["share_water"] },
        text: "把水分出去会慢一点，但旧卒擦亮的箭头说明，王位未必只能由你承担。",
        cards: ["share_water"]
      },
      {
        title: "以人的方式离开",
        unlock: { endings: ["human"] },
        text: "你承认归位已经醒了，却拒绝让它替旧城决定你是谁。",
        endings: ["human"]
      }
    ]
  },
  {
    id: "general",
    title: "大将军托付",
    head: "死城里还有人等的不是旧王本人，而是旧城重新有主。",
    hidden: "完美路线不是逃避责任，而是找到真正愿意守城的人。",
    segments: [
      {
        title: "水路打开",
        unlock: { cards: ["lower_water"] },
        text: "归位铜钥转开王城水路，出口和王座第一次变成同一条路的两端。",
        cards: ["lower_water"]
      },
      {
        title: "石像醒来",
        unlock: { cards: ["leave_cache"] },
        text: "供桌糕和王印唤醒大将军。他不是临时工具，而是旧城仍承认的旧臣。",
        cards: ["leave_cache"]
      },
      {
        title: "王权可被归还",
        unlock: { endings: ["perfect"] },
        text: "王权托付后，旧城不再向现世回身。你也不用把自己献回王座。",
        endings: ["perfect"]
      }
    ]
  },
  {
    id: "monster",
    title: "怪异抬头",
    head: "更快的选择会开路，也会教会归位另一种用法。",
    hidden: "当人被看成障碍，怪异就学会把人移开。",
    segments: [
      {
        title: "棺钉撬",
        unlock: { cards: ["grab_crowbar"] },
        text: "强行撬开纸扎王箱，拿到的不是普通工具，而是死门捷径的钥匙。",
        cards: ["grab_crowbar"]
      },
      {
        title: "硬闯死门",
        unlock: { cards: ["force_gate"] },
        text: "棺钉撬卡住门禁的瞬间，你的影子留在原地，像另一个判断开始替你做决定。",
        cards: ["force_gate"]
      },
      {
        title: "代价写在身体里",
        unlock: { endings: ["depleted"] },
        text: "属性耗尽不是剧情强杀，而是每次强行推进都在把下一次选择的余地磨掉。",
        endings: ["depleted"]
      }
    ]
  }
];

const CURTAIN_CALL = {
  title: "旧城谢幕",
  locked: "收齐主要结局与剧情脉络后开放。这里会成为未来视频、设定集和完整世界线的入口。",
  sections: [
    {
      title: "雾港不是起点",
      body: "雾港只是旧城压回现世时露出的第一块断面。外城、内城、死城本来属于同一座古代城邦，王离位后，城没有死，只是一直在寻找能把所有错位重新归档的人。"
    },
    {
      title: "主角不是被选中",
      body: "你不是误入旧城的人。你是旧王从时空乱流里坠入现世后留下的空位。现实查不到亲缘，不是因为资料缺失，而是因为你从来没有被现实完整登记。"
    },
    {
      title: "沈砚不是纯粹反派",
      body: "沈砚的剖真被求证欲喂坏。他清醒地把你带回雾港，也清醒地献祭你。可他的恐惧是真的：如果旧城没有重新归位，现世会有更多城市被压回过去。"
    },
    {
      title: "第二季的门",
      body: "王权托付后留下的空白令帖，不是彩蛋式威胁，而是新问题：当王权可以被转移，其他本命怪异是否也能被继承、交易，甚至被人为制造？"
    }
  ]
};

const FLAG_REQUIREMENTS = {
  home_cache: "需要：筒子楼归位标记",
  hard_choice: "需要：你更快，也更冷",
  basement_hint: "需要：内城线路浮现",
  tunnel_open: "需要：内城暗渠打开",
  helped_runner: "需要：旧卒证词",
  water_lowered: "需要：王城水路打开",
  read_echo_marks: "需要：王闸刻名读懂",
  left_cache: "需要：将军石像记住你",
  doctor_saved: "需要：旧医官被救下",
  king_memory: "需要：旧王记忆",
  partner_break: "需要：沈砚信任破裂",
  human_choice: "需要：保住人的选择",
  weird_choice: "需要：怪异正在抬头",
  general_oath: "需要：大将军可被托付",
  perfect_choice: "需要：王权已有新主"
};

const RECEIPT_ART = {
  bureau: {
    src: "./assets/story/receipt-bureau.webp",
    alt: "白塔局指挥室里，雾港地图上浮出三段旧城轮廓。"
  },
  home: {
    src: "./assets/story/receipt-home.webp",
    alt: "筒子楼楼道被旧城门影覆盖，旧包、壁画残照和铜钥留在门前。"
  },
  clinic: {
    src: "./assets/story/receipt-clinic.webp",
    alt: "白墙诊所与旧城医署重叠，药柜、旧档和纸人轮廓藏在冷光里。"
  },
  market: {
    src: "./assets/story/receipt-market.webp",
    alt: "雨棚鬼市里，供桌糕、井水瓶和纸扎王箱摆在雾中的外城摊位上。"
  },
  lane: {
    src: "./assets/story/receipt-lane.webp",
    alt: "后巷电房中，白塔节点、电缆和青砖墙上的归位线互相纠缠。"
  },
  overpass: {
    src: "./assets/story/receipt-overpass.webp",
    alt: "雾桥上，现代高架与古代官道错位叠合，远处露出旧王城轮廓。"
  },
  station: {
    src: "./assets/story/receipt-station.webp",
    alt: "旧戏台站里，短波收音机、白布戏台和王车残厢在雾中重叠。"
  },
  tunnel: {
    src: "./assets/story/receipt-tunnel.webp",
    alt: "阴沟水道与旧城护城河叠合，黑水、莲灯和铁栅通向内城暗渠。"
  },
  checkpoint: {
    src: "./assets/story/receipt-checkpoint.webp",
    alt: "死城门禁前，白塔局闸机、巡检灯和古代死门一起审视来人。"
  },
  reservoir: {
    src: "./assets/story/receipt-reservoir.webp",
    alt: "黑水王闸里，巨型水闸、王名刻痕和大将军石像沉在冷水声中。"
  },
  shelter: {
    src: "./assets/story/receipt-shelter.webp",
    alt: "内城密道打开，一边通往雾港城外，一边通向旧城王座。"
  }
};

const RECEIPT_ART_BY_CARD = {
  listen_window: "bureau",
  reset_power: "bureau",
  tune_radio: "station",
  blend_patrol: "checkpoint",
  claim_throne: "shelter",
  leave_as_human: "shelter",
  cut_truth: "shelter",
  entrust_general: "shelter"
};

const MAP = [
  { id: "home", name: "筒子楼", tier: 0, kind: "start", links: ["clinic", "market", "lane"] },
  { id: "clinic", name: "白墙诊所", tier: 1, kind: "aid", links: ["lane", "overpass", "station"] },
  { id: "market", name: "雨棚鬼市", tier: 1, kind: "loot", links: ["overpass", "tunnel"] },
  { id: "lane", name: "后巷电房", tier: 1, kind: "tech", links: ["station", "tunnel"] },
  { id: "overpass", name: "雾桥", tier: 2, kind: "risk", links: ["checkpoint", "tunnel"] },
  { id: "station", name: "旧戏台站", tier: 2, kind: "signal", links: ["checkpoint", "reservoir"] },
  { id: "tunnel", name: "阴沟水道", tier: 2, kind: "stealth", links: ["reservoir", "checkpoint"] },
  { id: "checkpoint", name: "死城门禁", tier: 3, kind: "access", links: ["shelter"] },
  { id: "reservoir", name: "黑水王闸", tier: 3, kind: "memory", links: ["shelter"] },
  { id: "shelter", name: "内城密道", tier: 4, kind: "final", links: [] }
];

const CARD_LIBRARY = {
  home: [
    card("pack_fast", "翻沈砚旧包", "拿走断讯和应急物资。", 12, "route", 92, {
      success: "沈砚的旧包压在床底，白塔局断讯、壁画残照和半瓶井水都在里面。照片背面被水浸花，只剩四个字：不要回身。",
      fail: "你翻得太急，包扣被门把挂住。短波自己亮了一下，沈砚的声音断断续续：别信我，快走。",
      gain: { water: 1, photo: 1, radio: 1 },
      clues: 1,
      stats: { mind: -4 },
      flag: "king_memory"
    }),
    card("listen_window", "听弃城广播", "确认白塔局封锁进度。", 16, "signal", 54, {
      success: "楼道广播先唱童谣，随后切成白塔局警报：旧城回身收容失败，三小时后弃城封锁。外城叠层已经压到三楼。",
      fail: "你听得太久，楼道里的脚步停在门外。猫眼里不是走廊，是一条挂满红纸的旧街。",
      clues: 1,
      stats: { cover: -4 },
      flag: "king_memory"
    }),
    card("bar_door", "按童谣封门", "给安全屋留下归位标记。", 18, "shelter", 78, {
      success: "你把旧城令帖压进门缝。红纸发潮，门背后响了一下，像有人从门外把门闩重新扣好。归位铜钥从门槛灰里露了出来。",
      fail: "令帖贴反了。木门裂出一道王印，像有人从另一段时间里按住你的手。",
      gain: { key: 1 },
      stats: { cover: 5, mind: -3 },
      flags: ["home_cache", "king_memory"]
    })
  ],
  clinic: [
    card("triage_room", "搜白塔药柜", "找药，也找局长留下的收容记录。", 20, "aid", 83, {
      success: "白瓷药盒后面夹着旧档：二十多年前，局长在时空乱流边捡到一个婴儿。档案照片被烧掉半张，剩下的眼睛像你。",
      fail: "柜门刚开，帘后坐着的纸人倒向你。它胸口贴着婴儿腕带，名字栏被刮成一片白。",
      gain: { med: 1 },
      clues: 1,
      stats: { body: -7, mind: -4 }
    }),
    card("help_doctor", "追问旧医官", "用白瓷药盒稳住知道病历的人。", 24, "aid", 64, {
      spend: { med: 1 },
      success: "你把白瓷药盒推到老人手边。老人没问你是谁，只把旧城令帖塞给你，说当年王城密道只认旧臣和王印，不认白塔局。",
      fail: "药盒碎在地上，药柜倒下的声音引来巡检灯。老人一转身，白大褂里空荡荡，只剩一句话：沈砚早知道你是谁。",
      gain: { pass: 1 },
      clues: 1,
      stats: { mind: 4, cover: -8 },
      flags: ["doctor_saved", "human_choice"]
    }),
    card("take_oxygen", "拆收容供氧车", "强行取走还能运转的白塔设备。", 18, "ruthless", 42, {
      success: "供氧车被你撞开，里面藏着铜壳电池、朱砂信号棒和沈砚的实验签：刺激足够时，本命怪异会替人说真话。",
      fail: "氧气瓶砸在地上，漏气声像哭。短波里沈砚轻声笑了一下，像在记录你的反应。",
      gain: { battery: 1, flare: 1 },
      stats: { mind: -9, cover: -7 },
      flags: ["hard_choice", "partner_break"]
    })
  ],
  market: [
    card("raid_stalls", "翻外城供摊", "补给是真，祭品也是真。", 18, "loot", 88, {
      success: "塑料布下有井水瓶和供桌糕，旁边摆着半截白塔局封条。外城百姓当年没有密道，只有这些供品。",
      fail: "你找到食物，也碰倒一排空碗。碗沿自己朝你转过来，像在等旧王给一个交代。",
      gain: { water: 1, ration: 2 },
      stats: { cover: -4 }
    }),
    card("trade_ring", "问壁画摊主", "用壁画残照和补给换旧王来历。", 16, "route", 57, {
      need: { photo: 1 },
      spend: { ration: 1 },
      success: "无脸摊主用壁画残照对上拓片，又收下供桌糕：旧王离城那夜，外城火起，王座空了三百年。",
      fail: "他把壁画残照按在摊布上，又收下供桌糕，却给你一张写着你名字的王榜。榜尾有沈砚的批注：诱导成功。",
      clues: 2,
      stats: { mind: -2 },
      flag: "king_memory"
    }),
    card("grab_crowbar", "撬开纸扎王箱", "拿到密道工具，制造噪声。", 20, "ruthless", 38, {
      success: "棺钉撬弯得刚好，像为王城密道准备的。箱底写着：旧王若归，先开死门。",
      fail: "纸扎箱尖叫着裂开。街对面的灯和几张纸脸一起转向你，叫的不是你的现实名字。",
      gain: { crowbar: 1 },
      stats: { cover: -8 },
      flag: "partner_break"
    })
  ],
  lane: [
    card("reset_power", "重启白塔节点", "用电池换短暂通信。", 18, "tech", 68, {
      need: { battery: 1 },
      success: "电流穿过整条巷子。局长的录音只响了一句：我捡到你那天，旧城的城门在婴儿哭声里合上。",
      fail: "火花烧掉了电池。屏幕只剩一行字：归位对象拒绝归位。",
      spend: { battery: 1 },
      clues: 2,
      stats: { body: -4 },
      flag: "king_memory"
    }),
    card("strip_uniform", "取下隔离衣", "混入白塔巡线队。", 16, "stealth", 82, {
      success: "隔离衣有雨味和消毒水味。穿上以后，白塔巡线灯从你脸上扫过，没有报警，像早就认识你。",
      fail: "衣扣被血黏住。你花了太久才扯下来，胸牌后的名字却变成了“旧王”。",
      gain: { coat: 1 },
      stats: { cover: 9, mind: -6 }
    }),
    card("follow_cable", "沿归位线走", "发现通往内城的错位线路。", 22, "route", 74, {
      success: "电缆从现代墙缝钻进青砖地。你在砖上刻箭头，指尖却自动写出旧城王印。",
      fail: "电缆尽头是死路，但墙上已有你的刻痕。沈砚像在很远处说：你终于开始记起来了。",
      clues: 1,
      flags: ["basement_hint", "king_memory"],
      stats: { mind: -3 }
    })
  ],
  overpass: [
    card("cross_fog", "穿过外城雾桥", "快，但容易暴露在叠层里。", 18, "route", 46, {
      success: "雾桥一半是高架，一半是古城官道。你贴着护栏跑，脚下的柏油和青石不断交换位置。",
      fail: "桥下的灯抬起来，你翻过隔离带硬摔下去。落地时，远处有人喊“王驾回城”。",
      clues: 1,
      stats: { body: -10, cover: -8 }
    }),
    card("drop_pack", "丢下重物冲刺", "牺牲背包换生路。", 12, "ruthless", 74, {
      success: "你把最重的东西扔进雾里，身体突然变轻。短波里沈砚记下一句：求生欲开始压过归位本能。",
      fail: "你丢错了包层，真正重的东西还在肩上。那不是物资，是越来越清晰的王座记忆。",
      drop: 2,
      stats: { body: 4, mind: -6 }
    }),
    card("signal_bus", "点亮朱砂信号棒", "向白塔局暴露位置。", 20, "signal", 35, {
      need: { flare: 1 },
      success: "红光穿透雾，白塔局无人车闪了两下灯。车门打开，导航只剩一个目的地：内城密道。",
      fail: "红光照亮的不只是公交车，还有车窗里坐满的旧城臣民。他们无声地看着你，像等你判决。",
      spend: { flare: 1 },
      clues: 2,
      stats: { cover: -10 }
    })
  ],
  station: [
    card("tune_radio", "调准白塔短波", "用壁画残照校准沈砚留下的剖真记录。", 18, "signal", 52, {
      need: { radio: 1, photo: 1 },
      success: "你把壁画残照贴近短波天线。沈砚的记录浮出来：本命怪异“剖真”已觉醒。为了证明旧王存在，我必须把他带回王城。",
      fail: "频道里只有潮水声，像有人贴着水下唱戏。唱词里反复出现你的旧王封号。",
      clues: 3,
      stats: { mind: -3 },
      flag: "partner_break"
    }),
    card("search_lockers", "搜站台储物柜", "找钥匙，也找沈砚的第二封信。", 20, "loot", 71, {
      success: "储物柜里有井水瓶、旧票根和一把归位铜钥。沈砚在票根背面写：他不回来，旧城永远不会停。",
      fail: "你打开的是空柜，里面只有一面小镜子。镜子里坐着一个披王袍的陌生人。",
      gain: { water: 1, key: 1 },
      stats: { mind: -5 },
      flag: "king_memory"
    }),
    card("hide_train", "躲进王车残厢", "恢复意志，拖慢路线。", 24, "shelter", 86, {
      success: "车厢一半是塑料座椅，一半是王车木厢。你终于听见自己的心跳，也听见远处旧臣喊你归位。",
      fail: "你睡得太沉，醒来时广播已经换了一轮。沈砚留言：睡眠让记忆松动，继续刺激。",
      stats: { mind: 14, food: -5 }
    })
  ],
  tunnel: [
    card("wade_water", "趟过黑水暗渠", "低调，但伤身体。", 22, "stealth", 80, {
      success: "水没到膝盖。你咬着牙走完，鞋里灌满了雾港的冷，也灌满了旧城护城河的腥味。",
      fail: "水下有什么东西绊住你。你挣脱时撞破小腿，水面浮出一枚旧王玉佩。",
      clues: 1,
      stats: { body: -9, cover: 5 }
    }),
    card("open_grate", "撬开内城暗渠", "需要棺钉撬，直通更深的旧城。", 16, "route", 88, {
      need: { crowbar: 1 },
      success: "铁栅呻吟着让开。后面不是出口，是一条贵族逃亡时修下的密道支线。",
      fail: "撬棍打滑，铁锈割开掌心。血落在栅门上，门里有人喊“陛下”。",
      clues: 2,
      stats: { body: -3 },
      flag: "tunnel_open"
    }),
    card("share_water", "分水给旧卒", "少一点补给，多一段旧城证词。", 18, "aid", 63, {
      need: { water: 1 },
      success: "他喝完水后没有跟你走，只把墙上真正的箭头擦亮：将军未死，王位可托。",
      fail: "他抢过水就跑，你只看见他背后的旧军号码。那是死城守军的编制。",
      spend: { water: 1 },
      clues: 2,
      stats: { mind: 5 },
      flags: ["helped_runner", "human_choice"]
    })
  ],
  checkpoint: [
    card("show_pass", "出示旧城令帖", "让死城门禁认出你。", 16, "access", 81, {
      need: { pass: 1 },
      success: "门禁看了令帖，又看了你的脸。机械音忽然换成古音：旧臣见王，开死门。",
      fail: "令帖上的章慢慢渗红。你只好在警报响起前钻进侧门，背后有人跪下又站起。",
      clues: 2,
      stats: { cover: -4 },
      flag: "king_memory"
    }),
    card("blend_patrol", "混进隔离队", "需要白塔隔离衣，风险高，收益大。", 18, "stealth", 48, {
      need: { coat: 1 },
      success: "队伍没有人说话。你也不说话，于是你成了白塔局的一部分，直到他们开始讨论是否处决沈砚。",
      fail: "有人问你的编号。你迟疑了半秒，屏幕自动弹出：归位对象，无权离城。",
      clues: 3,
      stats: { mind: -8, cover: -10 },
      flag: "partner_break"
    }),
    card("force_gate", "硬闯死城门禁", "用棺钉撬制造最后的暴力捷径。", 14, "ruthless", 29, {
      need: { crowbar: 1 },
      success: "你把棺钉撬卡进闸机齿轮，身后警报像一场迟到的雨。你的影子却留在原地，戴着王冠。",
      fail: "撬棍卡死，闸机咬住背包，警报和疼痛同时抵达。沈砚说：很好，恐惧也会喂醒归位。",
      clues: 1,
      stats: { body: -14, cover: -14 },
      flags: ["partner_break", "weird_choice"]
    })
  ],
  reservoir: [
    card("read_scratches", "读王闸刻名", "过去的王名写在水闸背后。", 14, "memory", 69, {
      success: "刻痕不是地图，是你当年离城的顺序。你按它们停顿，旧王记忆在第三次停顿后回到身体里。",
      fail: "你读懂得太晚，水闸已经开始放水。水面漂来一张写着王名的纸钱。",
      clues: 2,
      stats: { mind: -4 },
      flags: ["read_echo_marks", "king_memory"]
    }),
    card("lower_water", "转动归位铜钥", "需要归位铜钥，打开王城水路。", 20, "tech", 55, {
      need: { key: 1 },
      success: "闸门缓缓下沉，露出写满白色盐线的通道。盐线尽头不是出口，是王座方向。",
      fail: "钥匙能转，但转得太慢。水声先一步追上来，像旧城把你的名字重新卷回族谱。",
      clues: 2,
      stats: { body: -6 },
      flag: "water_lowered"
    }),
    card("leave_cache", "唤醒旧城大将军", "用供桌糕和王城水路换一个替你守城的人。", 15, "memory", 91, {
      needFlag: "water_lowered",
      spend: { ration: 1 },
      success: "你把供桌糕和王印刻痕留在将军石像前。石像裂开一线，里面传来铁甲摩擦声：若王不愿归位，臣可代守。",
      fail: "供品摆得太晚，但石像仍然转过半张脸。它记住了你的迟疑。",
      clues: 2,
      stats: { mind: 4 },
      flags: ["left_cache", "general_oath"]
    })
  ],
  shelter: [
    card("claim_throne", "归位王座", "带着归位铜钥留下来，承担旧城君王的责任。", 12, "final", 62, {
      need: { key: 1 },
      success: "你把归位铜钥按进王座残纹。归位怪异第一次完整服从你，旧城停止回身，现实雾港开始复原。",
      fail: "王座认出了你，也认出了你的逃意。死城灯火一盏盏亮起，像在审问失职的王。",
      stats: { mind: -8 },
      flag: "king_memory"
    }),
    card("leave_as_human", "说服沈砚同行", "拒绝王位，以人的身份逃离。", 12, "final", 58, {
      needFlag: "human_choice",
      success: "你对沈砚说：我的能力已经醒了，你不是我的对手，但我不想伤害你。旧城是过去式，我要守护现世。沈砚终于放下记录仪。",
      fail: "沈砚盯着你的脸，眼里只剩剖真的狂热：你不归位，实验就没有结论。",
      stats: { mind: -6 },
      flag: "human_choice"
    }),
    card("cut_truth", "斩断剖真", "让沈砚闭嘴，也让怪异替你开路。", 14, "ruthless", 46, {
      needFlag: "partner_break",
      success: "归位不再只是修正错位，也能把一个人的存在从路上移开。沈砚的短波静了，密道为你打开。",
      fail: "你下手的瞬间犹豫了。沈砚笑着后退，剖真怪异从他影子里张开。",
      stats: { body: -8, mind: -8 },
      flags: ["weird_choice", "partner_break"]
    }),
    card("entrust_general", "托付大将军", "隐藏路线：把王权归位给旧城大将军。", 16, "final", 51, {
      need: { key: 1 },
      needFlags: ["water_lowered", "general_oath"],
      success: "大将军跪在王座前，接过你用归位铜钥归还的王权。旧城有了新主，现世不必再献出一个旧王。",
      fail: "将军伸手接印，却被死城怨声压回石壳。你还没有足够的理由证明自己可以离开。",
      stats: { mind: -5, body: -4 },
      flag: "perfect_choice"
    })
  ]
};

let state = null;
let ambient = null;
let judgmentTimer = 0;
let archiveViewMode = "archive";
let clueFieldMode = "overview";
let selectedClueCardId = "";
let clueMobilePanel = "graph";
let clueReadSegments = loadClueReadSegments();

function card(id, label, detail, cost, kind, chance, data) {
  return { id, label, detail, cost, kind, chance, ...data };
}

function audioContextClass() {
  return window.AudioContext || window.webkitAudioContext;
}

class AmbientBgm {
  constructor() {
    const AudioContextClass = audioContextClass();
    if (!AudioContextClass) throw new Error("Web Audio is not available in this browser.");
    this.ctx = new AudioContextClass();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(this.ctx.destination);

    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.value = 420;
    this.filter.Q.value = 0.8;
    this.filter.connect(this.master);

    this.drone = this.makeOscillator("sine", 54, 0.08);
    this.shadow = this.makeOscillator("triangle", 81, 0.035);
    this.noise = this.makeNoise();
    this.assets = this.makeAudioAssets();
    this.transients = new Set();
    this.playedVoices = new Set();
    this.duckCount = 0;
    this.nextChime = 0;
    this.running = false;
    this.raf = 0;
  }

  makeOscillator(type, frequency, gainValue) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.value = gainValue;
    osc.connect(gain);
    gain.connect(this.filter);
    osc.start();
    return { osc, gain };
  }

  makeNoise() {
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i += 1) data[i] = (Math.random() * 2 - 1) * 0.35;
    const source = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    source.buffer = buffer;
    source.loop = true;
    filter.type = "bandpass";
    filter.frequency.value = 780;
    filter.Q.value = 0.5;
    gain.gain.value = 0.018;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    source.start();
    return { source, filter, gain };
  }

  makeAudioAssets() {
    return {
      ambience: this.makeAudioAsset(AUDIO_ASSETS.ambience, true),
      pressure: this.makeAudioAsset(AUDIO_ASSETS.pressure, true),
      success: this.makeAudioAsset(AUDIO_ASSETS.success),
      fail: this.makeAudioAsset(AUDIO_ASSETS.fail),
      broadcast: this.makeAudioAsset(AUDIO_ASSETS.broadcast),
      shenyan: this.makeAudioAsset(AUDIO_ASSETS.shenyan)
    };
  }

  makeAudioAsset(src, loop = false) {
    const audio = new Audio(src);
    audio.preload = "auto";
    audio.loop = loop;
    audio.volume = 0;
    audio.playsInline = true;
    return audio;
  }

  async toggle() {
    if (this.ctx.state === "suspended") await this.ctx.resume();
    this.running = !this.running;
    this.master.gain.setTargetAtTime(this.running ? 0.18 : 0, this.ctx.currentTime, 0.8);
    if (this.running) {
      await this.startAssetLoops();
      this.tick();
    } else {
      this.stopAssetLoops();
      cancelAnimationFrame(this.raf);
    }
    return this.running;
  }

  async startAssetLoops() {
    this.applyAssetMix(state?.heat || 0);
    await Promise.allSettled([this.assets.ambience.play(), this.assets.pressure.play()]);
  }

  stopAssetLoops() {
    [this.assets.ambience, this.assets.pressure].forEach((clip) => {
      clip.pause();
      clip.currentTime = 0;
      clip.volume = 0;
    });
    this.transients.forEach((clip) => {
      clip.pause();
      clip.currentTime = 0;
    });
    this.transients.clear();
    this.duckCount = 0;
  }

  setAlert(heat) {
    const level = clamp(heat / 18, 0, 1);
    const now = this.ctx.currentTime;
    this.drone.osc.frequency.setTargetAtTime(52 + level * 12, now, 0.6);
    this.shadow.osc.frequency.setTargetAtTime(79 + level * 19, now, 0.6);
    this.drone.gain.gain.setTargetAtTime(0.065 + level * 0.055, now, 0.6);
    this.shadow.gain.gain.setTargetAtTime(0.02 + level * 0.045, now, 0.6);
    this.noise.gain.gain.setTargetAtTime(0.012 + level * 0.06, now, 0.5);
    this.noise.filter.frequency.setTargetAtTime(520 + level * 1200, now, 0.8);
    this.filter.frequency.setTargetAtTime(360 + level * 520, now, 0.8);
    this.applyAssetMix(heat);
  }

  applyAssetMix(heat) {
    const level = clamp(heat / 18, 0, 1);
    const duck = this.duckCount > 0 ? 0.42 : 1;
    this.assets.ambience.volume = (0.22 + level * 0.05) * duck;
    this.assets.pressure.volume = Math.pow(level, 1.35) * 0.28 * duck;
  }

  playReceipt(success) {
    this.playOneShot(success ? "success" : "fail", success ? 0.42 : 0.48);
  }

  playVoiceOnce(name) {
    if (this.playedVoices.has(name)) return;
    this.playedVoices.add(name);
    this.playOneShot(name, 0.84, true);
  }

  resetRunCues() {
    this.playedVoices.clear();
  }

  playOneShot(name, volume, duck = false) {
    if (!this.running || !this.assets[name]) return;
    const source = this.assets[name];
    const clip = new Audio(source.currentSrc || source.src);
    clip.preload = "auto";
    clip.volume = volume;
    clip.playsInline = true;
    this.transients.add(clip);
    if (duck) {
      this.duckCount += 1;
      this.applyAssetMix(state?.heat || 0);
    }
    let timer = null;
    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      if (timer) window.clearTimeout(timer);
      this.transients.delete(clip);
      if (duck) {
        this.duckCount = Math.max(0, this.duckCount - 1);
        this.applyAssetMix(state?.heat || 0);
      }
    };
    clip.addEventListener("ended", cleanup, { once: true });
    clip.addEventListener("error", cleanup, { once: true });
    clip.play().then(() => {
      const maxSeconds = AUDIO_CUE_DURATIONS[name];
      if (!maxSeconds) return;
      timer = window.setTimeout(() => {
        clip.pause();
        clip.currentTime = 0;
        cleanup();
      }, maxSeconds * 1000);
    }).catch(cleanup);
  }

  tick() {
    if (!this.running) return;
    const heat = state?.heat || 0;
    this.setAlert(heat);
    const now = this.ctx.currentTime;
    const interval = Math.max(1.4, 5.6 - heat * 0.22);
    if (now >= this.nextChime) {
      this.playChime(heat);
      this.nextChime = now + interval + Math.random() * 1.5;
    }
    this.raf = requestAnimationFrame(() => this.tick());
  }

  playChime(heat) {
    const now = this.ctx.currentTime;
    const level = clamp(heat / 18, 0, 1);
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = level > 0.65 ? "sawtooth" : "sine";
    osc.frequency.setValueAtTime(180 + Math.random() * 70 + level * 120, now);
    osc.frequency.exponentialRampToValueAtTime(76 + level * 24, now + 0.8);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08 + level * 0.05, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    osc.connect(gain);
    gain.connect(this.filter);
    osc.start(now);
    osc.stop(now + 1.3);
  }
}

function ensureAmbient() {
  if (!ambient) ambient = new AmbientBgm();
  return ambient;
}

function loadArchive() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.slice(-MAX_ECHOES) : [];
  } catch {
    return [];
  }
}

function saveArchive(archive) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(archive.slice(-MAX_ECHOES)));
}

function loadActionMemory() {
  try {
    const raw = localStorage.getItem(ACTION_MEMORY_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return normalizeActionMemory(parsed);
  } catch {
    return {};
  }
}

function saveActionMemory(memory) {
  localStorage.setItem(ACTION_MEMORY_KEY, JSON.stringify(memory || {}));
}

function loadClueReadSegments() {
  try {
    const raw = localStorage.getItem(CLUE_READ_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    const list = Array.isArray(parsed) ? parsed : parsed?.segments;
    return new Set(Array.isArray(list) ? list.filter((item) => typeof item === "string") : []);
  } catch {
    return new Set();
  }
}

function saveClueReadSegments() {
  localStorage.setItem(CLUE_READ_KEY, JSON.stringify([...clueReadSegments]));
}

function normalizeActionMemory(memory) {
  return Object.fromEntries(Object.entries(memory).map(([id, record]) => {
    if (!record || typeof record !== "object") return [id, record];
    return [id, {
      ...record,
      success: normalizeOutcomeMemory(record.success),
      fail: normalizeOutcomeMemory(record.fail)
    }];
  }));
}

function normalizeOutcomeMemory(outcome) {
  if (!outcome || typeof outcome !== "object") return outcome;
  return {
    ...outcome,
    line: normalizeEffectLine(outcome.line)
  };
}

function normalizeEffectLine(line) {
  let seenAwakeningValue = false;
  return String(line || "").split(" / ").map((part) => {
    if (/^抑制\+/.test(part)) return part.replace(/^抑制/, "倾向抑制");
    if (!/^觉醒[+-]/.test(part)) return part;
    if (!seenAwakeningValue) {
      seenAwakeningValue = true;
      return part.replace(/^觉醒/, "觉醒值");
    }
    return part.replace(/^觉醒/, "倾向觉醒");
  }).join(" / ");
}

function randomId() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

function mulberry32(seed) {
  return function random() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(list, rng = state.rng) {
  return list[Math.floor(rng() * list.length)];
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function startRun() {
  closeJudgment();
  refs.feedbackModal.hidden = true;
  refs.settlementModal.hidden = true;
  const archive = loadArchive();
  const actionMemory = loadActionMemory();
  const seed = Date.now() % 2147483647;
  const rng = mulberry32(seed);
  const activeEcho = archive.length ? pick(archive.slice(-6), rng) : null;
  const relics = deriveRelics(archive);

  state = {
    id: randomId(),
    seed,
    rng,
    archive,
    actionMemory,
    activeEcho,
    cycle: archive.length + 1,
    relics,
    node: "home",
    available: ["home"],
    visited: [],
    minutes: START_MINUTES,
    stats: {
      body: 4,
      cover: 4,
      food: 5,
      mind: 4
    },
    bag: {},
    clues: 0,
    heat: 0,
    morality: 0,
    flags: new Set(),
    log: [],
    last: null,
    feedback: null,
    ended: false,
    ending: null,
    phase: "event",
    nodeResolved: false,
    cards: [],
    choices: [],
    exhaustedNodes: new Set(),
    echoUsedAid: false,
    story: openingText(activeEcho, relics)
  };

  applyRelicStart();
  Object.entries(STARTING_ITEMS).forEach(([id, count]) => addItem(id, count, true));
  addLog("开局", "三小时后弃城封锁。目标：穿过旧城叠层，抵达内城密道。");
  generateCards();
  render();
  ambient?.resetRunCues();
}

function openingText(echo, relics) {
  const base =
    "上午九点，白塔局断讯只剩一句：三小时后弃城封锁。\n\n" +
    "你在筒子楼醒来。门外的楼道像一条旧街，手机里只有沈砚发来的半张壁画。\n\n" +
    "先处理眼前的事。";
  if (!echo) return base;
  const relicLine = relics.length ? `\n\n你还带着一些熟悉到不合常理的痕迹：${relics.map((id) => RELICS[id].name).join("、")}。` : "";
  return `${base}\n\n桌上压着半张黄纸，字迹像你，却更疲惫：${echo.note}${relicLine}`;
}

function deriveRelics(archive) {
  const last = archive.slice(-5);
  const relics = new Set();
  last.forEach((echo) => {
    if (echo.relic && RELICS[echo.relic]) relics.add(echo.relic);
  });
  return Array.from(relics).slice(-3);
}

function applyRelicStart() {
  if (state.relics.includes("shelter")) stat("cover", 1);
  if (state.relics.includes("ruthless")) stat("mind", -1);
}

function hasItem(id, count = 1) {
  return (state.bag[id] || 0) >= count;
}

function hasTag(tag) {
  return Object.keys(state.bag).some((id) => (ITEMS[id]?.tags || []).includes(tag));
}

function bagLoad() {
  return Object.entries(state.bag).reduce((sum, [id, count]) => sum + (ITEMS[id]?.size || 0) * count, 0);
}

function addItem(id, count = 1, silent = false) {
  const item = ITEMS[id];
  if (!item || count <= 0) return 0;
  let added = 0;
  for (let i = 0; i < count; i += 1) {
    if (bagLoad() + item.size > MAX_BAG) break;
    state.bag[id] = (state.bag[id] || 0) + 1;
    added += 1;
  }
  if (added && !silent) addLog("获得", `${item.name}${added > 1 ? ` ×${added}` : ""}`);
  if (added < count && !silent) addLog("背包", `${item.name}放不下了。`);
  return added;
}

function removeItem(id, count = 1) {
  const used = Math.min(state.bag[id] || 0, count);
  if (!used) return 0;
  state.bag[id] -= used;
  if (state.bag[id] <= 0) delete state.bag[id];
  return used;
}

function removeAnyItem(count = 1) {
  const removed = [];
  for (const id of SAFE_DROP_ORDER) {
    while (removed.length < count && hasItem(id)) {
      removeItem(id);
      removed.push(ITEMS[id].name);
    }
    if (removed.length >= count) break;
  }
  return removed;
}

function stat(key, delta) {
  if (!Object.prototype.hasOwnProperty.call(state.stats, key)) return;
  state.stats[key] = clamp((state.stats[key] || 0) + normalizeStatDelta(delta), 0, MAX_STAT);
}

function normalizeStatDelta(delta) {
  if (!delta) return 0;
  if (Math.abs(delta) <= 2) return delta;
  return Math.sign(delta) * Math.max(1, Math.round(Math.abs(delta) / 7));
}

function setFlag(flag) {
  state.flags.add(flag);
}

function hasFlag(flag) {
  return state.flags.has(flag);
}

function depletedStat() {
  return STATS.find(({ key }) => state.stats[key] <= 0) || null;
}

function currentDeathInfo() {
  const broken = depletedStat();
  if (broken) {
    return {
      type: "depleted",
      label: `${broken.name}归零`,
      reason: `${broken.name}会归零，你已经付不出下一次选择的代价。`
    };
  }
  if (state.minutes <= 0) {
    return {
      type: "timeout",
      label: "封锁完成",
      reason: "倒计时会归零，弃城封锁会先一步合拢。"
    };
  }
  return null;
}

function addLog(title, text) {
  state.log.unshift({ title, text, minutes: START_MINUTES - state.minutes });
  state.log = state.log.slice(0, 24);
}

function currentNode() {
  return MAP.find((node) => node.id === state.node);
}

function nodeById(id) {
  return MAP.find((node) => node.id === id);
}

function cardById(id) {
  return Object.values(CARD_LIBRARY).flat().find((cardData) => cardData.id === id);
}

function sceneArtFor(nodeId = state?.node) {
  const art = RECEIPT_ART[nodeId];
  return art?.src || SCENE_ART[nodeId] || DEFAULT_SCENE_ART;
}

function feedbackSceneArtFor(cardData) {
  const artKey = RECEIPT_ART_BY_CARD[cardData.id] || state.node;
  return RECEIPT_ART[artKey]?.src || sceneArtFor(state.node);
}

function feedbackSceneAltFor(cardData) {
  const artKey = RECEIPT_ART_BY_CARD[cardData.id] || state.node;
  return RECEIPT_ART[artKey]?.alt || RECEIPT_ART[state.node]?.alt || "雾港旧城事件插图";
}

function generateCards() {
  const pool = CARD_LIBRARY[state.node] || [];
  const seen = new Set(state.choices.filter((choice) => choice.node === state.node).map((choice) => choice.card));
  const fresh = pool.filter((entry) => !seen.has(entry.id));
  state.cards = shuffle(fresh, state.rng).slice(0, state.node === "shelter" ? 4 : 3);
  if (!state.cards.length) {
    state.exhaustedNodes.add(state.node);
    if (!state.ended && state.node !== "shelter") enterRouteChoice("auto");
  }
}

function remainingCardsForNode(nodeId) {
  const pool = CARD_LIBRARY[nodeId] || [];
  const seen = new Set(state.choices.filter((choice) => choice.node === nodeId).map((choice) => choice.card));
  return pool.filter((entry) => !seen.has(entry.id));
}

function shuffle(list, rng) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function effectiveCheckRating(cardData) {
  let rating = cardData.chance;
  const checkKey = checkStatFor(cardData);
  if (state.relics.includes("route") && state.choices.length === 0) rating += 10;
  if (state.relics.includes("ruthless") && cardAlignment(cardData) === "evil") rating += 12;
  if (cardData.kind === "stealth" && hasTag("cover")) rating += 10;
  if (cardData.kind === "signal" && hasTag("signal")) rating += 10;
  if (cardData.kind === "access" && hasTag("access")) rating += 12;
  if (cardData.kind === "route" && state.clues >= 3) rating += 8;
  rating += Math.min(12, state.clues * 2);
  rating -= Math.max(0, state.heat - 10);
  if (cardAlignment(cardData) === "evil" && state.heat >= 8) rating += 8;
  if (cardAlignment(cardData) === "good" && state.heat >= 10) rating -= 10;
  if (checkKey !== "cover") rating -= state.stats.cover <= 2 ? 8 : 0;
  if (checkKey !== "mind") rating -= state.stats.mind <= 2 ? 8 : 0;
  return clamp(Math.round(rating), 12, 96);
}

function effectiveCheckTarget(cardData) {
  const rating = effectiveCheckRating(cardData);
  const checkKey = checkStatFor(cardData);
  const statValue = checkKey ? state.stats[checkKey] || 0 : BASE_CHECK_STAT;
  return targetForSuccessRate(statValue, rating / 100);
}

function rollCheck(cardData) {
  const checkKey = checkStatFor(cardData);
  const statValue = checkKey ? state.stats[checkKey] || 0 : 0;
  const diceCount = Math.max(0, statValue);
  const target = effectiveCheckTarget(cardData);
  const rolls = Array.from({ length: diceCount }, () => Math.floor(state.rng() * CHECK_DIE_SIDES) + 1);
  const total = rolls.reduce((sum, value) => sum + value, 0);
  return {
    checkKey,
    statValue,
    diceCount,
    target,
    rolls,
    roll: total,
    total,
    success: total >= target
  };
}

function targetForSuccessRate(diceCount, successRate) {
  const count = Math.max(0, Math.round(diceCount));
  if (count <= 0) return 1;
  const rate = clamp(successRate, 0.01, 0.99);
  const distribution = diceDistribution(count);
  const totalOutcomes = distribution.reduce((sum, ways) => sum + ways, 0);
  let bestTarget = count;
  let bestDelta = Infinity;
  let successOutcomes = 0;
  for (let target = distribution.length - 1; target >= count; target -= 1) {
    successOutcomes += distribution[target] || 0;
    const chance = successOutcomes / totalOutcomes;
    const delta = Math.abs(chance - rate);
    if (delta <= bestDelta) {
      bestDelta = delta;
      bestTarget = target;
    }
  }
  return bestTarget;
}

function diceDistribution(diceCount) {
  const cacheKey = `${diceCount}d${CHECK_DIE_SIDES}`;
  if (DICE_TARGET_CACHE.has(cacheKey)) return DICE_TARGET_CACHE.get(cacheKey);
  let distribution = [1];
  for (let die = 0; die < diceCount; die += 1) {
    const next = Array(distribution.length + CHECK_DIE_SIDES).fill(0);
    distribution.forEach((ways, sum) => {
      if (!ways) return;
      for (let face = 1; face <= CHECK_DIE_SIDES; face += 1) {
        next[sum + face] += ways;
      }
    });
    distribution = next;
  }
  DICE_TARGET_CACHE.set(cacheKey, distribution);
  return distribution;
}

function checkStatFor(action) {
  if (!action?.chance) return null;
  return action.check || CHECK_STAT_BY_KIND[action.kind] || "mind";
}

function statName(key) {
  return STATS.find((entry) => entry.key === key)?.name || "";
}

function canPlay(cardData) {
  return !blockReason(cardData);
}

function blockReason(cardData) {
  const missingFlag = requiredFlagsFor(cardData).find((flag) => !hasFlag(flag));
  if (missingFlag) return FLAG_REQUIREMENTS[missingFlag] || `需要：${flagLabel(missingFlag)}`;
  const missing = Object.entries(requiredItemsFor(cardData)).find(([id, count]) => !hasItem(id, count));
  if (missing) return `需要：${ITEMS[missing[0]]?.name || missing[0]}×${missing[1]}`;
  return moralBlock(cardData);
}

function requiredFlagsFor(cardData) {
  return [cardData.needFlag, ...(cardData.needFlags || [])].filter(Boolean);
}

function requiredItemsFor(cardData) {
  const required = {};
  [cardData.need, cardData.spend].forEach((map) => {
    Object.entries(map || {}).forEach(([id, count]) => {
      required[id] = Math.max(required[id] || 0, count);
    });
  });
  return required;
}

function moralBlock(cardData) {
  const alignment = cardAlignment(cardData);
  const tier = currentNode()?.tier || 0;
  if (alignment === "good" && tier >= 2 && state.heat >= 12) return "觉醒太深，抑制类选择暂时无法执行";
  if (alignment === "good" && state.morality <= -3) return "觉醒已经压过了这个选择";
  if (alignment === "evil" && tier >= 3 && state.morality >= 4 && state.heat <= 3) return "你还没有狠到这一步";
  return "";
}

function cardAlignment(action) {
  return action?.alignment || ALIGNMENT_BY_KIND[action?.kind] || "neutral";
}

function alignmentLabel(action) {
  return ALIGNMENT_LABELS[cardAlignment(action)] || "常";
}

function playCard(cardData) {
  if (state.ended || !canPlay(cardData)) return;
  const before = snapshot();
  const check = rollCheck(cardData);
  const success = check.success;
  const text = success ? cardData.success : cardData.fail;

  spendCost(cardData);
  applyCard(cardData, success);
  advanceTime(cardData.cost, cardData.kind);

  const result = summarize(before, cardData, check, text);
  const death = currentDeathInfo();
  result.death = death;
  state.last = result;
  state.feedback = buildFeedback(cardData, result);
  rememberActionOutcome(cardData, result, death);
  state.story = [compactEventText(text), compactNarrativeText(result.narrative)].filter(Boolean).join("\n\n");
  state.choices.push({ card: cardData.id, node: state.node, kind: cardData.kind, success });
  state.cards = state.cards.filter((entry) => entry.id !== cardData.id);
  if (!remainingCardsForNode(state.node).length) state.exhaustedNodes.add(state.node);
  state.nodeResolved = true;
  state.phase = state.node === "shelter" ? "event" : "ready";
  addLog(success ? "成功" : "失手", `${cardData.label}。${result.summary}`);

  if (death?.type === "depleted") {
    endRun("depleted");
  } else if (death?.type === "timeout") {
    endRun("timeout");
  } else if (state.node === "shelter" && success) {
    endRun("shelter");
  } else {
    maybeEchoEvent();
    if (!state.ended) {
      if (state.phase === "event") generateCards();
      if (state.phase === "ready") {
        state.story += state.exhaustedNodes.has(state.node)
          ? "\n\n这里已经没有更多可处理的事了。你只能离开这里。"
          : "\n\n当前区域已经处理完。你可以离开这里，也可以冒险再处理一轮。";
      }
    }
  }
  render();
  if (state.feedback && !state.ended) showJudgment(check, () => showFeedback());
}

function spendCost(cardData) {
  if (cardData.spend) {
    Object.entries(cardData.spend).forEach(([id, count]) => removeItem(id, count));
  }
}

function applyCard(cardData, success) {
  const baseStats = { ...(cardData.stats || {}) };
  Object.entries(baseStats).forEach(([key, delta]) => stat(key, success ? delta : Math.min(delta, -Math.abs(delta || 5))));
  applyMoralShift(cardData, success);

  if (success) {
    if (cardData.gain) Object.entries(cardData.gain).forEach(([id, count]) => addItem(id, count));
    if (cardData.clues) state.clues += cardData.clues + (state.relics.includes("signal") && cardData.kind === "signal" ? 1 : 0);
    if (cardData.flag) setFlag(cardData.flag);
    if (cardData.flags) cardData.flags.forEach((flag) => setFlag(flag));
  } else {
    if (cardData.drop) removeAnyItem(cardData.drop);
  }

  if (state.relics.includes("aid") && !state.echoUsedAid && state.stats.body <= 3) {
    state.echoUsedAid = true;
    stat("body", 1);
    addLog("痕迹", "白瓷药盒让你的手重新有了力气。");
  }
}

function applyMoralShift(cardData, success) {
  const alignment = cardAlignment(cardData);
  if (alignment === "good") {
    state.morality = clamp(state.morality + 1, -MAX_MORALITY, MAX_MORALITY);
    state.heat = Math.max(0, state.heat - (success ? 1 : 0));
    return;
  }

  if (alignment === "evil") {
    state.morality = clamp(state.morality - (success ? 1 : 2), -MAX_MORALITY, MAX_MORALITY);
    state.heat = clamp(state.heat + (success ? 2 : 4), 0, MAX_AWAKENING);
    return;
  }

  if (!success) state.heat = clamp(state.heat + 2, 0, MAX_AWAKENING);
  if (success && ["memory", "access", "signal"].includes(cardData.kind)) {
    state.heat = clamp(state.heat + 1, 0, MAX_AWAKENING);
  }
}

function advanceTime(minutes, kind) {
  state.minutes = Math.max(0, state.minutes - minutes);
  if (kind === "route") {
    if (minutes >= 14) stat("cover", -1);
    return;
  }
  if (kind === "memory" || kind === "signal" || kind === "access") stat("mind", -1);
  if (kind === "risk" || kind === "stealth") stat("body", -1);
  if (state.stats.mind <= 2 && cardAlignment({ kind }) !== "good") state.heat = clamp(state.heat + 1, 0, MAX_AWAKENING);
}

function moveTo(nodeId) {
  if (state.ended || state.phase !== "route" || !currentNode().links.includes(nodeId)) return;
  const target = nodeById(nodeId);
  if (!target) return;
  state.visited.push(state.node);
  state.node = nodeId;
  state.phase = "event";
  state.nodeResolved = false;
  state.available = Array.from(new Set([...state.available, nodeId, ...target.links]));
  const moveCost = target.kind === "final" ? 8 : 10 + target.tier * 2;
  advanceTime(moveCost, "route");
  state.story = routeText(target);
  addLog("移动", `抵达${target.name}，耗时 ${moveCost} 分钟。`);
  if (depletedStat()) {
    endRun("depleted");
  } else if (state.minutes <= 0) {
    endRun("timeout");
  } else {
    generateCards();
  }
  render();
}

function routeText(node) {
  const lines = {
    home: "你回到筒子楼门口。现代门牌和旧城王印叠在一起，像两段时间争着认你。",
    clinic: "白墙诊所门口挂着褪色红十字，里面却有旧城医署的药柜。外城叠层已经开始吃掉街区。",
    market: "雨棚鬼市的塑料布被雾打湿。供桌糕摆在空摊上，摊位背后露出古代外城的青砖市井。",
    lane: "后巷电房低低震动。黑线一样的电缆钻进青砖墙，像白塔局把现代钉在旧城上。",
    overpass: "雾桥一半是高架，一半是古代官道。桥外的现实越来越远。",
    station: "旧戏台站的电子屏还亮着，台口垂着白布。沈砚的短波和童谣在同一段频率里互相咬住。",
    tunnel: "阴沟水道潮湿、狭窄，水面漂着莲灯。这里通向内城，也通向你不愿承认的王座。",
    checkpoint: "死城门禁就在前面。白塔局隔离灯和旧城死门重叠，所有出口都在判断你该不该离开。",
    reservoir: "黑水王闸背后有一阵风。墙上刻着旧王离城的顺序，也刻着外族入侵那夜的火线。",
    shelter: "内城密道就在眼前。它既能通向城外，也能通向王座下方。沈砚在那里等你。"
  };
  return lines[node.id] || node.name;
}

function storyPhase() {
  const tier = currentNode()?.tier || 0;
  if (state.node === "shelter" || tier >= 3 || state.clues >= 6) return "late";
  if (tier >= 2 || state.clues >= 3 || state.choices.length >= 3) return "mid";
  return "early";
}

function maybeEchoEvent() {
  if (!state.activeEcho) return;
  const shouldAppear = state.choices.length === 2 || (state.relics.includes("memory") && state.choices.length === 4);
  if (!shouldAppear || hasFlag(`echo_event_${state.choices.length}`)) return;
  setFlag(`echo_event_${state.choices.length}`);
  state.cards.unshift({
    id: `echo_${state.choices.length}`,
    label: "听过去的自己说完",
    detail: "获得线索，但这会让循环更沉。",
    cost: 10,
    kind: "memory",
    chance: 92,
    success: `便签背面还有一行小字：“${state.activeEcho.note}”`,
    fail: "你盯着便签太久，字迹像潮水一样散开。",
    clues: 2,
    stats: { mind: -4 },
    flag: "heard_echo"
  });
}

function continueCurrentNode() {
  if (state.ended || (state.phase !== "ready" && state.phase !== "route")) return;
  if (state.exhaustedNodes.has(state.node)) {
    state.phase = "ready";
    state.cards = [];
    state.story = `${currentNode().name}已经被你翻到底。\n\n没有更多值得冒险的事了。`;
    render();
    return;
  }
  state.phase = "event";
  state.nodeResolved = false;
  state.heat = clamp(state.heat + 1, 0, MAX_AWAKENING);
  state.story = `你决定在${currentNode().name}多停一会儿。\n\n机会还在，但**【归位】**也会因为犹豫和贪念醒得更深。`;
  addLog("停留", `继续处理${currentNode().name}，觉醒+1。`);
  generateCards();
  render();
}

function openRouteChoice() {
  if (state.ended || state.phase !== "ready") return;
  enterRouteChoice("manual");
  render();
}

function enterRouteChoice(mode) {
  state.phase = "route";
  state.story = state.exhaustedNodes.has(state.node)
    ? `${currentNode().name}已经没有更多可处理的事。\n\n你摊开临时路线，只能从眼前的岔路里选一个方向。`
    : `${currentNode().name}的事情暂时告一段落。\n\n你摊开临时路线，只能从眼前的岔路里选一个方向。`;
  if (mode !== "auto") addLog("前进", "开始选择下一站。");
}

function returnToCurrentNode() {
  if (state.ended || state.phase !== "route") return;
  if (!remainingCardsForNode(state.node).length) return;
  state.phase = "ready";
  state.story = `你把路线纸折回口袋。\n\n${currentNode().name}还在原地。你可以再处理这里的事，也可以稍后离开。`;
  addLog("返回", `回到${currentNode().name}。`);
  render();
}

function snapshot() {
  return {
    bag: { ...state.bag },
    stats: { ...state.stats },
    clues: state.clues,
    heat: state.heat,
    morality: state.morality,
    flags: new Set(state.flags)
  };
}

function summarize(before, cardData, check, text) {
  const itemDiffs = [];
  const ids = new Set([...Object.keys(before.bag), ...Object.keys(state.bag)]);
  ids.forEach((id) => {
    const delta = (state.bag[id] || 0) - (before.bag[id] || 0);
    if (!delta) return;
    itemDiffs.push(`${delta > 0 ? "获得" : "失去"}${ITEMS[id].name}×${Math.abs(delta)}`);
  });

  const statDiffs = STATS.map(({ key, name }) => {
    const delta = state.stats[key] - before.stats[key];
    return Math.abs(delta) >= 4 ? `${name}${delta > 0 ? "+" : ""}${delta}` : null;
  }).filter(Boolean);
  const allStatDiffs = STATS.map(({ key, name }) => {
    const delta = state.stats[key] - before.stats[key];
    return delta ? `${name}${delta > 0 ? "+" : ""}${delta}` : null;
  }).filter(Boolean);

  const clueDiff = state.clues - before.clues;
  const progressDiffs = [];
  if (clueDiff) progressDiffs.push(`线索+${clueDiff}`);
  const heatDiff = state.heat - before.heat;
  if (heatDiff) progressDiffs.push(`觉醒值${heatDiff > 0 ? "+" : ""}${heatDiff}`);
  const moralityDiff = state.morality - before.morality;
  if (moralityDiff) progressDiffs.push(tendencyDiffText(moralityDiff));

  const flags = [];
  state.flags.forEach((flag) => {
    if (!before.flags.has(flag)) flags.push(flag);
  });
  const flagDiffs = flags.slice(0, 2).map((flag) => flagLabel(flag));
  statDiffs.push(...progressDiffs, ...flagDiffs);
  const memoryDiffs = [...itemDiffs, ...allStatDiffs, ...progressDiffs, ...flagDiffs];

  const summary = [
    judgmentText(check),
    `耗时 ${cardData.cost}m`,
    ...itemDiffs,
    ...statDiffs
  ].join(" / ");

  return {
    text,
    success: check.success,
    checkKey: check.checkKey,
    statValue: check.statValue,
    diceCount: check.diceCount,
    target: check.target,
    rolls: check.rolls,
    roll: check.roll,
    total: check.total,
    summary,
    itemDiffs,
    statDiffs,
    memoryDiffs,
    effectLine: memoryDiffs.length ? memoryDiffs.join(" / ") : "状态暂时没有明显变化",
    heatDiff,
    moralityDiff,
    narrative: buildChangeNarrative(itemDiffs, statDiffs, heatDiff, moralityDiff, check.success, cardData)
  };
}

function buildChangeNarrative(itemDiffs, statDiffs, heatDiff, moralityDiff, success, cardData) {
  const lines = [];
  const phase = storyPhase();
  if (phase === "early") {
    if (success) {
      lines.push("**你确认了一条规则。**属性越稳，骰子越多；先让自己能继续走，线索才有意义。");
    } else {
      lines.push("*失手也没有白费。*这张牌的代价被你记住了，下次再看见它时，直觉会先一步提醒你。");
    }
  } else if (phase === "mid" && success) {
    lines.push(`**${cardData.label}让旧城多露出一层。**这不是完整答案，只是足够你继续往里走的一小块证据。`);
  }
  if (itemDiffs.length) lines.push("**你把能带走的东西压进包底。**背包沉了一点，选择也因此多了一点。");
  const coreStats = statDiffs.filter((entry) => !entry.startsWith("觉醒值") && !entry.startsWith("倾向"));
  if (coreStats.length) lines.push("*身体和念头像被雾掰了一下。某些信息在脑中接上，某些力气则从指缝里漏出去。*");
  if (heatDiff > 0) lines.push(`**【归位】在体内亮了一瞬。**那不是提醒，更像旧城借你的手醒过来。`);
  if (heatDiff < 0) lines.push(`*你把那股冲动压回喉咙里，雾声暂时低下去。*`);
  if (moralityDiff > 0) lines.push("你仍然记得自己想以人的方式离开这里。");
  if (moralityDiff < 0) lines.push("你开始更快地判断谁是人，谁只是路上的障碍。");
  if (!lines.length) lines.push(success ? "事情暂时按你的判断落定。" : "没有新的东西落入口袋，只有雾把沉默留了下来。");
  return lines.join("\n\n");
}

function tendencyDiffText(delta) {
  if (delta > 0) return `倾向抑制+${delta}`;
  if (delta < 0) return `倾向觉醒+${Math.abs(delta)}`;
  return "";
}

function rememberActionOutcome(cardData, result, death = null) {
  if (!state?.actionMemory || !cardData?.id || !result?.effectLine) return;
  const key = result.success ? "success" : "fail";
  const previous = state.actionMemory[cardData.id] || {};
  const previousOutcome = previous[key] || {};
  state.actionMemory = {
    ...state.actionMemory,
    [cardData.id]: {
      ...previous,
      label: cardData.label,
      [key]: {
        line: result.effectLine,
        death: death || previousOutcome.death || null,
        count: (previousOutcome.count || 0) + 1,
        updatedAt: Date.now()
      }
    }
  };
  saveActionMemory(state.actionMemory);
}

function buildFeedback(cardData, result) {
  const title = result.success ? "你稳住了" : "它注意到了你";
  const type = cardData.kind === "memory" || cardData.kind === "signal" || cardData.kind === "access" ? "征兆" : "道具";
  const rewardLine = result.itemDiffs.length ? result.itemDiffs.join(" / ") : "没有带走新的东西";
  const rewardDetail = itemDetailsFor(cardData);
  const changeLine = result.statDiffs.length ? result.statDiffs.join(" / ") : "状态暂时没有明显变化";
  const threadLine = receiptThreadLine(cardData, result);
  const afterLines = splitNarrativeParagraphs(result.narrative);
  return {
    title,
    tone: result.success ? "success" : "fail",
    success: result.success,
    node: state.node,
    nodeName: currentNode().name,
    cardId: cardData.id,
    art: feedbackSceneArtFor(cardData),
    artAlt: feedbackSceneAltFor(cardData),
    cardLabel: cardData.label,
    mainLine: compactEventText(result.text),
    fullMainLine: result.text,
    hintLine: feedbackMicroLine(result),
    body: `${compactEventText(result.text)}\n\n${compactNarrativeText(result.narrative)}`,
    afterLines,
    meta: judgmentHtml(result),
    rewardLabel: type,
    rewardLine,
    rewardDetail,
    threadDetailLine: stripThreadPrefix(threadLine),
    threadLine,
    changeLine
  };
}

function stripThreadPrefix(text) {
  return String(text || "").replace(/^脉络[:：]\s*/, "");
}

function splitNarrativeParagraphs(text) {
  return String(text || "")
    .split(/\n{2,}/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function compactEventText(text, limit = 56) {
  const normalized = stripMarkdown(text).replace(/\s+/g, " ").trim();
  const firstSentence = normalized.match(/^.+?[。！？!?]/)?.[0] || normalized;
  if (firstSentence.length <= limit) return firstSentence;
  return `${firstSentence.slice(0, limit)}…`;
}

function compactNarrativeText(text) {
  const line = splitNarrativeParagraphs(text)[0] || "";
  return compactEventText(line, 48);
}

function feedbackMicroLine(result) {
  const itemGains = result.itemDiffs.filter((line) => line.startsWith("获得"));
  if (itemGains.length) return itemGains.join(" / ");
  const itemLosses = result.itemDiffs.filter((line) => line.startsWith("失去"));
  if (itemLosses.length) return itemLosses.join(" / ");
  const clueGain = result.statDiffs.find((line) => line.startsWith("线索+"));
  if (clueGain) return clueGain;
  const namedProgress = result.statDiffs.find((line) => !/^(力量|敏捷|智力|意志|觉醒值|倾向)/.test(line));
  if (namedProgress) return namedProgress;
  const statChange = result.statDiffs.find((line) => /^(力量|敏捷|智力|意志)/.test(line));
  if (statChange) return statChange;
  if (result.death?.label) return result.death.label;
  return result.success ? "没有带走新的东西" : "没有拿稳。";
}

function voiceCueForFeedback(feedback) {
  const cue = VOICE_CARD_CUES[feedback?.cardId];
  if (!cue) return "";
  if (cue.on === "success" && !feedback.success) return "";
  if (cue.on === "fail" && feedback.success) return "";
  return cue.cue;
}

function receiptThreadLine(cardData, result) {
  const flags = [cardData.flag, ...(cardData.flags || [])].filter(Boolean);
  const phase = storyPhase();
  if (phase === "early") {
    if (!result.success) return "脉络：这次失手会留成一条经验。下一次再遇到相同选择，你会更早知道它危险在哪里。";
    if (cardData.kind === "route") return "脉络：你先确认了路线规则。时间、属性和背包会共同决定你能走多远。";
    if (cardData.kind === "shelter") return "脉络：这里暂时安全了一点。安全点不是终点，只是让下一段路更可控。";
    if (cardData.kind === "signal") return "脉络：广播给了方向，但没有给答案。先记住目标：三小时内抵达内城密道。";
    return "脉络：眼前的事先落定了。旧城还没有说清它为什么认识你。";
  }
  if (!result.success) {
    if (flags.includes("partner_break")) return phase === "late" ? "脉络：这次失手没有打断沈砚的布局，反而让他的【剖真】多了一份可验证的恐惧。" : "脉络：沈砚留下的东西越来越像一次布置，不像一次求救。";
    if (flags.includes("king_memory")) return phase === "late" ? "脉络：旧王记忆没有被你拿稳，但旧城已经确认你会对这些线索起反应。" : "脉络：这些线索在认你，但你还不知道它们认的是哪一个身份。";
    if (cardData.kind === "ruthless") return "脉络：强行推进失败时，【归位】学到的不是路，而是把阻碍当成可以移开的东西。";
    return "脉络：逃出雾港仍是眼前目标，但这次失手让旧城更确信你属于这里。";
  }
  if (flags.includes("perfect_choice")) return "脉络：王权被托付出去后，逃出雾港不再等于抛弃旧城。";
  if (flags.includes("general_oath")) return "脉络：大将军线打开，主角第一次看见“既不坐王座，也不毁掉旧城”的第三条路。";
  if (flags.includes("human_choice")) return "脉络：你保住的是人的选择。它会在终局让你有底气拒绝王位，也有可能拉住沈砚。";
  if (flags.includes("weird_choice")) return "脉络：这一步更快，却让【归位】接近怪异结局：它开始分不清修正和抹除。";
  if (flags.includes("partner_break")) return "脉络：沈砚的求真正在露出献祭本质。你越接近答案，他越不像搭档。";
  if (flags.includes("king_memory")) return phase === "late" ? "脉络：旧王身份被推进了一格。孤儿感不是缺失亲人，而是你本来就没有被放在现世的位置。" : "脉络：旧城把你的名字、童谣和王印连在一起，但最后一段证据还没有出现。";
  if (cardData.kind === "signal") return "脉络：白塔局和沈砚的短波都在说真话，只是他们各自剪掉了最危险的半句。";
  if (cardData.kind === "aid") return "脉络：救人不是偏离逃生，而是在证明【归位】还能被人性约束。";
  if (cardData.kind === "memory") return "脉络：记忆线把逃生路和王座路绑在一起，你离出口越近，也越接近旧王责任。";
  if (cardData.kind === "ruthless") return "脉络：强硬选择能缩短路程，但也会喂大你心里那个想把障碍归位掉的念头。";
  if (state.node === "shelter") return "脉络：内城密道既是出口也是审判席，你选择的是自己最终要成为什么。";
  return "脉络：这一步没有改变终点，仍然是逃出雾港；它改变的是你用什么身份抵达终点。";
}

function judgmentText(result) {
  const name = result.checkKey ? `${statName(result.checkKey)}判定` : "行动判定";
  const operator = result.success ? "≥" : "<";
  return `${name}：${result.diceCount} 骰合计 ${result.total} ${operator} 需求 ${result.target}，${result.success ? "成功" : "失败"}`;
}

function judgmentHtml(result) {
  const name = result.checkKey ? `${statName(result.checkKey)}判定` : "行动判定";
  const tone = result.success ? "success" : "fail";
  const operator = result.success ? "≥" : "<";
  const resultLabel = result.success ? "成功" : "失败";
  const rollTitle = result.rolls?.length ? ` title="骰面：${result.rolls.join("、")}"` : "";
  return `${name}：<span class="judgment-label">投</span> <span class="judgment-stat">${result.diceCount} 骰</span> <span class="judgment-label">合计</span> <span class="judgment-roll ${tone}"${rollTitle}>${result.total}</span> <span class="judgment-operator ${tone}">${operator}</span> <span class="judgment-label">需求</span> <span class="judgment-target">${result.target}</span> <span class="judgment-result ${tone}">${resultLabel}</span>`;
}

function itemDetailsFor(cardData) {
  const ids = Object.keys(cardData.gain || {});
  if (!ids.length) return "";
  return ids.map((id) => ITEMS[id]?.text).filter(Boolean).join(" ");
}

function flagLabel(flag) {
  const labels = {
    home_cache: "筒子楼归位标记",
    doctor_saved: "旧医官被救下",
    hard_choice: "你更快，也更冷",
    basement_hint: "内城线路浮现",
    tunnel_open: "内城暗渠打开",
    helped_runner: "旧卒证词",
    read_echo_marks: "王闸刻名读懂",
    water_lowered: "王城水路打开",
    left_cache: "将军石像记住你",
    king_memory: "旧王记忆",
    partner_break: "沈砚信任破裂",
    human_choice: "保住人的选择",
    weird_choice: "怪异正在抬头",
    general_oath: "大将军可被托付",
    perfect_choice: "王权已有新主"
  };
  return labels[flag] || flag;
}

function endRun(reason) {
  const ending = makeEnding(reason);
  const echo = makeEcho(ending);
  ending.review = makeReview(ending, echo);
  const archive = [...loadArchive(), echo].slice(-MAX_ECHOES);
  saveArchive(archive);
  state.archive = archive;
  state.ending = ending;
  state.ended = true;
  state.story = `${ending.body}\n\n留下痕迹：${RELICS[echo.relic]?.name || "无名痕迹"}。\n${echo.note}`;
  addLog("结局", ending.title);
  renderSettlement();
  refs.settlementModal.hidden = false;
}

function makeReview(ending, echo) {
  const successful = state.choices.filter((choice) => choice.success).length;
  const failed = state.choices.length - successful;
  const route = currentRouteNames();
  const strongest = strongestStat();
  const weakest = weakestStat();
  const archiveBefore = state.archive || [];
  const archiveAfter = [...archiveBefore, echo].slice(-MAX_ECHOES);
  const previousAchievements = achievementIdsFromArchive(archiveBefore);
  const newAchievementIds = (echo.achievements || []).filter((id) => !previousAchievements.has(id));
  const newEnding = !archiveBefore.some((item) => endingIdFromEcho(item) === ending.id);
  const collection = collectionSummary(archiveAfter);
  const unlockLabels = [
    newEnding ? `新结局：${endingMeta(ending.id)?.title || ending.title}` : "",
    ...newAchievementIds.map((id) => `成就：${achievementById(id)?.title || id}`)
  ].filter(Boolean);

  return {
    grade: gradeFor(ending.score, ending.id),
    summary: `你走过 ${route.length} 个地点，处理 ${state.choices.length} 次事件，成功 ${successful} 次，失手 ${failed} 次。`,
    route: route.length ? route.join(" → ") : currentNode().name,
    resources: `力量 ${state.stats.body} / 敏捷 ${state.stats.cover} / 智力 ${state.stats.food} / 意志 ${state.stats.mind}`,
    pressure: `线索 ${state.clues} / 觉醒值 ${state.heat} / 倾向 ${awakeningAxisText(awakeningAxisValue())} / 背包 ${bagLoad()} / ${MAX_BAG}`,
    highlight: reviewHighlight(ending, strongest, weakest),
    advice: nextAdvice(ending, weakest),
    collection: `结局 ${collection.endings}/${ENDING_CATALOG.length} · 成就 ${collection.achievements}/${ACHIEVEMENTS.length}`,
    unlocks: unlockLabels.length ? unlockLabels.join(" / ") : "没有新的收藏，但这条路线已经更清楚了。",
    unlockItems: unlockLabels,
    cause: ending.cause || "路线自然收束。",
    trace: `${RELICS[echo.relic]?.name || "无名痕迹"}：${echo.note}`
  };
}

function strongestStat() {
  return [...STATS].sort((a, b) => state.stats[b.key] - state.stats[a.key])[0];
}

function weakestStat() {
  return [...STATS].sort((a, b) => state.stats[a.key] - state.stats[b.key])[0];
}

function gradeFor(score, endingId) {
  if (endingId === "perfect") return "评价 S / 旧城托付";
  if (endingId === "human") return "评价 A / 以人离城";
  if (endingId === "king") return "评价 A / 旧王归位";
  if (endingId === "weird") return "评价 B / 怪异出城";
  if (score >= 230) return "评价 C / 接近密道";
  if (score >= 150) return "评价 D / 记忆成形";
  return "评价 E / 留在旧城";
}

function reviewHighlight(ending, strongest, weakest) {
  if (ending.id === "perfect") return "你没有逃避王权，也没有让现世再献出一个人。";
  if (ending.id === "human") return "你拒绝了旧王身份，把归位留给现世，而不是王座。";
  if (ending.id === "king") return "你终于回到王座，旧城因此停下，但你也被旧城留下。";
  if (ending.id === "weird") return "你逃出了雾港，却让怪异学会了用你的方式活下去。";
  if (state.minutes <= 0) return "你看见了密道方向，但弃城封锁先一步合拢。";
  if (ending.id === "depleted") return `${weakest.name}归零让路线提前崩盘，下一次要给它留缓冲。`;
  if (state.stats.body <= 0) return "这条路最先耗尽的是身体，不是线索。";
  return `${strongest.name}撑住了路线，但${weakest.name}成为最明显的缺口。`;
}

function nextAdvice(ending, weakest) {
  if (ending.id === "perfect") return "下一次可以审一遍暗线：大将军、局长和沈砚是否都提前埋到了。";
  if (ending.id === "human") return "下一次可以尝试找大将军，把旧城危机交给真正愿意守城的人。";
  if (ending.id === "king") return "下一次可以更早保住人的选择，看看能否拒绝王位。";
  if (ending.id === "weird") return "下一次少走觉醒类选择，别让【归位】学会把人当障碍。";
  if (state.clues < 4) return "下一次优先找线索：短波、刻痕、旧城令帖都会让密道更稳。";
  if (state.heat > 8) return "下一次别太早推高觉醒。觉醒过深会让抑制类选择变窄。";
  if (weakest.key === "food") return "下一次给智力留缓冲。技术、信号和门禁会吃这项。";
  if (weakest.key === "cover") return "下一次保住敏捷。移动、潜行和躲闪都靠它撑。";
  if (weakest.key === "mind") return "下一次留一点时间休整。意志低会让你更容易暴露。";
  return "下一次可以更早离开旧区域，别把时间花在已经变空的地方。";
}

function makeEnding(reason) {
  const score =
    state.stats.body +
    state.stats.food +
    state.stats.mind +
    state.stats.cover +
    state.clues * 12 -
    state.heat * 4 +
    state.morality * 5 +
    Object.keys(state.bag).length * 5;

  if (reason === "shelter") {
    if (hasFlag("perfect_choice")) {
      return {
        id: "perfect",
        title: "王权托付",
        cause: "把王权交给愿意守城的人。",
        score: Math.max(0, Math.round(score + 120)),
        body:
          "大将军接过王印时，死城的火声第一次退远。\n\n旧城没有再向现世回身，雾港像从没发生过怪异事件一样恢复了秩序。只有你口袋里那枚空白令帖还在发热，像第二季才会打开的门。"
      };
    }
    if (hasFlag("weird_choice")) {
      return {
        id: "weird",
        title: "怪异出城",
        cause: "用怪异替你打开密道。",
        score: Math.max(0, Math.round(score + 55)),
        body:
          "密道为你打开，沈砚的短波永远静了。\n\n你逃出了雾港。可归位怪异已经学会把人从世界上移开，白塔局在城外看见你时，没有一个人敢先叫你的名字。"
      };
    }
    if (hasFlag("human_choice")) {
      return {
        id: "human",
        title: "以人离城",
        cause: "拒绝旧王身份，以人的方式离开。",
        score: Math.max(0, Math.round(score + 90)),
        body:
          "你没有坐上王座。你对沈砚说，旧城已经是过去式，你醒来的能力要守护现世，而不是替过去收尸。\n\n密道尽头，雾港的风第一次像现实世界的风。"
      };
    }
    return {
      id: "king",
      title: "旧王归位",
      cause: "坐上王座，让旧城停下。",
      score: Math.max(0, Math.round(score + 80)),
      body:
        "你把手按上王座残纹，归位怪异终于完整服从你。\n\n旧城停止吞噬雾港，现世恢复平静。但王座下的密道从你身后合拢，你知道自己再也不是现世的人。"
    };
  }
  if (reason === "collapse") {
    return {
      id: "collapse",
      title: "雾里倒下",
      cause: "没能抵达密道。",
      deathReason: "你没能走到内城密道前。",
      score: Math.max(0, Math.round(score * 0.45)),
      body:
        "你没能走到密道前。\n\n最后听见的是自己的包落地，里面的壁画残照滚出来，像替旧城认回了它的王。"
    };
  }
  if (reason === "depleted") {
    const broken = depletedStat();
    return {
      id: "depleted",
      title: `${broken?.name || "某项能力"}耗尽`,
      cause: `${broken?.name || "某项能力"}归零。`,
      deathReason: `${broken?.name || "某项能力"}会归零，你已经付不出下一次选择的代价。`,
      score: Math.max(0, Math.round(score * 0.5)),
      body:
        `密道还在前方，但${broken?.name || "某项能力"}先断了。\n\n雾没有追上来，旧城也没有关门；只是你已经付不出下一次选择的代价。`
    };
  }
  if (reason === "timeout") {
    return {
      id: "timeout",
      title: "弃城封锁完成",
      cause: "倒计时归零。",
      deathReason: "倒计时归零，弃城封锁先一步合拢。",
      score: Math.max(0, Math.round(score * 0.65)),
      body:
        "你看见了密道方向的灯，也看见城外隔离线一段段合拢。\n\n迟到不是死亡，但在雾港，迟到会让世界忘记你曾经存在。"
    };
  }
  return {
    id: "lost",
    title: "未完成归位",
    cause: "这一次没有走完。",
    score: Math.max(0, Math.round(score)),
    body: "这一次没有走完，但它在旧城墙上留下了一道浅痕。"
  };
}

function makeEcho(ending) {
  const dominant = dominantKind();
  const route = currentRouteNames();
  const achievements = earnedAchievements(ending);
  return {
    id: state.id,
    cycle: state.cycle,
    name: echoName(dominant, ending),
    endingId: ending.id,
    ending: ending.title,
    endingTitle: ending.title,
    score: ending.score,
    cause: ending.cause || "",
    deathReason: ending.deathReason || "",
    route,
    achievements,
    relic: relicFor(dominant, ending),
    note: noteFor(dominant, ending),
    createdAt: Date.now()
  };
}

function currentRouteNames() {
  return [...state.visited, state.node]
    .map((id) => nodeById(id)?.name)
    .filter(Boolean);
}

function earnedAchievements(ending) {
  return ACHIEVEMENTS
    .filter((achievement) => achievement.test({ ending, state }))
    .map((achievement) => achievement.id);
}

function achievementById(id) {
  return ACHIEVEMENTS.find((achievement) => achievement.id === id);
}

function endingMeta(id) {
  return ENDING_CATALOG.find((ending) => ending.id === id);
}

function endingIdFromEcho(item) {
  if (item?.endingId) return item.endingId;
  const title = item?.ending || item?.endingTitle || "";
  if (/耗尽$/.test(title)) return "depleted";
  return ENDING_CATALOG.find((ending) => ending.title === title)?.id || "";
}

function endingEntries(archive, id) {
  return archive.filter((item) => endingIdFromEcho(item) === id);
}

function achievementIdsFromArchive(archive) {
  const ids = new Set();
  archive.forEach((item) => {
    ids.add("first_trace");
    (item.achievements || []).forEach((id) => ids.add(id));
    const endingId = endingIdFromEcho(item);
    if (["perfect", "human", "king", "weird"].includes(endingId)) ids.add("first_escape");
    if (endingId === "human") ids.add("still_human");
    if (endingId === "perfect") ids.add("trusted_general");
    if (endingId === "timeout") ids.add("too_late");
  });
  return ids;
}

function collectionSummary(archive) {
  const endingIds = new Set(archive.map(endingIdFromEcho).filter(Boolean));
  return {
    endings: endingIds.size,
    achievements: achievementIdsFromArchive(archive).size
  };
}

function storyEndingIdsFromArchive(archive) {
  return new Set(archive.map(endingIdFromEcho).filter((id) => STORY_ENDING_IDS.includes(id)));
}

function seenActionIds(memory = state?.actionMemory || {}) {
  return new Set(Object.entries(memory)
    .filter(([, record]) => record?.success || record?.fail)
    .map(([id]) => id));
}

function actionSeen(id, memory = state?.actionMemory || {}) {
  return Boolean(memory?.[id]?.success || memory?.[id]?.fail);
}

function actionSucceeded(id, memory = state?.actionMemory || {}) {
  return Boolean(memory?.[id]?.success);
}

function flagSeen(flag, memory = state?.actionMemory || {}) {
  if (state?.flags?.has(flag)) return true;
  return Object.values(CARD_LIBRARY).flat().some((cardData) => {
    const flags = [cardData.flag, ...(cardData.flags || [])].filter(Boolean);
    return flags.includes(flag) && actionSucceeded(cardData.id, memory);
  });
}

function endingSeen(id, archive = state?.archive || []) {
  return storyEndingIdsFromArchive(archive).has(id);
}

function clueSegmentUnlocked(segment, archive = state?.archive || [], memory = state?.actionMemory || {}) {
  const unlock = segment.unlock || {};
  const cardIds = unlock.cards || [];
  const endingIds = unlock.endings || [];
  const flags = unlock.flags || [];
  const cardsOk = !cardIds.length || cardIds.some((id) => actionSeen(id, memory));
  const endingsOk = !endingIds.length || endingIds.some((id) => endingSeen(id, archive));
  const flagsOk = !flags.length || flags.every((flag) => flagSeen(flag, memory));
  return cardsOk && endingsOk && flagsOk;
}

function clueProgress(archive = state?.archive || [], memory = state?.actionMemory || {}) {
  const segments = CLUE_THREADS.flatMap((thread) => thread.segments);
  const unlockedSegments = segments.filter((segment) => clueSegmentUnlocked(segment, archive, memory)).length;
  const endingIds = storyEndingIdsFromArchive(archive);
  return {
    unlockedSegments,
    totalSegments: segments.length,
    endingCount: endingIds.size,
    endingTotal: STORY_ENDING_IDS.length,
    complete: unlockedSegments === segments.length && STORY_ENDING_IDS.every((id) => endingIds.has(id))
  };
}

const ENDING_CARD_BY_STORY_ID = {
  king: "claim_throne",
  human: "leave_as_human",
  weird: "cut_truth",
  perfect: "entrust_general"
};

function clueFields() {
  return [
    { id: "overview", title: "主线总览", head: "只看旧城路线和主要事件节点。" },
    ...CLUE_THREADS.map((thread) => ({ id: thread.id, title: thread.title, head: thread.head, thread }))
  ];
}

function clueFieldById(id = clueFieldMode) {
  return clueFields().find((field) => field.id === id) || clueFields()[0];
}

function cardsForClueSegment(segment) {
  const ids = new Set([...(segment.cards || []), ...(segment.unlock?.cards || [])]);
  (segment.endings || segment.unlock?.endings || []).forEach((endingId) => {
    const cardId = ENDING_CARD_BY_STORY_ID[endingId];
    if (cardId) ids.add(cardId);
  });
  return [...ids].filter((id) => cardById(id));
}

function clueThreadCardIds(thread) {
  return new Set(thread.segments.flatMap(cardsForClueSegment));
}

function clueFieldCardIds(fieldId = clueFieldMode) {
  const field = clueFieldById(fieldId);
  if (!field.thread) return null;
  return clueThreadCardIds(field.thread);
}

function clueSegmentPrimaryCard(segment) {
  return cardsForClueSegment(segment)[0] || "";
}

function clueSegmentFocusCard(segment) {
  const endingId = [...(segment.endings || []), ...(segment.unlock?.endings || [])].find((id) => ENDING_CARD_BY_STORY_ID[id]);
  if (endingId) return ENDING_CARD_BY_STORY_ID[endingId];
  return clueSegmentPrimaryCard(segment);
}

function clueSegmentStage(segment) {
  if ([...(segment.endings || []), ...(segment.unlock?.endings || [])].length) return 4;
  const tiers = cardsForClueSegment(segment)
    .map((id) => nodeForCard(id)?.tier)
    .filter((tier) => Number.isFinite(tier));
  return tiers.length ? clamp(Math.max(...tiers), 0, 4) : 0;
}

function clueSegmentsForCard(cardId) {
  return CLUE_THREADS.flatMap((thread) => thread.segments
    .filter((segment) => cardsForClueSegment(segment).includes(cardId))
    .map((segment) => ({ thread, segment })));
}

function clueSegmentKey(thread, segment) {
  const index = Math.max(0, thread.segments.indexOf(segment));
  return `${thread.id}:${index}:${segment.title}`;
}

function clueSegmentIsNew(thread, segment, archive = state?.archive || [], memory = state?.actionMemory || {}) {
  return clueSegmentUnlocked(segment, archive, memory) && !clueReadSegments.has(clueSegmentKey(thread, segment));
}

function clueThreadHasNew(thread, archive = state?.archive || [], memory = state?.actionMemory || {}) {
  return thread.segments.some((segment) => clueSegmentIsNew(thread, segment, archive, memory));
}

function clueFieldHasNew(field, archive = state?.archive || [], memory = state?.actionMemory || {}) {
  if (!field.thread) return CLUE_THREADS.some((thread) => clueThreadHasNew(thread, archive, memory));
  return clueThreadHasNew(field.thread, archive, memory);
}

function markClueSegmentRead(thread, segment) {
  if (!thread || !segment) return false;
  const key = clueSegmentKey(thread, segment);
  if (clueReadSegments.has(key)) return false;
  clueReadSegments.add(key);
  return true;
}

function markClueCardRead(cardId) {
  let changed = false;
  clueSegmentsForCard(cardId).forEach(({ thread, segment }) => {
    changed = markClueSegmentRead(thread, segment) || changed;
  });
  if (changed) saveClueReadSegments();
}

function renderNewBadge(label = "新") {
  return `<span class="clue-new-badge" aria-label="新解锁">${escapeHtml(label)}</span>`;
}

function clueFieldProgress(field, archive = state?.archive || [], memory = state?.actionMemory || {}) {
  if (!field.thread) return clueProgress(archive, memory);
  const unlocked = field.thread.segments.filter((segment) => clueSegmentUnlocked(segment, archive, memory)).length;
  return { unlocked, total: field.thread.segments.length };
}

function clueThreadUnlocked(thread, archive = state?.archive || [], memory = state?.actionMemory || {}) {
  return thread.segments.some((segment) => clueSegmentUnlocked(segment, archive, memory));
}

function clueFieldUnlocked(field, archive = state?.archive || [], memory = state?.actionMemory || {}) {
  return !field.thread || clueThreadUnlocked(field.thread, archive, memory);
}

function graphCardId(cardData) {
  return `graph-card-${cardData.id}`;
}

function graphRegionId(nodeId) {
  return `graph-region-${nodeId}`;
}

function allGraphCards() {
  return MAP.flatMap((node) => (CARD_LIBRARY[node.id] || []).map((cardData, index) => ({ ...cardData, nodeId: node.id, nodeName: node.name, nodeTier: node.tier, graphIndex: index })));
}

function graphCardOutcome(cardData, memory = state?.actionMemory || {}) {
  const record = memory?.[cardData.id] || {};
  const success = Boolean(record.success);
  const fail = Boolean(record.fail);
  if (success && fail) return { className: "both", label: "双记录" };
  if (success) return { className: "success", label: "成功过" };
  if (fail) return { className: "fail", label: "失手过" };
  return { className: "unknown", label: "未见" };
}

function graphCardLocked(cardData) {
  const missingItem = Object.entries(requiredItemsFor(cardData)).some(([id, count]) => !hasItem(id, count));
  const missingFlag = requiredFlagsFor(cardData).some((flag) => !hasFlag(flag));
  return missingItem || missingFlag;
}

function graphCardSeen(cardData, memory = state?.actionMemory || {}) {
  const record = memory?.[cardData.id] || {};
  return Boolean(record.success || record.fail);
}

function graphCardTags(cardData, memory = state?.actionMemory || {}) {
  const seen = graphCardSeen(cardData, memory);
  const tags = [];
  Object.entries(cardData.need || {}).forEach(([id, count]) => tags.push(`需 ${ITEMS[id]?.name || id}${count > 1 ? `×${count}` : ""}`));
  Object.entries(cardData.spend || {}).forEach(([id, count]) => tags.push(`耗 ${ITEMS[id]?.name || id}${count > 1 ? `×${count}` : ""}`));
  requiredFlagsFor(cardData).forEach((flag) => tags.push(seen || hasFlag(flag) ? `需 ${flagLabel(flag)}` : "需 关键条件"));
  if (seen) {
    Object.entries(cardData.gain || {}).forEach(([id, count]) => tags.push(`得 ${ITEMS[id]?.name || id}${count > 1 ? `×${count}` : ""}`));
    [cardData.flag, ...(cardData.flags || [])].filter(Boolean).forEach((flag) => tags.push(`点亮 ${flagLabel(flag)}`));
  }
  if (cardData.clues) tags.push(`线索+${cardData.clues}`);
  return tags.slice(0, 4);
}

function graphOutcomeText(cardData, type, memory = state?.actionMemory || {}) {
  const record = memory?.[cardData.id]?.[type];
  if (!record) return type === "success" ? "成功结果待记录" : "失手结果待记录";
  const source = type === "success" ? cardData.success : cardData.fail;
  return compactEventText(source || record.line || "", 24);
}

function graphFinalLabel(cardData, archive = state?.archive || [], memory = state?.actionMemory || {}) {
  const revealed = endingSeen(cardData.id, archive) || Boolean(memory?.[cardData.id]?.success);
  if (!revealed) return STORY_ENDING_IDS.includes(cardData.id) ? "终局判断" : "";
  const labels = {
    claim_throne: "旧王归位",
    leave_as_human: "以人离城",
    cut_truth: "怪异出城",
    entrust_general: "王权托付"
  };
  return labels[cardData.id] || "";
}

function graphThreadLabel(cardId) {
  return clueSegmentsForCard(cardId)[0]?.thread?.title || "";
}

function graphRelatedCardIds(cardId) {
  if (!cardId) return new Set();
  const ids = new Set([cardId]);
  clueSegmentsForCard(cardId).forEach(({ thread }) => {
    clueThreadCardIds(thread).forEach((id) => ids.add(id));
  });
  return ids;
}

function graphRequirementSources(cardData, memory = state?.actionMemory || {}) {
  const { itemSources, flagSources } = dependencySources();
  const rows = [];
  Object.keys(requiredItemsFor(cardData)).forEach((id) => {
    const sources = itemSources.get(id) || [];
    const knownSources = sources.filter((source) => source.id !== cardData.id && actionSeen(source.id, memory));
    const implicit = !knownSources.length && (STARTING_ITEMS[id] || hasItem(id))
      ? { label: STARTING_ITEMS[id] ? "开局携带" : "当前已持有", id: "" }
      : null;
    rows.push({
      label: ITEMS[id]?.name || id,
      kind: "关键物件",
      sources: implicit ? [implicit] : knownSources
    });
  });
  requiredFlagsFor(cardData).forEach((flag) => {
    const sources = flagSources.get(flag) || [];
    const knownSources = sources.filter((source) => source.id !== cardData.id && actionSeen(source.id, memory));
    rows.push({
      label: flagLabel(flag),
      kind: "剧情条件",
      sources: knownSources
    });
  });
  return rows.filter((row) => row.sources.length);
}

function graphCardsForNode(nodeId, visibleCardIds = null) {
  const cards = CARD_LIBRARY[nodeId] || [];
  if (!visibleCardIds) return cards;
  return cards.filter((cardData) => visibleCardIds.has(cardData.id));
}

function buildEventGraphLayout(options = {}) {
  const visibleCardIds = options.visibleCardIds || null;
  const regionWidth = 252;
  const regionLeft = 34;
  const regionTop = 54;
  const columnGap = 310;
  const laneHeight = 292;
  const eventHeight = 52;
  const eventGap = 8;
  const headerHeight = 62;
  const footerHeight = 14;
  const laneByCount = {
    1: [1],
    2: [0, 2],
    3: [0, 1, 2]
  };
  const tierMap = new Map();
  MAP.forEach((node) => {
    if (!tierMap.has(node.tier)) tierMap.set(node.tier, []);
    tierMap.get(node.tier).push(node);
  });
  const regionHeights = new Map();
  const cardsByNode = new Map();
  MAP.forEach((node) => {
    const cards = graphCardsForNode(node.id, visibleCardIds);
    cardsByNode.set(node.id, cards);
    regionHeights.set(node.id, headerHeight + footerHeight + cards.length * eventHeight + Math.max(0, cards.length - 1) * eventGap);
  });
  const laneCount = 3;
  const height = regionTop * 2 + laneCount * laneHeight;
  const regionPositions = new Map();
  const cardPositions = new Map();
  [...tierMap.entries()].forEach(([tier, nodes]) => {
    const lanes = laneByCount[Math.min(3, Math.max(1, nodes.length))] || [0, 1, 2];
    nodes.forEach((node, nodeIndex) => {
      const left = regionLeft + tier * columnGap;
      const nodeHeight = regionHeights.get(node.id);
      const lane = lanes[nodeIndex] ?? nodeIndex % laneCount;
      const top = regionTop + lane * laneHeight + Math.max(0, Math.round((laneHeight - nodeHeight) / 2));
      regionPositions.set(node.id, { left, top, width: regionWidth, height: nodeHeight, cx: left + regionWidth / 2, cy: top + nodeHeight / 2 });
      (cardsByNode.get(node.id) || []).forEach((cardData, index) => {
        const cardTop = top + headerHeight + index * (eventHeight + eventGap);
        cardPositions.set(cardData.id, {
          left: left + 12,
          top: cardTop,
          width: regionWidth - 24,
          height: eventHeight,
          cx: left + regionWidth / 2,
          cy: cardTop + eventHeight / 2,
          right: left + regionWidth - 12,
          leftEdge: left + 12
        });
      });
    });
  });
  const maxTier = Math.max(...MAP.map((node) => node.tier));
  return {
    width: regionLeft * 2 + maxTier * columnGap + regionWidth,
    height,
    regionPositions,
    cardPositions,
    cardsByNode
  };
}

function dependencySources() {
  const itemSources = new Map();
  const flagSources = new Map();
  allGraphCards().forEach((cardData) => {
    Object.keys(cardData.gain || {}).forEach((id) => {
      if (!itemSources.has(id)) itemSources.set(id, []);
      itemSources.get(id).push(cardData);
    });
    [cardData.flag, ...(cardData.flags || [])].filter(Boolean).forEach((flag) => {
      if (!flagSources.has(flag)) flagSources.set(flag, []);
      flagSources.get(flag).push(cardData);
    });
  });
  return { itemSources, flagSources };
}

function buildThreadEdges(layout, fieldId = "overview") {
  const focusCardId = selectedClueCardId;
  const threads = focusCardId
    ? CLUE_THREADS.filter((thread) => clueThreadCardIds(thread).has(focusCardId))
    : fieldId === "overview" ? [] : CLUE_THREADS.filter((thread) => thread.id === fieldId);
  return threads.flatMap((thread) => {
    const cardIds = thread.segments.map(clueSegmentPrimaryCard).filter(Boolean);
    return cardIds.slice(0, -1).map((cardId, index) => {
      const source = layout.cardPositions.get(cardId);
      const target = layout.cardPositions.get(cardIds[index + 1]);
      if (!source || !target) return null;
      return {
        type: "thread",
        label: thread.title,
        from: { x: source.right, y: source.cy },
        to: { x: target.leftEdge, y: target.cy }
      };
    }).filter(Boolean);
  });
}

function buildGraphEdges(layout, options = {}) {
  const fieldId = options.fieldId || "overview";
  return buildThreadEdges(layout, fieldId);
}

function graphEdgePath(edge) {
  const { from, to } = edge;
  if (Math.abs(from.x - to.x) < 40) {
    const bend = Math.max(from.x, to.x) + 28;
    return `M ${from.x} ${from.y} C ${bend} ${from.y}, ${bend} ${to.y}, ${to.x} ${to.y}`;
  }
  const dx = Math.max(44, Math.abs(to.x - from.x) * 0.42);
  return `M ${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`;
}

function renderGraphEdges(edges) {
  return edges.map((edge) => {
    const mx = Math.round((edge.from.x + edge.to.x) / 2);
    const my = Math.round((edge.from.y + edge.to.y) / 2);
    return `
      <g class="event-graph-edge ${edge.type}">
        <path d="${graphEdgePath(edge)}" marker-end="url(#eventGraphArrow)"></path>
        ${["route", "thread"].includes(edge.type) ? "" : `<text x="${mx}" y="${my - 4}">${escapeHtml(edge.label)}</text>`}
      </g>
    `;
  }).join("");
}

function renderEventGraphNode(cardData, archive, memory, style, options = {}) {
  const finalLabel = graphFinalLabel(cardData, archive, memory);
  const selected = options.selectedCardId === cardData.id;
  const related = options.relatedCardIds?.has(cardData.id);
  const threadLabel = graphThreadLabel(cardData.id) || finalLabel || "";
  return `
    <button id="${graphCardId(cardData)}" class="event-graph-card ${selected ? "selected" : ""} ${related ? "related" : ""}" type="button" style="${style}" data-card-id="${cardData.id}">
      <div class="event-graph-card-head">
        <strong>${escapeHtml(cardData.label)}</strong>
      </div>
      ${threadLabel ? `<span class="event-graph-thread">${escapeHtml(threadLabel)}</span>` : ""}
    </button>
  `;
}

const GRAPH_STAGE_LABELS = ["开局", "外城分岔", "旧城中段", "死城门槛", "内城终局"];

function renderLaneSegment(thread, segment, archive, memory, options = {}) {
  const cardId = clueSegmentFocusCard(segment);
  const open = clueSegmentUnlocked(segment, archive, memory);
  if (!open) {
    return `
      <div class="story-lane-card locked mystery">
        <strong>???</strong>
        <span>未知脉络</span>
        <p>继续探索关键线索。</p>
      </div>
    `;
  }
  const selected = options.selectedCardId === cardId;
  const related = options.relatedCardIds?.has(cardId);
  const isNew = clueSegmentIsNew(thread, segment, archive, memory);
  const title = open ? segment.title : "未明线索";
  const text = open ? compactEventText(segment.text, 34) : clueLockedText(segment);
  const card = cardId ? cardById(cardId) : null;
  const node = cardId ? nodeForCard(cardId) : null;
  const body = `
    <div class="story-lane-card-head">
      <strong>${escapeHtml(title)}</strong>
      ${isNew ? renderNewBadge() : ""}
    </div>
    <span>${node ? escapeHtml(node.name) : "旧城脉络"}${card ? ` · ${escapeHtml(card.label)}` : ""}</span>
    <p>${escapeHtml(text)}</p>
  `;
  if (!cardId) return `<div class="story-lane-card locked">${body}</div>`;
  return `
    <button id="${graphCardId({ id: cardId })}" class="story-lane-card ${open ? "unlocked" : "locked"} ${selected ? "selected" : ""} ${related ? "related" : ""} ${isNew ? "is-new" : ""}" type="button" data-card-id="${cardId}">
      ${body}
    </button>
  `;
}

function renderStoryLane(thread, archive, memory, options = {}) {
  const threadOpen = clueThreadUnlocked(thread, archive, memory);
  const hasNew = threadOpen && clueThreadHasNew(thread, archive, memory);
  const cells = threadOpen
    ? GRAPH_STAGE_LABELS.map((_, stage) => {
      const segments = thread.segments.filter((segment) => clueSegmentStage(segment) === stage);
      return `
        <div class="story-lane-cell">
          ${segments.length ? segments.map((segment) => renderLaneSegment(thread, segment, archive, memory, options)).join("") : '<div class="story-lane-empty"></div>'}
        </div>
      `;
    }).join("")
    : `
      <div class="story-lane-cell story-lane-mask" style="grid-column: span 5;">
        <div class="story-lane-card locked mystery">
          <strong>???</strong>
          <span>未知分野</span>
          <p>获得关键线索后显形。</p>
        </div>
      </div>
    `;
  return `
    <section class="story-lane-row ${threadOpen ? "unlocked" : "locked"} ${hasNew ? "has-new" : ""}">
      <div class="story-lane-title">
        <div class="story-lane-title-head">
          <strong>${threadOpen ? escapeHtml(thread.title) : "???"}</strong>
          ${hasNew ? renderNewBadge() : ""}
        </div>
        <span>${threadOpen ? escapeHtml(thread.head) : "重要脉络尚未显形"}</span>
      </div>
      ${cells}
    </section>
  `;
}

function renderEventGraph(archive = state.archive, memory = state.actionMemory, options = {}) {
  const fieldId = options.fieldId || "overview";
  const field = clueFieldById(fieldId);
  const threads = field.thread ? [field.thread] : CLUE_THREADS;
  const relatedCardIds = graphRelatedCardIds(options.selectedCardId || "");
  const stageHeader = `
    <div class="story-lane-header">
      <span>脉络</span>
      ${GRAPH_STAGE_LABELS.map((label, index) => `<span>${index + 1}. ${label}</span>`).join("")}
    </div>
  `;
  const lanes = threads.map((thread) => renderStoryLane(thread, archive, memory, { ...options, relatedCardIds })).join("");
  const progress = clueProgress(archive, memory);
  return `
    <section class="archive-modal-section event-graph-section story-lane-section">
      <div class="panel-heading">
        <h3>剧情泳道图</h3>
        <span class="item-meta">${progress.unlockedSegments}/${progress.totalSegments} 暗线 · ${progress.endingCount}/${progress.endingTotal} 结局</span>
      </div>
      <div class="event-graph-legend">
        <span class="thread">同线脉络</span>
        <span class="route">点击节点查看前因</span>
      </div>
      <div class="event-graph-scroll story-lane-scroll" role="region" aria-label="旧城剧情泳道图">
        <div class="story-lane-board">
          ${stageHeader}
          ${lanes}
        </div>
      </div>
    </section>
  `;
}

function renderClueSystem(archive = state.archive, memory = state.actionMemory) {
  const progress = clueProgress(archive, memory);
  const graph = renderEventGraph(archive, memory);
  const threads = CLUE_THREADS.map((thread) => renderClueThread(thread, archive, memory)).join("");
  return `
    <section class="archive-modal-section clue-system-section">
      <div class="panel-heading">
        <h3>线索脉络</h3>
        <span class="item-meta">${progress.unlockedSegments}/${progress.totalSegments}</span>
      </div>
      <div class="clue-overview">
        <strong>${progress.complete ? "旧城脉络已经闭合。" : "你只能先看见线头。"}</strong>
        <span>事件和结局会把下面的暗线一段段点亮。未解锁分支不会展示真相，已解锁内容可以反复回看。</span>
      </div>
      ${graph}
      <div class="clue-detail-heading">
        <h3>暗线回放</h3>
        <span>已解锁的事件文本和结局故事仍保留在这里。</span>
      </div>
      <div class="clue-thread-list">${threads}</div>
    </section>
  `;
}

function nodeForCard(cardId) {
  return MAP.find((node) => (CARD_LIBRARY[node.id] || []).some((cardData) => cardData.id === cardId)) || null;
}

function renderClueFieldNav(archive = state.archive, memory = state.actionMemory) {
  return clueFields().map((field) => {
    const active = field.id === clueFieldMode;
    const progress = clueFieldProgress(field, archive, memory);
    const unlocked = clueFieldUnlocked(field, archive, memory);
    const hasNew = unlocked && clueFieldHasNew(field, archive, memory);
    const countText = field.id === "overview"
      ? `${progress.unlockedSegments}/${progress.totalSegments}`
      : unlocked ? `${progress.unlocked}/${progress.total}` : "???";
    const label = unlocked ? field.title : "???";
    const attrs = unlocked ? `data-clue-field="${field.id}"` : "disabled aria-disabled=\"true\"";
    return `
      <button class="clue-field-button ${active ? "active" : ""} ${unlocked ? "unlocked" : "locked"} ${hasNew ? "has-new" : ""}" type="button" ${attrs}>
        <span class="clue-field-name">${escapeHtml(label)}</span>
        ${hasNew ? renderNewBadge() : ""}
        <b>${countText}</b>
      </button>
    `;
  }).join("");
}

function renderCluePage(archive = state.archive, memory = state.actionMemory) {
  if (!refs.cluePageContent) return;
  const field = clueFieldById(clueFieldMode);
  if (!clueFieldUnlocked(field, archive, memory)) clueFieldMode = "overview";
  const currentField = clueFieldById(clueFieldMode);
  const progress = clueProgress(archive, memory);
  const hasNewClues = clueFieldHasNew(clueFieldById("overview"), archive, memory);
  const visibleCardIds = clueFieldCardIds(currentField.id);
  if (visibleCardIds && selectedClueCardId && !visibleCardIds.has(selectedClueCardId)) selectedClueCardId = "";
  const graph = renderEventGraph(archive, memory, {
    fieldId: currentField.id,
    visibleCardIds,
    selectedCardId: selectedClueCardId
  });
  refs.cluePageContent.innerHTML = `
    <div class="clue-page-shell" data-panel="${clueMobilePanel}">
      <header class="clue-page-top">
        <div>
          <p class="eyebrow">线索脉络图</p>
          <h2>${escapeHtml(currentField.title)}</h2>
          <span>${escapeHtml(currentField.head || "按剧情分野查看旧城事件关系。")}</span>
        </div>
        <div class="clue-page-stats">
          <strong>${progress.unlockedSegments}/${progress.totalSegments}</strong>
          <span>暗线</span>
          <strong>${progress.endingCount}/${progress.endingTotal}</strong>
          <span>结局</span>
          <button class="menu-button" type="button" data-clue-close>返回游戏</button>
        </div>
      </header>
      <div class="clue-page-tabs" role="tablist" aria-label="线索页区域">
        <button class="${clueMobilePanel === "fields" ? "active" : ""}" type="button" data-clue-panel="fields">分野${hasNewClues ? renderNewBadge() : ""}</button>
        <button class="${clueMobilePanel === "graph" ? "active" : ""}" type="button" data-clue-panel="graph">图谱${hasNewClues ? renderNewBadge() : ""}</button>
        <button class="${clueMobilePanel === "detail" ? "active" : ""}" type="button" data-clue-panel="detail">详情</button>
      </div>
      <div class="clue-page-body">
        <aside class="clue-sidebar">
          <div class="panel-heading"><h3>剧情分野</h3><span class="item-meta">只看主线关系</span></div>
          <div class="clue-field-list">${renderClueFieldNav(archive, memory)}</div>
        </aside>
        <main class="clue-graph-panel">${graph}</main>
        <aside class="clue-inspector">${renderClueInspector(currentField, archive, memory)}</aside>
      </div>
    </div>
  `;
  bindCluePageControls();
}

function renderClueInspector(field, archive = state.archive, memory = state.actionMemory) {
  const selectedCard = selectedClueCardId ? cardById(selectedClueCardId) : null;
  if (selectedCard) return renderClueEventInspector(selectedCard, archive, memory);
  return renderClueFieldInspector(field, archive, memory);
}

function renderClueFieldInspector(field, archive = state.archive, memory = state.actionMemory) {
  if (!field.thread) {
    return `
      <div class="clue-inspector-head">
        <span>总览</span>
        <h3>旧城事件主干</h3>
        <p>已经照亮的旧城线索会在这里归拢成脉络，尚未确认的分野仍被雾色遮住。</p>
      </div>
      <div class="clue-thread-mini-list">
        ${CLUE_THREADS.map((thread) => renderClueThreadMini(thread, archive, memory)).join("")}
      </div>
    `;
  }
  return `
    <div class="clue-inspector-head">
      <span>分野</span>
      <h3>${escapeHtml(field.thread.title)}</h3>
      <p>${escapeHtml(field.thread.hidden)}</p>
    </div>
    <div class="clue-thread-mini-list">
      ${field.thread.segments.map((segment) => renderClueSegmentMini(segment, archive, memory)).join("")}
    </div>
  `;
}

function renderClueThreadMini(thread, archive = state.archive, memory = state.actionMemory) {
  const progress = clueFieldProgress({ thread }, archive, memory);
  const unlocked = clueThreadUnlocked(thread, archive, memory);
  if (!unlocked) {
    return `
      <div class="clue-thread-mini locked">
        <strong>???</strong>
        <span>重要脉络尚未显形</span>
      </div>
    `;
  }
  return `
    <button class="clue-thread-mini" type="button" data-clue-field="${thread.id}">
      <strong>${escapeHtml(thread.title)}</strong>
      <span>${progress.unlocked}/${progress.total} · ${escapeHtml(thread.head)}</span>
    </button>
  `;
}

function renderClueSegmentMini(segment, archive = state.archive, memory = state.actionMemory) {
  const open = clueSegmentUnlocked(segment, archive, memory);
  const cards = open ? cardsForClueSegment(segment).map((id) => cardById(id)?.label).filter(Boolean).join(" / ") : "";
  return `
    <div class="clue-segment-mini ${open ? "unlocked" : "locked"}">
      <strong>${open ? escapeHtml(segment.title) : "???"}</strong>
      <p>${open ? escapeHtml(segment.text) : "继续探索关键线索。"}</p>
      ${cards ? `<span>${escapeHtml(cards)}</span>` : ""}
    </div>
  `;
}

function renderClueSource(source) {
  if (!source.id) return `<span>${escapeHtml(source.label)}</span>`;
  const sourceNode = nodeForCard(source.id);
  const place = sourceNode ? sourceNode.name : "旧城事件";
  return `
    <button type="button" data-card-jump="${source.id}" aria-label="查看${escapeHtml(source.label)}，获取地点：${escapeHtml(place)}">
      <strong>${escapeHtml(source.label)}</strong>
      <span>${escapeHtml(place)}</span>
    </button>
  `;
}

function renderClueEventInspector(cardData, archive = state.archive, memory = state.actionMemory) {
  const node = nodeForCard(cardData.id);
  const record = memory?.[cardData.id] || {};
  const outcomes = [
    record.success ? renderOutcomeReplay("成功", cardData.success, record.success.count) : "",
    record.fail ? renderOutcomeReplay("失手", cardData.fail, record.fail.count) : ""
  ].filter(Boolean).join("");
  const related = clueSegmentsForCard(cardData.id);
  const requirements = graphRequirementSources(cardData);
  return `
    <div class="clue-inspector-head">
      <span>${node ? escapeHtml(node.name) : "旧城事件"}</span>
      <h3>${escapeHtml(cardData.label)}</h3>
      <p>${escapeHtml(cardData.detail || "")}</p>
    </div>
    <div class="clue-inspector-block">
      <h4>关键前置</h4>
      ${requirements.length ? requirements.map((row) => `
        <div class="clue-requirement-row">
          <div><strong>${escapeHtml(row.label)}</strong><span>${row.kind}</span></div>
          <div class="clue-source-list">
            ${row.sources.map(renderClueSource).join("")}
          </div>
        </div>
      `).join("") : `<p class="empty-line">这件事不依赖额外前置。</p>`}
    </div>
    <div class="clue-inspector-block">
      <h4>事件回放</h4>
      ${outcomes || `<p class="empty-line">这件事还没有留下成败记录。</p>`}
    </div>
    <div class="clue-inspector-block">
      <h4>相关脉络</h4>
      ${related.length
        ? related.map(({ thread, segment }) => `
          <div class="clue-segment-mini ${clueSegmentUnlocked(segment, archive, memory) ? "unlocked" : "locked"}">
            <strong>${escapeHtml(thread.title)} / ${clueSegmentUnlocked(segment, archive, memory) ? escapeHtml(segment.title) : "未明线索"}</strong>
            <p>${clueSegmentUnlocked(segment, archive, memory) ? escapeHtml(segment.text) : clueLockedText(segment)}</p>
          </div>
        `).join("")
        : `<p class="empty-line">这件事暂时不属于已整理的暗线分野。</p>`}
    </div>
  `;
}

function bindCluePageControls() {
  refs.cluePageContent.querySelectorAll("[data-clue-close]").forEach((button) => {
    button.addEventListener("click", hideCluePage);
  });
  refs.cluePageContent.querySelectorAll("[data-clue-field]").forEach((button) => {
    button.addEventListener("click", () => {
      clueFieldMode = button.dataset.clueField || "overview";
      selectedClueCardId = "";
      clueMobilePanel = "graph";
      renderCluePage();
    });
  });
  refs.cluePageContent.querySelectorAll("[data-card-id]").forEach((button) => {
    button.addEventListener("click", () => {
      focusClueCard(button.dataset.cardId || "", { showDetail: true });
    });
  });
  refs.cluePageContent.querySelectorAll("[data-card-jump]").forEach((button) => {
    button.addEventListener("click", () => focusClueCard(button.dataset.cardJump || "", { showDetail: true, forceOverview: true }));
  });
  refs.cluePageContent.querySelectorAll("[data-clue-panel]").forEach((button) => {
    button.addEventListener("click", () => {
      clueMobilePanel = button.dataset.cluePanel || "graph";
      renderCluePage();
    });
  });
}

function focusClueCard(cardId, options = {}) {
  selectedClueCardId = cardId;
  if (options.forceOverview) clueFieldMode = "overview";
  clueMobilePanel = options.showDetail ? "detail" : "graph";
  if (cardId) markClueCardRead(cardId);
  renderCluePage();
  requestAnimationFrame(() => {
    const node = document.getElementById(graphCardId({ id: cardId }));
    node?.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
    node?.focus({ preventScroll: true });
  });
}

function renderClueThread(thread, archive, memory) {
  const unlocked = thread.segments.filter((segment) => clueSegmentUnlocked(segment, archive, memory));
  const progressText = `${unlocked.length}/${thread.segments.length}`;
  const segments = thread.segments.map((segment, index) => renderClueSegment(segment, index, archive, memory)).join("");
  return `
    <article class="clue-thread ${unlocked.length ? "unlocked" : "locked"}">
      <div class="clue-thread-head">
        <div>
          <span>${progressText}</span>
          <h4>${thread.title}</h4>
        </div>
        <p>${thread.head}</p>
      </div>
      <div class="clue-thread-hidden">${unlocked.length ? thread.hidden : "线头已经出现，后面的脉络还藏在旧城里。"}</div>
      <div class="clue-segment-list">${segments}</div>
    </article>
  `;
}

function renderClueSegment(segment, index, archive, memory) {
  const open = clueSegmentUnlocked(segment, archive, memory);
  const evidence = open ? renderClueEvidence(segment, archive, memory) : "";
  return `
    <div class="clue-segment ${open ? "unlocked" : "locked"}">
      <div class="clue-segment-index">${String(index + 1).padStart(2, "0")}</div>
      <div class="clue-segment-body">
        <strong>${open ? segment.title : "未明线索"}</strong>
        <p>${open ? segment.text : clueLockedText(segment)}</p>
        ${evidence}
      </div>
    </div>
  `;
}

function clueLockedText(segment) {
  const unlock = segment.unlock || {};
  const hints = [];
  if (unlock.cards?.length) hints.push("相关事件");
  if (unlock.endings?.length) hints.push("相关结局");
  if (unlock.flags?.length) hints.push("关键条件");
  return hints.length ? `继续寻找${hints.join("、")}。` : "继续游玩后会显形。";
}

function renderClueEvidence(segment, archive, memory) {
  const cards = (segment.cards || []).map((id) => renderCardReplay(id, memory)).filter(Boolean).join("");
  const endings = (segment.endings || []).map((id) => renderEndingReplay(id, archive)).filter(Boolean).join("");
  const media = `<div class="clue-media-slot">回忆影像 · ${segment.title}</div>`;
  const evidence = [cards, endings].filter(Boolean).join("");
  return `<div class="clue-evidence">${media}${evidence}</div>`;
}

function renderCardReplay(id, memory = state?.actionMemory || {}) {
  const cardData = cardById(id);
  const record = memory?.[id];
  if (!cardData || (!record?.success && !record?.fail)) return "";
  const outcomes = [
    record.success ? renderOutcomeReplay("成功", cardData.success, record.success.count) : "",
    record.fail ? renderOutcomeReplay("失手", cardData.fail, record.fail.count) : ""
  ].filter(Boolean).join("");
  return `
    <details class="clue-replay-card">
      <summary>${cardData.label}</summary>
      <div class="clue-replay-outcomes">${outcomes}</div>
    </details>
  `;
}

function renderOutcomeReplay(label, text, count = 1) {
  return `
    <div class="clue-replay-outcome">
      <span>${label}${count > 1 ? ` · ${count}次` : ""}</span>
      <p>${renderInline(text || "")}</p>
    </div>
  `;
}

function renderEndingReplay(id, archive = state?.archive || []) {
  if (!endingSeen(id, archive)) return "";
  const story = ENDING_STORIES[id];
  if (!story) return "";
  const entries = endingEntries(archive, id);
  const latest = entries[entries.length - 1];
  return `
    <details class="clue-ending-replay">
      <summary>${story.title}</summary>
      <div class="clue-ending-body">${renderNarrative(story.body)}</div>
      ${latest?.route?.length ? `<p class="clue-route">最近路线：${latest.route.join(" → ")}</p>` : ""}
    </details>
  `;
}

function renderEndingStoryCollection(archive = state.archive) {
  const endingIds = storyEndingIdsFromArchive(archive);
  const cards = STORY_ENDING_IDS.map((id) => {
    const story = ENDING_STORIES[id];
    const open = endingIds.has(id);
    const entries = endingEntries(archive, id);
    const latest = entries[entries.length - 1];
    return `
      <article class="ending-story-card ${open ? "unlocked" : "locked"}">
        <div>
          <strong>${open ? story.title : "未记录结局"}</strong>
          <span>${open ? `${entries.length} 次记录` : endingMeta(id)?.hint || "继续探索"}</span>
        </div>
        ${open ? `<div class="ending-story-body">${renderNarrative(story.body)}</div>` : `<p>${endingMeta(id)?.hint || "这段结局还没有发生。"}</p>`}
        ${open && latest?.cause ? `<b>${escapeHtml(latest.cause)}</b>` : ""}
      </article>
    `;
  }).join("");
  return `
    <section class="archive-modal-section">
      <div class="panel-heading"><h3>结局故事</h3><span class="item-meta">${endingIds.size}/${STORY_ENDING_IDS.length}</span></div>
      <div class="ending-story-grid">${cards}</div>
    </section>
  `;
}

function renderCurtainCall(archive = state.archive, memory = state.actionMemory) {
  const progress = clueProgress(archive, memory);
  const body = progress.complete
    ? CURTAIN_CALL.sections.map((section) => `
        <article class="curtain-section">
          <h4>${section.title}</h4>
          <p>${section.body}</p>
        </article>
      `).join("")
    : `<p>${CURTAIN_CALL.locked}</p>`;
  return `
    <section class="archive-modal-section curtain-call ${progress.complete ? "unlocked" : "locked"}">
      <div class="panel-heading">
        <h3>${CURTAIN_CALL.title}</h3>
        <span class="item-meta">${progress.endingCount}/${progress.endingTotal} 结局 · ${progress.unlockedSegments}/${progress.totalSegments} 脉络</span>
      </div>
      <div class="curtain-card">
        <strong>${progress.complete ? "谢幕入口已开放" : "谢幕尚未开放"}</strong>
        <span>${progress.complete ? "完整世界线已归档，后续可以在这里承载视频与设定集。" : "收齐主要结局和剧情脉络后，这里会打开完整世界线。"}</span>
      </div>
      <div class="curtain-body">${body}</div>
    </section>
  `;
}

function dominantKind() {
  const counts = {};
  state.choices.forEach((choice) => {
    counts[choice.kind] = (counts[choice.kind] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "route";
}

function relicFor(kind, ending) {
  if (["king", "human", "perfect"].includes(ending.id)) return "route";
  if (ending.id === "weird") return "ruthless";
  if (kind === "aid") return "aid";
  if (kind === "shelter" || kind === "stealth") return "shelter";
  if (kind === "ruthless") return "ruthless";
  if (kind === "signal" || kind === "tech") return "signal";
  if (kind === "memory") return "memory";
  return "route";
}

function echoName(kind, ending) {
  if (ending.id === "king") return "归位旧王";
  if (ending.id === "human") return "离城者";
  if (ending.id === "perfect") return "托印人";
  if (ending.id === "weird") return "带怪出城者";
  const names = {
    aid: "守夜人",
    shelter: "守门人",
    stealth: "灰外套",
    ruthless: "冷手",
    signal: "调频者",
    tech: "电房客",
    memory: "刻痕人",
    route: "认路人",
    loot: "拾荒者"
  };
  return names[kind] || "迷雾中的你";
}

function noteFor(kind, ending) {
  if (ending.id === "king") return "王座会停下旧城，也会留下坐上去的人。";
  if (ending.id === "human") return "归位不只属于旧城，也能属于现世。";
  if (ending.id === "perfect") return "王权可以被归还，也可以被托付。";
  if (ending.id === "weird") return "剖真死后，别让归位学会它的饥饿。";
  if (kind === "aid") return "救人不是软弱，是证明自己还想做人。";
  if (kind === "ruthless") return "快一点可以活，太快会把人也归位成障碍。";
  if (kind === "signal") return "沈砚的短波每次说真话，都少说半句原因。";
  if (kind === "memory") return "墙上的三道线，第一道通向外城，第三道通向王座。";
  return "雾最厚的时候，别走最像出口的路。";
}

function getActions() {
  if (state.ended) {
    return [{
      label: "重新开始",
      detail: "带着新痕迹重新开始",
      cost: 0,
      primary: true,
      onClick: startRun
    }];
  }

  if (state.phase === "ready") {
    return [
      ...state.cards.filter(() => !state.exhaustedNodes.has(state.node)).map((cardData) => ({
        ...cardData,
        disabled: !canPlay(cardData),
        onClick: () => playCard(cardData)
      })),
      {
        label: "离开这里",
        detail: "收起当前区域，打开路线图",
        cost: 0,
        chance: null,
        primary: true,
        onClick: openRouteChoice
      }
    ];
  }

  if (state.phase === "route") {
    const routeActions = currentNode().links.map((id) => {
      const target = nodeById(id);
      const moveCost = target.kind === "final" ? 8 : 10 + target.tier * 2;
      return {
        label: `前往${target.name}`,
        detail: routeDetail(target),
        cost: moveCost,
        chance: null,
        primary: target.kind === "final",
        onClick: () => moveTo(id)
      };
    });

    const backAction = remainingCardsForNode(state.node).length ? [{
        label: `回到${currentNode().name}`,
        detail: "暂不选目的地，回到当前区域",
        cost: 0,
        chance: null,
        onClick: returnToCurrentNode
      }] : [];

    return [...routeActions, ...backAction];
  }

  return state.cards.map((cardData) => ({
    ...cardData,
    disabled: !canPlay(cardData),
    onClick: () => playCard(cardData)
  }));
}

function routeDetail(target) {
  const details = {
    aid: "可能找到医疗和人情",
    loot: "补给较多，背包压力更大",
    tech: "偏工具和门禁线索",
    risk: "更快但更容易暴露",
    signal: "适合找白塔局和沈砚短波",
    stealth: "低调路线，消耗身体",
    access: "接近死城封锁核心",
    memory: "旧王记忆更多",
    final: "抵达内城密道"
  };
  return details[target.kind] || "移动到下一处";
}

function render() {
  renderAtmosphere();
  renderStatus();
  renderBag();
  renderEcho();
  renderSceneArt();
  renderMap();
  renderStory();
  renderActions();
  renderLog();
  renderArchive();
  if (refs.cluePage && !refs.cluePage.hidden) renderCluePage();
}

function renderAtmosphere() {
  document.body.dataset.alert = heatLevel().tone;
  if (ambient?.running) ambient.setAlert(state.heat);
}

function renderSceneArt() {
  const art = sceneArtFor();
  const artUrl = new URL(art, window.location.href).href;
  refs.visualPanel?.style.setProperty("--scene-image", `url("${artUrl}")`);
  refs.storyPanel?.style.setProperty("--scene-image", `url("${artUrl}")`);
  if (refs.sceneArtImage && refs.sceneArtImage.getAttribute("src") !== art) {
    refs.sceneArtImage.setAttribute("src", art);
  }
}

function renderStatus() {
  refs.timerValue.textContent = formatMinutes(state.minutes);
  refs.loopValue.textContent = `第 ${state.cycle} 次【归位】 / 线索 ${state.clues}`;
  refs.awakeningPanel.innerHTML = renderHeatPanel();
  let currentGroup = "";
  refs.statsPanel.innerHTML = STATS.map(({ key, name, group }) => {
    const value = state.stats[key];
    const tone = value <= 2 ? "danger" : value <= 3 ? "warn" : "";
    const step = statStep(value);
    const cells = Array.from({ length: 8 }, (_, i) => {
      const spent = i < step;
      const current = i === step - 1;
      return `<span class="stat-cell ${spent ? "spent" : ""} ${current ? "current" : ""} ${spent ? tone : ""}"></span>`;
    }).join("");
    const heading = group !== currentGroup ? `<div class="stat-group-label">${group}</div>` : "";
    currentGroup = group;
    return `${heading}<div class="stat-row"><div class="stat-name">${name}</div><div class="stat-cells">${cells}</div><div class="stat-value">${step}</div></div>`;
  }).join("");
}

function renderHeatPanel() {
  const axis = awakeningAxisValue();
  const level = awakeningAxisLevel(axis);
  const goodCount = Math.max(0, axis);
  const evilCount = Math.max(0, -axis);
  const goodCells = Array.from({ length: MAX_MORALITY }, (_, i) => {
    const active = i >= MAX_MORALITY - goodCount;
    return `<span class="axis-cell good ${active ? "on" : ""}"></span>`;
  }).join("");
  const evilCells = Array.from({ length: MAX_MORALITY }, (_, i) => {
    const active = i < evilCount;
    return `<span class="axis-cell evil ${active ? "on" : ""}"></span>`;
  }).join("");
  return `
    <div class="heat-head"><span>觉醒值 ${state.heat}</span><strong>${level.label}</strong></div>
    <div class="awakening-axis" aria-label="归位抑制与觉醒倾向">
      <span class="axis-label good">抑制</span>
      <div class="axis-half good">${goodCells}</div>
      <span class="axis-center"></span>
      <div class="axis-half evil">${evilCells}</div>
      <span class="axis-label evil">觉醒</span>
    </div>
    <div class="heat-note">${level.note}</div>
  `;
}

function awakeningAxisValue() {
  return clamp(state.morality - Math.round(state.heat / 3), -MAX_MORALITY, MAX_MORALITY);
}

function awakeningAxisText(value) {
  if (value > 0) return `抑制+${value}`;
  if (value < 0) return `觉醒+${Math.abs(value)}`;
  return "中线";
}

function awakeningAxisLevel(value) {
  if (value >= 6) return { label: "稳住", note: "你很确定，自己仍然是活在现世里的人。" };
  if (value >= 4) return { label: "压住", note: "旧城的回声退到远处，你还能按自己的心意判断。" };
  if (value >= 2) return { label: "偏抑制", note: "你觉得自己还是更像人，只是偶尔会听见门后的声音。" };
  if (value >= 1) return { label: "轻抑制", note: "你还抓得住自己的想法，虽然【归位】已经开始回应你。" };
  if (value <= -6) return { label: "临界", note: "你几乎相信，旧城那套秩序本来就该回来。" };
  if (value <= -4) return { label: "深觉醒", note: "像有另一个秩序在替你判断，而且它越来越熟悉。" };
  if (value <= -2) return { label: "偏觉醒", note: "你偶尔会觉得，人只是被放错位置的东西。" };
  if (value <= -1) return { label: "轻觉醒", note: "有些判断不再完全像你自己的。" };
  return { label: "中线", note: "你还分得清自己和【归位】的声音。" };
}

function heatLevel() {
  if (state.heat >= 16) return { label: "失控", tone: "danger" };
  if (state.heat >= 11) return { label: "觉醒", tone: "danger" };
  if (state.heat >= 6) return { label: "躁动", tone: "warn" };
  return { label: "清明", tone: "calm" };
}

function statStep(value) {
  if (value <= 0) return 0;
  return clamp(Math.round(value), 1, MAX_STAT);
}

function renderBag() {
  const entries = Object.entries(state.bag);
  const props = entries.filter(([id]) => !isOmen(id));
  const omens = entries.filter(([id]) => isOmen(id));
  const renderList = (list) => list.length ? list.map(([id, count]) => {
    return `<div class="inventory-item ${isOmen(id) ? "omen" : ""}"><span class="item-name">${ITEMS[id].name}</span><span class="item-meta">×${count}</span></div>`;
  }).join("") : `<div class="empty-line">空</div>`;
  const html = `
    <div class="panel-heading"><h3>道具与征兆</h3><span class="item-meta">${bagLoad()} / ${MAX_BAG}</span></div>
    <div class="inventory-group"><div class="inventory-title">道具</div><div class="inventory-list">${renderList(props)}</div></div>
    <div class="inventory-group omen"><div class="inventory-title">征兆</div><div class="inventory-list">${renderList(omens)}</div></div>
  `;
  refs.inventoryPanel.innerHTML = html;
  refs.menuInventoryPanel.innerHTML = html;
}

function isOmen(id) {
  const tags = ITEMS[id]?.tags || [];
  return tags.includes("memory") || tags.includes("signal") || tags.includes("access");
}

function renderEcho() {
  const active = state.activeEcho
    ? `<div class="echo-card">
        <div class="echo-name">${state.activeEcho.name}：${state.activeEcho.note}</div>
      </div>`
    : `<div class="empty-line">这一局没有旧便签。</div>`;
  const relics = state.relics.length
    ? `<div class="relic-list">${state.relics.map((id) => `<span class="relic-chip">${RELICS[id].name}</span>`).join("")}</div>`
    : `<div class="empty-line">暂无痕迹</div>`;
  const html = `
    <div class="panel-heading"><h3>痕迹</h3><span class="item-meta">${state.relics.length}/3</span></div>
    ${active}
    ${relics}
  `;
  refs.echoPanel.innerHTML = html;
  refs.menuEchoPanel.innerHTML = html;
}

function renderMap() {
  const node = currentNode();
  refs.mapGrid.innerHTML = `
    <div class="route-strip solo">
      <div class="route-node current">
        <span class="route-kicker">${mapKicker(node)}</span>
        <span class="route-name">${node.name}</span>
        <span class="route-story">${mapSummary(node)}</span>
      </div>
    </div>
  `;
}

function mapKicker(node) {
  if (state.ended) return "结局";
  if (state.phase === "route") return "路线图";
  if (state.phase === "ready") return `${node.tier + 1}/5 当前区域`;
  return `${node.tier + 1}/5 区域事件`;
}

function mapSummary(node) {
  if (state.ended) return state.ending?.title || "路线结束";
  if (state.phase === "route") return "从眼前的岔路里选一个方向。";
  if (state.phase === "ready") {
    return state.exhaustedNodes.has(state.node)
      ? "这里已经没有更多值得冒险的事。"
      : "上一张事件牌已结算，可以离开，也可以再冒险处理一轮。";
  }
  if (state.choices.length === 0 && state.node === "home") {
    return "三小时内穿过旧城叠层，抵达内城密道。先处理眼前的事。";
  }
  return routeText(node);
}

function renderStory() {
  refs.phasePill.textContent = state.ended
    ? "结局"
    : state.phase === "route"
      ? "选择下一站"
      : state.phase === "ready"
        ? "区域已处理"
      : `${currentNode().tier + 1}/5 区域事件`;
  refs.sceneTitle.textContent = state.ended ? state.ending.title : currentNode().name;
  refs.storyText.innerHTML = renderNarrative(state.story);
}

function renderNarrative(text) {
  return String(text || "")
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${renderInline(paragraph.replace(/\n/g, "<br>"))}</p>`)
    .join("");
}

function renderInline(text) {
  return escapeHtml(text)
    .replace(/&lt;br&gt;/g, "<br>")
    .replace(/【([^】]+)】/g, `<span class="ability-token">【$1】</span>`)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function renderFeedbackBody(feedback) {
  return `
    <div class="feedback-mainline">${renderInline(feedback.mainLine || "")}</div>
    ${feedback.hintLine ? `<p class="feedback-microline">${renderInline(feedback.hintLine)}</p>` : ""}
  `;
}

function feedbackAfterlineClass(line) {
  const plain = stripMarkdown(line);
  const classes = ["feedback-afterline"];
  if (/^\*/.test(line)) classes.push("is-hidden");
  if (line.includes("【归位】")) classes.push("is-weird");
  if (/带走|背包|东西|状态|选择/.test(plain)) classes.push("is-result");
  if (/仍然记得|开始更快|以人的方式|障碍/.test(plain)) classes.push("is-choice");
  return classes.join(" ");
}

function stripMarkdown(text) {
  return String(text || "").replace(/\*\*/g, "").replace(/\*/g, "");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderActions() {
  const actions = getActions();
  const actionCards = actions.map((action, index) => {
    const actionCost = action.cost ? `耗时 ${action.cost}m` : action.primary ? "前往" : "确认";
    const blocked = blockReason(action);
    const unmet = action.disabled && blocked;
    const checkText = actionCheckPreview(action);
    const knownDeath = knownDeathFor(action);
    const detailText = unmet ? escapeHtml(lockedActionDetail(action.detail)) : renderActionDetail(action);
    const sideMarkup = unmet
      ? `<span class="action-lock"><span>暂时不能选择</span><strong>${blocked}</strong></span>`
      : [
          `<span class="action-cost">${actionCost}</span>`,
          checkText ? `<span class="action-check">${checkText}</span>` : "",
          knownDeath ? `<span class="action-death-pill">已知死亡</span>` : ""
        ].filter(Boolean).join("");
    return `<button class="action-button ${action.primary ? "primary" : ""} ${unmet ? "unmet" : ""} ${knownDeath ? "known-death" : ""}" data-action="${index}" ${action.disabled ? "disabled" : ""} type="button">
      <span class="action-main">
        <span class="action-label">${action.label}</span>
        <span class="action-detail">${detailText}</span>
      </span>
      <span class="action-side">
        ${sideMarkup}
      </span>
    </button>`;
  }).join("");
  const hasCheck = actions.some((action) => !action.disabled && Boolean(actionCheckPreview(action)));
  const ruleNote = hasCheck
    ? `<div class="action-rule-note">判定：每点属性投 1 颗骰，每颗 1-12，合计达到需求即通过。</div>`
    : "";
  refs.actionsPanel.innerHTML = `${actionCards}${ruleNote}`;
  refs.actionsPanel.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => actions[Number(button.dataset.action)]?.onClick());
  });
}

function lockedActionDetail(detail) {
  return String(detail || "").replace(/^需要[^，,。；;]+[，,]\s*/, "");
}

function renderActionDetail(action) {
  const memory = state.actionMemory?.[action.id];
  const knownDeath = knownDeathFromMemory(memory);
  const brief = `<span class="action-brief">${escapeHtml(action.detail || "")}</span>`;
  if (!knownDeath && !memory?.success && !memory?.fail) return brief;
  const rows = [
    brief,
    knownDeath ? knownDeathRow(knownDeath) : "",
    memory.success ? knownActionRow("success", "记得可行", memory.success) : "",
    memory.fail ? knownActionRow("fail", "记得失手", memory.fail) : ""
  ].filter(Boolean).join("");
  return `<span class="action-known-list">${rows}</span>`;
}

function knownDeathFor(action) {
  return knownDeathFromMemory(state.actionMemory?.[action?.id]);
}

function knownDeathFromMemory(memory) {
  if (!memory || typeof memory !== "object") return null;
  return memory.fail?.death || memory.success?.death || null;
}

function knownDeathRow(death) {
  return `<span class="action-death-warning"><b>已知死亡</b><span>${escapeHtml(death.reason || death.label || "这条选择曾让路线提前结束。")}</span></span>`;
}

function knownActionRow(type, label, outcome) {
  const text = outcome?.line || (type === "success" ? "曾经成功过。" : "曾经失手过。");
  const title = type === "success" ? "成功" : "失败";
  return `<span class="action-known ${type}"><b>${title}</b><span>${escapeHtml(compactKnownOutcome(text))}</span></span>`;
}

function compactKnownOutcome(line) {
  const parts = String(line || "").split(" / ").map((part) => part.trim()).filter(Boolean);
  const itemGains = [];
  const itemLosses = [];
  const stats = [];
  const progress = [];
  parts.forEach((part) => {
    if (part.startsWith("获得")) {
      itemGains.push(part.replace(/^获得/, ""));
      return;
    }
    if (part.startsWith("失去")) {
      itemLosses.push(part.replace(/^失去/, ""));
      return;
    }
    if (/^(力量|敏捷|智力|意志)[+-]/.test(part)) {
      stats.push(part);
      return;
    }
    if (/^线索\+/.test(part)) {
      progress.push(part);
      return;
    }
    if (/^觉醒值[+-]/.test(part)) {
      progress.push(part.replace(/^觉醒值/, "觉醒"));
      return;
    }
    if (/^倾向抑制\+/.test(part)) {
      progress.push(part.replace(/^倾向/, ""));
      return;
    }
    if (/^倾向觉醒\+/.test(part)) {
      progress.push(part.replace(/^倾向/, ""));
    }
  });
  const output = [];
  if (itemGains.length) output.push(`获 ${itemGains.join("、")}`);
  if (itemLosses.length) output.push(`失 ${itemLosses.join("、")}`);
  output.push(...stats.slice(0, 3));
  output.push(...progress.slice(0, 2));
  return output.slice(0, 5).join(" / ") || "无明显变化";
}

function actionCheckPreview(action) {
  const checkKey = checkStatFor(action);
  if (!checkKey) return "";
  return `${statName(checkKey)}需求 ${effectiveCheckTarget(action)}`;
}

function renderSettlement() {
  const review = state.ending?.review;
  if (!review) return;
  refs.settlementContent.innerHTML = `
    <div class="settlement-hero">
      <div>
        <div class="settlement-grade">${review.grade}</div>
        <h3>${state.ending.title}</h3>
        <p>${review.cause}</p>
      </div>
      <div class="settlement-score">${state.ending.score}</div>
    </div>
    <div class="settlement-unlocks">
      <div><span>收藏进度</span><strong>${review.collection}</strong></div>
      <div><span>本次解锁</span><strong>${review.unlocks}</strong></div>
    </div>
    <div class="settlement-body">${renderNarrative(state.ending.body)}</div>
    <div class="settlement-grid">
      <div class="settlement-row"><span>本局概况</span><strong>${review.summary}</strong></div>
      <div class="settlement-row"><span>经过地点</span><strong>${review.route}</strong></div>
      <div class="settlement-row"><span>状态收束</span><strong>${review.resources}</strong></div>
      <div class="settlement-row"><span>压力记录</span><strong>${review.pressure}</strong></div>
      <div class="settlement-row"><span>收束原因</span><strong>${review.cause}</strong></div>
      <div class="settlement-row"><span>关键评价</span><strong>${review.highlight}</strong></div>
      <div class="settlement-row"><span>下次建议</span><strong>${review.advice}</strong></div>
      <div class="settlement-row trace"><span>留下痕迹</span><strong>${review.trace}</strong></div>
    </div>
    <div class="settlement-actions">
      <button id="settlementRestartButton" class="action-button primary" type="button">
        <span class="action-main">
          <span class="action-label">再试一次</span>
          <span class="action-detail">带着这次留下的痕迹重新开始</span>
        </span>
        <span class="action-cost">再次归位</span>
      </button>
      <button id="settlementCloseButton" class="action-button" type="button">
        <span class="action-main">
          <span class="action-label">先看看记录</span>
          <span class="action-detail">关闭结算，回到当前页面</span>
        </span>
        <span class="action-cost">关闭</span>
      </button>
    </div>
  `;

  refs.settlementContent.querySelector("#settlementRestartButton").addEventListener("click", () => {
    refs.settlementModal.hidden = true;
    startRun();
  });
  refs.settlementContent.querySelector("#settlementCloseButton").addEventListener("click", () => {
    refs.settlementModal.hidden = true;
  });
}

function showFeedback() {
  renderFeedback();
  refs.feedbackModal.hidden = false;
  if (state.feedback) {
    ambient?.playReceipt(state.feedback.tone === "success");
    const voiceCue = voiceCueForFeedback(state.feedback);
    if (voiceCue) window.setTimeout(() => ambient?.playVoiceOnce(voiceCue), 750);
  }
}

function showJudgment(check, onComplete) {
  clearTimeout(judgmentTimer);
  const stat = statName(check.checkKey) || "行动";
  const tone = check.success ? "success" : "fail";
  const resultText = check.success ? "通过" : "失手";
  const rolls = check.rolls?.length ? check.rolls : [0];
  refs.judgmentContent.innerHTML = `
    <div class="judgment-card ${tone}" aria-live="polite">
      <div class="judgment-kicker">判定中</div>
      <h2 id="judgmentTitle">${stat}需求 ${check.target}</h2>
      <div class="dice-stage" aria-label="投骰结果">
        ${rolls.map((value, index) => `<span class="die" style="--i:${index}"><span>${value}</span></span>`).join("")}
      </div>
      <div class="judgment-sum">
        <span>合计</span>
        <strong class="${tone}">${check.total}</strong>
        <em>${resultText}</em>
      </div>
    </div>
  `;
  refs.judgmentModal.hidden = false;
  const card = refs.judgmentContent.querySelector(".judgment-card");
  requestAnimationFrame(() => card?.classList.add("rolling"));
  window.setTimeout(() => card?.classList.add("resolved"), 520);
  judgmentTimer = window.setTimeout(() => {
    closeJudgment();
    onComplete?.();
  }, 1420);
}

function closeJudgment() {
  clearTimeout(judgmentTimer);
  judgmentTimer = 0;
  refs.judgmentModal.hidden = true;
}

function renderFeedback() {
  const feedback = state.feedback;
  if (!feedback) return;
  refs.feedbackContent.innerHTML = `
    <div class="feedback-card ${feedback.tone}">
      <img class="feedback-bg" src="${feedback.art}" alt="${feedback.artAlt}" decoding="async" />
      <div class="feedback-copy">
        <div class="feedback-copy-head">
          <div>
            <div class="feedback-kicker">${feedback.nodeName} / ${feedback.cardLabel}</div>
            <h3>${feedback.title}</h3>
          </div>
          <button id="feedbackReadToggle" class="feedback-read-toggle" type="button" aria-expanded="true" aria-controls="feedbackReadPanel">
            收起阅读区
          </button>
        </div>
        <div id="feedbackReadPanel" class="feedback-read-panel">
          <div class="feedback-body">${renderFeedbackBody(feedback)}</div>
          <div class="feedback-details">
            <button id="feedbackDetailToggle" class="feedback-detail-toggle" type="button" aria-expanded="false" aria-controls="feedbackDetailPanel">
              展开更多
            </button>
            <div id="feedbackDetailPanel" class="feedback-detail-panel" hidden>
              <div class="feedback-grid">
                <div><span>现场</span><strong>${renderInline(feedback.fullMainLine || feedback.mainLine || "")}</strong></div>
                <div><span>${feedback.rewardLabel}</span><strong>${feedback.rewardLine}</strong></div>
                <div><span>脉络</span><strong>${feedback.threadDetailLine}</strong></div>
                <div><span>变化</span><strong>${feedback.changeLine}</strong></div>
                <div><span>判定</span><strong>${feedback.meta}</strong></div>
              </div>
              ${renderFeedbackExpandedLines(feedback)}
              ${feedback.rewardDetail ? `<p class="feedback-note">${feedback.rewardDetail}</p>` : ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  const readToggle = refs.feedbackContent.querySelector("#feedbackReadToggle");
  const readPanel = refs.feedbackContent.querySelector("#feedbackReadPanel");
  const detailToggle = refs.feedbackContent.querySelector("#feedbackDetailToggle");
  const detailPanel = refs.feedbackContent.querySelector("#feedbackDetailPanel");
  readToggle.addEventListener("click", () => {
    const nextOpen = readPanel.hidden;
    readPanel.hidden = !nextOpen;
    readToggle.setAttribute("aria-expanded", String(nextOpen));
    readToggle.textContent = nextOpen ? "收起阅读区" : "展开阅读区";
    refs.feedbackContent.querySelector(".feedback-card")?.classList.toggle("reading-collapsed", !nextOpen);
  });
  detailToggle.addEventListener("click", () => {
    const nextOpen = detailPanel.hidden;
    detailPanel.hidden = !nextOpen;
    detailToggle.setAttribute("aria-expanded", String(nextOpen));
    detailToggle.textContent = nextOpen ? "收起更多" : "展开更多";
  });
}

function renderFeedbackExpandedLines(feedback) {
  const lines = feedback.afterLines?.slice(1) || [];
  if (!lines.length) return "";
  const html = lines.map((line) => `<p class="${feedbackAfterlineClass(line)}">${renderInline(line)}</p>`).join("");
  return `<div class="feedback-afterlines">${html}</div>`;
}

function closeFeedback() {
  refs.feedbackModal.hidden = true;
}

function renderLog() {
  const list = state.log.length ? state.log.map((entry) => {
    return `<div class="log-entry"><div class="log-time">${formatMinutes(START_MINUTES - entry.minutes)} / ${entry.title}</div><p class="log-text">${entry.text}</p></div>`;
  }).join("") : `<div class="empty-line">暂无记录</div>`;
  const html = `<h3>本局记录</h3><div class="log-list">${list}</div>`;
  refs.runLog.innerHTML = html;
  refs.menuRunLogPanel.innerHTML = `<div class="log-panel menu-log-panel">${html}</div>`;
}

function renderArchive() {
  refs.archivePanel.innerHTML = "";
  renderArchiveModal();
}

function renderArchiveModal(mode = archiveViewMode) {
  if (mode === "clues") {
    showCluePage();
    return;
  }
  archiveViewMode = "archive";
  if (refs.archiveTitle) refs.archiveTitle.textContent = "痕迹档案";
  refs.archiveModal?.querySelector(".archive-modal-panel")?.classList.remove("clue-map-panel");
  const collection = collectionSummary(state.archive);
  const relics = state.relics.length
    ? state.relics.map((id) => `<div class="archive-detail-card"><strong>${RELICS[id].name}</strong><span>${RELICS[id].text}</span></div>`).join("")
    : `<div class="empty-line">暂无生效痕迹</div>`;
  const echo = state.activeEcho
    ? `<div class="archive-note">${state.activeEcho.name}：${state.activeEcho.note}</div>`
    : `<div class="empty-line">这一局没有旧便签。</div>`;
  const list = state.archive.slice(-8).reverse();
  const history = list.length
    ? list.map((item) => `
      <div class="archive-history-item">
        <div><strong>${item.name}</strong><span>${item.ending}</span></div>
        <b>${item.score}</b>
      </div>
    `).join("")
    : `<div class="empty-line">还没有旧痕迹</div>`;

  const currentSection = `
    <section class="archive-modal-section">
      <div class="panel-heading"><h3>当前生效</h3><span class="item-meta">${state.relics.length}/3</span></div>
      ${echo}
      <div class="archive-detail-grid">${relics}</div>
    </section>`;
  const endingSection = `
    <section class="archive-modal-section">
      <div class="panel-heading"><h3>结局收集</h3><span class="item-meta">${collection.endings}/${ENDING_CATALOG.length}</span></div>
      <div class="collection-grid">${renderEndingCollection(state.archive)}</div>
    </section>`;
  const achievementSection = `
    <section class="archive-modal-section">
      <div class="panel-heading"><h3>成就</h3><span class="item-meta">${collection.achievements}/${ACHIEVEMENTS.length}</span></div>
      <div class="achievement-grid">${renderAchievementCollection(state.archive)}</div>
    </section>`;
  const historySection = `
    <section class="archive-modal-section">
      <div class="panel-heading"><h3>历史痕迹</h3><span class="item-meta">${state.archive.length}</span></div>
      <div class="archive-history-list">${history}</div>
    </section>`;
  const endingStorySection = renderEndingStoryCollection(state.archive);
  const curtainSection = renderCurtainCall(state.archive, state.actionMemory);
  const archiveSections = [currentSection, endingSection, endingStorySection, achievementSection, historySection, curtainSection].join("");

  refs.archiveModalContent.innerHTML = archiveSections;
  bindArchiveTabs();
}

function bindArchiveTabs() {
  refs.archiveModalContent.querySelectorAll("[data-archive-view]").forEach((button) => {
    button.addEventListener("click", () => renderArchiveModal(button.dataset.archiveView));
  });
}

function renderEndingCollection(archive) {
  return ENDING_CATALOG.map((meta) => {
    const entries = endingEntries(archive, meta.id);
    const latest = entries[entries.length - 1];
    const best = entries.reduce((max, item) => Math.max(max, item.score || 0), 0);
    return `<div class="collection-card ${entries.length ? "unlocked" : "locked"}">
      <div><strong>${entries.length ? meta.title : "未记录结局"}</strong><span>${meta.tier}</span></div>
      <p>${entries.length ? escapeHtml(latest?.cause || latest?.deathReason || meta.hint) : meta.hint}</p>
      <b>${entries.length ? `${entries.length} 次 / 最高 ${best}` : "未收集"}</b>
    </div>`;
  }).join("");
}

function renderAchievementCollection(archive) {
  const unlocked = achievementIdsFromArchive(archive);
  return ACHIEVEMENTS.map((achievement) => {
    const open = unlocked.has(achievement.id);
    return `<div class="achievement-card ${open ? "unlocked" : "locked"}">
      <strong>${open ? achievement.title : "未解锁"}</strong>
      <span>${achievement.text}</span>
    </div>`;
  }).join("");
}

function formatMinutes(minutes) {
  const h = Math.floor(Math.max(0, minutes) / 60);
  const m = Math.max(0, minutes) % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

function labelStat(value) {
  if (value > 75) return "稳";
  if (value > 50) return "紧";
  if (value > 25) return "险";
  return "崩";
}

function updateAudioButton(running) {
  refs.audioButton.classList.remove("unavailable");
  refs.audioButton.classList.toggle("active", running);
  refs.audioButton.title = running ? "关闭音效与配音" : "开启音效与配音";
  refs.audioButton.setAttribute("aria-label", running ? "关闭音效与配音" : "开启音效与配音");
  refs.audioButton.setAttribute("aria-pressed", String(running));
  refs.audioButton.removeAttribute("aria-disabled");
}

function markAudioUnavailable() {
  refs.audioButton.classList.remove("active");
  refs.audioButton.classList.add("unavailable");
  refs.audioButton.title = "当前浏览器不支持音效";
  refs.audioButton.setAttribute("aria-label", "当前浏览器不支持音效");
  refs.audioButton.setAttribute("aria-pressed", "false");
  refs.audioButton.setAttribute("aria-disabled", "true");
}

function showAudioPrompt() {
  if (refs.audioPromptModal && !ambient?.running) refs.audioPromptModal.hidden = false;
}

function closeAudioPrompt() {
  if (refs.audioPromptModal) refs.audioPromptModal.hidden = true;
}

async function enableAudioFromPrompt() {
  try {
    const audio = ensureAmbient();
    const running = audio.running ? true : await audio.toggle();
    updateAudioButton(running);
  } catch {
    markAudioUnavailable();
  } finally {
    closeAudioPrompt();
  }
}

refs.newLoopButton.addEventListener("click", startRun);
refs.clearEchoButton.addEventListener("click", () => {
  if (!confirm("清除本机所有痕迹档案？")) return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(ACTION_MEMORY_KEY);
  localStorage.removeItem(CLUE_READ_KEY);
  clueReadSegments = new Set();
  startRun();
});

refs.topMenuButton.addEventListener("click", () => {
  refs.topMenuPanel.hidden = !refs.topMenuPanel.hidden;
});

refs.audioButton.addEventListener("click", async () => {
  try {
    const running = await ensureAmbient().toggle();
    updateAudioButton(running);
  } catch {
    markAudioUnavailable();
  }
});

refs.enableAudioPromptButton.addEventListener("click", enableAudioFromPrompt);
refs.skipAudioPromptButton.addEventListener("click", closeAudioPrompt);

refs.loreButton.addEventListener("click", () => {
  refs.topMenuPanel.hidden = true;
  refs.loreModal.hidden = false;
});

refs.closeLoreButton.addEventListener("click", () => {
  refs.loreModal.hidden = true;
});

refs.closeSettlementButton.addEventListener("click", () => {
  refs.settlementModal.hidden = true;
});

refs.feedbackCloseButton.addEventListener("click", closeFeedback);

refs.clueButton.addEventListener("click", () => {
  openClueSystem();
});

refs.archiveButton.addEventListener("click", () => {
  renderArchiveModal("archive");
  refs.topMenuPanel.hidden = true;
  refs.archiveModal.hidden = false;
});

refs.closeArchiveButton.addEventListener("click", () => {
  refs.archiveModal.hidden = true;
});

let gameStarted = false;

function startGame() {
  refs.landingScreen.hidden = true;
  refs.app.hidden = false;
  if (!gameStarted) {
    gameStarted = true;
    startRun();
  }
}

function openClueSystem() {
  startGame();
  showCluePage();
}

function showCluePage() {
  startGame();
  closeAudioPrompt();
  refs.topMenuPanel.hidden = true;
  refs.archiveModal.hidden = true;
  refs.cluePage.hidden = false;
  renderCluePage();
}

function hideCluePage() {
  refs.cluePage.hidden = true;
}

refs.startGameButton.addEventListener("click", startGame);
refs.landingClueButton.addEventListener("click", openClueSystem);
refs.topClueButton.addEventListener("click", openClueSystem);

refs.loreModal.addEventListener("click", (event) => {
  if (event.target === refs.loreModal) refs.loreModal.hidden = true;
});

refs.archiveModal.addEventListener("click", (event) => {
  if (event.target === refs.archiveModal) refs.archiveModal.hidden = true;
});

document.addEventListener("click", (event) => {
  if (refs.topMenuPanel.hidden) return;
  if (refs.topMenuPanel.contains(event.target) || refs.topMenuButton.contains(event.target)) return;
  refs.topMenuPanel.hidden = true;
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (refs.cluePage && !refs.cluePage.hidden) {
      hideCluePage();
      return;
    }
    refs.loreModal.hidden = true;
    refs.settlementModal.hidden = true;
    refs.archiveModal.hidden = true;
    refs.topMenuPanel.hidden = true;
  }
});

showAudioPrompt();

if (new URLSearchParams(window.location.search).get("play") === "1") {
  startGame();
}
