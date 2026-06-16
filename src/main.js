const STORAGE_KEY = "witchkeni.fogharbor.runs.v2";
const START_MINUTES = 180;
const MAX_ECHOES = 24;
const MAX_BAG = 8;

if (new URLSearchParams(window.location.search).get("fresh") === "1") {
  localStorage.removeItem(STORAGE_KEY);
  window.history.replaceState(null, "", window.location.pathname);
}

const refs = {
  timerValue: document.querySelector("#timerValue"),
  loopValue: document.querySelector("#loopValue"),
  heatPanel: document.querySelector("#heatPanel"),
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
  audioButton: document.querySelector("#audioButton"),
  archiveButton: document.querySelector("#archiveButton"),
  archiveModal: document.querySelector("#archiveModal"),
  archiveModalContent: document.querySelector("#archiveModalContent"),
  closeArchiveButton: document.querySelector("#closeArchiveButton"),
  newLoopButton: document.querySelector("#newLoopButton"),
  clearEchoButton: document.querySelector("#clearEchoButton"),
  loreButton: document.querySelector("#loreButton"),
  loreModal: document.querySelector("#loreModal"),
  closeLoreButton: document.querySelector("#closeLoreButton"),
  settlementModal: document.querySelector("#settlementModal"),
  settlementContent: document.querySelector("#settlementContent"),
  closeSettlementButton: document.querySelector("#closeSettlementButton"),
  feedbackModal: document.querySelector("#feedbackModal"),
  feedbackContent: document.querySelector("#feedbackContent"),
  closeFeedbackButton: document.querySelector("#closeFeedbackButton")
};

const STATS = [
  { key: "body", name: "体力" },
  { key: "food", name: "补给" },
  { key: "mind", name: "意志" },
  { key: "cover", name: "隐蔽" }
];

const CHECK_STAT_BY_KIND = {
  aid: "mind",
  loot: "food",
  tech: "mind",
  risk: "body",
  signal: "mind",
  stealth: "cover",
  access: "cover",
  memory: "mind",
  ruthless: "body",
  route: "cover",
  shelter: "cover"
};

const ITEMS = {
  water: { name: "井水瓶", size: 1, tags: ["food"], text: "瓶口封着红纸，水里有淡淡香灰味。" },
  ration: { name: "供桌糕", size: 1, tags: ["food"], text: "压得很硬的米糕，背面沾着一粒香灰。" },
  med: { name: "白瓷药盒", size: 1, tags: ["heal"], text: "盒盖上贴着旧药铺的红签。" },
  battery: { name: "铜壳电池", size: 1, tags: ["tech"], text: "电池外壳被人刻过一道符线。" },
  crowbar: { name: "棺钉撬", size: 2, tags: ["force"], text: "撬棍尾端缠着褪色红绳。" },
  radio: { name: "戏台短波", size: 2, tags: ["signal"], text: "调频时会漏出几句锣鼓点。" },
  pass: { name: "旧厝门帖", size: 1, tags: ["access"], text: "半张门神贴，背面盖着避难层旧章。" },
  flare: { name: "朱砂信号棒", size: 1, tags: ["signal"], text: "亮起来像一炷倒着烧的香。" },
  coat: { name: "白布巡衣", size: 1, tags: ["cover"], text: "像雨衣，也像孝服。" },
  key: { name: "阴纹铜钥", size: 1, tags: ["access"], text: "齿纹像一行倒写的生辰八字。" },
  photo: { name: "褪色合照", size: 0, tags: ["memory"], text: "照片上总有一个位置看不清脸。" }
};

const RELICS = {
  route: { name: "门槛三道灰", text: "第一张路线牌成功率 +10%。" },
  shelter: { name: "灶后木楔", text: "开局隐蔽 +8。" },
  aid: { name: "白瓷药盒", text: "第一次受伤时少失去 8 体力。" },
  ruthless: { name: "冷掉的棺钉", text: "强硬选择成功率 +12%，但意志 -5。" },
  signal: { name: "戏台错拍", text: "信号类选择额外给 1 线索。" },
  memory: { name: "未烧完的纸钱", text: "每局多出现一个回声事件。" }
};

const MAP = [
  { id: "home", name: "筒子楼", tier: 0, kind: "start", links: ["clinic", "market", "lane"] },
  { id: "clinic", name: "白墙诊所", tier: 1, kind: "aid", links: ["overpass", "station"] },
  { id: "market", name: "雨棚鬼市", tier: 1, kind: "loot", links: ["overpass", "tunnel"] },
  { id: "lane", name: "后巷电房", tier: 1, kind: "tech", links: ["station", "tunnel"] },
  { id: "overpass", name: "雾桥", tier: 2, kind: "risk", links: ["checkpoint", "tunnel"] },
  { id: "station", name: "旧戏台站", tier: 2, kind: "signal", links: ["checkpoint", "reservoir"] },
  { id: "tunnel", name: "阴沟水道", tier: 2, kind: "stealth", links: ["reservoir", "checkpoint"] },
  { id: "checkpoint", name: "门神岗", tier: 3, kind: "access", links: ["shelter"] },
  { id: "reservoir", name: "黑水闸", tier: 3, kind: "memory", links: ["shelter"] },
  { id: "shelter", name: "地下避难层", tier: 4, kind: "final", links: [] }
];

