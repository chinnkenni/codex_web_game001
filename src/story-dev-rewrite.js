const STORAGE_KEY = "witchkeni.fogharbor.story-review.v3";

const ITEM_LABELS = {
  water: "井水瓶",
  ration: "供桌糕",
  med: "白瓷药盒",
  battery: "铜壳电池",
  crowbar: "棺钉撬",
  radio: "白塔短波",
  pass: "旧城令帖",
  flare: "朱砂信号棒",
  coat: "白塔隔离衣",
  key: "归位铜钥",
  photo: "壁画残照"
};

const FLAG_LABELS = {
  home_cache: "筒子楼归位标记",
  hard_choice: "你更快，也更冷",
  basement_hint: "内城线路浮现",
  tunnel_open: "内城暗渠打开",
  helped_runner: "旧卒证词",
  water_lowered: "王城水路打开",
  read_echo_marks: "王闸刻名读懂",
  left_cache: "将军石像记住你",
  doctor_saved: "旧医官被救下",
  king_memory: "旧王记忆",
  partner_break: "沈砚信任破裂",
  human_choice: "保住人的选择",
  weird_choice: "怪异正在抬头",
  general_oath: "大将军可被托付",
  perfect_choice: "王权已有新主"
};

const STARTING_ITEMS = { water: 1, ration: 1 };

