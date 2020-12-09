$app.minSDKVer = "2.2.0";
$app.minOSVer = "12.0.0";
$app.theme = "auto";
//作者 coo11 反馈问题请联系 https://t.me/coo11

//reference: https://noahgilmore.com/blog/dark-mode-uicolor-compatibility/
const categories= [[{精白:"#ffffff",银白:"#e9e7ef",铅白:"#f0f0f4",霜色:"#e9f1f6",雪白:"#f0fcff",莹白:"#e3f9fd",月白:"#d6ecf0",象牙白:"#fffbf0",缟:"#f2ecde",鱼肚白:"#fcefe8",白粉:"#fff2df",荼白:"#f3f9f1",鸭卵青:"#e0eee8",素:"#e0f0e9",青白:"#c0ebd7",蟹壳青:"#bbcdc5",花白:"#c2ccd0",老银:"#bacac6",灰色:"#808080",苍色:"#75878a",水色:"#88ada6",黝:"#6b6882",乌色:"#725e82",玄青:"#3d3b4f",乌黑:"#392f41",黎:"#75664d",黧:"#5d513c",黝黑:"#665757",缁色:"#493131",煤黑:"#312520",漆黑:"#161823",黑色:"#000000"},{樱草色:"#eaff56",鹅黄:"#fff143",鸭黄:"#faff72",杏黄:"#ffa631",橙黄:"#ffa400",橙色:"#fa8c35",杏红:"#ff8c31",橘黄:"#ff8936",橘红:"#ff7500",藤黄:"#ffb61e",姜黄:"#ffc773",雌黄:"#ffc64b",赤金:"#f2be45",缃色:"#f0c239",雄黄:"#e9bb1d",秋香色:"#d9b611",金色:"#eacd76",牙色:"#eedeb0",枯黄:"#d3b17d",黄栌:"#e29c45",乌金:"#a78e44",昏黄:"#c89b40",棕黄:"#ae7000",琥珀:"#ca6924",棕色:"#b25d25",茶色:"#b35c44",棕红:"#9b4400",赭:"#9c5333",驼色:"#a88462",秋色:"#896c39",棕绿:"#827100",褐色:"#6e511e",棕黑:"#7c4b00",赭色:"#955539",赭石:"#845a33"},{松花色:"#bce672",柳黄:"#c9dd22",嫩绿:"#bddd22",柳绿:"#afdd22",葱黄:"#a3d900",葱绿:"#9ed900",豆绿:"#9ed048",豆青:"#96ce54",油绿:"#00bc12",葱倩:"#0eb83a",葱青:"#0eb83a",青葱:"#0aa344",石绿:"#16a951",松柏绿:"#21a675",松花绿:"#057748",绿沈:"#0c8918",绿色:"#00e500",草绿:"#40de5a",青翠:"#00e079",青色:"#00e09e",翡翠色:"#3de1ad",碧绿:"#2add9c",玉色:"#2edfa3",缥:"#7fecad",艾绿:"#a4e2c6",石青:"#7bcfa6",碧色:"#1bd1a5",青碧:"#48c0a3",铜绿:"#549688",竹青:"#789262",墨灰:"#758a99",墨色:"#50616d",鸦青:"#424c50",黯:"#41555d"},{朱砂:"#ff461f",火红:"#ff2d51",朱膘:"#f36838",妃色:"#ed5736",品红:"#f00056",粉红:"#ffb3a7",桃红:"#f47983",海棠红:"#db5a6b",樱桃色:"#c93756",酡颜:"#f9906f",银红:"#f05654",大红:"#ff2121",石榴红:"#f20c00",绛紫:"#8c4356",绯红:"#c83c23",朱红:"#ff4c00",丹:"#ff4e20",彤:"#f35336",酡红:"#dc3023",炎:"#ff3300",茜色:"#cb3a56",绾:"#a98175",檀:"#b36d61",嫣红:"#ef7a82",洋红:"#ff0097",枣红:"#c32136",殷红:"#be002f",赫赤:"#c91f37",银朱:"#bf242a",赤:"#c3272b",胭脂:"#9d2933",栗色:"#60281e",玄色:"#622a1d"},{蔚蓝:"#70f3ff",蓝:"#44cef6",碧蓝:"#3eede7",石青:"#1685a9",靛青:"#177cb0",靛蓝:"#065279",花青:"#003472",宝蓝:"#4b5cc4",蓝灰色:"#a1afc9",藏青:"#2e4e7e",藏蓝:"#3b2e7e",黛:"#4a4266",黛绿:"#426666",黛蓝:"#425066",黛紫:"#574266",紫色:"#8d4bbb",紫酱:"#815463",酱紫:"#815476",紫檀:"#4c221b",绀青:"#003371",紫棠:"#56004f",青莲:"#801dae",群青:"#4c8dae",雪青:"#b0a4e3",丁香色:"#cca4e3",藕色:"#edd1d8",藕荷色:"#e4c6d0"}],[{桜色:"#bf242a",薄桜:"#fdeff2",桜鼠:"#e9dfe5",鴇鼠:"#e4d2d8",虹色:"#f6bfbc",珊瑚色:"#f5b1aa",一斤染:"#f5b199",宍色:"#efab93",紅梅色:"#f2a0a1",薄紅:"#f0908d",甚三紅:"#ee827c",桃色:"#f09199",鴇色:"#f4b3c2",撫子色:"#eebbcb",灰梅:"#e8d3c7",灰桜:"#e8d3d1",淡紅藤:"#e6cde3",石竹色:"#e5abbe",薄紅梅:"#e597b2",桃花色:"#e198b4",水柿:"#e4ab9b",ときがら茶:"#e09e87",退紅:"#d69090",薄柿:"#d4acad",長春色:"#c97586",梅鼠:"#c099a0",鴇浅葱:"#b88884",梅染:"#b48a76",蘇芳香:"#a86965",浅蘇芳:"#a25768",真朱:"#ec6d71",赤紫:"#eb6ea5",躑躅色:"#e95295",牡丹色:"#e7609e",今樣色:"#d0576b",中紅:"#c85179",薔薇色:"#e9546b",韓紅:"#e95464",銀朱:"#c85554",赤紅:"#c53d43",紅緋:"#e83929",赤:"#e60033",猩緋:"#e2041b",紅:"#d7003a",深緋:"#c9171e",緋色:"#d3381c",赤丹:"#ce5242",紅赤:"#d9333f",胭脂:"#b94047",朱緋:"#ba2636",茜色:"#b7282e",深海老茶:"#a73836",蘇芳:"#9e3d3f",真紅:"#a22041",濃紅:"#a22041",象牙色:"#f8f4e6",練色:"#ede4cd",灰白色:"#e9e4d4",蒸栗色:"#ede1a9",女郎花:"#f2f2b0",枯草色:"#e4dc8a",淡黄:"#f8e58c",白茶:"#ddbb99",赤白橡:"#d7a98c",洗柿:"#f2c9ac",鳥の子色:"#fff1cf",蜂蜜色:"#fddea5",肌色:"#fce2c4",薄卵色:"#fde8d0",雄黄:"#f9c89b",洒落柿:"#f7bd8f",赤香:"#f6b894",砥粉色:"#f4dda5",肉色:"#f1bf99",人色:"#f1bf99",丁子色:"#efcd9a",香色:"#efcd9a",薄香:"#f0cfa0",浅黄:"#edd3a1",枯色:"#e0c38c",淡香:"#f3bf88",杏色:"#f7b977",東云色:"#f19072",曙色:"#f19072",珊瑚朱色:"#ee836f",深支子:"#eb9b6f",纁:"#e0815e",浅緋:"#df7163",真赭:"#d57c6b",洗朱:"#d0826c",遠州茶:"#ca8269",紅樺色:"#bb5548",赭:"#ab6953"},{小豆色:"#96514d",枯茶:"#8d6449",飴色:"#deb068",駱駝色:"#bf794e",土色:"#bc763c",黄唐色:"#b98c46",桑染:"#b79b5b",櫨色:"#b77b57",黄橡:"#b68d4c",丁字染:"#ad7d4c",香染:"#ad7d4c",枇杷茶:"#ae7c4f",芝翫茶:"#ad7e4e",焦香:"#ae7c58",胡桃色:"#a86f4c",渋纸色:"#946243",朽葉色:"#917347",桑茶:"#956f29",路考茶:"#8c7042",国防色:"#7b6c3e",伽羅色:"#d8a373",江戸茶:"#cd8c5c",樺色:"#cd5e3c",紅鬱金:"#cb8347",土器色:"#c37854",狐色:"#c38743",黄土色:"#c39143",琥珀色:"#bf783a",赤茶:"#bb5535",代赭:"#bb5520",煉瓦色:"#b55233",雀茶:"#aa4f37",団十郎茶:"#9f563a",柿渋色:"#9f563a",紅鳶:"#9a493f",灰茶:"#98623c",茶色:"#965042",檜皮色:"#965036",鳶色:"#95483f",柿茶:"#954e2a",弁柄色:"#8f2e14",赤錆色:"#8a3319",褐色:"#8a3b00",栗梅:"#852e19",紅檜皮:"#7b4741",海老茶:"#773c30",唐茶:"#783c1d",栗色:"#762f07",赤銅色:"#752100",錆色:"#6c3524",赤褐色:"#683f36",茶褐色:"#664032",栗皮茶:"#6d3c32",黒茶:"#583822",葡萄茶:"#6c2c2f",葡萄色:"#640125",萱草色:"#f8b862",柑子色:"#f6ad49",金茶:"#f39800",蜜柑色:"#f08300",鉛丹色:"#ec6d51",黄丹:"#ee7948",柿色:"#ed6d3d",黄赤:"#ec6800",人参色:"#ec6800",橙色:"#ee7800",照柿:"#eb6238",赤橙:"#ea5506",金赤:"#ea5506",朱色:"#eb6101",小麦色:"#e49e61",丹色:"#e45e32",黄茶:"#e17b34",肉桂色:"#dd7a56",赤朽葉色:"#db8449",黄櫨染:"#d66a35",蒲公英色:"#ffd900",黄色:"#ffd900",中黄:"#ffea00",菜の花色:"#ffec47",黄檗色:"#fef263",卵色:"#fcd575",花葉色:"#fbd26b",刈安色:"#f5e56b",玉蜀黍色:"#eec362",金糸雀色:"#ebd842",黄支子色:"#ffdb4f",支子色:"#fbca4d",向日葵色:"#fcc800",山吹色:"#f8b500",鬱金色:"#fabf14",藤黄:"#f7c114",金色:"#e6b422"},{黄金:"#e6b422",櫨染:"#d9a62e",黄朽葉色:"#d3a243",山吹茶:"#c89932",芥子色:"#d0af4c",豆がら茶:"#8b968d",麹塵:"#6e7955",山鳩色:"#767c6b",利休鼠:"#888e7e",海松茶:"#5a544b",藍海松茶:"#56564b",藍媚茶:"#56564b",千歳茶:"#494a41",岩井茶:"#6b6f59",仙斎茶:"#474b42",黒緑:"#333631",柳煤竹:"#5b6356",樺茶色:"#726250",空五倍子色:"#9d896c",生壁色:"#94846a",肥後煤竹:"#897858",媚茶:"#716246",白橡:"#cbb994",亜麻色:"#d6c6af",榛色:"#bfa46f",灰汁色:"#9e9478",利休茶:"#a59564",鶯茶:"#715c1f",木蘭色:"#c7b370",砂色:"#dcd3b2",油色:"#a19361",利休色:"#8f8667",梅幸茶:"#887938",璃寛茶:"#6a5d21",黄海松茶:"#918754",菜種油色:"#a69425",青朽葉:"#ada250",根岸色:"#938b4b",鶸茶:"#8c8861",柳茶:"#a1a46d",海松色:"#726d40",鶯色:"#928c36",緑黄色:"#dccb18",鶸色:"#d7cf3a",抹茶色:"#c5c56a",若草色:"#c3d825",黄緑:"#b8d200",若芽色:"#e0ebaf",若菜色:"#d8e698",若苗色:"#c7dc68",青丹:"#99ab4e",草色:"#7b8d42",苔色:"#69821b",萌黄:"#aacf53",苗色:"#b0ca71",若葉色:"#b9d08b",松葉色:"#839b5c",夏虫色:"#cee4ae",鶸萌黄:"#82ae46",柳色:"#a8c97f",青白橡:"#9ba88d",柳鼠:"#c8d5bb",裏葉柳:"#c1d8ac",山葵色:"#a8bf93",老竹色:"#769164",白緑:"#d6e9ca",淡萌黄:"#93ca76",柳染:"#93b881",薄萌葱:"#badcad",深川鼠:"#97a791",若緑:"#98d98e",浅緑:"#88cb7f",薄緑:"#69b076",青鈍:"#6b7b6e",青磁鼠:"#bed2c3",薄青:"#93b69c",錆青磁:"#a6c8b2",緑青色:"#47885e",千歳緑:"#316745",若竹色:"#68be8d",緑:"#3eb370",常磐色:"#007b43",千草鼠:"#bed3ca",千草色:"#92b5a9",青磁色:"#7ebea5",青竹色:"#7ebeab",常磐緑:"#028760",木賊色:"#3b7960",天鵞絨:"#2f5d50",虫襖:"#3a5b52",革色:"#475950",深緑:"#00552e",鉄色:"#005243"},{萌葱色:"#006e54",花緑青:"#00a381",翡翠色:"#38b48b",青緑:"#00a497",水浅葱:"#80aba9",錆浅葱:"#5c9291",青碧:"#478384",御召茶:"#43676b",湊鼠:"#80989b",高麗納戸:"#2c4f54",百入茶:"#1f3134",錆鼠:"#47585c",錆鉄御納戸:"#485859",藍鼠:"#6c848d",錆御納戸:"#53727d",舛花色:"#5b7e91",熨斗目花色:"#426579",御召御納戸:"#4c6473",鉄御納戸:"#455765",紺鼠:"#44617b",藍鉄:"#393f4c",青褐:"#393e4f",褐返:"#203744",褐色:"#4d4c61",月白:"#eaf4fc",白菫色:"#eaedf7",白花色:"#e8ecef",藍白:"#ebf6f7",白藍:"#c1e4e9",水色:"#bce2e8",瓶覗:"#a2d7dd",秘色色:"#abced8",空色:"#a0d8ef",勿忘草色:"#89c3eb",青藤色:"#84a2d4",白群:"#83ccd2",浅縹:"#84b9cb",薄花色:"#698aab",納戸色:"#008899",浅葱色:"#00a3af",花浅葱:"#2a83a2",新橋色:"#59b9c6",天色:"#2ca9e1",露草色:"#38a1db",青:"#0095d9",薄藍:"#0094c8",縹色:"#2792c3",紺碧:"#007bbb",薄群青:"#5383c3",薄花桜:"#5a79ba",群青色:"#4c6cb3",杜若色:"#3e62ad",瑠璃色:"#1e50a2",薄縹:"#507ea4",瑠璃紺:"#19448e",紺瑠璃:"#164a84",藍色:"#165e83",青藍:"#274a78",深縹:"#2a4073",紺色:"#223a70",紺青:"#192f60",留紺:"#1c305c",濃藍:"#0f2350",鉄紺:"#17184b",漆黒:"#0d0015",淡藤色:"#bbc8e6",藤色:"#bbbcde",紅掛空色:"#8491c3",紅碧:"#8491c3",紺桔梗:"#4d5aaf",花色:"#4d5aaf",紺藍:"#4a488e",紅桔梗:"#4d4398",桔梗色:"#5654a2",藤納戸:"#706caa",紅掛花色:"#68699b",紫苑色:"#867ba9",白藤色:"#dbd0e6",藤紫:"#a59aca",菫色:"#7058a3",青紫:"#674598",菖蒲色:"#674196",竜胆色:"#9079ad",江戸紫:"#745399",本紫:"#65318e",葡萄色:"#522f60",深紫:"#493759",紫黒:"#2e2930",紫:"#884898",薄葡萄:"#c0a2c7",紫紺:"#460e44",暗紅色:"#74325c",桑の実色:"#55295b"},{古代紫:"#895b8a",茄子紺:"#824880",二藍:"#915c8b",京紫:"#9d5b8b",蒲葡:"#7a4171",若紫:"#bc64a4",紅紫:"#b44c97",梅紫:"#aa4c8f",菖蒲色:"#cc7eb1",紅藤色:"#cca6bf",浅紫:"#c4a3bf",紫水晶:"#e7e7eb",薄梅鼠:"#dcd6d9",暁鼠:"#d3cfd9",牡丹鼠:"#d3ccd6",霞色:"#c8c2c6",藤鼠:"#a6a5c4",半色:"#a69abd",薄色:"#a89dac",薄鼠:"#9790a4",鳩羽鼠:"#9e8b8e",鳩羽色:"#95859c",桔梗鼠:"#95949a",紫鼠:"#71686c",葡萄鼠:"#705b67",濃色:"#634950",紫鳶:"#5f414b",濃鼠:"#4f455c",藤煤竹:"#5a5359",滅紫:"#594255",紅消鼠:"#524748",似せ紫:"#513743",灰黄緑:"#e6eae3",蕎麦切色:"#d4dcd6",薄雲鼠:"#d4dcda",枯野色:"#d3cbc6",潤色:"#c8c2be",利休白茶:"#b3ada0",茶鼠:"#a99e93",胡桃染:"#a58f86",江戸鼠:"#928178",煤色:"#887f7a",丁子茶:"#b4866b",柴染:"#b28c6e",宗伝唐茶:"#a16d5d",砺茶:"#9f6f55",煎茶色:"#8c6450",銀煤竹:"#856859",黄枯茶:"#765c47",煤竹色:"#6f514c",焦茶:"#6f4b3e",黒橡:"#544a47",憲法色:"#543f32",涅色:"#554738",檳榔子染:"#433d3c",黒鳶:"#432f2f",赤墨:"#3f312b",黒紅:"#302833",白:"#ffffff",胡粉色:"#fffffc",卯の花色:"#f7fcfe",白磁:"#f8fbf8",生成り色:"#fbfaf5",乳白色:"#f3f3f3",白練:"#f3f3f2",素色:"#eae5e3",白梅鼠:"#e5e4e6",白鼠:"#dcdddd",絹鼠:"#dddcd6",灰青:"#c0c6c9",銀鼠:"#afafb0",薄鈍:"#adadad",薄墨色:"#a3a3a2",錫色:"#9ea1a3",素鼠:"#9fa0a0",鼠色:"#949495",源氏鼠:"#888084",灰色:"#7d7d7d",鉛色:"#7b7c7d",鈍色:"#727171",墨:"#595857",丼鼠:"#595455",消炭色:"#524e4d",藍墨茶:"#474a4d",羊羹色:"#383c3c",蝋色:"#2b2b2b",黒:"#2b2b2b",烏羽色:"#180614",鉄黒:"#281a14",濡羽色:"#000b00",黒壇:"#250d00",憲法黒茶:"#241a08",暗黒色:"#16160e"}],[{IndianRed:"#CD5C5C",LightCoral:"#F08080",Salmon:"#FA8072",DarkSalmon:"#E9967A",LightSalmon:"#FFA07A",Crimson:"#DC143C",Red:"#FF0000",FireBrick:"#B22222",DarkRed:"#8B0000",Pink:"#FFC0CB",LightPink:"#FFB6C1",HotPink:"#FF69B4",DeepPink:"#FF1493",MediumVioletRed:"#C71585",PaleVioletRed:"#DB7093",Lavender:"#E6E6FA",Thistle:"#D8BFD8",Plum:"#DDA0DD",Violet:"#EE82EE",Orchid:"#DA70D6",Fuchsia:"#FF00FF",Magenta:"#FF00FF",MediumOrchid:"#BA55D3",MediumPurple:"#9370DB",Amethyst:"#9966CC",BlueViolet:"#8A2BE2",DarkViolet:"#9400D3",DarkOrchid:"#9932CC",DarkMagenta:"#8B008B",Purple:"#800080",Indigo:"#4B0082",SlateBlue:"#6A5ACD",DarkSlateBlue:"#483D8B",MediumSlateBlue:"#7B68EE"},{LightSalmon:"#FFA07A",Coral:"#FF7F50",Tomato:"#FF6347",OrangeRed:"#FF4500",DarkOrange:"#FF8C00",Orange:"#FFA500",Gold:"#FFD700",Yellow:"#FFFF00",LightYellow:"#FFFFE0",LemonChiffon:"#FFFACD",LightGoldenrodYellow:"#FAFAD2",PapayaWhip:"#FFEFD5",Moccasin:"#FFE4B5",PeachPuff:"#FFDAB9",PaleGoldenrod:"#EEE8AA",Khaki:"#F0E68C",DarkKhaki:"#BDB76B",Cornsilk:"#FFF8DC",BlanchedAlmond:"#FFEBCD",Bisque:"#FFE4C4",NavajoWhite:"#FFDEAD",Wheat:"#F5DEB3",BurlyWood:"#DEB887",Tan:"#D2B48C",RosyBrown:"#BC8F8F",SandyBrown:"#F4A460",Goldenrod:"#DAA520",DarkGoldenrod:"#B8860B",Peru:"#CD853F",Chocolate:"#D2691E",SaddleBrown:"#8B4513",Sienna:"#A0522D",Brown:"#A52A2A",Maroon:"#800000"},{GreenYellow:"#ADFF2F",Chartreuse:"#7FFF00",LawnGreen:"#7CFC00",Lime:"#00FF00",LimeGreen:"#32CD32",PaleGreen:"#98FB98",LightGreen:"#90EE90",MediumSpringGreen:"#00FA9A",SpringGreen:"#00FF7F",MediumSeaGreen:"#3CB371",SeaGreen:"#2E8B57",ForestGreen:"#228B22",Green:"#008000",DarkGreen:"#006400",YellowGreen:"#9ACD32",OliveDrab:"#6B8E23",Olive:"#808000",DarkOliveGreen:"#556B2F",MediumAquamarine:"#66CDAA",DarkSeaGreen:"#8FBC8F",LightSeaGreen:"#20B2AA",DarkCyan:"#008B8B",Teal:"#008080"},{Aqua:"#00FFFF",Cyan:"#00FFFF",LightCyan:"#E0FFFF",PaleTurquoise:"#AFEEEE",Aquamarine:"#7FFFD4",Turquoise:"#40E0D0",MediumTurquoise:"#48D1CC",DarkTurquoise:"#00CED1",CadetBlue:"#5F9EA0",SteelBlue:"#4682B4",LightSteelBlue:"#B0C4DE",PowderBlue:"#B0E0E6",LightBlue:"#ADD8E6",SkyBlue:"#87CEEB",LightSkyBlue:"#87CEFA",DeepSkyBlue:"#00BFFF",DodgerBlue:"#1E90FF",CornflowerBlue:"#6495ED",MediumSlateBlue:"#7B68EE",RoyalBlue:"#4169E1",Blue:"#0000FF",MediumBlue:"#0000CD",DarkBlue:"#00008B",Navy:"#000080",MidnightBlue:"#191970"},{White:"#FFFFFF",Snow:"#FFFAFA",Honeydew:"#F0FFF0",MintCream:"#F5FFFA",Azure:"#F0FFFF",AliceBlue:"#F0F8FF",GhostWhite:"#F8F8FF",WhiteSmoke:"#F5F5F5",Seashell:"#FFF5EE",Beige:"#F5F5DC",OldLace:"#FDF5E6",FloralWhite:"#FFFAF0",Ivory:"#FFFFF0",AntiqueWhite:"#FAEBD7",Linen:"#FAF0E6",LavenderBlush:"#FFF0F5",MistyRose:"#FFE4E1",Gainsboro:"#DCDCDC",LightGrey:"#D3D3D3",Silver:"#C0C0C0",DarkGray:"#A9A9A9",Gray:"#808080",DimGray:"#696969",LightSlateGray:"#778899",SlateGray:"#708090",DarkSlateGray:"#2F4F4F",Black:"#000000"}],[{label:{light:$rgba(0,0,0,1),dark:$rgba(255,255,255,1),jsbox:"systemLabel"},secondaryLabel:{light:$rgba(60,60,67,0.6),dark:$rgba(235,235,245,0.6),jsbox:"systemSecondaryLabel"},tertiaryLabel:{light:$rgba(60,60,67,0.3),dark:$rgba(235,235,245,0.3),jsbox:"systemTertiaryLabel"},quaternaryLabel:{light:$rgba(60,60,67,0.18),dark:$rgba(235,235,245,0.18),jsbox:"systemQuaternaryLabel"},systemFill:{light:$rgba(120,120,128,0.2),dark:$rgba(120,120,128,0.36),jsbox:"systemFill"},secondarySystemFill:{light:$rgba(120,120,128,0.16),dark:$rgba(120,120,128,0.32),jsbox:"systemSecondaryFill"},tertiarySystemFill:{light:$rgba(118,118,128,0.12),dark:$rgba(118,118,128,0.24),jsbox:"systemTertiaryFill"},quaternarySystemFill:{light:$rgba(116,116,128,0.08),dark:$rgba(118,118,128,0.18),jsbox:"systemQuaternaryFill"},placeholderText:{light:$rgba(60,60,67,0.3),dark:$rgba(235,235,245,0.3),jsbox:"systemPlaceholderText"},separator:{light:$rgba(60,60,67,0.29),dark:$rgba(84,84,88,0.6),jsbox:"systemSeparator"},opaqueSeparator:{light:$rgba(198,198,200,1),dark:$rgba(56,56,58,1),jsbox:"systemOpaqueSeparator"},systemBackground:{light:$rgba(255,255,255,1),dark:$rgba(0,0,0,1),jsbox:"systemBackground"},secondarySystemBackground:{light:$rgba(242,242,247,1),dark:$rgba(28,28,30,1),jsbox:"systemSecondaryBackground"},tertiarySystemBackground:{light:$rgba(255,255,255,1),dark:$rgba(44,44,46,1),jsbox:"systemTertiaryBackground"},systemGroupedBackground:{light:$rgba(242,242,247,1),dark:$rgba(0,0,0,1),jsbox:"systemGroupedBackground"},secondarySystemGroupedBackground:{light:$rgba(255,255,255,1),dark:$rgba(28,28,30,1),jsbox:"systemSecondaryGroupedBackground"},tertiarySystemGroupedBackground:{light:$rgba(242,242,247,1),dark:$rgba(44,44,46,1),jsbox:"systemTertiaryGroupedBackground"},darkText:{light:$rgba(0,0,0,1),dark:$rgba(0,0,0,1)},lightText:{light:$rgba(255,255,255,0.6),dark:$rgba(255,255,255,0.6)},link:{light:$rgba(0,122,255,1),dark:$rgba(9,132,255,1),jsbox:"systemLink"}},{systemBlue:{light:$rgba(0,122,255,1),dark:$rgba(10,132,255,1)},systemGreen:{light:$rgba(52,199,89,1),dark:$rgba(48,209,88,1)},systemIndigo:{light:$rgba(88,86,214,1),dark:$rgba(94,92,230,1)},systemOrange:{light:$rgba(255,149,0,1),dark:$rgba(255,159,10,1)},systemPink:{light:$rgba(255,45,85,1),dark:$rgba(255,55,95,1)},systemPurple:{light:$rgba(175,82,222,1),dark:$rgba(191,90,242,1)},systemRed:{light:$rgba(255,59,48,1),dark:$rgba(255,69,58,1)},systemTeal:{light:$rgba(90,200,250,1),dark:$rgba(100,210,255,1)},systemYellow:{light:$rgba(255,204,0,1),dark:$rgba(255,214,10,1)},systemGray:{light:$rgba(142,142,147,1),dark:$rgba(142,142,147,1)},systemGray2:{light:$rgba(174,174,178,1),dark:$rgba(99,99,102,1),jsbox:"systemGray2"},systemGray3:{light:$rgba(199,199,204,1),dark:$rgba(72,72,74,1),jsbox:"systemGray3"},systemGray4:{light:$rgba(209,209,214,1),dark:$rgba(58,58,60,1),jsbox:"systemGray4"},systemGray5:{light:$rgba(229,229,234,1),dark:$rgba(44,44,46,1),jsbox:"systemGray5"},systemGray6:{light:$rgba(242,242,247,1),dark:$rgba(28,28,30,1),jsbox:"systemGray6"}},{tintColor:{light:$color("tint"),dark:$rgb(21,126,251),black:$rgb(21,126,251)},primarySurface:{light:$rgb(255,255,255),dark:$rgb(20,20,20),black:$rgb(0,0,0)},secondarySurface:{light:$rgb(255,255,255),dark:$rgb(33,33,33),black:$rgb(20,20,20)},tertiarySurface:{light:$rgb(255,255,255),dark:$rgb(41,41,41),black:$rgb(33,33,33)},primaryText:{light:$rgb(51,51,51),dark:$rgb(255,255,255),black:$rgb(255,255,255)},secondaryText:{light:$rgb(102,102,102),dark:$rgb(172,172,172),black:$rgb(172,172,172)},backgroundColor:{light:$rgb(238,241,241),dark:$rgb(20,20,20),black:$rgb(0,0,0)},separatorColor:{light:$rgb(221,221,221),dark:$rgb(48,48,48),black:$rgb(40,40,40)},groupedBackground:{light:$rgb(249,249,249),dark:$rgb(20,20,20),black:$rgb(0,0,0)},insetGroupedBackground:{light:$rgb(242,242,242),dark:$rgb(20,20,20),black:$rgb(0,0,0)}},["black","darkGray","gray","lightGray","white","red","orange","yellow","green","blue","cyan","magenta","purple","brown"],["darkText","text","silver","separator","background","navy", "teal","aqua","olive","lime","maroon","fuchsia","tint"]]];

