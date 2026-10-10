/**
 * 里里和娜娜的科學大冒險 - 資料庫
 * 頻道來源: 小朋友看大世界 (@WYT2809)
 * https://www.youtube.com/@WYT2809
 */

const COMPANY_CONFIG = {
  name: "KinderExplore",
  domain: "kinderexplore.com",
  url: "https://kinderexplore.com",
  email: "info@kinderexplore.com",
  slogan: "啟發孩子的好奇心，帶孩子探索世界與科學！",
  about: "KinderExplore 致力於透過生動的動畫影音與遊戲化互動闖關，為孩子們打造最有趣、最富啟發性的世界與科學探索啟蒙平台。"
};

const CHANNEL_CONFIG = {
  name: "小朋友看大世界",
  handle: "@WYT2809",
  url: "https://www.youtube.com/@WYT2809",
  avatar: "https://yt3.googleusercontent.com/067SvfbIDLAbzhBfzq-V4-T0VPggzA3krh191XE5X2jKnHU0NypWATmkc7RYjeF0fJk3AS3qVW0=s176-c-k-c0x00ffffff-no-rj",
  banner: "https://yt3.googleusercontent.com/NN0GyxW3iqVHKFCz7LO5TW_S87pFOhRN_m7vu6FGvtGOQ5f-ETr3CfsKSM8ykUxAge5Zsj1a4-I=w1060-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
  slogan: "跟著里里和娜娜，開啟好奇心，一起發現世界！",
  intro: "里里和娜娜帶你一起探索身體、科學與生活中的小秘密！從骨頭、器官、昆蟲到自然現象，每一個「為什麼？」都會變成一場好玩的大冒險！"
};

const CHARACTERS = {
  riri: {
    name: "里里 Lili",
    role: "",
    color: "#60A5FA",
    tagline: "熱愛探險，充滿冒險勇氣與好奇心。",
    avatarIcon: "🚀",
    image: "assets/riri_head.png",
    fullImage: "assets/riri.png",
    greeting: "哈囉小探險家！我是里里，準備好跟我一起探索世界的奇蹟了嗎？"
  },
  nana: {
    name: "娜娜 Nana",
    role: "",
    color: "#F472B6",
    tagline: "細心聰明，喜歡觀察與思考。",
    avatarIcon: "🔍",
    image: "assets/nana_head.png",
    fullImage: "assets/nana.png",
    greeting: "嗨！我是娜娜！你知道身邊的世界藏著多少好玩的秘密嗎？讓我們一起闖關吧！"
  }
};

const THEMES_CONFIG = [
  {
    id: "earth",
    title: "地球大冒險",
    englishTitle: "Earth Adventure",
    icon: '<img src="assets/icons/icon_earth_nature.png" class="theme-custom-icon" alt="">',
    badgeIcon: '<img src="assets/icons/icon_dinosaur.png" class="badge-custom-icon" alt="">',
    color: "#10B981",
    colorDark: "#047857",
    lightBg: "#ECFDF5",
    borderColor: "#A7F3D0",
    description: "化身小小古生物學家，穿梭億萬年時空，發掘神秘恐龍化石與地球大自然的驚奇奧秘！"
  },
  {
    id: "body",
    title: "人體大冒險",
    englishTitle: "Human Body Adventure",
    icon: '<img src="assets/icons/icon_skeleton_heart.png" class="theme-custom-icon" alt="">',
    badgeIcon: '<img src="assets/icons/icon_magnifier_microbe.png" class="badge-custom-icon" alt="">',
    color: "#F59E0B",
    colorDark: "#B45309",
    lightBg: "#FFFBEB",
    borderColor: "#FDE68A",
    description: "走進人體的神奇工廠！探索保護大腦的堅固骨骼，以及默默阻擋病毒細菌的黏黏鼻涕超人！"
  },
  {
    id: "clock",
    title: "時鐘大冒險",
    englishTitle: "Clock Adventure",
    icon: '<img src="assets/icons/icon_math_numbers.png" class="theme-custom-icon" alt="">',
    badgeIcon: '<img src="assets/icons/icon_rocket_space.png" class="badge-custom-icon" alt="">',
    color: "#8B5CF6",
    colorDark: "#6D28D9",
    lightBg: "#F5F3FF",
    borderColor: "#DDD6FE",
    description: "滴答滴答！認識時針與分針的走動秘密，學會看懂整點與5分鐘，當時間的魔法小主人！"
  },
  {
    id: "space",
    title: "宇宙大冒險",
    englishTitle: "Space Adventure",
    icon: '<img src="assets/icons/icon_rocket_space.png" class="theme-custom-icon" alt="">',
    badgeIcon: '<img src="assets/icons/icon_planet_saturn.png" class="badge-custom-icon" alt="">',
    color: "#3B82F6",
    colorDark: "#1D4ED8",
    lightBg: "#EFF6FF",
    borderColor: "#BFDBFE",
    description: "搭乘里里號太空船航向璀璨星際，拜訪太陽系八大行星，解鎖星空宇宙的無限神奇！"
  }
];