const storyData = {
  pitch: {
    title: "三小时后，白塔局将弃城封锁；你要穿过旧城叠层，决定自己是王、人，还是怪异。",
    body:
      "雾港不是普通封城，而是「旧城回身」收容失败：外城、内城、死城三段古代城邦正在覆盖现代街区。主角以为自己是现实里无亲无故的孤儿，被前搭档沈砚用“壁画上有一张和你一模一样的脸”诱回雾港。\n\n真正的反转是：主角不是误入旧城，而是从旧城时空乱流坠入现世、化作婴儿的失职君王；他的本命怪异「归位」能让错位的人、建筑、时间和身份回到原处。沈砚清醒地献祭主角，是为了逼旧王归位、验证自己的「剖真」理论。",
    metrics: [
      ["单局时长", "15 分钟"],
      ["表层目标", "逃出雾港"],
      ["深层真相", "旧王归位"],
      ["终局包装", "王 / 人 / 怪异 / 隐藏完美"]
    ]
  },
  reviewAxes: [
    ["presence", "临场感", "旧城叠层是否有画面，玩家是否能感到现代雾港被古城吞没。"],
    ["agency", "选择压迫", "每次选择是否让玩家更接近逃生、归位或怪异化。"],
    ["motive", "动机清晰", "玩家是否理解为什么逃、为什么沈砚叫他回来、为什么自己特殊。"],
    ["aftertaste", "反转余味", "沈砚献祭、主角旧王身份和结局选择是否能留下回味。"],
    ["visual", "图文合拍", "事件回执插图是否能补足氛围，而不是抢走文案重点。"]
  ],
  worldRules: [
    {
      title: "本命怪异",
      text: "每个人一生只对应一种怪异。怪异需要强烈刺激才会觉醒，并会按照支配者的人性缺口成长。"
    },
    {
      title: "人性劣根",
      text: "怪异不是单方面腐蚀人。人的执念、嫉妒、控制欲、求证欲会滋养怪异，让它发生劣化。"
    },
    {
      title: "归位",
      text: "主角的本命怪异。它能让错位的人、城、时间、身份回到原处；也能危险地把“障碍”从世界上移开。"
    },
    {
      title: "剖真",
      text: "沈砚的本命怪异。疯狂科学家式求真欲喂大了它，让沈砚为了证明真相可以献祭主角。"
    }
  ],
  chapters: [
    {
      id: "wake",
      title: "童谣与断讯",
      time: "09:00",
      beat: "童谣先行，随后白塔局断讯确认旧城回身失控。沈砚壁画线索把玩家从“逃生者”拉进“被选中者”。",
      tags: ["弃城封锁", "壁画残照", "沈砚诱导"]
    },
    {
      id: "outer",
      title: "外城叠层",
      time: "09:20-10:05",
      beat: "诊所、鬼市、电房呈现现代街区与古代外城叠在一起。玩家开始发现自己的孤儿感不是心理问题，而是现实没有他的原位。",
      tags: ["外城", "局长捡婴", "旧王暗示"]
    },
    {
      id: "inner",
      title: "内城逼近",
      time: "10:05-10:55",
      beat: "雾桥、旧戏台、暗渠把玩家推向内城。沈砚的剖真记录暴露：他不是求救，而是在观察归位觉醒。",
      tags: ["内城", "剖真", "王座记忆"]
    },
    {
      id: "dead",
      title: "死城证词",
      time: "10:55-11:45",
      beat: "死城门禁和黑水王闸让玩家看见旧王离位后的屠城后果，并给出大将军托付路线。",
      tags: ["死城", "失职君王", "大将军"]
    },
    {
      id: "choice",
      title: "王、人、怪异",
      time: "11:45-12:00",
      beat: "内城密道既是出口也是王座下方。玩家选择归位为王、以人离城、怪异出城，或把王权托付大将军。",
      tags: ["终局抉择", "归位", "多结局"]
    }
  ],
  storySpine: [
    {
      stage: "诱回雾港",
      playerRead: "沈砚发来壁画线索，玩家以为自己只是回来查失踪家人与身世。",
      hiddenTruth: "沈砚已经确认壁画旧王与主角同脸，真正目的不是求救，而是把旧王放回旧城。",
      receiptCue: "筒子楼和白塔局回执要反复出现旧包、壁画残照、断讯和铜钥，让“被叫回来”变成可见证据。"
    },
    {
      stage: "确认必须逃",
      playerRead: "三小时后弃城封锁，表层目标是抵达内城密道并逃出雾港。",
      hiddenTruth: "封锁不是抓怪物，而是白塔局承认旧城回身无法继续压住；留下的人会被旧城归档。",
      receiptCue: "诊所、电房和雾桥插图要让现代设施被旧城吞掉，玩家一眼明白危险不是抽象规则。"
    },
    {
      stage: "外城认脸",
      playerRead: "外城叠层里的摊主、旧医官、旧卒开始对主角有异常反应。",
      hiddenTruth: "他们不是随机怪物，而是在用旧城身份系统识别失位旧王。",
      receiptCue: "雨棚鬼市、旧城令帖、死城门禁回执要把“认出你”放在画面中心，但不提前说破全部真相。"
    },
    {
      stage: "剖真露馅",
      playerRead: "沈砚的短波像线索，也像提醒，他似乎仍在帮玩家。",
      hiddenTruth: "沈砚体内的本命怪异「剖真」被求证欲喂坏，他用恐惧、失手和追逐刺激主角觉醒。",
      receiptCue: "旧戏台站和白塔局图像承担反转暗线：记录仪、短波、实验档案都要像证据，不像普通道具。"
    },
    {
      stage: "王位债务",
      playerRead: "黑水王闸和死城证词说明旧城为什么一直追着主角。",
      hiddenTruth: "旧王离位后旧城失守，归位不是单纯回家，而是重新承担王权造成的债。",
      receiptCue: "王闸和大将军回执要把责任压下来：水、刻名、石像、王印，比鬼脸更重要。"
    },
    {
      stage: "终局选择",
      playerRead: "内城密道是出口，玩家必须在王、人、怪异或托付之间做最终选择。",
      hiddenTruth: "真正考题不是能不能逃，而是主角用什么方式处理【归位】和旧城责任。",
      receiptCue: "内城密道插图必须同时可读为出口和王座，让四种结局都能从同一张图里成立。"
    }
  ],
  characters: [
    {
      role: "主角",
      name: "失位旧王",
      text: "表面是现实里的孤儿，实际是旧城君王从时空乱流坠入现世后的婴儿形态。因为本不属于现世，所以现实里没有亲缘、没有过去、没有归属感。"
    },
    {
      role: "前搭档",
      name: "沈砚",
      text: "疯狂科学家型调查者。本命怪异「剖真」被求真成瘾喂坏，他清醒地诱骗主角进雾港，用主角验证旧王归位理论。"
    },
    {
      role: "收容者",
      name: "白塔局局长",
      text: "当年在时空乱流边捡到婴儿主角，知道他拥有常人无法承受的怪异潜质，却隐瞒了完整身份。"
    },
    {
      role: "隐藏线",
      name: "旧城大将军",
      text: "死城里仍守着旧王命的旧臣。若玩家找到并托付王权，大将军能成为名正言顺的新君王。"
    }
  ],
  truths: [
    {
      title: "第一层：雾港必须逃",
      text: "白塔局收容失败，三小时后弃城封锁。留在城里的人会被隔离，也会被旧城叠层吞进过去。"
    },
    {
      title: "第二层：沈砚在诱导",
      text: "沈砚不是单纯求救者。他用壁画线索骗主角回来，是为了刺激主角觉醒本命怪异「归位」。"
    },
    {
      title: "第三层：主角是旧王",
      text: "主角并非现实孤儿，而是旧城失位君王。旧城因王离位而群龙无首，被异类入侵，最终回身吞噬现世。"
    },
    {
      title: "第四层：怪异由人喂坏",
      text: "怪异不是腐蚀人性的外物。沈砚的剖真被求证欲喂坏，主角的归位也可能因逃避、愤怒或责任而走向不同结局。"
    }
  ],
  nodes: [
    {
      id: "home",
      name: "筒子楼",
      act: "童谣与断讯",
      function: "开场动机、沈砚诱导、弃城封锁",
      sensory: "现代门牌和旧城王印叠在一起，白塔局警报被童谣盖住半句。",
      immersion: "第一屏必须让玩家明白：我被沈砚叫回雾港，三小时后城会被封死，而壁画上的旧王长着我的脸。",
      events: [
        {
          title: "翻沈砚旧包",
          type: "开场 / 线索",
          hook: "拿走断讯和壁画残照。",
          success: "旧包里有白塔局断讯、壁画残照和井水瓶。照片上的旧城君王和你有同一张脸。",
          fail: "短波自己亮了一下，沈砚的声音断断续续：别信我，快走。",
          note: "开场第一张牌要把沈砚、壁画、白塔局和逃生目标一次性挂上钩。",
          gain: { water: 1, photo: 1, radio: 1 },
          flags: ["king_memory"],
          score: 95
        },
        {
          title: "听弃城广播",
          type: "封锁 / 世界观",
          hook: "确认白塔局封锁进度。",
          success: "广播确认旧城回身收容失败，三小时后弃城封锁。外城已经叠到三楼。",
          fail: "猫眼里不是走廊，是一条挂满王旗的古街。",
          note: "统一使用“弃城封锁”，让危险一眼可懂。",
          flags: ["king_memory"],
          score: 91
        },
        {
          title: "按童谣封门",
          type: "童谣 / 归位",
          hook: "给安全屋留下归位标记。",
          success: "旧城令帖压进门缝，童谣浮出：旧王不归，满城无门。",
          fail: "木门裂出王印，像另一段时间按住你的手。",
          note: "童谣负责民间传说代入，王印负责旧王身份暗线。",
          gain: { key: 1 },
          flags: ["home_cache", "king_memory"],
          score: 94
        }
      ]
    },
    {
      id: "clinic",
      name: "白墙诊所",
      act: "外城叠层",
      function: "局长捡婴、身体边界、人的选择",
      sensory: "白塔药柜和旧城医署叠在一起，婴儿腕带被刮掉名字。",
      immersion: "这里把“主角为何没有家人”埋成白塔局旧档，不直接揭完。",
      events: [
        {
          title: "搜白塔药柜",
          type: "档案 / 医疗",
          hook: "找药，也找局长留下的收容记录。",
          success: "旧档显示局长曾在时空乱流边捡到一个婴儿，照片被烧掉半张。",
          fail: "纸人胸口贴着婴儿腕带，名字栏被刮成白。",
          note: "把孤儿感落成可调查证据。",
          gain: { med: 1 },
          score: 90
        },
        {
          title: "追问旧医官",
          type: "救助 / 通行",
          hook: "用白瓷药盒稳住知道病历的人。",
          success: "你把白瓷药盒推到旧医官手边。他给出旧城令帖，说王城密道只认旧臣和王印。",
          fail: "药盒碎在地上，他只留下一句：沈砚早知道你是谁。",
          note: "救助线对应“人”的结局倾向，也把药盒接到令帖上。",
          spend: { med: 1 },
          gain: { pass: 1 },
          flags: ["doctor_saved", "human_choice"],
          score: 92
        },
        {
          title: "拆收容供氧车",
          type: "强硬 / 剖真",
          hook: "取走设备，也暴露沈砚实验痕迹。",
          success: "供氧车里藏着铜壳电池、朱砂信号棒和沈砚实验签：刺激足够时，本命怪异会替人说真话。",
          fail: "短波里沈砚轻笑，像在记录你的反应。",
          note: "这里开始把沈砚从搭档转成观察者。",
          gain: { battery: 1, flare: 1 },
          flags: ["hard_choice", "partner_break"],
          score: 86
        }
      ]
    },
    {
      id: "market",
      name: "雨棚鬼市",
      act: "外城叠层",
      function: "外城历史、旧王壁画、补给交易",
      sensory: "塑料布后是青砖市井，供桌和摊位像为一座被屠外城摆着。",
      immersion: "鬼市负责讲外城百姓没有密道、旧王离位后外城先被牺牲。",
      events: [
        {
          title: "翻外城供摊",
          type: "补给 / 历史",
          hook: "补给是真，祭品也是真。",
          success: "井水瓶和供桌糕旁边压着白塔封条，像现代救援来得太迟。",
          fail: "空碗转向你，像等旧王给一个交代。",
          note: "把补给变成外城牺牲的余波。",
          gain: { water: 1, ration: 2 },
          score: 89
        },
        {
          title: "问壁画摊主",
          type: "身份 / 路线",
          hook: "用壁画残照和补给换旧王来历。",
          success: "摊主用壁画残照对上拓片，又收下供桌糕：旧王离城那夜，外城火起，王座空了三百年。",
          fail: "摊主把壁画残照按在摊布上，又收下供桌糕，却给出写着你名字的王榜。",
          note: "这是沈砚反转最明确的中段暗线，也让壁画残照成为身份钥匙。",
          need: { photo: 1 },
          spend: { ration: 1 },
          flags: ["king_memory"],
          score: 96
        },
        {
          title: "撬开纸扎王箱",
          type: "强硬 / 工具",
          hook: "拿到密道工具，制造噪声。",
          success: "棺钉撬和旧王密道提示一起出现：旧王若归，先开死门。",
          fail: "纸脸叫出你的旧王封号。",
          note: "强硬路线喂大怪异倾向。",
          gain: { crowbar: 1 },
          flags: ["partner_break"],
          score: 84
        }
      ]
    },
    {
      id: "lane",
      name: "后巷电房",
      act: "外城叠层",
      function: "白塔通信、局长暗线、归位线路",
      sensory: "电缆钻进青砖墙，像白塔局把现代钉在旧城上。",
      immersion: "技术线负责解释白塔局既保护主角，也把他作为收容对象。",
      events: [
        {
          title: "重启白塔节点",
          type: "通信 / 局长",
          hook: "用电池换短暂通信。",
          success: "局长录音响起：我捡到你那天，旧城的城门在婴儿哭声里合上。",
          fail: "屏幕只剩一行字：归位对象拒绝归位。",
          note: "局长捡婴暗线要在这里落第二锤。",
          need: { battery: 1 },
          spend: { battery: 1 },
          flags: ["king_memory"],
          score: 88
        },
        {
          title: "取下隔离衣",
          type: "隐蔽 / 收容",
          hook: "混入白塔巡线队。",
          success: "隔离衣扫过你的脸，没有报警，像白塔局早就认识你。",
          fail: "胸牌后的名字变成“旧王”。",
          note: "让玩家感到自己不是被救援的人，而是被记录的人。",
          gain: { coat: 1 },
          score: 90
        },
        {
          title: "沿归位线走",
          type: "路线 / 归位",
          hook: "发现通往内城的错位线路。",
          success: "你刻下箭头，指尖却自动写出旧城王印。",
          fail: "墙上已有你的刻痕，沈砚说：你终于开始记起来了。",
          note: "连接外城到内城，开始显性恢复记忆。",
          flags: ["basement_hint", "king_memory"],
          score: 91
        }
      ]
    },
    {
      id: "overpass",
      name: "雾桥",
      act: "内城逼近",
      function: "速度、暴露、现实远离",
      sensory: "高架和古代官道交替出现，桥外现实像被雾折走。",
      immersion: "这里从调查转逃亡，让玩家感到自己越跑越靠近过去。",
      events: [
        {
          title: "穿过外城雾桥",
          type: "路线 / 暴露",
          hook: "快，但容易暴露在叠层里。",
          success: "柏油和青石不断交换位置，你贴着护栏跑过两段时间。",
          fail: "远处有人喊王驾回城。",
          note: "动作场景负责提速。",
          score: 84
        },
        {
          title: "丢下重物冲刺",
          type: "强硬 / 牺牲",
          hook: "牺牲背包换生路。",
          success: "沈砚记录：求生欲开始压过归位本能。",
          fail: "真正重的东西不是物资，是越来越清晰的王座记忆。",
          note: "把资源损失和身份压力绑在一起。",
          drop: 2,
          score: 88
        },
        {
          title: "点亮朱砂信号棒",
          type: "信号 / 白塔",
          hook: "向白塔局暴露位置。",
          success: "白塔无人车闪灯，导航只剩一个目的地：内城密道。",
          fail: "车窗里坐满旧城臣民，无声等你判决。",
          note: "白塔局仍有工具，但不是温柔救援。",
          need: { flare: 1 },
          spend: { flare: 1 },
          score: 93
        }
      ]
    },
    {
      id: "station",
      name: "旧戏台站",
      act: "内城逼近",
      function: "沈砚剖真、童谣回收、王座记忆",
      sensory: "电子屏、白布戏台、短波和童谣咬在同一段频率里。",
      immersion: "旧戏台是沈砚反转的核心地点：他留下的不只是线索，是实验记录。",
      events: [
        {
          title: "调准白塔短波",
          type: "剖真 / 反转",
          hook: "用壁画残照校准沈砚留下的剖真记录。",
          success: "你把壁画残照贴近短波天线。沈砚承认：为了证明旧王存在，我必须把他带回王城。",
          fail: "潮水声里反复唱出你的旧王封号。",
          note: "这里正式暴露沈砚不是普通求救者。",
          need: { radio: 1, photo: 1 },
          flags: ["partner_break"],
          score: 98
        },
        {
          title: "搜站台储物柜",
          type: "钥匙 / 留言",
          hook: "找钥匙，也找沈砚第二封信。",
          success: "归位铜钥和沈砚票根同时出现：他不回来，旧城永远不会停。",
          fail: "镜子里坐着一个披王袍的陌生人。",
          note: "给密道钥匙，也继续推旧王身份。",
          gain: { water: 1, key: 1 },
          flags: ["king_memory"],
          score: 91
        },
        {
          title: "躲进王车残厢",
          type: "休整 / 记忆",
          hook: "恢复意志，拖慢路线。",
          success: "你听见旧臣喊你归位，也听见自己仍想活成一个人。",
          fail: "沈砚留言：睡眠让记忆松动，继续刺激。",
          note: "休整也要服务记忆恢复。",
          score: 87
        }
      ]
    },
    {
      id: "tunnel",
      name: "阴沟水道",
      act: "内城逼近",
      function: "密道支线、旧卒证词、大将军伏笔",
      sensory: "现代排水渠和旧城护城河叠在一起，莲灯漂向王城。",
      immersion: "水道把逃生路线从普通下水道升级为贵族密道支线。",
      events: [
        {
          title: "趟过黑水暗渠",
          type: "隐蔽 / 体力",
          hook: "低调，但伤身体。",
          success: "鞋里灌满雾港的冷，也灌满旧城护城河的腥味。",
          fail: "水面浮出一枚旧王玉佩。",
          note: "身体不适和旧王证物一起出现。",
          score: 88
        },
        {
          title: "撬开内城暗渠",
          type: "工具 / 密道",
          hook: "需要棺钉撬，直通更深的旧城。",
          success: "铁栅后是贵族逃亡时修下的密道支线。",
          fail: "血落在栅门上，门里有人喊陛下。",
          note: "第一次明确终点是旧城密道，目标是逃出雾港。",
          need: { crowbar: 1 },
          flags: ["tunnel_open"],
          score: 90
        },
        {
          title: "分水给旧卒",
          type: "救助 / 大将军",
          hook: "少一点补给，多一段旧城证词。",
          success: "旧卒擦亮箭头：将军未死，王位可托。",
          fail: "他抢水逃走，背后是死城守军编号。",
          note: "隐藏完美结局的早期入口。",
          need: { water: 1 },
          spend: { water: 1 },
          flags: ["helped_runner", "human_choice"],
          score: 95
        }
      ]
    },
    {
      id: "checkpoint",
      name: "死城门禁",
      act: "死城证词",
      function: "死城入口、白塔隔离、王身份审判",
      sensory: "白塔隔离灯和旧城死门重叠，所有出口都在判断你该不该离开。",
      immersion: "这里让玩家意识到自己不是普通逃生者，而是被死城和白塔共同审查的对象。",
      events: [
        {
          title: "出示旧城令帖",
          type: "凭据 / 王印",
          hook: "让死城门禁认出你。",
          success: "门禁换成古音：旧臣见王，开死门。",
          fail: "令帖渗红，背后有人跪下又站起。",
          note: "王印身份显性化。",
          need: { pass: 1 },
          flags: ["king_memory"],
          score: 92
        },
        {
          title: "混进隔离队",
          type: "伪装 / 白塔",
          hook: "需要白塔隔离衣，风险高，收益大。",
          success: "白塔队伍讨论是否处决沈砚，你第一次听见他被当成异常源。",
          fail: "屏幕弹出：归位对象，无权离城。",
          note: "沈砚和主角都被白塔视为收容对象。",
          need: { coat: 1 },
          flags: ["partner_break"],
          score: 89
        },
        {
          title: "硬闯死城门禁",
          type: "强硬 / 怪异",
          hook: "用棺钉撬制造最后的暴力捷径。",
          success: "棺钉撬卡进闸机齿轮，你的影子留在原地，戴着王冠。",
          fail: "撬棍卡死，沈砚说：很好，恐惧也会喂醒归位。",
          note: "怪异结局倾向的重要喂养点，也回收棺钉撬。",
          need: { crowbar: 1 },
          flags: ["partner_break", "weird_choice"],
          score: 86
        }
      ]
    },
    {
      id: "reservoir",
      name: "黑水王闸",
      act: "死城证词",
      function: "旧王记忆、归位钥匙、隐藏完美路线",
      sensory: "墙上刻着旧王离城顺序，也刻着外族入侵那夜的火线。",
      immersion: "这里把失职君王真相讲清：主角不是被害者那么简单。",
      events: [
        {
          title: "读王闸刻名",
          type: "记忆 / 失职",
          hook: "过去的王名写在水闸背后。",
          success: "刻痕不是地图，是你当年离城的顺序。旧王记忆回到身体里。",
          fail: "水面漂来一张写着王名的纸钱。",
          note: "三段记忆的第三段，必须击中失职感。",
          flags: ["read_echo_marks", "king_memory"],
          score: 98
        },
        {
          title: "转动归位铜钥",
          type: "钥匙 / 王座",
          hook: "需要归位铜钥，打开王城水路。",
          success: "盐线通道尽头不是出口，是王座方向。",
          fail: "旧城把你的名字卷回族谱。",
          note: "让玩家知道逃出去和归位不是同一件事。",
          need: { key: 1 },
          flags: ["water_lowered"],
          score: 90
        },
        {
          title: "唤醒旧城大将军",
          type: "隐藏 / 托付",
          hook: "用供桌糕和王城水路换一个替你守城的人。",
          success: "你把供桌糕和王印刻痕留在将军石像前。石像裂开一线：若王不愿归位，臣可代守。",
          fail: "供品摆得太晚，但石像仍然转过半张脸，记住你的迟疑。",
          note: "隐藏完美结局条件；必须先打开王城水路，再用明确供品唤醒大将军。",
          needFlags: ["water_lowered"],
          spend: { ration: 1 },
          flags: ["left_cache", "general_oath"],
          score: 97
        }
      ]
    },
    {
      id: "shelter",
      name: "内城密道",
      act: "王、人、怪异",
      function: "终局抉择、身份结算、多结局",
      sensory: "密道既通向城外，也通向王座下方。沈砚拿着记录仪在那里等你。",
      immersion: "终点不是安全屋，而是身份选择：你要以什么东西活下去。",
      events: [
        {
          title: "归位王座",
          type: "王 / 责任",
          hook: "带着归位铜钥留下来，承担旧城君王的责任。",
          success: "你把归位铜钥按进王座残纹。归位怪异完整服从你，旧城停止回身，现实雾港开始复原。",
          fail: "王座认出你的逃意，死城灯火亮起。",
          note: "王结局：救现世，但主角留在旧城。",
          need: { key: 1 },
          flags: ["king_memory"],
          score: 94
        },
        {
          title: "说服沈砚同行",
          type: "人 / 现世",
          hook: "拒绝王位，以人的身份逃离。",
          success: "你告诉沈砚：我已经觉醒，但我不想伤害你。旧城是过去式，我要守护现世。",
          fail: "沈砚只想要实验结论。",
          note: "人结局：核心是能力觉醒但拒绝王位。",
          needFlags: ["human_choice"],
          flags: ["human_choice"],
          score: 96
        },
        {
          title: "斩断剖真",
          type: "怪异 / 决裂",
          hook: "让沈砚闭嘴，也让怪异替你开路。",
          success: "沈砚的短波静了，密道为你打开。",
          fail: "剖真怪异从他影子里张开。",
          note: "怪异结局：主角逃出，但归位开始学会移除人。",
          needFlags: ["partner_break"],
          flags: ["weird_choice", "partner_break"],
          score: 91
        },
        {
          title: "托付大将军",
          type: "隐藏完美 / 王权",
          hook: "把王权归位给旧城大将军。",
          success: "大将军接过王印，旧城有了新主，现世不必再献出旧王。",
          fail: "死城怨声压回石壳，你还没有足够理由离开。",
          note: "隐藏完美：世界恢复平静，留下第二季尾巴。",
          need: { key: 1 },
          needFlags: ["water_lowered", "general_oath"],
          flags: ["perfect_choice"],
          score: 99
        }
      ]
    }
  ],
  endingRouteRules: {
    summary:
      "终局不是只看最后点了哪个按钮，而是按旗标优先级结算：王权托付 > 怪异出城 > 以人离城 > 旧王归位。审批时要按这个顺序测试覆盖关系。",
    priorities: [
      ["1", "王权托付", "perfect_choice", "托付大将军成功后，优先覆盖其他倾向。"],
      ["2", "怪异出城", "weird_choice", "出现怪异旗标时，会覆盖人线和王线。"],
      ["3", "以人离城", "human_choice", "有人性选择旗标且没有更高优先级时结算。"],
      ["4", "旧王归位", "默认归位", "抵达密道且没有上述旗标时结算。"]
    ]
  },
  endingRoutes: [
    {
      id: "perfect",
      title: "王权托付",
      tier: "隐藏完美",
      testGoal: "验证玩家能发现第三条路：不坐王座，也不让旧城继续失控。",
      finalTrigger: "内城密道 / 托付大将军 成功",
      successCondition: "必须先在黑水王闸拿到 general_oath，再成功托付大将军。",
      path: [
        { nodeId: "home", choice: "按童谣封门", effect: "拿归位铜钥，确认旧王暗线" },
        { nodeId: "market", choice: "翻外城供摊", effect: "补足供桌糕，准备唤醒将军的供品" },
        { nodeId: "tunnel", choice: "分水给旧卒", effect: "提前听见王位可托的大将军伏笔" },
        { nodeId: "reservoir", choice: "转动归位铜钥", effect: "打开王城水路，获得 water_lowered" },
        { nodeId: "reservoir", choice: "唤醒旧城大将军", effect: "消耗供桌糕，获得 general_oath" },
        { nodeId: "shelter", choice: "托付大将军", effect: "用铜钥和将军誓约触发最高优先级" }
      ],
      must: ["general_oath", "perfect_choice", "玩家看见旧城仍需要一个守城者"],
      avoid: ["漏掉黑水王闸会导致终局按钮被锁", "不要让大将军只像临时解法，前文必须有旧卒和石像伏笔"],
      approval: ["大将军出现是否足够早", "托付王权是否像选择，不像逃避责任", "第二季尾巴是否克制"],
      risks: ["如果只在终局突然出现大将军，隐藏完美会显得机械。", "如果王权托付覆盖所有倾向没有说明，测试会误判结局。"]
    },
    {
      id: "human",
      title: "以人离城",
      tier: "主线结局",
      testGoal: "验证玩家能在旧王身份成立后，仍然用人的方式离开雾港。",
      finalTrigger: "内城密道 / 说服沈砚同行 成功",
      successCondition: "需要 human_choice，且不能已有 weird_choice 或 perfect_choice。",
      path: [
        { nodeId: "home", choice: "翻沈砚旧包", effect: "拿壁画残照，建立被骗回来的动机" },
        { nodeId: "clinic", choice: "搜白塔药柜", effect: "拿到白瓷药盒和局长捡婴档案" },
        { nodeId: "clinic", choice: "追问旧医官", effect: "消耗药盒救助，获得令帖和 human_choice" },
        { nodeId: "station", choice: "调准白塔短波", effect: "确认沈砚不是单纯求救" },
        { nodeId: "checkpoint", choice: "出示旧城令帖", effect: "用旧医官给的令帖通过死城门禁" },
        { nodeId: "shelter", choice: "说服沈砚同行", effect: "用人的选择压过王位诱惑" }
      ],
      must: ["human_choice", "沈砚反转暗线", "主角明确拒绝把人当障碍"],
      avoid: ["不要成功硬闯死城门禁", "不要成功斩断剖真", "不要完成托付大将军"],
      approval: ["说服沈砚是否有前置情感依据", "主角拒绝王位是否清楚", "归位能力是否被保留为守护现世的能力"],
      risks: ["只要提前拿到 weird_choice，终局会被怪异线覆盖。", "如果没有沈砚反转铺垫，说服会像突然洗白。"]
    },
    {
      id: "king",
      title: "旧王归位",
      tier: "主线结局",
      testGoal: "验证玩家能理解归位不是回家，而是承担失职君王的债。",
      finalTrigger: "内城密道 / 归位王座 成功",
      successCondition: "抵达密道并成功归位王座，同时没有 human_choice、weird_choice、perfect_choice。",
      path: [
        { nodeId: "home", choice: "翻沈砚旧包", effect: "拿壁画残照，建立旧王同脸证据" },
        { nodeId: "home", choice: "按童谣封门", effect: "拿归位铜钥，确认门槛会认你" },
        { nodeId: "market", choice: "问壁画摊主", effect: "用壁画残照和供桌糕确认旧王离城" },
        { nodeId: "tunnel", choice: "趟过黑水暗渠", effect: "沿鬼市后的暗渠进入内城水路" },
        { nodeId: "reservoir", choice: "读王闸刻名", effect: "补足旧王失职记忆" },
        { nodeId: "shelter", choice: "归位王座", effect: "用归位铜钥触发旧王归位" }
      ],
      must: ["king_memory", "旧王失职证据", "王座责任"],
      avoid: ["不要走救助线拿 human_choice", "不要走硬闯/斩断拿 weird_choice", "不要完成托付大将军"],
      approval: ["玩家是否明白自己为什么被旧城追", "坐上王座是否像承担责任", "牺牲是否足够明确"],
      risks: ["王线是默认兜底，后台必须提醒测试者避开人线和怪异线旗标。", "如果只讲身份不讲失职，归位会像奖励而不是代价。"]
    },
    {
      id: "weird",
      title: "怪异出城",
      tier: "偏离结局",
      testGoal: "验证强硬选择如何喂大归位，让主角把人当成可移除的障碍。",
      finalTrigger: "内城密道 / 斩断剖真 成功，或提前拿到 weird_choice 后抵达密道",
      successCondition: "获得 weird_choice，且没有 perfect_choice。",
      path: [
        { nodeId: "home", choice: "听弃城广播", effect: "确认时间压力，直接出门" },
        { nodeId: "market", choice: "撬开纸扎王箱", effect: "强硬取工具，继续喂大怪异倾向" },
        { nodeId: "overpass", choice: "穿过外城雾桥", effect: "快速冲向死城门禁" },
        { nodeId: "checkpoint", choice: "硬闯死城门禁", effect: "用棺钉撬获得 weird_choice" },
        { nodeId: "shelter", choice: "斩断剖真", effect: "主角与沈砚彻底决裂" }
      ],
      must: ["weird_choice", "partner_break", "强硬选择的收益和代价都可见"],
      avoid: ["不要完成托付大将军", "不要让怪异线只像坏结局惩罚"],
      approval: ["玩家是否知道自己为什么变冷", "沈砚被斩断是否是长期决裂结果", "归位从修正变成抹除是否清楚"],
      risks: ["怪异线优先级高于人线，测试人线时必须避开硬闯和斩断。", "如果强硬选择只给收益不给心理代价，怪异结局会失去说服力。"]
    },
  ],
  endings: [
    {
      title: "旧王归位",
      text: "主角留下，重新成为旧城君王。旧城停止吞噬雾港，现实恢复平静，但密道从他身后合拢。",
      tags: ["王", "责任", "牺牲"]
    },
    {
      title: "以人离城",
      text: "主角拒绝王位，说服沈砚一起逃离。他承认归位已经觉醒，但选择把能力用于守护现世。",
      tags: ["人", "现世", "说服沈砚"]
    },
    {
      title: "怪异出城",
      text: "主角与沈砚决裂，杀死或吞噬沈砚后逃离。旧城危机暂时压下，但归位怪异学会了移除人。",
      tags: ["怪异", "决裂", "危险胜利"]
    },
    {
      title: "王权托付",
      text: "隐藏完美路线。主角找到旧城大将军并托付王权，大将军名正言顺接过旧城，现世回归平静。",
      tags: ["隐藏完美", "大将军", "第二季尾巴"]
    },
    {
      title: "弃城封锁完成",
      text: "时间耗尽，城外隔离线合拢。主角没有逃出雾港，也没有归位旧城，只能成为下一轮痕迹。",
      tags: ["失败", "时间压力", "再来一局"]
    },
    {
      title: "能力耗尽",
      text: "路线还没有走完，某项能力先被耗空。玩家不是被旧城直接杀死，而是已经付不出下一次选择的代价。",
      tags: ["失败", "属性代价", "复盘入口"]
    }
  ]
};