const unitPixel = 1 / $device.info.screen.scale;
const font = [
  "PingFangSC-Light",
  "HiraMinProN-W3",
  "AvenirNextCondensed-Regular",
  "MuktaMahee-Light"
];

$define({
  type: "BarButtonActionDelegate: NSObject",
  events: {
    "readMe:": sender => {
      $ui.popover({
        sourceView: sender.$view().jsValue(),
        directions: $popoverDirection.up,
        size: $size(320, 200),
        views: [
          {
            type: "markdown",
            props: {
              content:
                '所有资料均可在 Apple 开发者文档和 JSBox 文档中找到， 相关内容请参阅 [UI Element Colors](https://developer.apple.com/documentation/uikit/uicolor/ui_element_colors?language=objc)、[Standard Colors](https://developer.apple.com/documentation/uikit/uicolor/standard_colors?language=objc) 和 [$color(string)](https://docs.xteko.com/#/data/method?id=colorstring)。\n该脚本未包括 `clearColor`(JSBox 中为 `$color("clear")`)。 '
            },
            layout: $layout.fillSafeArea
          }
        ]
      });
    }
  }
});

const list = {
  type: "list",
  props: {
    id: "list",
    selectable: 0,
    clipsToBounds: 0,
    separatorHidden: 1,
    template: (() => {
      let template = [];
      for (let i = 0; i < 5; i++) {
        template.push({
          type: "button",
          props: {
            cornerRadius: 4,
            borderWidth: unitPixel,
            id: `t${i}`,
            borderColor: $rgba(100, 100, 100, 0.25)
          },
          layout: (make, view) => {
            const label = view.ocValue().$titleLabel();
            label.$setAutoFontSize(true);
            const { width } = $ui.window.frame;
            const w = (width - 48) / 5;
            make.centerX.equalTo(-2 * w - 16 + i * (w + 8));
            make.size.equalTo($size(w, 36));
            make.bottom.inset(8);
          },
          events: {
            tapped: async sender => await popover(sender)
          }
        });
      }
      return template;
    })(),
    showsVerticalIndicator: 0,
    footer: { type: "view", props: { height: 50 } }
  },
  layout: $layout.fillSafeArea,
  events: {
    rowHeight: (_, indexPath) => {
      if (indexPath.row === 0) return 52;
      else return 44;
    }
  }
};

