// 草クラス
export class Grass {
    constructor(category, name, buyPrice, sellPrice, candidates) {
        this.category = category
        this.name = name
        this.buyPrice = buyPrice
        this.sellPrice = sellPrice
        this.candidates = candidates
    }
}

// 巻物クラス
export class Scroll {
    constructor(category, name, buyPrice, sellPrice, useToItem, candidates) {
        this.category = category
        this.name = name
        this.buyPrice = buyPrice
        this.sellPrice = sellPrice
        this.useToItem = useToItem
        this.candidates = candidates
    }
}

// 杖クラス
export class Staff {
    constructor(category, name, buyPrice, sellPrice, charges, candidates) {
        this.category = category
        this.name = name
        this.buyPrice = buyPrice
        this.sellPrice = sellPrice
        this.charges = charges
        this.candidates = candidates
    }
}

// 腕輪クラス
export class Bracelet {
    constructor(category, name, buyPrice, sellPrice, candidates) {
        this.category = category
        this.name = name
        this.buyPrice = buyPrice
        this.sellPrice = sellPrice
        this.candidates = candidates
    }
}

// お香クラス
export class Incense {
    constructor(category, name, buyPrice, sellPrice, candidates) {
        this.category = category
        this.name = name
        this.buyPrice = buyPrice
        this.sellPrice = sellPrice
        this.candidates = candidates
    }
}

// 壺クラス
export class Pot {
    constructor(category, name, buyPrice, sellPrice, emptyOrBack, candidates) {
        this.category = category
        this.name = name
        this.buyPrice = buyPrice
        this.sellPrice = sellPrice
        this.emptyOrBack = emptyOrBack
        this.candidates = candidates
    }
}


// 買値、売値の対応表（一部の草が、0.4かけるだけではダメなので）
export const buyToSell = {
    10: 4,
    40: 10,
    50: 20,
    70: 25,
    80: 30,
    100: 40,
    200: 80,
    250: 100,
    300: 120,
    400: 160,
    500: 200,
    600: 240,
    700: 280,
    900: 360,
    1000: 400,
    1100: 440,
    1200: 480,
    1300: 520,
    1400: 560,
    1500: 600,
    1600: 640,
    1700: 680,
    1800: 720,
    1900: 760,
    2000: 800,
    2200: 880,
    2300: 920,
    2400: 960,
    2500: 1000,
    2600: 1040,
    3000: 1200,
    3500: 1400,
    4000: 1600,
    5000: 2000,
    6300: 2520,
    6400: 2560,
    6500: 2600,
    7500: 3000,
    10000: 4000,
    10200: 4080,
    10300: 4120,
    15000: 6000
}

// 売値→買値の対応表を作成
export const sellToBuy = Object.fromEntries(
    Object.entries(buyToSell).map(([buy, sell]) => [sell, buy])
);

// 実際のアイテムの詳細データ

// 草リスト
export const grassList = [
    { name: "雑草", buyPrice: 10, sellPrice: 4 },
    { name: "薬草", buyPrice: 40, sellPrice: 10 },
    { name: "暴走の種", buyPrice: 50, sellPrice: 20 },
    { name: "毒草", buyPrice: 50, sellPrice: 20 },
    { name: "目つぶし草", buyPrice: 70, sellPrice: 25 },
    { name: "パワーアップ草", buyPrice: 70, sellPrice: 25 },
    { name: "めぐすり草", buyPrice: 70, sellPrice: 25 },
    { name: "混乱草", buyPrice: 70, sellPrice: 25 },
    { name: "すばやさ草", buyPrice: 70, sellPrice: 25 },
    { name: "睡眠草", buyPrice: 70, sellPrice: 25 },
    { name: "弟切草", buyPrice: 80, sellPrice: 30 },
    { name: "くねくね草", buyPrice: 100, sellPrice: 40 },
    { name: "高飛び草", buyPrice: 100, sellPrice: 40 },
    { name: "いやし草", buyPrice: 200, sellPrice: 80 },
    { name: "胃拡張の種", buyPrice: 200, sellPrice: 80 },
    { name: "胃縮小の種", buyPrice: 200, sellPrice: 80 },
    { name: "かぐわし草", buyPrice: 200, sellPrice: 80 },
    { name: "ドラゴン草", buyPrice: 250, sellPrice: 100 },
    { name: "無敵草", buyPrice: 400, sellPrice: 160 },
    { name: "復活の草", buyPrice: 400, sellPrice: 160 },
    { name: "不幸の種", buyPrice: 400, sellPrice: 160 },
    { name: "命の草", buyPrice: 500, sellPrice: 200 },
    { name: "毒消し草", buyPrice: 600, sellPrice: 240 },
    { name: "ちからの草", buyPrice: 700, sellPrice: 280 },
    { name: "しあわせ草", buyPrice: 1000, sellPrice: 400 },
    { name: "超不幸の種", buyPrice: 2000, sellPrice: 800 },
    { name: "天使の種", buyPrice: 2000, sellPrice: 800 }
]