normalizeStoryData();

const refs = {
  approvalView: document.querySelector("#approvalView"),
  libraryView: document.querySelector("#libraryView"),
  viewButtons: document.querySelectorAll("[data-view]"),
  endingPicker: document.querySelector("#endingPicker"),
  endingPriorityStrip: document.querySelector("#endingPriorityStrip"),
  selectedEndingPanel: document.querySelector("#selectedEndingPanel"),
  nav: document.querySelector("#storyNav"),
  pitchTitle: document.querySelector("#pitchTitle"),
  pitchBody: document.querySelector("#pitchBody"),
  coreMetrics: document.querySelector("#coreMetrics"),
  reviewSliders: document.querySelector("#reviewSliders"),
  reviewScoreLabel: document.querySelector("#reviewScoreLabel"),
  globalReviewNote: document.querySelector("#globalReviewNote"),
  draftSummary: document.querySelector("#draftSummary"),
  copyBriefButton: document.querySelector("#copyBriefButton"),
  chapterTimeline: document.querySelector("#chapterTimeline"),
  worldRuleList: document.querySelector("#worldRuleList"),
  storySpineList: document.querySelector("#storySpineList"),
  characterList: document.querySelector("#characterList"),
  truthLayers: document.querySelector("#truthLayers"),
  nodeFilter: document.querySelector("#nodeFilter"),
  nodeOverview: document.querySelector("#nodeOverview"),
  eventList: document.querySelector("#eventList"),
  endingList: document.querySelector("#endingList")
};
refs.clearDraftButton = document.querySelector("#clearDraftButton");