const listForStaticCell = {
  type: "list",
  props: {
    id: "static",
    selectable: 0,
    stickyHeader: 1,
    clipsToBounds: 0,
    separatorHidden: 1,
    data: generateListData(3),
    showsVerticalIndicator: 0,
    footer: { type: "view", props: { height: 50 } }
  },
  layout: $layout.fillSafeArea,
  events: {
    rowHeight: (_, indexPath) => {
      if (indexPath.row === 0) return 52;
      else return 44;
    }
  }
};

let startIndex = $cache.get("index") || 0;
if (startIndex < 3) {
  list.props.data = generateListData(startIndex);
  list.props.hidden = false;
  listForStaticCell.props.hidden = true;
} else {
  listForStaticCell.props.hidden = false;
  list.props.hidden = true;
}

$ui.render({
  props: { title: "Color+" },
  views: [
    list,
    listForStaticCell,
    {
      type: "blur",
      props: {
        style: 6,
        borderWidth: unitPixel,
        borderColor: $rgba(100, 100, 100, 0.25)
      },
      layout: (make, view) => {
        make.left.right.bottom.inset(0);
        make.top.equalTo(view.super.safeAreaBottom).offset(-50);
      },
      views: [
        {
          type: "tab",
          props: {
            index: startIndex,
            cornerRadius: 4,
            bgcolor: $rgba(255, 255, 255, 0.4),
            items: ["中国传统色", "日本传统色", "CSS 颜色", "iOS 颜色"]
          },
          layout: (make, view) => {
            make.height.equalTo(28);
            make.centerY.equalTo(view.super.safeAreaCenterY);
            make.centerX.equalTo(view.super);
          },
          events: {
            ready: () => {
              if (startIndex === 3) rightBarButton(true);
            },
            changed: ({ index }) => {
              $("static").hidden = index !== 3;
              $("list").hidden = index === 3;
              rightBarButton(index === 3);
              if (index < 3) $("list").data = generateListData(index);
              $cache.set("index", index);
            }
          }
        }
      ]
    }
  ]
});