// 巻物リスト
export const scrollList = [
    { name: "ぬれた巻物", buyPrice: 200, sellPrice: 80, useToItem: false },
    { name: "識別の巻物", buyPrice: 300, sellPrice: 120, useToItem: true },
    { name: "銀封印の巻物", buyPrice: 300, sellPrice: 120, useToItem: true },
    { name: "生物集合の巻物", buyPrice: 300, sellPrice: 120, useToItem: false },
    { name: "混乱の巻物", buyPrice: 300, sellPrice: 120, useToItem: false },
    { name: "バクスイの巻物", buyPrice: 300, sellPrice: 120, useToItem: false },
    { name: "道具寄せの巻物", buyPrice: 300, sellPrice: 120, useToItem: false },
    { name: "ゾワゾワの巻物", buyPrice: 300, sellPrice: 120, useToItem: false },
    { name: "困った時の巻物", buyPrice: 300, sellPrice: 120, useToItem: false },
    { name: "真空斬りの巻物", buyPrice: 300, sellPrice: 120, useToItem: false },
    { name: "印増大の巻物", buyPrice: 400, sellPrice: 160, useToItem: true },
    { name: "印消しの巻物", buyPrice: 400, sellPrice: 160, useToItem: true },
    { name: "メッキの巻物", buyPrice: 400, sellPrice: 160, useToItem: true },
    { name: "地の恵みの巻物", buyPrice: 400, sellPrice: 160, useToItem: true },
    { name: "天の恵みの巻物", buyPrice: 400, sellPrice: 160, useToItem: true },
    { name: "おにぎりの巻物", buyPrice: 400, sellPrice: 160, useToItem: true },
    { name: "罠消しの巻物", buyPrice: 600, sellPrice: 240, useToItem: false },
    { name: "あかりの巻物", buyPrice: 600, sellPrice: 240, useToItem: false },
    { name: "迷子の巻物", buyPrice: 600, sellPrice: 240, useToItem: false },
    { name: "おはらいの巻物", buyPrice: 600, sellPrice: 240, useToItem: true },
    { name: "敵加速の巻物", buyPrice: 1000, sellPrice: 400, useToItem: false },
    { name: "拾えずの巻物", buyPrice: 1000, sellPrice: 400, useToItem: false },
    { name: "くちなしの巻物", buyPrice: 1000, sellPrice: 400, useToItem: false },
    { name: "バクチの巻物", buyPrice: 1000, sellPrice: 400, useToItem: false },
    { name: "大部屋の巻物", buyPrice: 1000, sellPrice: 400, useToItem: false },
    { name: "水がれの巻物", buyPrice: 1000, sellPrice: 400, useToItem: false },
    { name: "魔物部屋の巻物", buyPrice: 1000, sellPrice: 400, useToItem: false },
    { name: "罠の巻物", buyPrice: 1000, sellPrice: 400, useToItem: false },
    { name: "呪いの巻物", buyPrice: 1000, sellPrice: 400, useToItem: true },
    { name: "吸い出しの巻物", buyPrice: 1000, sellPrice: 400, useToItem: true },
    { name: "壺増大の巻物", buyPrice: 1000, sellPrice: 400, useToItem: true },
    { name: "銀はがしの巻物", buyPrice: 1000, sellPrice: 400, useToItem: true },
    { name: "脱出の巻物", buyPrice: 1000, sellPrice: 400, useToItem: false },
    { name: "聖域の巻物", buyPrice: 1000, sellPrice: 400, useToItem: false },
    { name: "白紙の巻物", buyPrice: 1000, sellPrice: 400, useToItem: false },
    { name: "全滅の巻物", buyPrice: 3000, sellPrice: 1200, useToItem: false },
    { name: "ねだやしの巻物", buyPrice: 10000, sellPrice: 4000, useToItem: false }
]


