const STORAGE_KEY = "witchkeni.fogharbor.story-review.v3";

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
          score: 95
        },
        {
          title: "听弃城广播",
          type: "封锁 / 世界观",
          hook: "确认白塔局封锁进度。",
          success: "广播确认旧城回身收容失败，三小时后弃城封锁。外城已经叠到三楼。",
          fail: "猫眼里不是走廊，是一条挂满王旗的古街。",
          note: "统一使用“弃城封锁”，让危险一眼可懂。",
          score: 91
        },
        {
          title: "按童谣封门",
          type: "童谣 / 归位",
          hook: "给安全屋留下归位标记。",
          success: "旧城令帖压进门缝，童谣浮出：旧王不归，满城无门。",
          fail: "木门裂出王印，像另一段时间按住你的手。",
          note: "童谣负责民间传说代入，王印负责旧王身份暗线。",
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
          score: 90
        },
        {
          title: "追问旧医官",
          type: "救助 / 通行",
          hook: "救下知道王城密道的人。",
          success: "旧医官给出旧城令帖，说王城密道只认旧臣和王印。",
          fail: "他只留下一句：沈砚早知道你是谁。",
          note: "救助线对应“人”的结局倾向。",
          score: 92
        },
        {
          title: "拆收容供氧车",
          type: "强硬 / 剖真",
          hook: "取走设备，也暴露沈砚实验痕迹。",
          success: "供氧车里藏着沈砚实验签：刺激足够时，本命怪异会替人说真话。",
          fail: "短波里沈砚轻笑，像在记录你的反应。",
          note: "这里开始把沈砚从搭档转成观察者。",
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
          score: 89
        },
        {
          title: "问壁画摊主",
          type: "身份 / 路线",
          hook: "用补给换旧王壁画来历。",
          success: "拓片显示旧王离城那夜，外城火起，王座空了三百年。",
          fail: "摊主给出写着你名字的王榜，尾注是沈砚：诱导成功。",
          note: "这是沈砚反转最明确的中段暗线。",
          score: 96
        },
        {
          title: "撬开纸扎王箱",
          type: "强硬 / 工具",
          hook: "拿到密道工具，制造噪声。",
          success: "棺钉撬和旧王密道提示一起出现：旧王若归，先开死门。",
          fail: "纸脸叫出你的旧王封号。",
          note: "强硬路线喂大怪异倾向。",
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
          score: 88
        },
        {
          title: "取下隔离衣",
          type: "隐蔽 / 收容",
          hook: "混入白塔巡线队。",
          success: "隔离衣扫过你的脸，没有报警，像白塔局早就认识你。",
          fail: "胸牌后的名字变成“旧王”。",
          note: "让玩家感到自己不是被救援的人，而是被记录的人。",
          score: 90
        },
        {
          title: "沿归位线走",
          type: "路线 / 归位",
          hook: "发现通往内城的错位线路。",
          success: "你刻下箭头，指尖却自动写出旧城王印。",
          fail: "墙上已有你的刻痕，沈砚说：你终于开始记起来了。",
          note: "连接外城到内城，开始显性恢复记忆。",
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
          score: 88
        },
        {
          title: "点亮朱砂信号棒",
          type: "信号 / 白塔",
          hook: "向白塔局暴露位置。",
          success: "白塔无人车闪灯，导航只剩一个目的地：内城密道。",
          fail: "车窗里坐满旧城臣民，无声等你判决。",
          note: "白塔局仍有工具，但不是温柔救援。",
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
          hook: "听沈砚留下的剖真记录。",
          success: "沈砚承认：为了证明旧王存在，我必须把他带回王城。",
          fail: "潮水声里反复唱出你的旧王封号。",
          note: "这里正式暴露沈砚不是普通求救者。",
          score: 98
        },
        {
          title: "搜站台储物柜",
          type: "钥匙 / 留言",
          hook: "找钥匙，也找沈砚第二封信。",
          success: "归位铜钥和沈砚票根同时出现：他不回来，旧城永远不会停。",
          fail: "镜子里坐着一个披王袍的陌生人。",
          note: "给密道钥匙，也继续推旧王身份。",
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
          score: 90
        },
        {
          title: "分水给旧卒",
          type: "救助 / 大将军",
          hook: "少一点补给，多一段旧城证词。",
          success: "旧卒擦亮箭头：将军未死，王位可托。",
          fail: "他抢水逃走，背后是死城守军编号。",
          note: "隐藏完美结局的早期入口。",
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
          score: 92
        },
        {
          title: "混进隔离队",
          type: "伪装 / 白塔",
          hook: "需要白塔隔离衣，风险高，收益大。",
          success: "白塔队伍讨论是否处决沈砚，你第一次听见他被当成异常源。",
          fail: "屏幕弹出：归位对象，无权离城。",
          note: "沈砚和主角都被白塔视为收容对象。",
          score: 89
        },
        {
          title: "硬闯死城门禁",
          type: "强硬 / 怪异",
          hook: "最后的暴力捷径。",
          success: "你的影子留在原地，戴着王冠。",
          fail: "沈砚说：很好，恐惧也会喂醒归位。",
          note: "怪异结局倾向的重要喂养点。",
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
          score: 98
        },
        {
          title: "转动归位铜钥",
          type: "钥匙 / 王座",
          hook: "需要归位铜钥，打开王城水路。",
          success: "盐线通道尽头不是出口，是王座方向。",
          fail: "旧城把你的名字卷回族谱。",
          note: "让玩家知道逃出去和归位不是同一件事。",
          score: 90
        },
        {
          title: "唤醒旧城大将军",
          type: "隐藏 / 托付",
          hook: "牺牲现在，换一个替你守城的人。",
          success: "石像裂开一线：若王不愿归位，臣可代守。",
          fail: "石像转过半张脸，记住你的迟疑。",
          note: "隐藏完美结局条件。",
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
          hook: "留下来，承担旧城君王的责任。",
          success: "归位怪异完整服从你，旧城停止回身，现实雾港开始复原。",
          fail: "王座认出你的逃意，死城灯火亮起。",
          note: "王结局：救现世，但主角留在旧城。",
          score: 94
        },
        {
          title: "说服沈砚同行",
          type: "人 / 现世",
          hook: "拒绝王位，以人的身份逃离。",
          success: "你告诉沈砚：我已经觉醒，但我不想伤害你。旧城是过去式，我要守护现世。",
          fail: "沈砚只想要实验结论。",
          note: "人结局：核心是能力觉醒但拒绝王位。",
          score: 96
        },
        {
          title: "斩断剖真",
          type: "怪异 / 决裂",
          hook: "让沈砚闭嘴，也让怪异替你开路。",
          success: "沈砚的短波静了，密道为你打开。",
          fail: "剖真怪异从他影子里张开。",
          note: "怪异结局：主角逃出，但归位开始学会移除人。",
          score: 91
        },
        {
          title: "托付大将军",
          type: "隐藏完美 / 王权",
          hook: "把王权归位给旧城大将军。",
          success: "大将军接过王印，旧城有了新主，现世不必再献出旧王。",
          fail: "死城怨声压回石壳，你还没有足够理由离开。",
          note: "隐藏完美：世界恢复平静，留下第二季尾巴。",
          score: 99
        }
      ]
    }
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
    }
  ]
};