function generateCellInfo(colors, font) {
  const props = (color, name) => {
    return {
      title: name,
      titleColor: getFitedTitleColor(color),
      font: $font(font, 14),
      bgcolor: color
    };
  };
  if (colors.length === 5) {
    const row = {};
    for (let i = 0; i < 5; i++) {
      let id = `t${i}`;
      if (!colors[i])
        row[id] = { title: "", bgcolor: $color("clear"), borderWidth: 0 };
      else {
        let { color, name } = colors[i];
        if (typeof color === "string") color = $color(color);
        row[id] = props(color, name);
      }
    }
    return row;
  }
  const buttons = [];
  for (let i of colors) {
    if (!i) {
      buttons.push({ type: "view" });
      continue;
    }
    let { color, name } = i;
    if (typeof color === "string") color = $color(color);
    buttons.push({
      type: "button",
      props: {
        cornerRadius: 4,
        borderWidth: unitPixel,
        borderColor: $rgba(100, 100, 100, 0.25),
        ...props(color, name)
      },
      events: {
        tapped: async sender => await popover(sender)
      }
    });
  }
  return {
    type: "view",
    layout: $layout.fill,
    views: buttons,
    events: {
      layoutSubviews: view => {
        const {
          frame: { width, height },
          views
        } = view;
        const l = views.length;
        const w = (width - (l + 1) * 8) / l;
        for (let i in views) {
          views[i].frame = $rect(8 + (w + 8) * i, height - 44, w, 36);
          const label = views[i].ocValue().$titleLabel();
          label.$setAutoFontSize(true);
        }
      }
    }
  };
}