const LEVELS_DATA = [
  {
    id: 1,
    themeId: "space",
    title: "宇宙大冒險",
    subtitle: "8大行星大冒險",
    category: "宇宙天文",
    color: "#6366F1",
    bgColor: "#EEF2FF",
    icon: "🪐",
    videoId: "qB-9EbBClvI",
    description: "搭乘里里號太空船，前往太陽系拜訪八大行星！水星、金星、地球、火星、木星、土星、天王星和海王星，每一顆都有自己的神奇超能力喔！",
    dialogue: {
      speaker: "riri",
      text: "小探險家！你知道太陽系裡哪顆行星長得最巨大？哪一顆戴著美麗的大光環草帽嗎？看完了影片，趕快來接受行星挑戰吧！"
    },
    funFact: "你知道嗎？土星周圍的美麗光環，其實是由數十億顆冰塊、岩石碎片和小灰塵組成的呢！就像是一圈閃亮的冰雪呼啦圈！",
    badge: {
      id: "badge-space",
      name: "宇宙領航家勳章",
      icon: "🪐",
      color: "#6366F1",
      desc: "成功探索太陽系八大行星，具備探索星空的滿滿好奇心！"
    },
    questions: [
      {
        question: "太陽系家族中，身材最巨大、就像老大哥一樣的是哪一顆行星？",
        options: ["木星", "火星", "水星", "金星"],
        correctIndex: 0,
        explanation: "木星是太陽系中體積和質量最大的行星，它的肚子大到可以裝下一千多個地球呢！"
      },
      {
        question: "哪一顆行星頭頂戴著超級漂亮、由冰塊和岩石組成的顯眼「大光環」？",
        options: ["土星", "海王星", "地球", "水星"],
        correctIndex: 0,
        explanation: "答對了！土星以它寬闊而美麗的光環聞名於整個太陽系！"
      },
      {
        question: "我們人類和動植物生活在哪一顆充滿水與生命的藍色美麗星球上？",
        options: ["地球", "火星", "天王星", "木星"],
        correctIndex: 0,
        explanation: "沒錯！地球是我們美麗的家園，因為有海洋與大氣層，從太空中看是一顆湛藍色的寶石！"
      }
    ]
  },
  {
    id: 2,
    themeId: "body",
    title: "人體大冒險",
    subtitle: "人體骨頭探險隊",
    category: "人體奧秘",
    color: "#F59E0B",
    bgColor: "#FEF3C7",
    icon: "🦴",
    videoId: "uXDQeY9T0Uo",
    description: "如果人體沒有骨頭，我們就會像軟趴趴的果凍一樣！跟著娜娜走進神奇的骨骼世界，看看堅固的骨骼是如何保護我們跳躍、奔跑和大笑的！",
    dialogue: {
      speaker: "nana",
      text: "摸摸你的手背、膝蓋和頭頂，是不是硬硬的？這就是骨頭在默默守護我們喔！猜猜看我們身體裡藏了幾塊骨頭呢？"
    },
    funFact: "大人全身有 206 塊骨頭！而小北鼻出生的時候其實有大約 300 塊骨頭，隨著長大，有些骨頭會漸漸合成一塊喔！",
    badge: {
      id: "badge-skeleton",
      name: "骨骼小衛士勳章",
      icon: "🦴",
      color: "#F59E0B",
      desc: "認識了神奇的人體骨架，懂得喝牛奶、運動來愛護強壯骨頭！"
    },
    questions: [
      {
        question: "成年人的身體裡面，總共有多少塊堅固的骨頭支撐著我們？",
        options: ["大約 206 塊", "只有 10 塊", "大約 10,000 塊", "大約 50 塊"],
        correctIndex: 0,
        explanation: "成年人全身共有 206 塊骨頭，互相連接支撐起我們的身體結構！"
      },
      {
        question: "像安全帽一樣堅固的「頭骨」，是為了保護身體裡哪一個超級指揮中心？",
        options: ["大腦", "胃部", "腳趾頭", "手肘"],
        correctIndex: 0,
        explanation: "頭骨就像是最頂級的安全頭盔，緊緊保護著我們掌管思考與記憶的大腦！"
      },
      {
        question: "想要骨頭長得結實又健康，平時可以多攝取含有豐富鈣質的什麼食物？",
        options: ["牛奶與起司豆類", "炸雞配可樂", "彩色棒棒糖", "冰淇淋"],
        correctIndex: 0,
        explanation: "牛奶、優酪乳、小魚乾和豆類富含鈣質，多曬曬太陽做運動，骨頭就會頭好壯壯！"
      }
    ]
  },
  {
    id: 3,
    themeId: "body",
    title: "人體大冒險",
    subtitle: "鼻涕是怎麼來的？你鼻子裡的小秘密！",
    category: "健康科學",
    color: "#10B981",
    bgColor: "#D1FAE5",
    icon: "👃",
    videoId: "4OV_YSKpeMQ",
    description: "哈啾！流鼻涕的時候總覺得好麻煩？其實鼻涕是我們鼻子裡最忠誠的「黏黏超人」！它每天默默幫我們擋掉多少細菌和灰塵呢？",
    dialogue: {
      speaker: "riri",
      text: "很多人以為鼻涕只是髒東西，其實鼻涕可是人體的超級防衛網！快來認識這群默默守護我們呼吸系統的小英雄吧！"
    },
    funFact: "一個健康的健康人每天鼻子大約會分泌 1 公升左右的黏液，大部分都在不知不覺中被我們吞下去並被胃酸消滅了呢！",
    badge: {
      id: "badge-nose",
      name: "免疫防禦兵勳章",
      icon: "💧",
      color: "#10B981",
      desc: "解開了鼻腔黏液的防護大秘密，養成打噴嚏遮口鼻、勤洗手的好習慣！"
    },
    questions: [
      {
        question: "鼻子裡的鼻涕平常最重要的「超能力任務」是什麼？",
        options: ["像蜘蛛網一樣黏住空氣中的灰塵與細菌", "讓鼻子發出音樂", "幫舌頭品嚐味道", "讓頭髮長長"],
        correctIndex: 0,
        explanation: "鼻涕含有黏液蛋白與抗體，能把吸入的髒汙和病菌牢牢黏住，防止它們進入脆弱的肺部！"
      },
      {
        question: "鼻子裡像小毛刷一樣，會把黏著髒東西的黏液往外推動的微小結構叫什麼？",
        options: ["鼻纖毛", "小彈簧", "小牙齒", "小螺旋槳"],
        correctIndex: 0,
        explanation: "鼻纖毛每秒都在微小擺動，就像成千上萬把微型掃帚，把黏有灰塵的黏液往喉嚨或鼻孔方向掃除！"
      },
      {
        question: "當我們感冒被病毒入侵時，為什麼身體會分泌更多鼻涕？",
        options: ["身體正在啟動大清洗，想把病毒沖走", "因為身體肚子太餓了", "鼻子想睡覺了", "為了讓說話聲音變大"],
        correctIndex: 0,
        explanation: "感冒時身體的免疫警報響起，鼻腔分泌大量黏液來把細菌和病毒清洗稀釋並排出體外！"
      }
    ]
  },
  {
    id: 4,
    themeId: "earth",
    title: "地球大冒險",
    subtitle: "恐龍探險隊 - 化石藏著好多秘密 上集!",
    category: "古生物探奇",
    color: "#EF4444",
    bgColor: "#FEE2E2",
    icon: "🦕",
    videoId: "rPxJhIyQFxA",
    description: "穿上探險靴、拿好小毛刷！跟著里里和娜娜走進億萬年前的恐龍時代，看看古生物學家如何透過石頭裡的一塊骨頭、一顆腳印，拼湊出恐龍霸主的傳奇！",
    dialogue: {
      speaker: "nana",
      text: "恐龍雖然很久以前就消失在地球上了，但它們留下了神秘的時光寶盒——化石！快來化身小小古生物學家，尋找地底的驚奇！"
    },
    funFact: "世界上發現最大的恐龍之一「阿根廷龍」，體長超過 35 公尺，體重相當於十幾頭大象！化石的一根大腿骨就比一個大人還要高！",
    badge: {
      id: "badge-dino",
      name: "化石大偵探勳章",
      icon: "🦖",
      color: "#EF4444",
      desc: "懂得用細心與科學推理解讀遠古化石，榮獲恐龍專家稱號！"
    },
    questions: [
      {
        question: "現代科學家是透過在岩石地層中找到什麼，才知道遠古地球曾經有恐龍生活過？",
        options: ["恐龍化石與腳印遺跡", "恐龍拍的彩色照片", "太空人的日記", "深海裡的機器人"],
        correctIndex: 0,
        explanation: "古生物學家在世界各地發掘出恐龍的骨骼、牙齒、蛋甚至皮膚壓痕的化石，解開了古老生命的歷史！"
      },
      {
        question: "古代動植物的遺骸要變成堅硬的「化石」，通常需要經過多漫長的時間？",
        options: ["需要數萬年甚至數百萬年的地質變化", "只要放三天就可以", "只要過一個週末", "大約一個小時"],
        correctIndex: 0,
        explanation: "化石的形成非常稀有且漫長，需要生物遺體被泥沙迅速掩埋，經過數百萬年礦物質滲透石化才能誕生！"
      },
      {
        question: "電影裡最威風、擁有強大咬合力與鋸齒狀牙齒的著名肉食恐龍是誰？",
        options: ["暴龍 (霸王龍)", "三角龍", "劍龍", "腕龍"],
        correctIndex: 0,
        explanation: "霸王龍（Tyrannosaurus Rex）是白堊紀末期最著名的頂級掠食者，擁有鋒利的巨齒與驚人的力量！"
      }
    ]
  },
  {
    id: 5,
    themeId: "clock",
    title: "時鐘大冒險",
    subtitle: "認識整點和5分鐘",
    category: "生活數理",
    color: "#8B5CF6",
    bgColor: "#F5F3FF",
    icon: "⏰",
    videoId: "zJAnWWeaqUY",
    description: "滴答滴答！時鐘上有兩根神奇的小指針，矮矮胖胖的是誰？高高瘦瘦的又是誰？只要學會看懂時鐘，你就能成為掌控時間的魔法小主人！",
    dialogue: {
      speaker: "riri",
      text: "小探險家，你每天幾點起床上學、幾點吃晚餐呢？學會看時鐘，就能自己安排冒險日程囉！快來跟我挑戰時鐘大轉盤！"
    },
    funFact: "時鐘上的分針每走一大格（從數字 1 走到 2），實際上代表時間溜過了 5 分鐘！分針轉完一整圈 12 格，正好是 60 分鐘＝ 1 小時！",
    badge: {
      id: "badge-clock",
      name: "時鐘守護者勳章",
      icon: "⏰",
      color: "#8B5CF6",
      desc: "成功掌握時針與分針的走動規律，懂得珍惜時間、守時守信！"
    },
    questions: [
      {
        question: "時鐘錶面上，走得比較慢、身材矮矮胖胖的指針是哪一根？",
        options: ["時針", "分針", "秒針", "指南針"],
        correctIndex: 0,
        explanation: "矮胖走得慢的是「時針」，它負責告訴我們現在是幾點鐘喔！"
      },
      {
        question: "高高瘦瘦的「分針」從數字 12 走到數字 1，代表時間過去了幾分鐘？",
        options: ["5 分鐘", "1 分鐘", "60 分鐘", "10 分鐘"],
        correctIndex: 0,
        explanation: "分針每走一個大數字格子就是 5 分鐘！5、10、15、20...大家可以一起練習 5 的乘法唷！"
      },
      {
        question: "如果矮胖的時針正正指在 3，瘦長的分針正正指在 12，現在是幾點整？",
        options: ["3 點整", "12 點整", "3 點 12 分", "6 點整"],
        correctIndex: 0,
        explanation: "太棒了！分針在 12 代表整點，時針指著 3 就是「3點整」！"
      }
    ]
  }
];