let state = loadReviewState();

function loadReviewState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      selectedNode: parsed.selectedNode || "home",
      scores: {
        presence: Number(parsed.scores?.presence ?? 8),
        agency: Number(parsed.scores?.agency ?? 8),
        motive: Number(parsed.scores?.motive ?? 7),
        aftertaste: Number(parsed.scores?.aftertaste ?? 9),
        visual: Number(parsed.scores?.visual ?? 8)
      },
      globalNote: parsed.globalNote || "",
      eventNotes: parsed.eventNotes || {},
      selectedEnding: parsed.selectedEnding || "human",
      currentView: parsed.currentView || "approval"
    };
  } catch {
    return {
      selectedNode: "home",
      scores: { presence: 8, agency: 8, motive: 7, aftertaste: 9, visual: 8 },
      globalNote: "",
      eventNotes: {},
      selectedEnding: "human",
      currentView: "approval"
    };
  }
}

function saveReviewState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  renderDraftSummary();
}

function render() {
  renderView();
  renderEndingApproval();
  renderPitch();
  renderReviewConsole();
  renderTimeline();
  renderWorldRules();
  renderStorySpine();
  renderCharacters();
  renderTruths();
  renderNodeFilter();
  renderNode();
  renderEndings();
  renderDraftSummary();
}