// 杖リスト
export const staffList = [
    { name: "感電の杖[4]", buyPrice: 900, sellPrice: 360 },
    { name: "封印の杖[4]", buyPrice: 900, sellPrice: 360 },
    { name: "かなしばりの杖[4]", buyPrice: 900, sellPrice: 360 },
    { name: "導きの杖[2]", buyPrice: 900, sellPrice: 360 },
    { name: "場所がえの杖[5]", buyPrice: 1000, sellPrice: 400 },
    { name: "かなしばりの杖[5]", buyPrice: 1000, sellPrice: 400 },
    { name: "吹き飛ばしの杖[5]", buyPrice: 1000, sellPrice: 400 },
    { name: "導きの杖[3]", buyPrice: 1000, sellPrice: 400 },
    { name: "封印の杖[5]", buyPrice: 1000, sellPrice: 400 },
    { name: "飛びつきの杖[5]", buyPrice: 1000, sellPrice: 400 },
    { name: "ただの杖[5]", buyPrice: 1000, sellPrice: 400 },
    { name: "感電の杖[5]", buyPrice: 1000, sellPrice: 400 },
    { name: "転ばぬ先の杖[5]", buyPrice: 1000, sellPrice: 400 },
    { name: "導きの杖[4]", buyPrice: 1100, sellPrice: 440 },
    { name: "ただの杖[6]", buyPrice: 1100, sellPrice: 440 },
    { name: "かなしばりの杖[6]", buyPrice: 1100, sellPrice: 440 },
    { name: "鈍足の杖[4]", buyPrice: 1100, sellPrice: 440 },
    { name: "封印の杖[6]", buyPrice: 1100, sellPrice: 440 },
    { name: "感電の杖[6]", buyPrice: 1100, sellPrice: 440 },
    { name: "加速の杖[4]", buyPrice: 1100, sellPrice: 440 },
    { name: "吹き飛ばしの杖[6]", buyPrice: 1100, sellPrice: 440 },
    { name: "場所がえの杖[6]", buyPrice: 1100, sellPrice: 440 },
    { name: "飛びつきの杖[6]", buyPrice: 1100, sellPrice: 440 },
    { name: "トンネルの杖[4]", buyPrice: 1100, sellPrice: 440 },
    { name: "転ばぬ先の杖[6]", buyPrice: 1100, sellPrice: 440 },
    { name: "土塊の杖[4]", buyPrice: 1100, sellPrice: 440 },
    { name: "土塊の杖[5]", buyPrice: 1200, sellPrice: 480 },
    { name: "転ばぬ先の杖[7]", buyPrice: 1200, sellPrice: 480 },
    { name: "トンネルの杖[5]", buyPrice: 1200, sellPrice: 480 },
    { name: "飛びつきの杖[7]", buyPrice: 1200, sellPrice: 480 },
    { name: "吹き飛ばしの杖[7]", buyPrice: 1200, sellPrice: 480 },
    { name: "鈍足の杖[5]", buyPrice: 1200, sellPrice: 480 },
    { name: "ただの杖[7]", buyPrice: 1200, sellPrice: 480 },
    { name: "場所がえの杖[7]", buyPrice: 1200, sellPrice: 480 },
    { name: "加速の杖[5]", buyPrice: 1200, sellPrice: 480 },
    { name: "鈍足の杖[6]", buyPrice: 1300, sellPrice: 520 },
    { name: "トンネルの杖[6]", buyPrice: 1300, sellPrice: 520 },
    { name: "加速の杖[6]", buyPrice: 1300, sellPrice: 520 },
    { name: "土塊の杖[6]", buyPrice: 1300, sellPrice: 520 },
    { name: "不幸の杖[4]", buyPrice: 1400, sellPrice: 560 },
    { name: "幸せの杖[4]", buyPrice: 1400, sellPrice: 560 },
    { name: "一時しのぎの杖[4]", buyPrice: 1400, sellPrice: 560 },
    { name: "一時しのぎの杖[5]", buyPrice: 1500, sellPrice: 600 },
    { name: "痛み分けの杖[5]", buyPrice: 1500, sellPrice: 600 },
    { name: "不幸の杖[5]", buyPrice: 1500, sellPrice: 600 },
    { name: "幸せの杖[5]", buyPrice: 1500, sellPrice: 600 },
    { name: "ガイコツまどうの杖[5]", buyPrice: 1500, sellPrice: 600 },
    { name: "痛み分けの杖[6]", buyPrice: 1600, sellPrice: 640 },
    { name: "幸せの杖[6]", buyPrice: 1600, sellPrice: 640 },
    { name: "不幸の杖[6]", buyPrice: 1600, sellPrice: 640 },
    { name: "一時しのぎの杖[6]", buyPrice: 1600, sellPrice: 640 },
    { name: "ガイコツまどうの杖[6]", buyPrice: 1600, sellPrice: 640 },
    { name: "ガイコツまどうの杖[7]", buyPrice: 1700, sellPrice: 680 },
    { name: "痛み分けの杖[7]", buyPrice: 1700, sellPrice: 680 },
    { name: "桃まんの杖[4]", buyPrice: 2400, sellPrice: 960 },
    { name: "身代わりの杖[4]", buyPrice: 2400, sellPrice: 960 },
    { name: "桃まんの杖[5]", buyPrice: 2500, sellPrice: 1000 },
    { name: "身代わりの杖[5]", buyPrice: 2500, sellPrice: 1000 },
    { name: "身代わりの杖[6]", buyPrice: 2600, sellPrice: 1040 },
    { name: "桃まんの杖[6]", buyPrice: 2600, sellPrice: 1040 }
]