function generateListData(index) {
  const data = [];
  const category = categories[index];
  if (index < 3) {
    let allKeys = category.map(i => Object.keys(i));
    let allRows = allKeys.map(i => i.length);
    let rows = Math.max.apply(null, allRows);
    for (let i = 0; i < rows; i++) {
      const colors = [];
      for (let j = 0; j < 5; j++) {
        let key = allKeys[j][i];
        if (key) colors.push({ color: category[j][key], name: key });
        else colors.push(null);
      }
      data.push(generateCellInfo(colors, font[index]));
    }
    return data;
  } else {
    const sectionName = [
      "UI Element Colors",
      "Adaptable Standard Colors",
      "JSBox Semantic Colors",
      "Fixed Standard Colors",
      "JSBox Colors"
    ];
    for (let i = 0; i < 5; i++) {
      const rows = [];
      const _category = category[i];
      if (i < 3) {
        const allKeys = Object.keys(_category);
        let colors = [];
        for (let key of allKeys) {
          const { light, dark, black } = _category[key];
          colors = [
            { color: light, name: `${key}:Light` },
            { color: dark, name: `${key}:Dark` }
          ];
          if (i === 2) colors.push({ color: black, name: `${key}:Black` });
          rows.push(generateCellInfo(colors, font[3]));
        }
        data[i] = { title: sectionName[i], rows: rows };
      } else {
        while (_category.length > 0) {
          let colors = _category.splice(0, 4);
          colors.length < 4 && (colors[3] = undefined);
          colors = colors.map(i => {
            if (i)
              return {
                color: $color(i),
                name: i
              };
            else return null;
          });
          rows.push(generateCellInfo(colors, font[3]));
        }
        data[i] = { title: sectionName[i], rows: rows };
      }
    }
  }
  return data;
}