function renderView() {
  const view = state.currentView === "library" ? "library" : "approval";
  refs.approvalView.hidden = view !== "approval";
  refs.libraryView.hidden = view !== "library";
  refs.viewButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
    button.setAttribute("aria-pressed", button.dataset.view === view ? "true" : "false");
  });
}

function renderPitch() {
  refs.pitchTitle.textContent = storyData.pitch.title;
  refs.pitchBody.textContent = storyData.pitch.body;
  refs.coreMetrics.innerHTML = storyData.pitch.metrics
    .map(([label, value]) => `<div class="metric-cell"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");
}

function renderReviewConsole() {
  refs.reviewSliders.innerHTML = storyData.reviewAxes
    .map(([key, label, hint]) => `
      <div class="review-slider">
        <label for="axis-${key}"><span>${label}</span><output id="out-${key}">${state.scores[key]}</output></label>
        <input id="axis-${key}" type="range" min="1" max="10" value="${state.scores[key]}" data-axis="${key}" />
        <p>${hint}</p>
      </div>
    `)
    .join("");

  refs.reviewSliders.querySelectorAll("input[data-axis]").forEach((slider) => {
    slider.addEventListener("input", () => {
      const key = slider.dataset.axis;
      state.scores[key] = Number(slider.value);
      document.querySelector(`#out-${key}`).textContent = slider.value;
      renderReviewScore();
      saveReviewState();
    });
  });

  refs.globalReviewNote.value = state.globalNote;
  refs.globalReviewNote.addEventListener("input", () => {
    state.globalNote = refs.globalReviewNote.value;
    saveReviewState();
  });
  renderReviewScore();
}

function renderReviewScore() {
  const values = Object.values(state.scores);
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const label = average >= 9 ? "强代入" : average >= 7.5 ? "可进试玩" : average >= 6 ? "需补动机" : "需重写";
  refs.reviewScoreLabel.textContent = `${average.toFixed(1)} / 10 · ${label}`;
}

function renderTimeline() {
  refs.chapterTimeline.innerHTML = storyData.chapters
    .map((chapter, index) => `
      <article class="chapter-step ${index === 0 ? "active" : ""}">
        <span class="chapter-kicker">${chapter.time}</span>
        <h3>${chapter.title}</h3>
        <p>${chapter.beat}</p>
        <div class="chapter-tags">${chapter.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
      </article>
    `)
    .join("");
}

function renderWorldRules() {
  refs.worldRuleList.innerHTML = storyData.worldRules
    .map((rule) => `
      <article class="world-rule-card">
        <strong>${rule.title}</strong>
        <p>${rule.text}</p>
      </article>
    `)
    .join("");
}

function renderStorySpine() {
  refs.storySpineList.innerHTML = storyData.storySpine
    .map((beat, index) => `
      <article class="story-spine-card">
        <div class="spine-index">${String(index + 1).padStart(2, "0")}</div>
        <div>
          <h3>${beat.stage}</h3>
          <dl>
            <div><dt>玩家理解</dt><dd>${beat.playerRead}</dd></div>
            <div><dt>暗线真相</dt><dd>${beat.hiddenTruth}</dd></div>
            <div><dt>回执图像</dt><dd>${beat.receiptCue}</dd></div>
          </dl>
        </div>
      </article>
    `)
    .join("");
}

function renderCharacters() {
  refs.characterList.innerHTML = storyData.characters
    .map((character) => `
      <article class="character-card">
        <div class="character-role">${character.role}</div>
        <div>
          <h3>${character.name}</h3>
          <p>${character.text}</p>
        </div>
      </article>
    `)
    .join("");
}

function renderTruths() {
  refs.truthLayers.innerHTML = storyData.truths
    .map((truth) => `
      <article class="truth-card">
        <strong>${truth.title}</strong>
        <p>${truth.text}</p>
      </article>
    `)
    .join("");
}

function renderNodeFilter() {
  refs.nav.innerHTML = storyData.nodes
    .map((node, index) => `
      <button class="nav-button ${node.id === state.selectedNode ? "active" : ""}" type="button" data-node="${node.id}">
        <span class="nav-index">${String(index + 1).padStart(2, "0")}</span>
        <span class="nav-main">
          <span class="nav-title">${node.name}</span>
          <span class="nav-meta">${node.act}</span>
        </span>
      </button>
    `)
    .join("");

  refs.nav.querySelectorAll("[data-node]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedNode = button.dataset.node;
      saveReviewState();
      renderNodeFilter();
      renderNode();
    });
  });

  refs.nodeFilter.innerHTML = storyData.nodes
    .map((node) => `<option value="${node.id}" ${node.id === state.selectedNode ? "selected" : ""}>${node.name}</option>`)
    .join("");

  refs.nodeFilter.addEventListener("change", () => {
    state.selectedNode = refs.nodeFilter.value;
    saveReviewState();
    renderNodeFilter();
    renderNode();
  });
}

function renderNode() {
  const node = storyData.nodes.find((entry) => entry.id === state.selectedNode) || storyData.nodes[0];
  refs.nodeOverview.innerHTML = `
    <div>
      <h3>${node.name}</h3>
      <p>${node.sensory}</p>
      <p>${node.immersion}</p>
    </div>
    <div class="node-facts">
      <div class="node-fact"><span>章节</span><strong>${node.act}</strong></div>
      <div class="node-fact"><span>功能</span><strong>${node.function}</strong></div>
      <div class="node-fact"><span>事件数</span><strong>${node.events.length} 张行动牌</strong></div>
    </div>
    ${renderNodeResourceSummary(node)}
  `;

  refs.eventList.innerHTML = node.events
    .map((event, index) => {
      const noteKey = `${node.id}.${index}`;
      return `
        <article class="event-card">
          <div class="event-card-header">
            <div>
              <h3>${event.title}</h3>
              <div class="event-tags">
                <span class="tag">${event.type}</span>
                <span class="tag">${event.hook}</span>
              </div>
            </div>
            <div class="event-score">代入 ${event.score}</div>
          </div>
          <div class="event-copy-grid">
            <div class="copy-block">
              <span>成功文案</span>
              <p>${event.success}</p>
            </div>
            <div class="copy-block">
              <span>失败文案</span>
              <p>${event.fail}</p>
            </div>
          </div>
          <div class="copy-block">
            <span>研发备注</span>
            <p>${event.note}</p>
          </div>
          ${renderEventResourcePanel(event, node, index)}
          <div class="event-note">
            <label for="note-${noteKey}">你的审阅批注</label>
            <textarea id="note-${noteKey}" data-note="${noteKey}" rows="3" placeholder="例如：这一段是否有画面？玩家动机够不够？恐怖会不会太跳？">${escapeHtml(state.eventNotes[noteKey] || "")}</textarea>
          </div>
        </article>
      `;
    })
    .join("");

  refs.eventList.querySelectorAll("textarea[data-note]").forEach((textarea) => {
    textarea.addEventListener("input", () => {
      state.eventNotes[textarea.dataset.note] = textarea.value;
      saveReviewState();
    });
  });
}