const SCIENCE_WIKI = [
  {
    q: "為什麼天上的星星會一閃一閃眨眼睛？",
    a: "因為遙遠星光穿過地球的大氣層時，空氣冷熱流動造成光線折射抖動，看起來就像在對我們眨眼睛一樣喔！",
    icon: '<img src="assets/icons/icon_planet_saturn.png" class="wiki-custom-icon" alt="">'
  },
  {
    q: "為什麼運動後我們的心跳會咚咚咚加速？",
    a: "因為跑步運動時肌肉需要大量氧氣，心臟像超級幫浦一樣加快打血，把養分和氧氣快速送到全身！",
    icon: '<img src="assets/icons/icon_skeleton_heart.png" class="wiki-custom-icon" alt="">'
  },
  {
    q: "為什麼恐龍會突然在地球上消失呢？",
    a: "科學家發現大約 6600 萬年前，一顆巨大隕石撞擊地球引發氣候驟變，恐龍無法適應新環境而滅絕，但有一部分演變成了我們今天看見的鳥類喔！",
    icon: '<img src="assets/icons/icon_dinosaur.png" class="wiki-custom-icon" alt="">'
  },
  {
    q: "為什麼彩虹總共有七種顏色？",
    a: "太陽光其實混合了許多顏色，當陽光照在雨後空氣中的小水滴時，水滴像三稜鏡一樣把陽光折射分解開來，就出現了紅橙黃綠藍靛紫的美麗彩虹！",
    icon: '<img src="assets/icons/icon_sun_rainbow.png" class="wiki-custom-icon" alt="">'
  }
];