// 腕輪リスト
export const braceletList = [
    { name: "痛恨の腕輪", buyPrice: 1500, sellPrice: 600 },
    { name: "ボヨヨンの腕輪", buyPrice: 1500, sellPrice: 600 },
    { name: "罠増しの腕輪", buyPrice: 1500, sellPrice: 600 },
    { name: "垂れ流しの腕輪", buyPrice: 1500, sellPrice: 600 },
    { name: "連射の腕輪", buyPrice: 1500, sellPrice: 600 },
    { name: "諸刃の腕輪", buyPrice: 1500, sellPrice: 600 },
    { name: "ヘタ投げの腕輪", buyPrice: 1500, sellPrice: 600 },
    { name: "遠投の腕輪", buyPrice: 1500, sellPrice: 600 },
    { name: "爆発の腕輪", buyPrice: 1500, sellPrice: 600 },
    { name: "高飛びの腕輪", buyPrice: 1500, sellPrice: 600 },
    { name: "金垂れ流しの腕輪", buyPrice: 1500, sellPrice: 600 },
    { name: "ちからの腕輪", buyPrice: 2000, sellPrice: 800 },
    { name: "睡眠よけの腕輪", buyPrice: 2500, sellPrice: 1000 },
    { name: "大砲強化の腕輪", buyPrice: 2500, sellPrice: 1000 },
    { name: "道具感知の腕輪", buyPrice: 2500, sellPrice: 1000 },
    { name: "気配察知の腕輪", buyPrice: 2500, sellPrice: 1000 },
    { name: "呪いよけの腕輪", buyPrice: 3000, sellPrice: 1200 },
    { name: "魔物呼びの腕輪", buyPrice: 3000, sellPrice: 1200 },
    { name: "浮遊の腕輪", buyPrice: 3000, sellPrice: 1200 },
    { name: "水グモの腕輪", buyPrice: 3000, sellPrice: 1200 },
    { name: "胃縮小の腕輪", buyPrice: 3500, sellPrice: 1400 },
    { name: "胃拡張の腕輪", buyPrice: 3500, sellPrice: 1400 },
    { name: "値切りの腕輪", buyPrice: 3500, sellPrice: 1400 },
    { name: "弾きよけの腕輪", buyPrice: 3500, sellPrice: 1400 },
    { name: "しあわせの腕輪", buyPrice: 4000, sellPrice: 1600 },
    { name: "混乱よけの腕輪", buyPrice: 4000, sellPrice: 1600 },
    { name: "裏道の腕輪", buyPrice: 5000, sellPrice: 2000 },
    { name: "回復の腕輪", buyPrice: 5000, sellPrice: 2000 },
    { name: "錆よけの腕輪", buyPrice: 5000, sellPrice: 2000 },
    { name: "透視の腕輪", buyPrice: 5000, sellPrice: 2000 },
    { name: "すれちがいの腕輪", buyPrice: 5000, sellPrice: 2000 },
    { name: "壁抜けの腕輪", buyPrice: 6500, sellPrice: 2600 },
    { name: "忍び足の腕輪", buyPrice: 6500, sellPrice: 2600 },
    { name: "毒消しの腕輪", buyPrice: 6500, sellPrice: 2600 },
    { name: "鑑定師の腕輪", buyPrice: 7500, sellPrice: 3000 },
    { name: "罠師の腕輪", buyPrice: 7500, sellPrice: 3000 },
    { name: "百発百中の腕輪", buyPrice: 15000, sellPrice: 6000 }
]