function renderEndingApproval() {
  const selected = selectedEndingRoute();
  const audit = buildRouteAudit(selected);
  refs.endingPicker.innerHTML = storyData.endingRoutes
    .map((route) => `
      <button class="ending-pick ${route.id === selected.id ? "active" : ""}" type="button" data-ending="${route.id}">
        <span>${route.tier}</span>
        <strong>${route.title}</strong>
        <em>${route.finalTrigger}</em>
      </button>
    `)
    .join("");

  refs.endingPriorityStrip.innerHTML = storyData.endingRouteRules.priorities
    .map(([index, title, flag]) => `
      <div class="priority-chip">
        <span>${index}</span>
        <strong>${title}</strong>
        <code>${flag}</code>
      </div>
    `)
    .join("");

  refs.selectedEndingPanel.innerHTML = `
    <article class="ending-detail ${selected.id}">
      <header class="ending-detail-head">
        <div>
          <span class="ending-route-tier">${selected.tier}</span>
          <h2>${selected.title}</h2>
          <p>${selected.testGoal}</p>
        </div>
        <div class="ending-trigger">
          <span>最终触发</span>
          <strong>${selected.finalTrigger}</strong>
        </div>
      </header>

      <section class="linear-route-section" aria-label="${selected.title}线形图">
        <div class="section-heading">
          <h3>倒推线形图</h3>
          <span>按这个顺序测试事件</span>
        </div>
        <div class="linear-route">
          ${selected.path
            .map((step, index) => `
              <div class="linear-step">
                <div class="linear-dot">${String(index + 1).padStart(2, "0")}</div>
                <div class="linear-step-body">
                  <span>${nodeName(step.nodeId)}</span>
                  <strong>${step.choice}</strong>
                  <p>${step.effect}</p>
                  ${renderStepAuditChips(audit.steps[index])}
                </div>
              </div>
            `)
            .join("")}
        </div>
      </section>

      <section class="test-order-section">
        <div class="section-heading">
          <h3>实际测试顺序</h3>
          <span>你进游戏后照这个走</span>
        </div>
        <ol class="test-order-list">
          ${selected.path
            .map((step, index) => `
              <li>
                <span>${nodeName(step.nodeId)}</span>
                <strong>选择「${step.choice}」</strong>
                <em>${step.effect}</em>
                ${renderStepAuditChips(audit.steps[index])}
              </li>
            `)
            .join("")}
        </ol>
      </section>

      <section class="item-flow-section">
        <div class="section-heading">
          <h3>道具流转检查</h3>
          <span>起始：井水瓶 x1 / 供桌糕 x1</span>
        </div>
        <div class="item-flow-table">
          ${audit.steps
            .map((step) => `
              <div class="item-flow-row ${step.blocked ? "blocked" : ""}">
                <div>
                  <span>${step.index}</span>
                  <strong>${step.nodeName} / ${step.choice}</strong>
                </div>
                <div>${renderFlowCell("门槛来源", step.needDetail)}</div>
                <div>${renderFlowCell("获得去向", step.gainDetail)}</div>
                <div>${renderFlowCell("消耗核验", step.consumeDetail)}</div>
                <div class="flow-inventory">
                  <span>${step.blocked ? "卡点" : "旗标 / 背包"}</span>
                  <div class="flow-detail">
                    ${step.blocked ? `<span class="flow-line missing"><b>${step.blockReason}</b></span>` : step.flagDetail}
                    <span class="flow-line inventory"><b>${step.inventoryAfter}</b></span>
                  </div>
                </div>
              </div>
            `)
            .join("")}
        </div>
      </section>

      <section class="ending-condition-row">
        <div>
          <span>结算条件</span>
          <strong>${selected.successCondition}</strong>
        </div>
        <div>
          <span>${audit.blocked ? "路线可行性" : "优先级提醒"}</span>
          <strong>${audit.blocked ? audit.summary : priorityReminder(selected.id)}</strong>
        </div>
      </section>

      <section class="route-audit-grid compact">
        ${renderRouteAuditBlock("必须验证", selected.must, "must")}
        ${renderRouteAuditBlock("不要误走", selected.avoid, "avoid")}
        ${renderRouteAuditBlock("审批问题", selected.approval, "approval")}
        ${renderRouteAuditBlock("风险", selected.risks, "risk")}
      </section>
    </article>
  `;

  refs.endingPicker.querySelectorAll("[data-ending]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedEnding = button.dataset.ending;
      saveReviewState();
      renderEndingApproval();
    });
  });
}

function renderNodeResourceSummary(node) {
  const needEvents = node.events.filter((event) => hasEntries(event.need) || hasEntries(event.spend) || event.needFlags.length).length;
  const gainEntries = node.events.flatMap((event) => Object.keys(event.gain || {}));
  const missingNeeds = node.events.flatMap((event, eventIndex) =>
    Object.keys({ ...(event.need || {}), ...(event.spend || {}) }).filter((id) => !findPriorItemSources(node.id, id, eventIndex).length)
  );
  const missingFlags = node.events.flatMap((event, eventIndex) =>
    (event.needFlags || []).filter((flag) => !findPriorFlagSources(node.id, flag, eventIndex).length)
  );
  const unusedGains = node.events.flatMap((event, eventIndex) =>
    Object.keys(event.gain || {}).filter((id) => !findFutureItemUses(node.id, id, eventIndex).length)
  );

  return `
    <div class="node-resource-summary">
      <div><span>道具门槛事件</span><strong>${needEvents} 张</strong></div>
      <div><span>本节点发放</span><strong>${unique(gainEntries).map(itemLabel).join("、") || "无"}</strong></div>
      <div class="${missingNeeds.length ? "warn" : "ok"}"><span>缺前置来源</span><strong>${unique(missingNeeds).map(itemLabel).join("、") || "无"}</strong></div>
      <div class="${missingFlags.length ? "warn" : "ok"}"><span>缺前置旗标</span><strong>${unique(missingFlags).map(flagLabel).join("、") || "无"}</strong></div>
      <div class="${unusedGains.length ? "warn" : "ok"}"><span>后续未用到</span><strong>${unique(unusedGains).map(itemLabel).join("、") || "无"}</strong></div>
    </div>
  `;
}

function renderEventResourcePanel(event, node, eventIndex) {
  const rows = [
    ...withEmptyResourceRow(resourceNeedRows("需要", event.need, node.id, eventIndex), "需要道具", "need"),
    ...withEmptyResourceRow(resourceNeedRows("消耗", event.spend, node.id, eventIndex), "消耗道具", "spend"),
    ...withEmptyResourceRow(resourceGainRows(event.gain, node.id, eventIndex), "获得道具", "gain"),
    ...(event.drop ? [{ label: "失败掉落", value: `失败时随机掉落 ${event.drop} 件；成功测试顺序不触发。`, status: "warn" }] : []),
    ...withEmptyResourceRow(resourceNeedFlagRows(event.needFlags, node.id, eventIndex), "需要旗标", "need"),
    ...(event.flags.length ? [{ label: "获得旗标", value: formatFlags(event.flags), status: "flag" }] : [{ label: "获得旗标", value: "无", status: "empty" }])
  ];

  if (!rows.length) return "";
  return `
    <div class="event-resource-panel">
      ${rows.map((row) => `<div class="${row.status}"><span>${row.label}</span><strong>${row.value}</strong></div>`).join("")}
    </div>
  `;
}

function withEmptyResourceRow(rows, label) {
  return rows.length ? rows : [{ label, value: "无", status: "empty" }];
}

function resourceNeedRows(label, map, nodeId, eventIndex) {
  return Object.entries(map || {}).map(([id, count]) => {
    const sources = findPriorItemSources(nodeId, id, eventIndex);
    return {
      label: `${label}${itemLabel(id)} x${count}`,
      value: sources.length ? `前置来源：${sources.join("；")}` : "缺少前置来源",
      status: sources.length ? "need" : "missing"
    };
  });
}

function resourceGainRows(map, nodeId, eventIndex) {
  return Object.entries(map || {}).map(([id, count]) => {
    const uses = findFutureItemUses(nodeId, id, eventIndex);
    return {
      label: `获得${itemLabel(id)} x${count}`,
      value: uses.length ? `后续用到：${uses.join("；")}` : "后续没有事件要求或消耗",
      status: uses.length ? "gain" : "unused"
    };
  });
}

function resourceNeedFlagRows(flags, nodeId, eventIndex) {
  return (flags || []).map((flag) => {
    const sources = findPriorFlagSources(nodeId, flag, eventIndex);
    return {
      label: `需要旗标 ${flagLabel(flag)}`,
      value: sources.length ? `前置来源：${sources.join("；")}` : "缺少前置旗标来源",
      status: sources.length ? "need" : "missing"
    };
  });
}

function renderStepAuditChips(step) {
  if (!step) return `<div class="resource-chips"><span class="chip warn">未找到事件配置</span></div>`;
  const chips = [...step.needChips, ...step.gainChips, ...step.consumeChips, ...step.flagChips];
  if (step.blocked) chips.push({ text: `卡点 ${step.blockReason}`, type: "warn" });
  if (!chips.length) return `<div class="resource-chips"><span class="chip muted">无道具门槛</span></div>`;
  return `<div class="resource-chips">${chips.map((chip) => `<span class="chip ${chip.type}">${chip.text}</span>`).join("")}</div>`;
}