function rightBarButton(show) {
  const navi = $ui.vc.ocValue().$navigationItem();
  if (show) {
    const delegate = $objc("BarButtonActionDelegate").$new();
    $objc_retain(delegate);
    const buttons = $objc("NSMutableArray").$array();
    const image = $image("questionmark.circle").ocValue();
    const item = $objc("UIBarButtonItem")
      .$alloc()
      .$initWithImage_style_target_action(image, 0, delegate, "readMe:");
    buttons.$addObject(item);
    navi.$setRightBarButtonItems(buttons);
  } else navi.$setRightBarButtonItems(null);
}

/**
 * to calc what title color should be to fit background color
 * @param {object} UIColor
 */
function getFitedTitleColor(color) {
  let { red, green, blue, alpha } = color.components;
  const factors = 0.213 * red + 0.715 * green + 0.072 * blue;
  /**
   * @type {boolean} a - Is display dark text color in LIGHT MODE
   * @type {boolean} b - Is display dark text color in DARK MODE
   */
  const a = factors / alpha > 255 / 2;
  const b = factors * alpha > 255 / 2;

  if (alpha === 1 || a === b) return a ? $color("#333") : $color("#FFF");
  else return a ? $color("primaryText") : $color("#FFF", "#333");
}

async function popover(button) {
  $device.taptic(0);
  const i = $("tab").index;
  const { hexCode, components } = button.bgcolor;
  const { alpha, red, green, blue } = components;
  let menu = [
    "复制名称",
    `RGB(${red}, ${green}, ${blue})`,
    hexCode,
    "ColorHexa",
    "SpyColor"
  ];
  let jsboxColor;
  let colorName = button.title;
  if (i === 3) {
    const cell = button.super.super.super.ocValue();
    const indexPath = $("static")
      .ocValue()
      .$indexPathForCell(cell);
    const sec = indexPath.jsValue().section;

    colorName = colorName.split(":")[0];

    if (sec < 2) {
      menu[1] = `RGBA(${red}, ${green}, ${blue}, ${alpha})`;
      menu.splice(-3, 3);
      let colors = categories[3][sec][colorName];
      if ("jsbox" in colors) {
        jsboxColor = `$color("${colors.jsbox}")`;
      }
    } else jsboxColor = `$color("${colorName}")`;
    jsboxColor && menu.splice(1, 0, "复制 JSBox 颜色");

    if (sec !== 2 && sec !== 4) {
      menu[0] = "复制 iOS 颜色名";
      colorName = `${colorName}Color`;
    }
  }
  const { width } = $text.sizeThatFits({
    text: menu.filter(i => i.startsWith("R"))[0],
    font: $font("Lato-Medium", 17),
    width: 500
  });
  const { index, title } = await $ui.popover({
    sourceView: button,
    directions: $popoverDirection.any,
    size: $size(Math.max(width + 36, 175), 44 * menu.length),
    items: menu
  });
  if (!index) {
    $clipboard.text = colorName;
    $ui.success(`${colorName} 已复制`);
  } else if (title.indexOf("JSBox") > -1) {
    $clipboard.text = jsboxColor;
    $ui.success(`${jsboxColor} 已复制`);
  } else if (/^#|R/.test(title)) {
    $clipboard.text = title;
    $ui.success(`${title} 已复制`);
  } else if (title === "SpyColor")
    $app.openURL(`https://zh.spycolor.com/${hexCode.slice(1)}`);
  else if (title === "ColorHexa")
    $app.openURL(`https://www.colorhexa.com/${hexCode.slice(1)}`);
}