const CARD_LIBRARY = {
  home: [
    card("pack_fast", "只拿急需品", "省时间，少带东西。", 12, "route", 92, {
      success: "你把井水瓶、供桌糕和那张褪色合照塞进包里，剩下的东西留给屋子自己吞掉。",
      fail: "你动作太快，背带被门把挂住。门后像有人轻轻笑了一声。",
      gain: { water: 1, photo: 1 },
      stats: { mind: -4 }
    }),
    card("listen_window", "听楼道回音", "判断哪边已经失控。", 16, "signal", 54, {
      success: "楼上有拖拽声，楼下有广播声。最奇怪的是三楼空房里传来一声木鱼。",
      fail: "你听得太久，楼道里的脚步停在你门口。猫眼外只有一片白。",
      clues: 1,
      stats: { cover: -4 }
    }),
    card("bar_door", "用门神贴封门", "让屋子成为未来的安全点。", 18, "shelter", 78, {
      success: "你把半张门神贴压在门缝上。红纸立刻发潮，像替你挡住了一口气。",
      fail: "门神贴粘反了。木头吱呀一声裂开，声音传出很远。",
      gain: { key: 1 },
      stats: { cover: 5, mind: -3 },
      flag: "home_cache"
    })
  ],
  clinic: [
    card("triage_room", "翻检分诊室", "找药，也可能撞见没走掉的人。", 20, "aid", 83, {
      success: "你在贴着儿童贴纸的柜子里找到白瓷药盒，还有一张写错农历日期的处方。",
      fail: "柜门刚开，帘后坐着的纸人倒向你。你把门关上时手背破了。",
      gain: { med: 1 },
      stats: { body: -7, mind: -4 }
    }),
    card("help_doctor", "扶起白大褂老人", "花时间救人，换一条内部路。", 24, "aid", 64, {
      success: "老人没问你的名字，只把半张旧厝门帖塞进你手里，说别坐第一排。",
      fail: "药柜倒下的声音引来巡检灯。老人一转身，白大褂下空荡荡的。",
      gain: { pass: 1 },
      clues: 1,
      stats: { mind: 4, cover: -8 },
      flag: "doctor_saved"
    }),
    card("take_oxygen", "推走供氧车", "强行突破下一段路。", 18, "ruthless", 42, {
      success: "推车很沉，但它撞开门时像一口移动的棺材。",
      fail: "你推得太急，氧气瓶砸在地上，整层楼都听见像哭一样的漏气声。",
      gain: { battery: 1 },
      stats: { mind: -9, cover: -7 },
      flag: "hard_choice"
    })
  ],
  market: [
    card("raid_stalls", "翻供桌摊位", "稳定补给，背包会变重。", 18, "loot", 88, {
      success: "塑料布下面有井水瓶和供桌糕。它们比任何承诺都真实，只是都凉得过分。",
      fail: "你找到食物，也碰倒一排空碗。碗沿自己朝门口转了一圈。",
      gain: { water: 1, ration: 2 },
      stats: { cover: -4 }
    }),
    card("trade_ring", "和无脸摊主换路牌", "用补给换一条捷径。", 16, "route", 57, {
      need: { ration: 1 },
      success: "摊主把地图撕成两半，只给你避开巡检的那一半。你没看清他的脸。",
      fail: "他收下供桌糕，却给了你一张写着你名字的旧路线。",
      spend: { ration: 1 },
      clues: 2,
      stats: { mind: -2 }
    }),
    card("grab_crowbar", "撬开纸扎箱", "拿到强力工具，制造噪声。", 20, "ruthless", 38, {
      success: "棺钉撬弯得刚好，像是为这座坏掉的城市准备的。",
      fail: "纸扎箱尖叫着裂开。街对面的灯和几张纸脸一起转向了你。",
      gain: { crowbar: 1 },
      stats: { cover: -8 }
    })
  ],
  lane: [
    card("reset_power", "重启配电箱", "用电池换开门机会。", 18, "tech", 68, {
      need: { battery: 1 },
      success: "整条巷子的门禁亮了一秒。够了，你记住了它们醒来的顺序。",
      fail: "火花烧掉了电池，门禁没有动。",
      spend: { battery: 1 },
      clues: 2,
      stats: { body: -4 }
    }),
    card("strip_uniform", "取下巡检外套", "提高隐蔽，降低意志。", 16, "stealth", 82, {
      success: "外套有雨味和消毒水味。穿上以后，你不太像自己了。",
      fail: "衣扣被血黏住。你花了太久才把它扯下来。",
      gain: { coat: 1 },
      stats: { cover: 9, mind: -6 }
    }),
    card("follow_cable", "沿电缆走", "发现一条通往地下的线。", 22, "route", 74, {
      success: "电缆从墙缝钻进地下。你在砖上刻了一个箭头。",
      fail: "电缆尽头是死路，但墙上的刻痕不像第一次出现。",
      clues: 1,
      flag: "basement_hint",
      stats: { mind: -3 }
    })
  ],
  overpass: [
    card("cross_fog", "穿过雾桥", "快，但容易暴露。", 18, "route", 46, {
      success: "雾像一块湿布盖住高架。你贴着护栏跑，正好错过探照灯。",
      fail: "桥下的灯抬起来，你只能翻过隔离带硬摔下去。",
      clues: 1,
      stats: { body: -10, cover: -8 }
    }),
    card("drop_pack", "丢下重物冲刺", "牺牲背包换生路。", 12, "ruthless", 74, {
      success: "你把最重的东西扔进雾里，身体突然变轻，心也空了一块。",
      fail: "你丢错了包层，真正重的东西还在肩上。",
      drop: 2,
      stats: { body: 4, mind: -6 }
    }),
    card("signal_bus", "点亮朱砂信号棒", "召来车，也召来别的东西。", 20, "signal", 35, {
      need: { flare: 1 },
      success: "一辆被遗弃的公交车闪了两下灯。车门打开，像一张刚醒来的嘴。",
      fail: "红光穿透雾，照亮的不只是公交车，还有车窗里坐满的白影。",
      spend: { flare: 1 },
      clues: 2,
      stats: { cover: -10 }
    })
  ],
  station: [
    card("tune_radio", "调准戏台短波", "听避难层开门节奏。", 18, "signal", 52, {
      need: { radio: 1 },
      success: "短波里有三段敲击，两长一短。那不是求救，是戏台锣鼓给门禁打的拍子。",
      fail: "频道里只有潮水声，像有人贴着水下唱戏。",
      clues: 3,
      stats: { mind: -3 }
    }),
    card("search_lockers", "搜站台储物柜", "随机补给和钥匙。", 20, "loot", 71, {
      success: "储物柜里有井水瓶、旧票根和一把不该在这里的阴纹铜钥。",
      fail: "你打开的是空柜，里面只有一面小镜子和一张陌生人的脸。",
      gain: { water: 1, key: 1 },
      stats: { mind: -5 }
    }),
    card("hide_train", "躲进停运车厢", "恢复意志，拖慢路线。", 24, "shelter", 86, {
      success: "车厢里暗得刚刚好。你靠着塑料座椅坐下，终于听见自己的心跳。",
      fail: "你睡得太沉，醒来时广播已经换了一轮。",
      stats: { mind: 14, food: -5 }
    })
  ],
  tunnel: [
    card("wade_water", "趟过排水渠", "低调，但伤身体。", 22, "stealth", 80, {
      success: "水没到膝盖。你咬着牙走完，鞋里灌满了雾港的冷。",
      fail: "水下有什么东西绊住你。你挣脱时撞破了小腿。",
      clues: 1,
      stats: { body: -9, cover: 5 }
    }),
    card("open_grate", "撬开铁栅", "需要棺钉撬，直通深层。", 16, "route", 88, {
      need: { crowbar: 1 },
      success: "铁栅呻吟着让开。后面不是出口，是更深处的风。",
      fail: "撬棍打滑，铁锈割开掌心。",
      clues: 2,
      stats: { body: -3 },
      flag: "tunnel_open"
    }),
    card("share_water", "分水给迷路的人", "少一点补给，多一个引路人。", 18, "aid", 63, {
      need: { water: 1 },
      success: "他喝完水后没有跟你走，只把墙上真正的箭头擦亮给你看。",
      fail: "他抢过水就跑，你只看见他背后的号码布。",
      spend: { water: 1 },
      clues: 2,
      stats: { mind: 5 },
      flag: "helped_runner"
    })
  ],
  checkpoint: [
    card("show_pass", "贴出旧厝门帖", "最稳的正面过关。", 16, "access", 81, {
      need: { pass: 1 },
      success: "巡检员看了你一眼，又看了门帖一眼。他太累了，没有看第三眼。",
      fail: "门帖上的章慢慢渗红。你只好在警报响起前钻进侧门。",
      clues: 2,
      stats: { cover: -4 }
    }),
    card("blend_patrol", "混进巡检队", "需要白布巡衣，风险高，收益大。", 18, "stealth", 48, {
      need: { coat: 1 },
      success: "队伍没有人说话。你也不说话，于是你成了他们的一部分。",
      fail: "有人问你的编号。你迟疑了半秒，足够暴露。",
      clues: 3,
      stats: { mind: -8, cover: -10 }
    }),
    card("force_gate", "硬闯闸机", "最后的暴力捷径。", 14, "ruthless", 29, {
      success: "你用肩膀撞开闸机，身后警报像一场迟到的雨。",
      fail: "闸机咬住背包，警报和疼痛同时抵达。",
      clues: 1,
      stats: { body: -14, cover: -14 }
    })
  ],
  reservoir: [
    card("read_scratches", "读墙上刻痕", "过去的自己走过这里。", 14, "memory", 69, {
      success: "刻痕不是地图，是犹豫的顺序。你按它们停顿，门在第三次停顿后响了一声。",
      fail: "你读懂得太晚，水闸已经开始放水。水面漂来一张写着你名的纸钱。",
      clues: 2,
      stats: { mind: -4 },
      flag: "read_echo_marks"
    }),
    card("lower_water", "降下水闸", "需要阴纹铜钥，换一条湿路。", 20, "tech", 55, {
      need: { key: 1 },
      success: "闸门缓缓下沉，露出一条写满白色盐线的通道。",
      fail: "钥匙能转，但转得太慢。水声先一步追上来。",
      clues: 2,
      stats: { body: -6 },
      flag: "water_lowered"
    }),
    card("leave_cache", "留下供品标记", "牺牲现在，强化以后。", 15, "memory", 91, {
      success: "你把一包食物藏进消防箱，又在下面划了三道短线。",
      fail: "你藏得不够好，但至少下一次会知道这里危险。",
      spendAny: 1,
      stats: { mind: 4 },
      flag: "left_cache"
    })
  ],
  shelter: [
    card("knock_pattern", "敲出门禁节拍", "线索越多越稳。", 12, "final", 44, {
      success: "两长一短。门后的机械声像一只终于醒来的肺。",
      fail: "你敲错了一次。门没有开，墙上的灯开始变红。",
      stats: { mind: -8 }
    }),
    card("offer_supplies", "交出入层供品", "用补给换名额。", 12, "final", 67, {
      need: { ration: 1, water: 1 },
      success: "门缝里伸出一只手。它拿走物资，也把你拉进了光里。",
      fail: "里面的人说名额满了。你听出他们在撒谎。",
      spend: { ration: 1, water: 1 },
      stats: { mind: -6 }
    }),
    card("carry_someone", "带一个人进去", "如果你此前救过人，会改变结局。", 14, "aid", 39, {
      success: "你不是一个人抵达门口。门开时，里面的人先看见了你背后的人。",
      fail: "你们慢了一步。门开了，又在你们面前合上。",
      stats: { body: -8, mind: 6 },
      flag: "carried_survivor"
    })
  ]
};