function buildRouteAudit(route) {
  const inventory = createStartingInventory();
  const flags = new Set();
  const flagSources = new Map();
  const sourceUses = new Map();
  const steps = [];

  route.path.forEach((pathStep, index) => {
    const event = eventForStep(pathStep);
    const indexLabel = String(index + 1).padStart(2, "0");
    const actionLabel = `第${indexLabel}步 ${pathStep.choice}`;
    const countsBefore = inventoryCounts(inventory);
    const needRecords = buildNeedRecords(event?.need, inventory);
    const needFlagRecords = buildNeedFlagRecords(event?.needFlags, flagSources);
    const missingNeedItems = needRecords.filter((record) => record.missing > 0);
    const missingSpendItems = missingFromInventory(countsBefore, event?.spend || {});
    const missingFlags = needFlagRecords.filter((record) => record.missing);
    const blocked = missingNeedItems.length > 0 || missingSpendItems.length > 0 || missingFlags.length > 0 || !event;
    const consumeRecords = [];
    let gainRecords = [];

    if (!blocked && event?.need) recordNeedUses(sourceUses, needRecords, actionLabel);

    if (!blocked && event?.spend) {
      Object.entries(event.spend).forEach(([id, count]) => {
        consumeItemSources(inventory, id, count).forEach((unit) => {
          recordSourceUse(sourceUses, unit, "spend", actionLabel);
          consumeRecords.push({ id, unit, kind: "spend" });
        });
      });
    }

    if (!blocked && event?.gain) {
      gainRecords = Object.entries(event.gain).flatMap(([id, count]) => addItemSources(inventory, id, count, actionLabel));
    }

    if (!blocked && event?.flags) {
      event.flags.forEach((flag) => {
        flags.add(flag);
        if (!flagSources.has(flag)) flagSources.set(flag, []);
        flagSources.get(flag).push(actionLabel);
      });
    }

    const blockReason = [
      ...missingNeedItems.map((record) => `缺少门槛${itemLabel(record.id)} x${record.missing}`),
      ...missingSpendItems.map(([id, count]) => `缺少可消耗${itemLabel(id)} x${count}`),
      ...missingFlags.map((record) => `缺少旗标：${flagLabel(record.flag)}`),
      ...(!event ? ["事件未配置"] : [])
    ].join("；");

    steps.push({
      index: indexLabel,
      nodeName: nodeName(pathStep.nodeId),
      choice: pathStep.choice,
      event,
      needDetail: [renderNeedDetail(needRecords), renderNeedFlagDetail(needFlagRecords)].filter(Boolean).join(""),
      needChips: [...buildNeedChips(needRecords), ...buildNeedFlagChips(needFlagRecords)],
      gainRecords,
      consumeRecords,
      consumeDetail: renderConsumeDetail(consumeRecords, event),
      consumeChips: buildConsumeChips(consumeRecords, event),
      flagDetail: renderFlagDetail(event?.flags),
      flagChips: buildFlagChips(event?.flags),
      blocked,
      blockReason,
      inventoryAfter: formatSourceInventory(inventory)
    });
  });

  steps.forEach((step) => {
    step.gainDetail = renderGainUsageDetail(step.gainRecords, sourceUses);
    step.gainChips = buildGainUsageChips(step.gainRecords, sourceUses);
  });

  const blockedStep = steps.find((step) => step.blocked);
  return {
    steps,
    blocked: !!blockedStep,
    summary: blockedStep ? `${blockedStep.index} ${blockedStep.choice}：${blockedStep.blockReason}` : "按当前道具链可以走通。"
  };
}

function eventForStep(step) {
  const node = storyData.nodes.find((entry) => entry.id === step.nodeId);
  return node?.events.find((event) => event.title === step.choice) || null;
}

function createStartingInventory() {
  const inventory = {};
  Object.entries(STARTING_ITEMS).forEach(([id, count]) => addItemSources(inventory, id, count, "开局携带"));
  return inventory;
}

function addItemSources(inventory, id, count, sourceLabel) {
  if (!inventory[id]) inventory[id] = [];
  const records = [];
  const startIndex = inventory[id].length;
  for (let index = 0; index < count; index += 1) {
    const unit = {
      id,
      key: `${sourceLabel}|${id}|${startIndex + index + 1}`,
      sourceLabel
    };
    inventory[id].push(unit);
    records.push(unit);
  }
  return records;
}

function buildNeedRecords(need, inventory) {
  return Object.entries(need || {}).map(([id, count]) => {
    const sources = (inventory[id] || []).slice(0, count);
    return {
      id,
      count,
      sources,
      missing: Math.max(0, count - sources.length)
    };
  });
}

function buildNeedFlagRecords(needFlags, flagSources) {
  return (needFlags || []).map((flag) => {
    const sources = flagSources.get(flag) || [];
    return {
      flag,
      sources,
      missing: sources.length === 0
    };
  });
}

function recordNeedUses(sourceUses, records, actionLabel) {
  records.forEach((record) => {
    if (record.missing) return;
    record.sources.forEach((unit) => recordSourceUse(sourceUses, unit, "need", actionLabel));
  });
}

function recordSourceUse(sourceUses, unit, type, label) {
  if (!sourceUses.has(unit.key)) sourceUses.set(unit.key, []);
  sourceUses.get(unit.key).push({ type, label });
}

function consumeItemSources(inventory, id, count) {
  const units = inventory[id] || [];
  const removed = units.splice(0, count);
  if (!units.length) delete inventory[id];
  return removed;
}

function missingFromInventory(inventory, need) {
  return Object.entries(need || {}).filter(([id, count]) => (inventory[id] || 0) < count);
}

function inventoryCounts(inventory) {
  return Object.fromEntries(Object.entries(inventory).map(([id, units]) => [id, units.length]));
}

function renderNeedDetail(records) {
  return renderFlowLines(
    records.map((record) => ({
      type: record.missing ? "missing" : "need",
      label: `需 ${itemLabel(record.id)} x${record.count}`,
      detail: record.missing ? `缺 ${record.missing}；现有：${sourceList(record.sources) || "无"}` : `来源：${sourceList(record.sources)}`
    }))
  );
}

function renderNeedFlagDetail(records) {
  return renderFlowLines(
    records.map((record) => ({
      type: record.missing ? "missing" : "need",
      label: `需旗标 ${flagLabel(record.flag)}`,
      detail: record.missing ? "缺少前置旗标" : `来源：${record.sources.join("、")}`
    }))
  );
}

function buildNeedChips(records) {
  return records.map((record) => ({
    text: record.missing
      ? `需 ${itemLabel(record.id)} x${record.count}｜缺 ${record.missing}`
      : `需 ${itemLabel(record.id)} x${record.count}｜${sourceList(record.sources)}`,
    type: record.missing ? "warn" : "need"
  }));
}

function buildNeedFlagChips(records) {
  return records.map((record) => ({
    text: record.missing ? `需旗标 ${flagLabel(record.flag)}｜缺` : `需旗标 ${flagLabel(record.flag)}｜${record.sources.join("、")}`,
    type: record.missing ? "warn" : "need"
  }));
}

function renderGainUsageDetail(records, sourceUses) {
  return renderFlowLines(
    groupGainUsage(records, sourceUses).map((group) => ({
      type: group.status,
      label: `得 ${itemLabel(group.id)} x${group.count}`,
      detail: group.detail
    }))
  );
}

function buildGainUsageChips(records, sourceUses) {
  return groupGainUsage(records, sourceUses).map((group) => ({
    text: `得 ${itemLabel(group.id)} x${group.count}｜${group.shortDetail}`,
    type: `gain ${group.status}`
  }));
}

function groupGainUsage(records, sourceUses) {
  const groups = new Map();
  records.forEach((unit) => {
    const uses = sourceUses.get(unit.key) || [];
    const needLabels = unique(uses.filter((use) => use.type === "need").map((use) => use.label));
    const spendLabels = unique(uses.filter((use) => use.type === "spend").map((use) => use.label));
    const status = spendLabels.length ? "spent" : needLabels.length ? "used" : "unused";
    const detail = spendLabels.length
      ? `消耗：${spendLabels.join("、")}${needLabels.length ? `；门槛：${needLabels.join("、")}` : ""}`
      : needLabels.length
        ? `门槛：${needLabels.join("、")}`
        : "本线未用到";
    const shortDetail = spendLabels.length ? `消耗 ${spendLabels.join("、")}` : needLabels.length ? `门槛 ${needLabels.join("、")}` : "本线未用到";
    const key = `${unit.id}|${status}|${detail}`;
    const group = groups.get(key) || { id: unit.id, status, detail, shortDetail, count: 0 };
    group.count += 1;
    groups.set(key, group);
  });
  return [...groups.values()];
}

function renderConsumeDetail(records, event) {
  const lines = groupConsumeRecords(records).map((group) => ({
    type: "spend",
    label: `耗 ${itemLabel(group.id)} x${group.count}`,
    detail: `来源：${group.sources.join("、")}`
  }));
  if (event?.drop) {
    lines.push({
      type: "warn",
      label: `失败掉落 ${event.drop} 件`,
      detail: "成功测试顺序不触发"
    });
  }
  return renderFlowLines(lines);
}