const refs = {
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
      eventNotes: parsed.eventNotes || {}
    };
  } catch {
    return {
      selectedNode: "home",
      scores: { presence: 8, agency: 8, motive: 7, aftertaste: 9, visual: 8 },
      globalNote: "",
      eventNotes: {}
    };
  }
}

function saveReviewState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  renderDraftSummary();
}

function render() {
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
  const current = storyData.nodes.find((node) => node.id === state.selectedNode);
  refs.draftSummary.textContent =
    `当前审阅：${current?.name || "未选择"}\n` +
    `代入均分：${average.toFixed(1)} / 10\n` +
    `事件批注：${noteCount} 条\n` +
    `总体批注：${state.globalNote.trim() ? "已填写" : "未填写"}`;
}

function buildBriefText() {
  const scoreText = storyData.reviewAxes
    .map(([key, label]) => `${label} ${state.scores[key]}/10`)
    .join("，");
  const eventNotes = Object.entries(state.eventNotes)
    .filter(([, value]) => value.trim())
    .map(([key, value]) => `- ${labelForNoteKey(key)}：${value.trim()}`)
    .join("\n");
  return [
    "《旧城回身》剧情代入感审阅",
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

refs.clearDraftButton.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  state = loadReviewState();
  render();
  showToast("审阅草稿已清空");
});

render();