// お香リスト
export const incenseList = [
    { name: "無欲のお香[2]", buyPrice: 2200, sellPrice: 880 },
    { name: "耐炎耐爆のお香[2]", buyPrice: 2200, sellPrice: 880 },
    { name: "目配りのお香[2]", buyPrice: 2200, sellPrice: 880 },
    { name: "攻めのお香[2]", buyPrice: 2200, sellPrice: 880 },
    { name: "守りのお香[2]", buyPrice: 2200, sellPrice: 880 },
    { name: "山彦のお香[2]", buyPrice: 2200, sellPrice: 880 },
    { name: "身かわしのお香[2]", buyPrice: 2200, sellPrice: 880 },
    { name: "視界不良のお香[2]", buyPrice: 2200, sellPrice: 880 },
    { name: "重力のお香[2]", buyPrice: 2200, sellPrice: 880 },
    { name: "身かわしのお香[3]", buyPrice: 2300, sellPrice: 920 },
    { name: "目配りのお香[3]", buyPrice: 2300, sellPrice: 920 },
    { name: "重力のお香[3]", buyPrice: 2300, sellPrice: 920 },
    { name: "守りのお香[3]", buyPrice: 2300, sellPrice: 920 },
    { name: "山彦のお香[3]", buyPrice: 2300, sellPrice: 920 },
    { name: "耐炎耐爆のお香[3]", buyPrice: 2300, sellPrice: 920 },
    { name: "攻めのお香[3]", buyPrice: 2300, sellPrice: 920 },
    { name: "視界不良のお香[3]", buyPrice: 2300, sellPrice: 920 },
    { name: "無欲のお香[3]", buyPrice: 2300, sellPrice: 920 },
    { name: "視界不良のお香[4]", buyPrice: 2400, sellPrice: 960 },
    { name: "耐炎耐爆のお香[4]", buyPrice: 2400, sellPrice: 960 },
    { name: "目配りのお香[4]", buyPrice: 2400, sellPrice: 960 },
    { name: "守りのお香[4]", buyPrice: 2400, sellPrice: 960 },
    { name: "攻めのお香[4]", buyPrice: 2400, sellPrice: 960 },
    { name: "身かわしのお香[4]", buyPrice: 2400, sellPrice: 960 },
    { name: "山彦のお香[4]", buyPrice: 2400, sellPrice: 960 },
    { name: "重力のお香[4]", buyPrice: 2400, sellPrice: 960 },
    { name: "無欲のお香[4]", buyPrice: 2400, sellPrice: 960 }
]