function buildConsumeChips(records, event) {
  const chips = groupConsumeRecords(records).map((group) => ({
    text: `耗 ${itemLabel(group.id)} x${group.count}｜${group.sources.join("、")}`,
    type: "spend"
  }));
  if (event?.drop) chips.push({ text: `失败掉落 ${event.drop} 件`, type: "warn" });
  return chips;
}

function groupConsumeRecords(records) {
  const groups = new Map();
  records.forEach((record) => {
    const source = record.unit.sourceLabel;
    const key = `${record.id}|${record.kind}|${source}`;
    const group = groups.get(key) || { id: record.id, kind: record.kind, sources: [source], count: 0 };
    group.count += 1;
    groups.set(key, group);
  });
  return [...groups.values()];
}

function renderFlagDetail(flags) {
  return renderFlowLines((flags || []).map((flag) => ({ type: "flag", label: flagLabel(flag), detail: "本步获得旗标" })));
}

function buildFlagChips(flags) {
  return (flags || []).map((flag) => ({ text: `旗标 ${flagLabel(flag)}`, type: "flag" }));
}

function renderFlowCell(label, value) {
  return `<span class="flow-label">${label}</span><div class="flow-detail">${value || '<em class="flow-empty">无</em>'}</div>`;
}

function renderFlowLines(lines) {
  if (!lines.length) return "";
  return lines
    .map((line) => `<span class="flow-line ${line.type}"><b>${line.label}</b>${line.detail ? `<small>${line.detail}</small>` : ""}</span>`)
    .join("");
}

function sourceList(sources) {
  return unique(sources.map((source) => source.sourceLabel)).join("、");
}

function formatSourceInventory(inventory) {
  const entries = Object.entries(inventory).filter(([, units]) => units.length > 0);
  if (!entries.length) return "空";
  return entries.map(([id, units]) => `${itemLabel(id)} x${units.length}`).join("、");
}

function findPriorItemSources(nodeId, itemId, eventIndex = 0) {
  const targetIndex = storyData.nodes.findIndex((node) => node.id === nodeId);
  const sources = [];
  if (STARTING_ITEMS[itemId]) sources.push(`开局携带 x${STARTING_ITEMS[itemId]}`);
  storyData.nodes.forEach((node, nodeIndex) => {
    if (nodeIndex > targetIndex) return;
    node.events.forEach((event, sourceEventIndex) => {
      if (nodeIndex === targetIndex && sourceEventIndex >= eventIndex) return;
      const count = event.gain?.[itemId];
      if (count) sources.push(`${String(nodeIndex + 1).padStart(2, "0")} ${node.name} / ${event.title} x${count}`);
    });
  });
  return sources;
}

function findPriorFlagSources(nodeId, flag, eventIndex = 0) {
  const targetIndex = storyData.nodes.findIndex((node) => node.id === nodeId);
  const sources = [];
  storyData.nodes.forEach((node, nodeIndex) => {
    if (nodeIndex > targetIndex) return;
    node.events.forEach((event, sourceEventIndex) => {
      if (nodeIndex === targetIndex && sourceEventIndex >= eventIndex) return;
      if (event.flags.includes(flag)) sources.push(`${String(nodeIndex + 1).padStart(2, "0")} ${node.name} / ${event.title}`);
    });
  });
  return sources;
}

function findFutureItemUses(nodeId, itemId, eventIndex = -1) {
  const targetIndex = storyData.nodes.findIndex((node) => node.id === nodeId);
  const uses = [];
  storyData.nodes.forEach((node, nodeIndex) => {
    if (nodeIndex < targetIndex) return;
    node.events.forEach((event, useEventIndex) => {
      if (nodeIndex === targetIndex && useEventIndex <= eventIndex) return;
      if (event.need?.[itemId]) uses.push(`${String(nodeIndex + 1).padStart(2, "0")} ${node.name} / ${event.title} 要求`);
      if (event.spend?.[itemId]) uses.push(`${String(nodeIndex + 1).padStart(2, "0")} ${node.name} / ${event.title} 消耗`);
    });
  });
  return uses;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function hasEntries(map) {
  return Object.keys(map || {}).length > 0;
}

function normalizeStoryData() {
  storyData.nodes.forEach((node) => {
    node.events.forEach((event) => {
      event.need ||= {};
      event.spend ||= {};
      event.gain ||= {};
      event.flags = unique([...(event.flag ? [event.flag] : []), ...(event.flags || [])]);
      event.needFlags = unique([...(event.needFlag ? [event.needFlag] : []), ...(event.needFlags || [])]);
    });
  });
}

function itemMapToChips(prefix, map, type) {
  return Object.entries(map || {}).map(([id, count]) => ({ text: `${prefix} ${itemLabel(id)} x${count}`, type }));
}

function formatItemMap(map) {
  const entries = Object.entries(map || {});
  if (!entries.length) return "";
  return entries.map(([id, count]) => `${itemLabel(id)} x${count}`).join("、");
}

function formatFlags(flags) {
  if (!flags?.length) return "";
  return flags.map(flagLabel).join("、");
}

function formatInventory(inventory) {
  const entries = Object.entries(inventory).filter(([, count]) => count > 0);
  if (!entries.length) return "空";
  return entries.map(([id, count]) => `${itemLabel(id)} x${count}`).join("、");
}

function itemLabel(id) {
  return ITEM_LABELS[id] || id;
}

function flagLabel(id) {
  return FLAG_LABELS[id] || id;
}

function selectedEndingRoute() {
  return storyData.endingRoutes.find((route) => route.id === state.selectedEnding) || storyData.endingRoutes[0];
}

function priorityReminder(endingId) {
  const reminders = {
    perfect: "最高优先级；拿到 perfect_choice 会覆盖人线、怪异线和王线。",
    weird: "高于人线和王线；测试人线时必须避开 weird_choice。",
    human: "低于托付和怪异；必须避开 perfect_choice / weird_choice。",
    king: "默认兜底；必须避开 perfect_choice / weird_choice / human_choice。",
    timeout: "不进终局结算；由倒计时归零触发。",
    depleted: "不进终局结算；由任一属性归零触发。"
  };
  return reminders[endingId] || "按当前旗标优先级结算。";
}

function renderRouteAuditBlock(title, items, type) {
  return `
    <div class="route-audit-block ${type}">
      <span>${title}</span>
      <ul>
        ${items.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    </div>
  `;
}

function nodeName(nodeId) {
  return storyData.nodes.find((node) => node.id === nodeId)?.name || nodeId;
}

function renderEndings() {
  refs.endingList.innerHTML = storyData.endings
    .map((ending) => `
      <article class="ending-card">
        <h3>${ending.title}</h3>
        <p>${ending.text}</p>
        <div class="ending-tags">${ending.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
      </article>
    `)
    .join("");
}

function renderDraftSummary() {
  const values = Object.values(state.scores);
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const noteCount = Object.values(state.eventNotes).filter((value) => value.trim()).length;
  const ending = selectedEndingRoute();
  refs.draftSummary.textContent =
    `当前结局：${ending.title}\n` +
    `测试步数：${ending.path.length} 步\n` +
    `代入均分：${average.toFixed(1)} / 10\n` +
    `事件批注：${noteCount} 条\n` +
    `总体批注：${state.globalNote.trim() ? "已填写" : "未填写"}`;
}

function buildBriefText() {
  const scoreText = storyData.reviewAxes
    .map(([key, label]) => `${label} ${state.scores[key]}/10`)
    .join("，");
  const ending = selectedEndingRoute();
  const routeText = ending.path
    .map((step, index) => `${index + 1}. ${nodeName(step.nodeId)} / ${step.choice}：${step.effect}`)
    .join("\n");
  const eventNotes = Object.entries(state.eventNotes)
    .filter(([, value]) => value.trim())
    .map(([key, value]) => `- ${labelForNoteKey(key)}：${value.trim()}`)
    .join("\n");
  return [
    `《旧城回身》结局倒推审批：${ending.title}`,
    `结算条件：${ending.successCondition}`,
    `测试顺序：\n${routeText}`,
    `评分：${scoreText}`,
    `总体批注：${state.globalNote.trim() || "暂无"}`,
    eventNotes ? `事件批注：\n${eventNotes}` : "事件批注：暂无"
  ].join("\n\n");
}

function labelForNoteKey(key) {
  const [nodeId, indexText] = key.split(".");
  const node = storyData.nodes.find((entry) => entry.id === nodeId);
  const event = node?.events[Number(indexText)];
  return `${node?.name || nodeId} / ${event?.title || indexText}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function showToast(text) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = text;
  document.body.append(toast);
  setTimeout(() => toast.remove(), 1800);
}

refs.copyBriefButton.addEventListener("click", async () => {
  const text = buildBriefText();
  try {
    await navigator.clipboard.writeText(text);
    showToast("审阅摘要已复制");
  } catch {
    showToast(text);
  }
});

refs.viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.currentView = button.dataset.view;
    saveReviewState();
    renderView();
  });
});

refs.clearDraftButton.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  state = loadReviewState();
  render();
  showToast("审阅草稿已清空");
});

render();
