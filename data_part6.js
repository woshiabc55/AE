// Game IP Derivative Works Database - Extended Set Part 6
(function(){
  const EXT = [
  // ============================================================
  // GENSHIN IMPACT (HoYoverse)
  // ============================================================
  {ip:"Genshin Impact", title:"Genshin Impact OST Vol. 1-4", type:"ost", year:2020, region:"CN", publisher:"HoYoverse", desc:"原声专辑。", tags:["OST"]},
  {ip:"Genshin Impact", title:"Genshin Impact (Manga)", type:"manga", year:2022, region:"JP", publisher:"HoYoverse", desc:"官方漫画。", tags:["少年漫画"]},
  {ip:"Genshin Impact", title:"Genshin Impact (Web Toon)", type:"web-series", year:2021, region:"CN", publisher:"HoYoverse", desc:"官方 Web 漫画。", tags:["Web 漫画"]},
  {ip:"Genshin Impact", title:"Genshin Impact (Manga - Caribert)", type:"manga", year:2023, region:"JP", publisher:"HoYoverse", desc:"衍生漫画。", tags:["少年漫画"]},
  {ip:"Genshin Impact", title:"Genshin Impact: Xiao's Theater Stage Play", type:"theater", year:2023, region:"JP", publisher:"HoYoverse", desc:"魈舞台剧。", tags:["舞台剧"]},
  {ip:"Genshin Impact", title:"Genshin Impact: Symphony of Boreal Wind (Concert)", type:"concert", year:2023, region:"Global", publisher:"HoYoverse", desc:"全球巡演。", tags:["音乐会"]},
  {ip:"Genshin Impact", title:"Genshin Impact: Fontaine Symphony (Concert)", type:"concert", year:2024, region:"Global", publisher:"HoYoverse", desc:"枫丹音乐会。", tags:["音乐会"]},
  {ip:"Genshin Impact", title:"Genshin Impact: Genshin Symphony (Concert)", type:"concert", year:2022, region:"Global", publisher:"HoYoverse", desc:"首场音乐会。", tags:["音乐会"]},
  {ip:"Genshin Impact", title:"Genshin Impact Plush (Paimon)", type:"merch-figure", year:2021, region:"CN", publisher:"HoYoverse", desc:"派蒙毛绒。", tags:["毛绒"]},
  {ip:"Genshin Impact", title:"Genshin Impact (Nendoroid - Paimon)", type:"merch-figure", year:2022, region:"JP", publisher:"Good Smile", desc:"派蒙粘土人。", tags:["粘土人"]},
  {ip:"Genshin Impact", title:"Genshin Impact (Figma - Xiao)", type:"merch-figure", year:2022, region:"JP", publisher:"Max Factory", desc:"魈 Figma。", tags:["Figma"]},
  {ip:"Genshin Impact", title:"Genshin Impact (Nendoroid - Hu Tao)", type:"merch-figure", year:2023, region:"JP", publisher:"Good Smile", desc:"胡桃粘土人。", tags:["粘土人"]},
  {ip:"Genshin Impact", title:"Genshin Impact (Acrylic Standee Series)", type:"merch-figure", year:2022, region:"JP", publisher:"Movic", desc:"亚克力立牌。", tags:["立牌"]},
  {ip:"Genshin Impact", title:"Genshin Impact (Trading Card Game - Genshin TCG)", type:"merch-card", year:2023, region:"CN", publisher:"HoYoverse", desc:"七圣召唤官方实体卡。", tags:["TCG"]},
  {ip:"Genshin Impact", title:"Genshin Impact x KFC", type:"collab", year:2022, region:"CN", publisher:"KFC", desc:"肯德基联名。", tags:["餐饮联动"]},
  {ip:"Genshin Impact", title:"Genshin Impact x Pizza Hut", type:"collab", year:2021, region:"CN", publisher:"Pizza Hut", desc:"必胜客联名。", tags:["餐饮联动"]},
  {ip:"Genshin Impact", title:"Genshin Impact x Luckin Coffee", type:"collab", year:2022, region:"CN", publisher:"Luckin", desc:"瑞幸咖啡联名。", tags:["餐饮联动"]},
  {ip:"Genshin Impact", title:"Genshin Impact x Hey Tea", type:"collab", year:2022, region:"CN", publisher:"Hey Tea", desc:"喜茶联名。", tags:["餐饮联动"]},
  {ip:"Genshin Impact", title:"Genshin Impact x Rolls-Royce", type:"collab", year:2022, region:"CN", publisher:"Rolls-Royce", desc:"劳斯莱斯联名。", tags:["奢侈品"]},
  {ip:"Genshin Impact", title:"Genshin Impact x McDonalds", type:"collab", year:2023, region:"Global", publisher:"McDonalds", desc:"麦当劳联名。", tags:["餐饮联动"]},
  {ip:"Genshin Impact", title:"Genshin Impact x UNIQLO UT", type:"merch-cloth", year:2023, region:"Global", publisher:"Uniqlo", desc:"UT 联名。", tags:["服装"]},
  {ip:"Genshin Impact", title:"Genshin Impact x CASETiFY", type:"merch-cloth", year:2023, region:"Global", publisher:"Casetify", desc:"手机壳联名。", tags:["手机壳"]},
  {ip:"Genshin Impact", title:"Genshin Impact x Sweety", type:"collab", year:2023, region:"CN", publisher:"Sweety", desc:"糖果联名。", tags:["餐饮联动"]},
  {ip:"Genshin Impact", title:"Genshin Impact x Mengniu Yogurt", type:"collab", year:2022, region:"CN", publisher:"Mengniu", desc:"蒙牛酸奶联名。", tags:["餐饮联动"]},
  {ip:"Genshin Impact", title:"Genshin Impact (Fan Fest)", type:"event", year:2023, region:"Global", publisher:"HoYoverse", desc:"全球粉丝节。", tags:["粉丝节"]},
  {ip:"Genshin Impact", title:"Genshin Impact (Theme Cafe Tour)", type:"cafe", year:2023, region:"JP", publisher:"HoYoverse", desc:"主题咖啡。", tags:["主题咖啡"]},
  {ip:"Genshin Impact", title:"Genshin Impact (ChinaJoy Booth)", type:"event", year:2023, region:"CN", publisher:"HoYoverse", desc:"ChinaJoy 展台。", tags:["线下活动"]},
  {ip:"Genshin Impact", title:"Genshin Impact (Art Book)", type:"artbook", year:2023, region:"CN", publisher:"HoYoverse", desc:"官方画集。", tags:["画集"]},
  {ip:"Genshin Impact", title:"Genshin Impact (Duel Among the Tides - Novel)", type:"novel", year:2023, region:"CN", publisher:"HoYoverse", desc:"官方小说。", tags:["小说"]},
  {ip:"Genshin Impact", title:"Genshin Impact (Gacha Anime PV - Stormterror)", type:"web-series", year:2021, region:"CN", publisher:"HoYoverse", desc:"Web 短剧。", tags:["Web 短剧"]},

  // ============================================================
  // HONKAI STAR RAIL
  // ============================================================
  {ip:"Honkai Star Rail", title:"Honkai Star Rail OST Vol. 1-3", type:"ost", year:2023, region:"CN", publisher:"HoYoverse", desc:"原声带。", tags:["OST"]},
  {ip:"Honkai Star Rail", title:"Honkai Star Rail (Manga)", type:"manga", year:2023, region:"JP", publisher:"HoYoverse", desc:"官方漫画。", tags:["少年漫画"]},
  {ip:"Honkai Star Rail", title:"Honkai Star Rail: A Song of a Nameless Hero (Manga)", type:"manga", year:2024, region:"JP", publisher:"HoYoverse", desc:"衍生漫画。", tags:["少年漫画"]},
  {ip:"Honkai Star Rail", title:"Honkai Star Rail: Symphony of the Universe (Concert)", type:"concert", year:2024, region:"Global", publisher:"HoYoverse", desc:"全球巡演。", tags:["音乐会"]},
  {ip:"Honkai Star Rail", title:"Honkai Star Rail (Plush - March 7th)", type:"merch-figure", year:2023, region:"CN", publisher:"HoYoverse", desc:"三月七毛绒。", tags:["毛绒"]},
  {ip:"Honkai Star Rail", title:"Honkai Star Rail (Nendoroid - March 7th)", type:"merch-figure", year:2024, region:"JP", publisher:"Good Smile", desc:"三月七粘土人。", tags:["粘土人"]},
  {ip:"Honkai Star Rail", title:"Honkai Star Rail (Nendoroid - Dan Heng)", type:"merch-figure", year:2024, region:"JP", publisher:"Good Smile", desc:"丹恒粘土人。", tags:["粘土人"]},
  {ip:"Honkai Star Rail", title:"Honkai Star Rail (Figma - Kafka)", type:"merch-figure", year:2024, region:"JP", publisher:"Max Factory", desc:"卡芙卡 Figma。", tags:["Figma"]},
  {ip:"Honkai Star Rail", title:"Honkai Star Rail (Acrylic Standee)", type:"merch-figure", year:2023, region:"JP", publisher:"Movic", desc:"立牌。", tags:["立牌"]},
  {ip:"Honkai Star Rail", title:"Honkai Star Rail (Trading Card - Stellar Edition)", type:"merch-card", year:2024, region:"CN", publisher:"HoYoverse", desc:"官方卡牌。", tags:["TCG"]},
  {ip:"Honkai Star Rail", title:"Honkai Star Rail x Luckin Coffee", type:"collab", year:2023, region:"CN", publisher:"Luckin", desc:"瑞幸联名。", tags:["餐饮联动"]},
  {ip:"Honkai Star Rail", title:"Honkai Star Rail x KFC", type:"collab", year:2024, region:"CN", publisher:"KFC", desc:"肯德基联名。", tags:["餐饮联动"]},
  {ip:"Honkai Star Rail", title:"Honkai Star Rail x MacDonalds (China)", type:"collab", year:2024, region:"CN", publisher:"McDonalds", desc:"麦当劳联名。", tags:["餐饮联动"]},
  {ip:"Honkai Star Rail", title:"Honkai Star Rail x Hey Tea", type:"collab", year:2024, region:"CN", publisher:"Hey Tea", desc:"喜茶联名。", tags:["餐饮联动"]},
  {ip:"Honkai Star Rail", title:"Honkai Star Rail (Fan Fest)", type:"event", year:2024, region:"Global", publisher:"HoYoverse", desc:"粉丝节。", tags:["粉丝节"]},
  {ip:"Honkai Star Rail", title:"Honkai Star Rail (Theme Cafe)", type:"cafe", year:2024, region:"JP", publisher:"HoYoverse", desc:"主题咖啡。", tags:["主题咖啡"]},
  {ip:"Honkai Star Rail", title:"Honkai Star Rail (Stage Play)", type:"theater", year:2024, region:"JP", publisher:"HoYoverse", desc:"舞台剧。", tags:["舞台剧"]},
  {ip:"Honkai Star Rail", title:"Honkai Star Rail (ChinaJoy Booth)", type:"event", year:2024, region:"CN", publisher:"HoYoverse", desc:"ChinaJoy。", tags:["线下活动"]},

  // ============================================================
  // HONKAI IMPACT 3RD
  // ============================================================
  {ip:"Honkai Impact", title:"Honkai Impact 3rd (Manga)", type:"manga", year:2017, region:"CN", publisher:"miHoYo", desc:"官方漫画。", tags:["少年漫画"]},
  {ip:"Honkai Impact", title:"Honkai Impact 3rd: Second Eruption (Manga)", type:"manga", year:2018, region:"CN", publisher:"miHoYo", desc:"漫画续作。", tags:["少年漫画"]},
  {ip:"Honkai Impact", title:"Honkai Impact 3rd (Anime Shorts)", type:"web-series", year:2018, region:"CN", publisher:"miHoYo", desc:"官方短动画。", tags:["短动画"]},
  {ip:"Honkai Impact", title:"Honkai Impact 3rd: Cooking with Valkyries (Webseries)", type:"web-series", year:2019, region:"CN", publisher:"miHoYo", desc:"女武神做饭。", tags:["短剧"]},
  {ip:"Honkai Impact", title:"Honkai Impact 3rd: Alien World (Manga)", type:"manga", year:2018, region:"CN", publisher:"miHoYo", desc:"漫画。", tags:["少年漫画"]},
  {ip:"Honkai Impact", title:"Honkai Impact 3rd: Gears of Fate (Stage Play)", type:"theater", year:2020, region:"JP", publisher:"miHoYo", desc:"舞台剧。", tags:["舞台剧"]},
  {ip:"Honkai Impact", title:"Honkai Impact 3rd OST (Various)", type:"ost", year:2017, region:"CN", publisher:"miHoYo", desc:"原声带。", tags:["OST"]},
  {ip:"Honkai Impact", title:"Honkai Impact 3rd Concert", type:"concert", year:2023, region:"CN", publisher:"miHoYo", desc:"音乐会。", tags:["音乐会"]},
  {ip:"Honkai Impact", title:"Honkai Impact 3rd: Sweet Home (Anime PV)", type:"web-series", year:2022, region:"CN", publisher:"miHoYo", desc:"PV 短剧。", tags:["Web 短剧"]},
  {ip:"Honkai Impact", title:"Honkai Impact 3rd (Plush - Kiana)", type:"merch-figure", year:2020, region:"CN", publisher:"miHoYo", desc:"琪亚娜毛绒。", tags:["毛绒"]},
  {ip:"Honkai Impact", title:"Honkai Impact 3rd (Nendoroid - Theresa)", type:"merch-figure", year:2021, region:"JP", publisher:"Good Smile", desc:"德丽莎粘土人。", tags:["粘土人"]},
  {ip:"Honkai Impact", title:"Honkai Impact 3rd (Figma - Raiden Mei)", type:"merch-figure", year:2021, region:"JP", publisher:"Max Factory", desc:"芽衣 Figma。", tags:["Figma"]},
  {ip:"Honkai Impact", title:"Honkai Impact 3rd (Acrylic Stand)", type:"merch-figure", year:2019, region:"JP", publisher:"Movic", desc:"立牌。", tags:["立牌"]},
  {ip:"Honkai Impact", title:"Honkai Impact 3rd (Art Book)", type:"artbook", year:2020, region:"CN", publisher:"miHoYo", desc:"画集。", tags:["画集"]},
  {ip:"Honkai Impact", title:"Honkai Impact 3rd x KFC", type:"collab", year:2021, region:"CN", publisher:"KFC", desc:"肯德基联名。", tags:["餐饮联动"]},

  // ============================================================
  // WUTHERING WAVES
  // ============================================================
  {ip:"Wuthering Waves", title:"Wuthering Waves OST Vol. 1-2", type:"ost", year:2024, region:"CN", publisher:"Kuro Games", desc:"原声。", tags:["OST"]},
  {ip:"Wuthering Waves", title:"Wuthering Waves (Plush - Rover)", type:"merch-figure", year:2024, region:"CN", publisher:"Kuro Games", desc:"漂泊者毛绒。", tags:["毛绒"]},
  {ip:"Wuthering Waves", title:"Wuthering Waves (Manga - Online)", type:"manga", year:2024, region:"CN", publisher:"Kuro Games", desc:"官方漫画。", tags:["少年漫画"]},
  {ip:"Wuthering Waves", title:"Wuthering Waves (Fan Fest)", type:"event", year:2024, region:"CN", publisher:"Kuro Games", desc:"粉丝节。", tags:["粉丝节"]},
  {ip:"Wuthering Waves", title:"Wuthering Waves (Theme Cafe)", type:"cafe", year:2024, region:"JP", publisher:"Kuro Games", desc:"主题咖啡。", tags:["主题咖啡"]},
  {ip:"Wuthering Waves", title:"Wuthering Waves x Luckin", type:"collab", year:2024, region:"CN", publisher:"Luckin", desc:"瑞幸联名。", tags:["餐饮联动"]},
  {ip:"Wuthering Waves", title:"Wuthering Waves (Stage Play)", type:"theater", year:2024, region:"CN", publisher:"Kuro Games", desc:"舞台剧。", tags:["舞台剧"]},

  // ============================================================
  // REVERSE: 1999
  // ============================================================
  {ip:"Reverse 1999", title:"Reverse: 1999 OST", type:"ost", year:2023, region:"CN", publisher:"Bluepoch", desc:"原声。", tags:["OST"]},
  {ip:"Reverse 1999", title:"Reverse: 1999 (Manga)", type:"manga", year:2023, region:"CN", publisher:"Bluepoch", desc:"官方漫画。", tags:["少年漫画"]},
  {ip:"Reverse 1999", title:"Reverse: 1999 (Plush - Sonetto)", type:"merch-figure", year:2023, region:"CN", publisher:"Bluepoch", desc:"十四行诗毛绒。", tags:["毛绒"]},
  {ip:"Reverse 1999", title:"Reverse: 1999 (Nendoroid - An-an Lee)", type:"merch-figure", year:2024, region:"JP", publisher:"Good Smile", desc:"安安莉莉粘土人。", tags:["粘土人"]},
  {ip:"Reverse 1999", title:"Reverse: 1999 (Fan Fest)", type:"event", year:2023, region:"CN", publisher:"Bluepoch", desc:"粉丝节。", tags:["粉丝节"]},
  {ip:"Reverse 1999", title:"Reverse: 1999 (Theme Cafe)", type:"cafe", year:2024, region:"JP", publisher:"Bluepoch", desc:"主题咖啡。", tags:["主题咖啡"]},

  // ============================================================
  // ARKNIGHTS
  // ============================================================
  {ip:"Arknights", title:"Arknights OST (Various)", type:"ost", year:2019, region:"CN", publisher:"HyperGryph", desc:"原声。", tags:["OST"]},
  {ip:"Arknights", title:"Arknights: Prelude to Dawn (Anime)", type:"anime", year:2022, region:"JP", publisher:"Yostar Pictures", desc:"动画第一季。", tags:["动画"]},
  {ip:"Arknights", title:"Arknights: Perish in Frost (Anime)", type:"anime", year:2023, region:"JP", publisher:"Yostar Pictures", desc:"动画第二季。", tags:["动画"]},
  {ip:"Arknights", title:"Arknights: Rise from Ember (Anime)", type:"anime", year:2024, region:"JP", publisher:"Yostar Pictures", desc:"动画第三季。", tags:["动画"]},
  {ip:"Arknights", title:"Arknights (Manga)", type:"manga", year:2019, region:"JP", publisher:"HyperGryph", desc:"官方漫画。", tags:["少年漫画"]},
  {ip:"Arknights", title:"Arknights: Prologue (Web Anime)", type:"web-series", year:2022, region:"JP", publisher:"Yostar Pictures", desc:"序章动画。", tags:["动画"]},
  {ip:"Arknights", title:"Arknights (Manga - Reimei Zensou)", type:"manga", year:2022, region:"JP", publisher:"Kadokawa", desc:"动画前传漫画。", tags:["少年漫画"]},
  {ip:"Arknights", title:"Arknights (Plush - Amiya)", type:"merch-figure", year:2020, region:"CN", publisher:"HyperGryph", desc:"阿米娅毛绒。", tags:["毛绒"]},
  {ip:"Arknights", title:"Arknights (Nendoroid - Amiya)", type:"merch-figure", year:2022, region:"JP", publisher:"Good Smile", desc:"阿米娅粘土人。", tags:["粘土人"]},
  {ip:"Arknights", title:"Arknights (Nendoroid - Kal'tsit)", type:"merch-figure", year:2023, region:"JP", publisher:"Good Smile", desc:"凯尔希粘土人。", tags:["粘土人"]},
  {ip:"Arknights", title:"Arknights (Figma - W)", type:"merch-figure", year:2023, region:"JP", publisher:"Max Factory", desc:"W Figma。", tags:["Figma"]},
  {ip:"Arknights", title:"Arknights (Art Book)", type:"artbook", year:2023, region:"CN", publisher:"HyperGryph", desc:"画集。", tags:["画集"]},
  {ip:"Arknights", title:"Arknights x KFC", type:"collab", year:2022, region:"CN", publisher:"KFC", desc:"肯德基联名。", tags:["餐饮联动"]},
  {ip:"Arknights", title:"Arknights x Luckin Coffee", type:"collab", year:2022, region:"CN", publisher:"Luckin", desc:"瑞幸联名。", tags:["餐饮联动"]},
  {ip:"Arknights", title:"Arknights x MacDonalds (China)", type:"collab", year:2023, region:"CN", publisher:"McDonalds", desc:"麦当劳联名。", tags:["餐饮联动"]},
  {ip:"Arknights", title:"Arknights x Lawson", type:"collab", year:2023, region:"JP", publisher:"Lawson", desc:"罗森联名。", tags:["餐饮联动"]},
  {ip:"Arknights", title:"Arknights Concert", type:"concert", year:2023, region:"CN", publisher:"HyperGryph", desc:"音乐会。", tags:["音乐会"]},
  {ip:"Arknights", title:"Arknights (Fan Fest)", type:"event", year:2023, region:"CN", publisher:"HyperGryph", desc:"粉丝节。", tags:["粉丝节"]},
  {ip:"Arknights", title:"Arknights (Theme Cafe)", type:"cafe", year:2023, region:"JP", publisher:"HyperGryph", desc:"主题咖啡。", tags:["主题咖啡"]},
  {ip:"Arknights", title:"Arknights (ChinaJoy Booth)", type:"event", year:2023, region:"CN", publisher:"HyperGryph", desc:"ChinaJoy。", tags:["线下活动"]},
  {ip:"Arknights", title:"Arknights (Pachinko)", type:"pachinko", year:2024, region:"JP", publisher:"Sammy", desc:"柏青哥。", tags:["柏青哥"]},

  // ============================================================
  // AZUR LANE
  // ============================================================
  {ip:"Azur Lane", title:"Azur Lane: Queen's Orders (Manga)", type:"manga", year:2018, region:"JP", publisher:"DMM Games", desc:"搞笑漫画。", tags:["少年漫画"]},
  {ip:"Azur Lane", title:"Azur Lane: Slow Ahead! (Anime)", type:"anime", year:2021, region:"JP", publisher:"Yostar Pictures", desc:"Q 版动画。", tags:["Q版动画"]},
  {ip:"Azur Lane", title:"Azur Lane: Bisoku Zenshin! (Anime)", type:"anime", year:2021, region:"JP", publisher:"Yostar Pictures", desc:"Q 版动画 2 季。", tags:["Q版动画"]},
  {ip:"Azur Lane", title:"Azur Lane (Manga - Kiso's Survey)", type:"manga", year:2020, region:"JP", publisher:"Kadokawa", desc:"衍生漫画。", tags:["少年漫画"]},
  {ip:"Azur Lane", title:"Azur Lane: Queen's Order (Manga)", type:"manga", year:2020, region:"JP", publisher:"Kadokawa", desc:"衍生漫画。", tags:["少年漫画"]},
  {ip:"Azur Lane", title:"Azur Lane (Plush - Laffey)", type:"merch-figure", year:2019, region:"JP", publisher:"Yostar", desc:"拉菲毛绒。", tags:["毛绒"]},
  {ip:"Azur Lane", title:"Azur Lane (Nendoroid - Ayanami)", type:"merch-figure", year:2020, region:"JP", publisher:"Good Smile", desc:"绫波粘土人。", tags:["粘土人"]},
  {ip:"Azur Lane", title:"Azur Lane (Nendoroid - Javelin)", type:"merch-figure", year:2020, region:"JP", publisher:"Good Smile", desc:"标枪粘土人。", tags:["粘土人"]},
  {ip:"Azur Lane", title:"Azur Lane (Acrylic Stand)", type:"merch-figure", year:2019, region:"JP", publisher:"Movic", desc:"立牌。", tags:["立牌"]},
  {ip:"Azur Lane", title:"Azur Lane OST", type:"ost", year:2017, region:"JP", publisher:"Yostar", desc:"原声。", tags:["OST"]},
  {ip:"Azur Lane", title:"Azur Lane: Crosswave (PS4 Game)", type:"game-spinoff", year:2019, region:"JP", publisher:"Compile Heart", desc:"PS4 衍生。", tags:["ACT"]},
  {ip:"Azur Lane", title:"Azur Lane: Crosswave (Switch)", type:"game-spinoff", year:2020, region:"JP", publisher:"Compile Heart", desc:"Switch 衍生。", tags:["ACT"]},
  {ip:"Azur Lane", title:"Azur Lane x Lawson", type:"collab", year:2019, region:"JP", publisher:"Lawson", desc:"罗森联名。", tags:["餐饮联动"]},
  {ip:"Azur Lane", title:"Azur Lane x Kura Sushi", type:"collab", year:2020, region:"JP", publisher:"Kura Sushi", desc:"藏寿司联名。", tags:["餐饮联动"]},
  {ip:"Azur Lane", title:"Azur Lane x Fujisan (Train)", type:"collab", year:2021, region:"JP", publisher:"Fujisan Tokyu", desc:"电车联名。", tags:["电车联动"]},
  {ip:"Azur Lane", title:"Azur Lane (Fan Fest)", type:"event", year:2019, region:"JP", publisher:"Yostar", desc:"粉丝节。", tags:["粉丝节"]},
  {ip:"Azur Lane", title:"Azur Lane (Art Book)", type:"artbook", year:2021, region:"JP", publisher:"DMM Games", desc:"画集。", tags:["画集"]},
  {ip:"Azur Lane", title:"Azur Lane (Pachislot)", type:"pachinko", year:2021, region:"JP", publisher:"Sammy", desc:"柏青斯洛。", tags:["柏青斯洛"]},

  // ============================================================
  // BLUE ARCHIVE
  // ============================================================
  {ip:"Blue Archive", title:"Blue Archive OST (Various)", type:"ost", year:2021, region:"JP", publisher:"Nexon Games", desc:"原声。", tags:["OST"]},
  {ip:"Blue Archive", title:"Blue Archive: The Animation", type:"anime", year:2024, region:"JP", publisher:"Yostar Pictures", desc:"动画。", tags:["动画"]},
  {ip:"Blue Archive", title:"Blue Archive: Nice to Meet You (Manga)", type:"manga", year:2022, region:"JP", publisher:"Nexon", desc:"官方漫画。", tags:["少年漫画"]},
  {ip:"Blue Archive", title:"Blue Archive: Variant Showdown! (Manga)", type:"manga", year:2023, region:"JP", publisher:"Nexon", desc:"漫画。", tags:["少年漫画"]},
  {ip:"Blue Archive", title:"Blue Archive (Plush - Shiroko)", type:"merch-figure", year:2022, region:"JP", publisher:"Nexon", desc:"白子毛绒。", tags:["毛绒"]},
  {ip:"Blue Archive", title:"Blue Archive (Nendoroid - Shiroko)", type:"merch-figure", year:2023, region:"JP", publisher:"Good Smile", desc:"白子粘土人。", tags:["粘土人"]},
  {ip:"Blue Archive", title:"Blue Archive (Nendoroid - Hoshino)", type:"merch-figure", year:2024, region:"JP", publisher:"Good Smile", desc:"星野粘土人。", tags:["粘土人"]},
  {ip:"Blue Archive", title:"Blue Archive x Lawson", type:"collab", year:2023, region:"JP", publisher:"Lawson", desc:"罗森联名。", tags:["餐饮联动"]},
  {ip:"Blue Archive", title:"Blue Archive x Kura Sushi", type:"collab", year:2023, region:"JP", publisher:"Kura Sushi", desc:"藏寿司联名。", tags:["餐饮联动"]},
  {ip:"Blue Archive", title:"Blue Archive (Fan Fest)", type:"event", year:2023, region:"JP", publisher:"Nexon", desc:"粉丝节。", tags:["粉丝节"]},
  {ip:"Blue Archive", title:"Blue Archive (Art Book)", type:"artbook", year:2023, region:"JP", publisher:"Nexon", desc:"画集。", tags:["画集"]},

  // ============================================================
  // NIKKE
  // ============================================================
  {ip:"Nikke", title:"Goddess of Victory: Nikke OST", type:"ost", year:2022, region:"KR", publisher:"Shift Up", desc:"原声。", tags:["OST"]},
  {ip:"Nikke", title:"Nikke (Manga)", type:"manga", year:2023, region:"JP", publisher:"Shift Up", desc:"官方漫画。", tags:["少年漫画"]},
  {ip:"Nikke", title:"Nikke: Nendoroid - Rapi", type:"merch-figure", year:2023, region:"JP", publisher:"Good Smile", desc:"拉毗粘土人。", tags:["粘土人"]},
  {ip:"Nikke", title:"Nikke (Plush - Rapi)", type:"merch-figure", year:2023, region:"KR", publisher:"Shift Up", desc:"拉毗毛绒。", tags:["毛绒"]},
  {ip:"Nikke", title:"Nikke (Figma - Anis)", type:"merch-figure", year:2024, region:"JP", publisher:"Max Factory", desc:"爱丽丝 Figma。", tags:["Figma"]},
  {ip:"Nikke", title:"Nikke (Art Book)", type:"artbook", year:2023, region:"KR", publisher:"Shift Up", desc:"画集。", tags:["画集"]},
  {ip:"Nikke", title:"Nikke x McDonalds (Korea)", type:"collab", year:2023, region:"KR", publisher:"McDonalds", desc:"麦当劳联名。", tags:["餐饮联动"]},
  {ip:"Nikke", title:"Nikke x Pizza Hut", type:"collab", year:2024, region:"KR", publisher:"Pizza Hut", desc:"必胜客联名。", tags:["餐饮联动"]},
  {ip:"Nikke", title:"Nikke (Fan Fest)", type:"event", year:2023, region:"KR", publisher:"Shift Up", desc:"粉丝节。", tags:["粉丝节"]},

  // ============================================================
  // LIMBUS COMPANY / PROJECT MOON
  // ============================================================
  {ip:"Limbus Company", title:"Limbus Company OST (Various)", type:"ost", year:2023, region:"KR", publisher:"Project Moon", desc:"原声。", tags:["OST"]},
  {ip:"Limbus Company", title:"Limbus Company (Manga - Le'mer)", type:"manga", year:2023, region:"KR", publisher:"Project Moon", desc:"官方漫画。", tags:["少年漫画"]},
  {ip:"Limbus Company", title:"Limbus Company (Plush - Dante)", type:"merch-figure", year:2023, region:"KR", publisher:"Project Moon", desc:"但丁毛绒。", tags:["毛绒"]},
  {ip:"Limbus Company", title:"Limbus Company (Fan Fest - World)", type:"event", year:2024, region:"KR", publisher:"Project Moon", desc:"粉丝节。", tags:["粉丝节"]},
  {ip:"Limbus Company", title:"Project Moon (Limbus x TGS)", type:"event", year:2023, region:"JP", publisher:"Project Moon", desc:"TGS 展台。", tags:["线下活动"]},
  {ip:"Project Moon", title:"Lobotomy Corporation (Mobile)", type:"game-mobile", year:2018, region:"KR", publisher:"Project Moon", desc:"前身手游。", tags:["手游"]},
  {ip:"Project Moon", title:"Library of Ruina (Game)", type:"game-spinoff", year:2020, region:"KR", publisher:"Project Moon", desc:"《Limbus》前作。", tags:["Roguelike"]},
  {ip:"Project Moon", title:"Library of Ruina OST", type:"ost", year:2020, region:"KR", publisher:"Project Moon", desc:"原声。", tags:["OST"]},

  // ============================================================
  // GIRLS' FRONTLINE
  // ============================================================
  {ip:"Girls' Frontline", title:"Girls' Frontline OST (Various)", type:"ost", year:2016, region:"CN", publisher:"MICA Team", desc:"原声。", tags:["OST"]},
  {ip:"Girls' Frontline", title:"Girls' Frontline (Manga)", type:"manga", year:2017, region:"CN", publisher:"MICA Team", desc:"官方漫画。", tags:["少年漫画"]},
  {ip:"Girls' Frontline", title:"Girls' Frontline: Healing Chapter (Manga)", type:"manga", year:2020, region:"CN", publisher:"MICA Team", desc:"治愈篇。", tags:["少年漫画"]},
  {ip:"Girls' Frontline", title:"Girls' Frontline: Neural Cloud (Mobile)", type:"game-mobile", year:2022, region:"CN", publisher:"MICA Team", desc:"云图计划。", tags:["手游"]},
  {ip:"Girls' Frontline", title:"Girls' Frontline: GunEVO (Mobile)", type:"game-mobile", year:2024, region:"CN", publisher:"MICA Team", desc:"枪弹棋。", tags:["手游"]},
  {ip:"Girls' Frontline", title:"Girls' Frontline (Plush - M4A1)", type:"merch-figure", year:2019, region:"CN", publisher:"MICA Team", desc:"M4A1 毛绒。", tags:["毛绒"]},
  {ip:"Girls' Frontline", title:"Girls' Frontline (Nendoroid - M4A1)", type:"merch-figure", year:2020, region:"JP", publisher:"Good Smile", desc:"M4A1 粘土人。", tags:["粘土人"]},
  {ip:"Girls' Frontline", title:"Girls' Frontline (Art Book)", type:"artbook", year:2021, region:"CN", publisher:"MICA Team", desc:"画集。", tags:["画集"]},
  {ip:"Girls' Frontline", title:"Girls' Frontline x Pizza Hut", type:"collab", year:2020, region:"CN", publisher:"Pizza Hut", desc:"必胜客联名。", tags:["餐饮联动"]},
  {ip:"Girls' Frontline", title:"Girls' Frontline (Fan Fest)", type:"event", year:2019, region:"CN", publisher:"MICA Team", desc:"粉丝节。", tags:["粉丝节"]},

  // ============================================================
  // FATE SERIES (TYPE-MOON)
  // ============================================================
  {ip:"Fate", title:"Fate/stay night: Unlimited Blade Works (Anime)", type:"anime", year:2014, region:"JP", publisher:"ufotable", desc:"《UBW》动画。", tags:["动画"]},
  {ip:"Fate", title:"Fate/Zero (Anime)", type:"anime", year:2011, region:"JP", publisher:"ufotable", desc:"前传动画。", tags:["动画"]},
  {ip:"Fate", title:"Fate/stay night: Heaven's Feel (Film Trilogy)", type:"film-anime", year:2017, region:"JP", publisher:"ufotable", desc:"剧场版三部曲。", tags:["剧场版"]},
  {ip:"Fate", title:"Fate/Apocrypha (Anime)", type:"anime", year:2017, region:"JP", publisher:"A-1 Pictures", desc:"动画。", tags:["动画"]},
  {ip:"Fate", title:"Fate/Extra: Last Encore (Anime)", type:"anime", year:2018, region:"JP", publisher:"Shaft", desc:"动画。", tags:["动画"]},
  {ip:"Fate", title:"Fate/Grand Order (Game)", type:"game-mobile", year:2015, region:"JP", publisher:"DELiGHTWORKS", desc:"手游。", tags:["手游"]},
  {ip:"Fate", title:"Fate/Grand Order: Absolute Demonic Front: Babylonia (Anime)", type:"anime", year:2019, region:"JP", publisher:"CloverWorks", desc:"《FGO》动画。", tags:["动画"]},
  {ip:"Fate", title:"Fate/Grand Order: Camelot (Film)", type:"film-anime", year:2020, region:"JP", publisher:"Production I.G.", desc:"剧场版。", tags:["剧场版"]},
  {ip:"Fate", title:"Fate/Grand Order: Shinji Entaku Ryouiki Camelot 2", type:"film-anime", year:2021, region:"JP", publisher:"Production I.G.", desc:"剧场版。", tags:["剧场版"]},
  {ip:"Fate", title:"Fate/Grand Order: Solomon (Film)", type:"film-anime", year:2021, region:"JP", publisher:"CloverWorks", desc:"剧场版。", tags:["剧场版"]},
  {ip:"Fate", title:"Fate/Grand Order: Lostbelt (Anime)", type:"anime", year:2024, region:"JP", publisher:"CloverWorks", desc:"异闻带动画。", tags:["动画"]},
  {ip:"Fate", title:"Fate/kaleid liner Prisma Illya (Anime)", type:"anime", year:2013, region:"JP", publisher:"SILVER LINK.", desc:"魔法少女伊莉雅动画。", tags:["动画"]},
  {ip:"Fate", title:"Fate/kaleid liner Prisma Illya: Oath Under Snow (Film)", type:"film-anime", year:2017, region:"JP", publisher:"SILVER LINK.", desc:"剧场版。", tags:["剧场版"]},
  {ip:"Fate", title:"Fate/Extra CCC (Manga)", type:"manga", year:2013, region:"JP", publisher:"Kadokawa", desc:"漫画。", tags:["少年漫画"]},
  {ip:"Fate", title:"Fate/Stay Night (Manga)", type:"manga", year:2004, region:"JP", publisher:"Kadokawa", desc:"官方漫画。", tags:["少年漫画"]},
  {ip:"Fate", title:"Fate/Zero (Manga)", type:"manga", year:2006, region:"JP", publisher:"Kadokawa", desc:"官方漫画。", tags:["少年漫画"]},
  {ip:"Fate", title:"Fate/Apocrypha (Manga)", type:"manga", year:2012, region:"JP", publisher:"Kadokawa", desc:"官方漫画。", tags:["少年漫画"]},
  {ip:"Fate", title:"Fate (Manga Anthology - Comic Anthology)", type:"manga", year:2012, region:"JP", publisher:"Kadokawa", desc:"漫画选集。", tags:["少年漫画"]},
  {ip:"Fate", title:"Fate/Extra CCC Fox Tail (Manga)", type:"manga", year:2013, region:"JP", publisher:"Kadokawa", desc:"衍生漫画。", tags:["少年漫画"]},
  {ip:"Fate", title:"Fate/Prototype (OVA)", type:"anime", year:2011, region:"JP", publisher:"ufotable", desc:"原案 OVA。", tags:["OVA"]},
  {ip:"Fate", title:"Today's Menu for the Emiya Family (Anime)", type:"anime", year:2018, region:"JP", publisher:"ufotable", desc:"美食动画。", tags:["美食动画"]},
  {ip:"Fate", title:"Today's Menu for the Emiya Family (Film)", type:"film-anime", year:2024, region:"JP", publisher:"ufotable", desc:"美食剧场版。", tags:["剧场版"]},
  {ip:"Fate", title:"Fate (Stage Play)", type:"theater", year:2014, region:"JP", publisher:"Marvelous", desc:"舞台剧。", tags:["舞台剧"]},
  {ip:"Fate", title:"Fate/Grand Order: Ordeal Call (Anime)", type:"anime", year:2025, region:"JP", publisher:"CloverWorks", desc:"动画。", tags:["动画"]},
  {ip:"Fate", title:"Fate OST (Various)", type:"ost", year:2006, region:"JP", publisher:"TYPE-MOON", desc:"原声。", tags:["OST"]},
  {ip:"Fate", title:"Fate/Stay Night: Heaven's Feel OST (Yuki Kajiura)", type:"ost", year:2017, region:"JP", publisher:"Aniplex", desc:"原声。", tags:["OST"]},
  {ip:"Fate", title:"Fate/Grand Order (Concert)", type:"concert", year:2019, region:"JP", publisher:"Aniplex", desc:"音乐会。", tags:["音乐会"]},
  {ip:"Fate", title:"Fate (Plush - Saber)", type:"merch-figure", year:2005, region:"JP", publisher:"Movic", desc:"Saber 毛绒。", tags:["毛绒"]},
  {ip:"Fate", title:"Fate (Nendoroid - Saber)", type:"merch-figure", year:2010, region:"JP", publisher:"Good Smile", desc:"Saber 粘土人。", tags:["粘土人"]},
  {ip:"Fate", title:"Fate (Nendoroid - Gilgamesh)", type:"merch-figure", year:2015, region:"JP", publisher:"Good Smile", desc:"吉尔伽美什粘土人。", tags:["粘土人"]},
  {ip:"Fate", title:"Fate (Nendoroid - Archer)", type:"merch-figure", year:2015, region:"JP", publisher:"Good Smile", desc:"Archer 粘土人。", tags:["粘土人"]},
  {ip:"Fate", title:"Fate (Trading Card Game)", type:"merch-card", year:2010, region:"JP", publisher:"Bushiroad", desc:"TCG。", tags:["TCG"]},
  {ip:"Fate", title:"Fate/Grand Order (Nendoroid - Mash)", type:"merch-figure", year:2019, region:"JP", publisher:"Good Smile", desc:"玛修粘土人。", tags:["粘土人"]},
  {ip:"Fate", title:"Fate/Grand Order (Plush - Mash)", type:"merch-figure", year:2019, region:"JP", publisher:"Aniplex", desc:"玛修毛绒。", tags:["毛绒"]},
  {ip:"Fate", title:"Fate (Art Book - Colorful Works)", type:"artbook", year:2017, region:"JP", publisher:"TYPE-MOON", desc:"画集。", tags:["画集"]},
  {ip:"Fate", title:"Fate/Stay Night: Realta Nua (Manga)", type:"manga", year:2006, region:"JP", publisher:"Kadokawa", desc:"漫画。", tags:["少年漫画"]},
  {ip:"Fate", title:"Fate/Grand Order (Stage Play)", type:"theater", year:2019, region:"JP", publisher:"Marvelous", desc:"舞台剧。", tags:["舞台剧"]},
  {ip:"Fate", title:"Fate (Costume - SuperGroupies)", type:"merch-cloth", year:2017, region:"JP", publisher:"SuperGroupies", desc:"联名服装。", tags:["COS"]},
  {ip:"Fate", title:"Fate x Kura Sushi", type:"collab", year:2020, region:"JP", publisher:"Kura Sushi", desc:"藏寿司联名。", tags:["餐饮联动"]},
  {ip:"Fate", title:"Fate x Lawson", type:"collab", year:2019, region:"JP", publisher:"Lawson", desc:"罗森联名。", tags:["餐饮联动"]},
  ];
  window.DATA = window.DATA.concat(EXT);
})();