// 壺リスト
export const potList = [
    { name: "やりすごしの壺[3]", buyPrice: 1100, sellPrice: 440, useToItem: "空っぽ" },
    { name: "識別の壺[3]", buyPrice: 1100, sellPrice: 440, useToItem: "空っぽ" },
    { name: "ただの壺[3]", buyPrice: 1100, sellPrice: 440, useToItem: "空っぽ" },
    { name: "変化の壺[3]", buyPrice: 1100, sellPrice: 440, useToItem: "空っぽ" },
    { name: "保存の壺[3]", buyPrice: 1100, sellPrice: 440, useToItem: "空っぽ" },
    { name: "底抜けの壺[2]", buyPrice: 1200, sellPrice: 480, useToItem: "空っぽ" },
    { name: "倉庫の壺[2]", buyPrice: 1200, sellPrice: 480, useToItem: "空っぽ" },
    { name: "ただの壺[4]", buyPrice: 1200, sellPrice: 480, useToItem: "空っぽ" },
    { name: "やりすごしの壺[4]", buyPrice: 1200, sellPrice: 480, useToItem: "空っぽ" },
    { name: "保存の壺[4]", buyPrice: 1200, sellPrice: 480, useToItem: "空っぽ" },
    { name: "識別の壺[4]", buyPrice: 1200, sellPrice: 480, useToItem: "空っぽ" },
    { name: "変化の壺[4]", buyPrice: 1200, sellPrice: 480, useToItem: "空っぽ" },
    { name: "保存の壺[5]", buyPrice: 1300, sellPrice: 520, useToItem: "空っぽ" },
    { name: "識別の壺[5]", buyPrice: 1300, sellPrice: 520, useToItem: "空っぽ" },
    { name: "倉庫の壺[3]", buyPrice: 1300, sellPrice: 520, useToItem: "空っぽ" },
    { name: "変化の壺[5]", buyPrice: 1300, sellPrice: 520, useToItem: "空っぽ" },
    { name: "換金の壺[3]", buyPrice: 1300, sellPrice: 520, useToItem: "空っぽ" },
    { name: "底抜けの壺[3]", buyPrice: 1300, sellPrice: 520, useToItem: "空っぽ" },
    { name: "やりすごしの壺[5]", buyPrice: 1300, sellPrice: 520, useToItem: "空っぽ" },
    { name: "ただの壺[5]", buyPrice: 1300, sellPrice: 520, useToItem: "空っぽ" },
    { name: "割れない壺[3]", buyPrice: 1300, sellPrice: 520, useToItem: "空っぽ" },
    { name: "手封じの壺[3]", buyPrice: 1300, sellPrice: 520, useToItem: "空っぽ" },
    { name: "底抜けの壺[4]", buyPrice: 1400, sellPrice: 560, useToItem: "空っぽ" },
    { name: "割れない壺[4]", buyPrice: 1400, sellPrice: 560, useToItem: "空っぽ" },
    { name: "倉庫の壺[4]", buyPrice: 1400, sellPrice: 560, useToItem: "空っぽ" },
    { name: "手封じの壺[4]", buyPrice: 1400, sellPrice: 560, useToItem: "空っぽ" },
    { name: "換金の壺[4]", buyPrice: 1400, sellPrice: 560, useToItem: "空っぽ" },
    { name: "割れない壺[5]", buyPrice: 1500, sellPrice: 600, useToItem: "空っぽ" },
    { name: "換金の壺[5]", buyPrice: 1500, sellPrice: 600, useToItem: "空っぽ" },
    { name: "手封じの壺[5]", buyPrice: 1500, sellPrice: 600, useToItem: "空っぽ" },
    { name: "倉庫の壺[5]", buyPrice: 1500, sellPrice: 600, useToItem: "空っぽ" },
    { name: "おはらいの壺[2]", buyPrice: 1800, sellPrice: 720, useToItem: "空っぽ" },
    { name: "呪いの壺[2]", buyPrice: 1800, sellPrice: 720, useToItem: "空っぽ" },
    { name: "おはらいの壺[3]", buyPrice: 1900, sellPrice: 760, useToItem: "空っぽ" },
    { name: "呪いの壺[3]", buyPrice: 1900, sellPrice: 760, useToItem: "空っぽ" },
    { name: "おはらいの壺[4]", buyPrice: 2000, sellPrice: 800, useToItem: "空っぽ" },
    { name: "呪いの壺[4]", buyPrice: 2000, sellPrice: 800, useToItem: "空っぽ" },
    { name: "笑いの壺[2]", buyPrice: 2200, sellPrice: 880, useToItem: "背中" },
    { name: "笑いの壺[3]", buyPrice: 2300, sellPrice: 920, useToItem: "背中" },
    { name: "魔物の壺[3]", buyPrice: 2300, sellPrice: 920, useToItem: "背中" },
    { name: "水鉄砲の壺[3]", buyPrice: 2300, sellPrice: 920, useToItem: "背中" },
    { name: "トドの壺[3]", buyPrice: 2300, sellPrice: 920, useToItem: "背中" },
    { name: "ビックリの壺[3]", buyPrice: 2300, sellPrice: 920, useToItem: "背中" },
    { name: "背中の壺[3]", buyPrice: 2300, sellPrice: 920, useToItem: "背中" },
    { name: "ビックリの壺[4]", buyPrice: 2400, sellPrice: 960, useToItem: "背中" },
    { name: "魔物の壺[4]", buyPrice: 2400, sellPrice: 960, useToItem: "背中" },
    { name: "水鉄砲の壺[4]", buyPrice: 2400, sellPrice: 960, useToItem: "背中" },
    { name: "トドの壺[4]", buyPrice: 2400, sellPrice: 960, useToItem: "背中" },
    { name: "背中の壺[4]", buyPrice: 2400, sellPrice: 960, useToItem: "背中" },
    { name: "背中の壺[5]", buyPrice: 2500, sellPrice: 1000, useToItem: "背中" },
    { name: "トドの壺[5]", buyPrice: 2500, sellPrice: 1000, useToItem: "背中" },
    { name: "水鉄砲の壺[5]", buyPrice: 2500, sellPrice: 1000, useToItem: "背中" },
    { name: "魔物の壺[5]", buyPrice: 2500, sellPrice: 1000, useToItem: "背中" },
    { name: "ビックリの壺[5]", buyPrice: 2500, sellPrice: 1000, useToItem: "背中" },
    { name: "合成の壺[3]", buyPrice: 6300, sellPrice: 2520, useToItem: "空っぽ" },
    { name: "合成の壺[4]", buyPrice: 6400, sellPrice: 2560, useToItem: "空っぽ" },
    { name: "弱化の壺[2]", buyPrice: 10200, sellPrice: 4080, useToItem: "空っぽ" },
    { name: "強化の壺[2]", buyPrice: 10200, sellPrice: 4080, useToItem: "空っぽ" },
    { name: "強化の壺[3]", buyPrice: 10300, sellPrice: 4120, useToItem: "空っぽ" },
    { name: "弱化の壺[3]", buyPrice: 10300, sellPrice: 4120, useToItem: "空っぽ" }
]