let state = null;
let ambient = null;

function card(id, label, detail, cost, kind, chance, data) {
  return { id, label, detail, cost, kind, chance, ...data };
}

class AmbientBgm {
  constructor() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
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

  async toggle() {
    if (this.ctx.state === "suspended") await this.ctx.resume();
    this.running = !this.running;
    this.master.gain.setTargetAtTime(this.running ? 0.42 : 0, this.ctx.currentTime, 0.8);
    if (this.running) this.tick();
    return this.running;
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
  const archive = loadArchive();
  const seed = Date.now() % 2147483647;
  const rng = mulberry32(seed);
  const activeEcho = archive.length ? pick(archive.slice(-6), rng) : null;
  const relics = deriveRelics(archive);

  state = {
    id: randomId(),
    seed,
    rng,
    archive,
    activeEcho,
    cycle: archive.length + 1,
    relics,
    node: "home",
    available: ["home"],
    visited: [],
    minutes: START_MINUTES,
    stats: {
      body: 88,
      food: 72,
      mind: 78,
      cover: 76
    },
    bag: {},
    clues: 0,
    heat: 0,
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
  addItem("water", 1, true);
  addItem("ration", 1, true);
  addLog("开局", "三小时后封控清洗。目标：赶到地下避难层。");
  generateCards();
  render();
}

function openingText(echo, relics) {
  const base =
    "上午九点，雾港东区的喇叭第一次说出“封控清洗”。楼道里的红灯亮了三下，像有人在门外点香。\n\n" +
    "不是逃出城市，而是在三小时内抵达地下避难层。你需要路线、入层凭据、补给，以及一点别被旧城认出来的判断。";
  if (!echo) return base;
  const relicLine = relics.length ? `\n\n你还带着上一些路线留下的痕迹：${relics.map((id) => RELICS[id].name).join("、")}。` : "";
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
  if (state.relics.includes("shelter")) state.stats.cover += 8;
  if (state.relics.includes("ruthless")) state.stats.mind -= 5;
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
  const order = ["photo", "ration", "water", "battery", "med", "flare", "coat", "key", "radio", "crowbar", "pass"];
  const removed = [];
  for (const id of order) {
    while (removed.length < count && hasItem(id)) {
      removeItem(id);
      removed.push(ITEMS[id].name);
    }
    if (removed.length >= count) break;
  }
  return removed;
}

function stat(key, delta) {
  state.stats[key] = clamp((state.stats[key] || 0) + delta, 0, 100);
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

function generateCards() {
  const pool = CARD_LIBRARY[state.node] || [];
  const seen = new Set(state.choices.filter((choice) => choice.node === state.node).map((choice) => choice.card));
  const fresh = pool.filter((entry) => !seen.has(entry.id));
  state.cards = shuffle(fresh, state.rng).slice(0, 3);
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

function effectiveChance(cardData) {
  let chance = cardData.chance;
  const checkKey = checkStatFor(cardData);
  if (checkKey) chance += Math.round((state.stats[checkKey] - 60) / 4);
  if (state.relics.includes("route") && state.choices.length === 0) chance += 10;
  if (state.relics.includes("ruthless") && cardData.kind === "ruthless") chance += 12;
  if (cardData.kind === "stealth" && hasTag("cover")) chance += 10;
  if (cardData.kind === "signal" && hasTag("signal")) chance += 10;
  if (cardData.kind === "access" && hasTag("access")) chance += 12;
  if (cardData.kind === "route" && state.clues >= 3) chance += 8;
  chance += Math.min(12, state.clues * 2);
  chance -= Math.max(0, state.heat - 10);
  chance -= state.stats.cover < 35 ? 8 : 0;
  chance -= state.stats.mind < 30 ? 8 : 0;
  return clamp(Math.round(chance), 12, 96);
}

function checkStatFor(action) {
  if (!action?.chance) return null;
  return action.check || CHECK_STAT_BY_KIND[action.kind] || "mind";
}

function statName(key) {
  return STATS.find((entry) => entry.key === key)?.name || "";
}

function canPlay(cardData) {
  if (!cardData.need) return true;
  return Object.entries(cardData.need).every(([id, count]) => hasItem(id, count));
}

function playCard(cardData) {
  if (state.ended || !canPlay(cardData)) return;
  const before = snapshot();
  const chance = effectiveChance(cardData);
  const roll = Math.floor(state.rng() * 100) + 1;
  const success = roll <= chance;
  const text = success ? cardData.success : cardData.fail;

  spendCost(cardData);
  applyCard(cardData, success);
  advanceTime(cardData.cost, cardData.kind);

  const result = summarize(before, cardData, success, chance, roll, text);
  state.last = result;
  state.feedback = buildFeedback(cardData, result);
  state.story = `${text}\n\n${result.summary}`;
  state.choices.push({ card: cardData.id, node: state.node, kind: cardData.kind, success });
  state.cards = state.cards.filter((entry) => entry.id !== cardData.id);
  if (!remainingCardsForNode(state.node).length) state.exhaustedNodes.add(state.node);
  state.nodeResolved = true;
  state.phase = state.node === "shelter" ? "event" : "ready";
  addLog(success ? "成功" : "失手", `${cardData.label}。${result.summary}`);

  if (depletedStat()) {
    endRun("depleted");
  } else if (state.minutes <= 0) {
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
  if (state.feedback && !state.ended) showFeedback();
}

function spendCost(cardData) {
  if (cardData.spend) {
    Object.entries(cardData.spend).forEach(([id, count]) => removeItem(id, count));
  }
  if (cardData.spendAny) {
    removeAnyItem(cardData.spendAny);
  }
}

function applyCard(cardData, success) {
  const baseStats = { ...(cardData.stats || {}) };
  Object.entries(baseStats).forEach(([key, delta]) => stat(key, success ? delta : Math.min(delta, -Math.abs(delta || 5))));

  if (success) {
    if (cardData.gain) Object.entries(cardData.gain).forEach(([id, count]) => addItem(id, count));
    if (cardData.clues) state.clues += cardData.clues + (state.relics.includes("signal") && cardData.kind === "signal" ? 1 : 0);
    if (cardData.flag) setFlag(cardData.flag);
  } else {
    state.heat += cardData.kind === "ruthless" ? 5 : 3;
    if (cardData.drop) removeAnyItem(cardData.drop);
  }

  if (state.relics.includes("aid") && !state.echoUsedAid && state.stats.body < 55) {
    state.echoUsedAid = true;
    stat("body", 8);
    addLog("痕迹", "李明的药盒替你省下一次处理伤口的时间。");
  }
}

function advanceTime(minutes, kind) {
  state.minutes = Math.max(0, state.minutes - minutes);
  stat("food", -(kind === "shelter" ? 3 : 5));
  stat("mind", -(kind === "memory" ? 2 : 4));
  if (state.stats.food < 18) stat("body", -5);
  if (state.stats.mind < 18) stat("cover", -4);
  state.heat = Math.max(0, state.heat - 1);
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
    home: "你回到筒子楼门口。对联只剩半幅，门槛灰里有三道脚印。",
    clinic: "白墙诊所门口挂着褪色红十字，输液架排在走廊里，像一排等人牵走的纸人。",
    market: "雨棚鬼市的塑料布被雾打湿。供桌糕摆在空摊上，第一排凳子没人坐。",
    lane: "后巷电房低低震动。墙上的电缆像黑线，通向几扇没有门牌的门。",
    overpass: "雾桥像一条露出水面的脊骨。桥下有水声，也有锣鼓点。",
    station: "旧戏台站的电子屏还亮着，台口垂着白布，广播夹着一句女声唱腔。",
    tunnel: "阴沟水道潮湿、狭窄，水面漂着莲灯。每一步都会被水记住。",
    checkpoint: "门神岗就在前面。灯、枪、扩音器，全都比人更清醒。",
    reservoir: "黑水闸背后有一阵风。墙上有旧刻痕，像有人把回家的路反着写了一遍。",
    shelter: "地下避难层的门就在眼前。它没有欢迎任何人的意思。"
  };
  return lines[node.id] || node.name;
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
  state.heat += 2;
  state.story = `你决定在${currentNode().name}多停一会儿。\n\n这会带来更多机会，也会让雾里的灯更容易找到你。`;
  addLog("停留", `继续处理${currentNode().name}，警觉+2。`);
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
    flags: new Set(state.flags)
  };
}

function summarize(before, cardData, success, chance, roll, text) {
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

  const clueDiff = state.clues - before.clues;
  if (clueDiff) statDiffs.push(`线索+${clueDiff}`);
  const heatDiff = state.heat - before.heat;
  if (heatDiff) statDiffs.push(`警觉${heatDiff > 0 ? "+" : ""}${heatDiff}`);

  const flags = [];
  state.flags.forEach((flag) => {
    if (!before.flags.has(flag)) flags.push(flag);
  });
  flags.slice(0, 2).forEach((flag) => statDiffs.push(flagLabel(flag)));

  const summary = [
    `${success ? "成功" : "失手"}：${roll}/${chance}`,
    `耗时 ${cardData.cost}m`,
    ...itemDiffs,
    ...statDiffs
  ].join(" / ");

  return { text, success, chance, roll, summary, itemDiffs, statDiffs };
}

function buildFeedback(cardData, result) {
  const checkKey = checkStatFor(cardData);
  const title = result.success ? "你稳住了" : "它注意到了你";
  const type = cardData.kind === "memory" || cardData.kind === "signal" || cardData.kind === "access" ? "征兆" : "道具";
  const rewardLine = result.itemDiffs.length ? result.itemDiffs.join(" / ") : "没有带走新的东西";
  const rewardDetail = itemDetailsFor(cardData);
  const changeLine = result.statDiffs.length ? result.statDiffs.join(" / ") : "状态暂时没有明显变化";
  return {
    title,
    tone: result.success ? "success" : "fail",
    cardLabel: cardData.label,
    body: result.text,
    meta: `${checkKey ? `${statName(checkKey)}检定` : "路线"}：${result.roll}/${result.chance}`,
    rewardLabel: type,
    rewardLine,
    rewardDetail,
    changeLine
  };
}

function itemDetailsFor(cardData) {
  const ids = Object.keys(cardData.gain || {});
  if (!ids.length) return "";
  return ids.map((id) => ITEMS[id]?.text).filter(Boolean).join(" ");
}

function flagLabel(flag) {
  const labels = {
    home_cache: "旧公寓成为安全点",
    doctor_saved: "医生欠你人情",
    hard_choice: "你更快，也更冷",
    basement_hint: "地下路线浮现",
    tunnel_open: "隧道铁栅已开",
    helped_runner: "迷路者记得你",
    read_echo_marks: "读懂墙上刻痕",
    water_lowered: "水路打开",
    left_cache: "留下补给痕迹",
    carried_survivor: "有人跟你抵达门口",
    heard_echo: "听见过去的提醒"
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
  const route = [...state.visited, state.node]
    .map((id) => nodeById(id)?.name)
    .filter(Boolean);
  const strongest = strongestStat();
  const weakest = weakestStat();

  return {
    grade: gradeFor(ending.score, ending.id),
    summary: `你走过 ${route.length} 个地点，处理 ${state.choices.length} 次事件，成功 ${successful} 次，失手 ${failed} 次。`,
    route: route.length ? route.join(" → ") : currentNode().name,
    resources: `体力 ${state.stats.body} / 补给 ${state.stats.food} / 意志 ${state.stats.mind} / 隐蔽 ${state.stats.cover}`,
    pressure: `线索 ${state.clues} / 警觉 ${state.heat} / 背包 ${bagLoad()} / ${MAX_BAG}`,
    highlight: reviewHighlight(ending, strongest, weakest),
    advice: nextAdvice(ending, weakest),
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
  if (endingId === "shelter" && score >= 330) return "评价 S / 入层稳定";
  if (endingId === "shelter") return "评价 A / 活着抵达";
  if (score >= 230) return "评价 B / 只差一段路";
  if (score >= 150) return "评价 C / 路线成形";
  return "评价 D / 留下痕迹";
}

function reviewHighlight(ending, strongest, weakest) {
  if (ending.id === "shelter") return "你把信息、时间和风险压到了门能打开的程度。";
  if (state.minutes <= 0) return "你看见了方向，但时间被零散决定吃掉了。";
  if (ending.id === "depleted") return `${weakest.name}归零让路线提前崩盘，下一次要给它留缓冲。`;
  if (state.stats.body <= 0) return "这条路最先耗尽的是身体，不是线索。";
  return `${strongest.name}撑住了路线，但${weakest.name}成为最明显的缺口。`;
}

function nextAdvice(ending, weakest) {
  if (ending.id === "shelter") return "下一次可以尝试带人入层，或用更低警觉抵达。";
  if (state.clues < 4) return "下一次优先找线索：短波、刻痕、通行证都会让终点更稳。";
  if (state.heat > 8) return "下一次少用强硬路线，警觉会压低后续成功率。";
  if (weakest.key === "food") return "下一次早点补给。补给低时，体力会被拖垮。";
  if (weakest.key === "cover") return "下一次保住隐蔽。巡检灯比雾更难甩开。";
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
    Object.keys(state.bag).length * 5;

  if (reason === "shelter") {
    const title = hasFlag("carried_survivor") ? "双人入层" : state.clues >= 6 ? "准点入层" : "擦边入层";
    return {
      id: "shelter",
      title,
      score: Math.max(0, Math.round(score + 80)),
      body:
        "地下门在最后一轮广播里打开。\n\n里面的光不温暖，但稳定。你把包放在脚边，第一次意识到自己还在呼吸。"
    };
  }
  if (reason === "collapse") {
    return {
      id: "collapse",
      title: "雾里倒下",
      score: Math.max(0, Math.round(score * 0.45)),
      body:
        "你没能走到门前。\n\n最后听见的是自己的包落地，里面的东西滚出来，像替你继续往前。"
    };
  }
  if (reason === "depleted") {
    const broken = depletedStat();
    return {
      id: "depleted",
      title: `${broken?.name || "某项能力"}耗尽`,
      score: Math.max(0, Math.round(score * 0.5)),
      body:
        `门还在前方，但${broken?.name || "某项能力"}先断了。\n\n雾没有追上来，房子也没有关门；只是你已经付不出下一次检定的代价。`
    };
  }
  if (reason === "timeout") {
    return {
      id: "timeout",
      title: "门在前方合上",
      score: Math.max(0, Math.round(score * 0.65)),
      body:
        "你看见了避难层方向的灯，也看见它们一盏盏熄灭。\n\n迟到不是死亡，但在雾港，迟到很像死亡。"
    };
  }
  return {
    id: "lost",
    title: "未完成路线",
    score: Math.max(0, Math.round(score)),
    body: "这条路线没有走完，但它在雾里留下了一道浅痕。"
  };
}

function makeEcho(ending) {
  const dominant = dominantKind();
  return {
    id: state.id,
    cycle: state.cycle,
    name: echoName(dominant, ending),
    ending: ending.title,
    score: ending.score,
    relic: relicFor(dominant, ending),
    note: noteFor(dominant, ending),
    createdAt: Date.now()
  };
}

function dominantKind() {
  const counts = {};
  state.choices.forEach((choice) => {
    counts[choice.kind] = (counts[choice.kind] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "route";
}

function relicFor(kind, ending) {
  if (ending.id === "shelter") return "route";
  if (kind === "aid") return "aid";
  if (kind === "shelter" || kind === "stealth") return "shelter";
  if (kind === "ruthless") return "ruthless";
  if (kind === "signal" || kind === "tech") return "signal";
  if (kind === "memory") return "memory";
  return "route";
}

function echoName(kind, ending) {
  if (ending.id === "shelter") return "入层者";
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
  if (ending.id === "shelter") return "不要只收集东西，收集能开门的理由。";
  if (kind === "aid") return "救人不是善良，是多一双手替你推门。";
  if (kind === "ruthless") return "快一点可以活，太快会忘记为什么活。";
  if (kind === "signal") return "短波里的两长一短，不是噪声。";
  if (kind === "memory") return "墙上的三道线，第三道总是转向左边。";
  return "雾最厚的时候，别走最亮的路。";
}

function getActions() {
  if (state.ended) {
    return [{
      label: "下一次循环",
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
    signal: "适合找避难层节拍",
    stealth: "低调路线，消耗身体",
    access: "接近封锁核心",
    memory: "过去痕迹更多",
    final: "尝试入层"
  };
  return details[target.kind] || "移动到下一处";
}

function render() {
  renderAtmosphere();
  renderStatus();
  renderBag();
  renderEcho();
  renderMap();
  renderStory();
  renderActions();
  renderLog();
  renderArchive();
}

function renderAtmosphere() {
  document.body.dataset.alert = heatLevel().tone;
  if (ambient?.running) ambient.setAlert(state.heat);
}

function renderStatus() {
  refs.timerValue.textContent = formatMinutes(state.minutes);
  refs.loopValue.textContent = `第 ${state.cycle} 次路线 / 线索 ${state.clues}`;
  refs.heatPanel.innerHTML = renderHeatPanel();
  refs.statsPanel.innerHTML = STATS.map(({ key, name }) => {
    const value = state.stats[key];
    const tone = value <= 25 ? "danger" : value <= 50 ? "warn" : "";
    const step = statStep(value);
    const cells = Array.from({ length: 8 }, (_, i) => {
      const spent = i < step;
      const current = i === step - 1;
      return `<span class="stat-cell ${spent ? "spent" : ""} ${current ? "current" : ""} ${spent ? tone : ""}"></span>`;
    }).join("");
    return `<div class="stat-row"><div class="stat-name">${name}</div><div class="stat-cells">${cells}</div><div class="stat-value">${step}</div></div>`;
  }).join("");
}

function renderHeatPanel() {
  const level = heatLevel();
  const cells = Array.from({ length: 10 }, (_, i) => {
    const active = i < Math.min(10, Math.ceil(state.heat / 2));
    return `<span class="heat-cell ${active ? "on" : ""} ${level.tone}"></span>`;
  }).join("");
  const penalty = Math.max(0, state.heat - 10);
  return `
    <div class="heat-head"><span>警觉 ${state.heat}</span><strong>${level.label}</strong></div>
    <div class="heat-cells">${cells}</div>
    <div class="heat-note">${penalty ? `检定-${penalty}` : "检定无惩罚"}</div>
  `;
}

function heatLevel() {
  if (state.heat >= 16) return { label: "合围", tone: "danger" };
  if (state.heat >= 11) return { label: "追踪", tone: "danger" };
  if (state.heat >= 6) return { label: "注视", tone: "warn" };
  return { label: "低声", tone: "calm" };
}

function statStep(value) {
  if (value <= 0) return 0;
  return clamp(Math.ceil(value / 12.5), 1, 8);
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
    return "三小时内抵达地下避难层。先处理眼前的事。";
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
  refs.storyText.textContent = state.story;
}

function renderActions() {
  refs.actionsPanel.innerHTML = getActions().map((action, index) => {
    const chance = action.chance ? `成功 ${effectiveChance(action)}%` : "路线";
    const actionCost = action.cost ? `耗时 ${action.cost}m / ${chance}` : chance;
    const checkKey = checkStatFor(action);
    const checkText = checkKey ? ` / 检定：${statName(checkKey)} ${statStep(state.stats[checkKey])}` : "";
    const heatText = actionHeatText(action);
    const need = action.need ? `需要：${Object.entries(action.need).map(([id, count]) => `${ITEMS[id].name}×${count}`).join("、")}` : "";
    return `<button class="action-button ${action.primary ? "primary" : ""} ${action.kind === "ruthless" ? "danger" : ""}" data-action="${index}" ${action.disabled ? "disabled" : ""} type="button">
      <span class="action-main">
        <span class="action-label">${action.label}</span>
        <span class="action-detail">${action.detail}${need ? ` / ${need}` : ""}${checkText}</span>
      </span>
      <span class="action-side">
        <span class="action-cost">${actionCost}</span>
        ${heatText ? `<span class="action-heat ${heatText.tone}">${heatText.label}</span>` : ""}
      </span>
    </button>`;
  }).join("");
  const actions = getActions();
  refs.actionsPanel.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => actions[Number(button.dataset.action)]?.onClick());
  });
}

function actionHeatText(action) {
  if (action.chance) {
    const failGain = action.kind === "ruthless" ? 5 : 3;
    const successText = state.heat > 0 ? "成-1" : "成0";
    return { label: `警觉 ${successText} / 失+${failGain - 1}`, tone: action.kind === "ruthless" ? "danger" : "warn" };
  }
  if (action.cost) return { label: state.heat > 0 ? "警觉 -1" : "警觉 0", tone: "cool" };
  if (action.label === "离开这里") return { label: "警觉 0", tone: "cool" };
  return null;
}

function renderSettlement() {
  const review = state.ending?.review;
  if (!review) return;
  refs.settlementContent.innerHTML = `
    <div class="settlement-hero">
      <div>
        <div class="settlement-grade">${review.grade}</div>
        <h3>${state.ending.title}</h3>
      </div>
      <div class="settlement-score">${state.ending.score}</div>
    </div>
    <p class="settlement-body">${state.ending.body}</p>
    <div class="settlement-grid">
      <div class="settlement-row"><span>本局概况</span><strong>${review.summary}</strong></div>
      <div class="settlement-row"><span>经过路线</span><strong>${review.route}</strong></div>
      <div class="settlement-row"><span>状态收束</span><strong>${review.resources}</strong></div>
      <div class="settlement-row"><span>压力记录</span><strong>${review.pressure}</strong></div>
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
        <span class="action-cost">新路线</span>
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
}

function renderFeedback() {
  const feedback = state.feedback;
  if (!feedback) return;
  refs.feedbackContent.innerHTML = `
    <div class="feedback-card ${feedback.tone}">
      <div class="feedback-kicker">${feedback.cardLabel}</div>
      <h3>${feedback.title}</h3>
      <p>${feedback.body}</p>
      <div class="feedback-grid">
        <div><span>${feedback.rewardLabel}</span><strong>${feedback.rewardLine}</strong></div>
        <div><span>变化</span><strong>${feedback.changeLine}</strong></div>
        <div><span>检定</span><strong>${feedback.meta}</strong></div>
      </div>
      ${feedback.rewardDetail ? `<p class="feedback-note">${feedback.rewardDetail}</p>` : ""}
      <button id="feedbackContinueButton" class="action-button primary" type="button">
        <span class="action-main">
          <span class="action-label">继续</span>
          <span class="action-detail">回到当前区域</span>
        </span>
        <span class="action-cost">确认</span>
      </button>
    </div>
  `;
  refs.feedbackContent.querySelector("#feedbackContinueButton").addEventListener("click", closeFeedback);
}

function closeFeedback() {
  refs.feedbackModal.hidden = true;
}

function renderLog() {
  const list = state.log.length ? state.log.map((entry) => {
    return `<div class="log-entry"><div class="log-time">${formatMinutes(START_MINUTES - entry.minutes)} / ${entry.title}</div><p class="log-text">${entry.text}</p></div>`;
  }).join("") : `<div class="empty-line">暂无记录</div>`;
  refs.runLog.innerHTML = `<h3>本局记录</h3><div class="log-list">${list}</div>`;
}

function renderArchive() {
  refs.archivePanel.innerHTML = "";
  renderArchiveModal();
}

function renderArchiveModal() {
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
    : `<div class="empty-line">还没有上一条路线</div>`;

  refs.archiveModalContent.innerHTML = `
    <section class="archive-modal-section">
      <div class="panel-heading"><h3>当前生效</h3><span class="item-meta">${state.relics.length}/3</span></div>
      ${echo}
      <div class="archive-detail-grid">${relics}</div>
    </section>
    <section class="archive-modal-section">
      <div class="panel-heading"><h3>历史痕迹</h3><span class="item-meta">${state.archive.length}</span></div>
      <div class="archive-history-list">${history}</div>
    </section>
  `;
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

refs.newLoopButton.addEventListener("click", startRun);
refs.clearEchoButton.addEventListener("click", () => {
  if (!confirm("清除本机所有痕迹档案？")) return;
  localStorage.removeItem(STORAGE_KEY);
  startRun();
});

refs.topMenuButton.addEventListener("click", () => {
  refs.topMenuPanel.hidden = !refs.topMenuPanel.hidden;
});

refs.audioButton.addEventListener("click", async () => {
  const running = await ensureAmbient().toggle();
  refs.audioButton.classList.toggle("active", running);
  refs.audioButton.textContent = running ? "关闭氛围音" : "开启氛围音";
});

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

refs.closeFeedbackButton.addEventListener("click", closeFeedback);

refs.archiveButton.addEventListener("click", () => {
  renderArchiveModal();
  refs.topMenuPanel.hidden = true;
  refs.archiveModal.hidden = false;
});

refs.closeArchiveButton.addEventListener("click", () => {
  refs.archiveModal.hidden = true;
});

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

refs.feedbackModal.addEventListener("click", (event) => {
  if (event.target === refs.feedbackModal) closeFeedback();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    refs.loreModal.hidden = true;
    refs.settlementModal.hidden = true;
    refs.archiveModal.hidden = true;
    refs.feedbackModal.hidden = true;
    refs.topMenuPanel.hidden = true;
  }
});

startRun();
