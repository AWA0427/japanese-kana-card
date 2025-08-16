const allKana = [
  // 支持多种罗马音输入
  // 平假名 (清音)
  { kana: 'あ', romanji: 'a', type: '清音', form: '平假名' },
  { kana: 'い', romanji: 'i', type: '清音', form: '平假名' },
  { kana: 'う', romanji: 'u', type: '清音', form: '平假名' },
  { kana: 'え', romanji: 'e', type: '清音', form: '平假名' },
  { kana: 'お', romanji: 'o', type: '清音', form: '平假名' },

  { kana: 'か', romanji: 'ka', type: '清音', form: '平假名' },
  { kana: 'き', romanji: 'ki', type: '清音', form: '平假名' },
  { kana: 'く', romanji: 'ku', type: '清音', form: '平假名' },
  { kana: 'け', romanji: 'ke', type: '清音', form: '平假名' },
  { kana: 'こ', romanji: 'ko', type: '清音', form: '平假名' },

  { kana: 'さ', romanji: 'sa', type: '清音', form: '平假名' },
  { kana: 'し', romanji: ['shi', 'si'], type: '清音', form: '平假名' },
  { kana: 'す', romanji: 'su', type: '清音', form: '平假名' },
  { kana: 'せ', romanji: 'se', type: '清音', form: '平假名' },
  { kana: 'そ', romanji: 'so', type: '清音', form: '平假名' },

  { kana: 'た', romanji: 'ta', type: '清音', form: '平假名' },
  { kana: 'ち', romanji: ['chi', 'ti'], type: '清音', form: '平假名' },
  { kana: 'つ', romanji: ['tsu', 'tu'], type: '清音', form: '平假名' },
  { kana: 'て', romanji: 'te', type: '清音', form: '平假名' },
  { kana: 'と', romanji: 'to', type: '清音', form: '平假名' },

  { kana: 'な', romanji: 'na', type: '清音', form: '平假名' },
  { kana: 'に', romanji: 'ni', type: '清音', form: '平假名' },
  { kana: 'ぬ', romanji: 'nu', type: '清音', form: '平假名' },
  { kana: 'ね', romanji: 'ne', type: '清音', form: '平假名' },
  { kana: 'の', romanji: 'no', type: '清音', form: '平假名' },

  { kana: 'は', romanji: 'ha', type: '清音', form: '平假名' },
  { kana: 'ひ', romanji: 'hi', type: '清音', form: '平假名' },
  { kana: 'ふ', romanji: ['fu', 'hu'], type: '清音', form: '平假名' },
  { kana: 'へ', romanji: 'he', type: '清音', form: '平假名' },
  { kana: 'ほ', romanji: 'ho', type: '清音', form: '平假名' },

  { kana: 'ま', romanji: 'ma', type: '清音', form: '平假名' },
  { kana: 'み', romanji: 'mi', type: '清音', form: '平假名' },
  { kana: 'む', romanji: 'mu', type: '清音', form: '平假名' },
  { kana: 'め', romanji: 'me', type: '清音', form: '平假名' },
  { kana: 'も', romanji: 'mo', type: '清音', form: '平假名' },

  { kana: 'や', romanji: 'ya', type: '清音', form: '平假名' },
  { kana: 'ゆ', romanji: 'yu', type: '清音', form: '平假名' },
  { kana: 'よ', romanji: 'yo', type: '清音', form: '平假名' },

  { kana: 'ら', romanji: 'ra', type: '清音', form: '平假名' },
  { kana: 'り', romanji: 'ri', type: '清音', form: '平假名' },
  { kana: 'る', romanji: 'ru', type: '清音', form: '平假名' },
  { kana: 'れ', romanji: 're', type: '清音', form: '平假名' },
  { kana: 'ろ', romanji: 'ro', type: '清音', form: '平假名' },

  { kana: 'わ', romanji: 'wa', type: '清音', form: '平假名' },
  { kana: 'を', romanji: ['wo', 'o'], type: '清音', form: '平假名' },

  // 平假名 (拔音)
  { kana: 'ん', romanji: 'n', type: '拔音', form: '平假名' },

  // 平假名 (浊音)
  { kana: 'が', romanji: 'ga', type: '浊音', form: '平假名' },
  { kana: 'ぎ', romanji: 'gi', type: '浊音', form: '平假名' },
  { kana: 'ぐ', romanji: 'gu', type: '浊音', form: '平假名' },
  { kana: 'げ', romanji: 'ge', type: '浊音', form: '平假名' },
  { kana: 'ご', romanji: 'go', type: '浊音', form: '平假名' },

  { kana: 'ざ', romanji: 'za', type: '浊音', form: '平假名' },
  { kana: 'じ', romanji: ['ji', 'zi'], type: '浊音', form: '平假名' },
  { kana: 'ず', romanji: 'zu', type: '浊音', form: '平假名' },
  { kana: 'ぜ', romanji: 'ze', type: '浊音', form: '平假名' },
  { kana: 'ぞ', romanji: 'zo', type: '浊音', form: '平假名' },

  { kana: 'だ', romanji: 'da', type: '浊音', form: '平假名' },
  { kana: 'ぢ', romanji: ['ji', 'zi'], type: '浊音', form: '平假名' },
  { kana: 'づ', romanji: 'du', type: '浊音', form: '平假名' },
  { kana: 'で', romanji: 'de', type: '浊音', form: '平假名' },
  { kana: 'ど', romanji: 'do', type: '浊音', form: '平假名' },

  { kana: 'ば', romanji: 'ba', type: '浊音', form: '平假名' },
  { kana: 'び', romanji: 'bi', type: '浊音', form: '平假名' },
  { kana: 'ぶ', romanji: 'bu', type: '浊音', form: '平假名' },
  { kana: 'べ', romanji: 'be', type: '浊音', form: '平假名' },
  { kana: 'ぼ', romanji: 'bo', type: '浊音', form: '平假名' },
  // 平假名 (半浊音)
  { kana: 'ぱ', romanji: 'pa', type: '半浊音', form: '平假名' },
  { kana: 'ぴ', romanji: 'pi', type: '半浊音', form: '平假名' },
  { kana: 'ぷ', romanji: 'pu', type: '半浊音', form: '平假名' },
  { kana: 'ぺ', romanji: 'pe', type: '半浊音', form: '平假名' },
  { kana: 'ぽ', romanji: 'po', type: '半浊音', form: '平假名' },


  // 平假名 (拗音)
  { kana: 'きゃ', romanji: 'kya', type: '拗音', form: '平假名' },
  { kana: 'きゅ', romanji: 'kyu', type: '拗音', form: '平假名' },
  { kana: 'きょ', romanji: 'kyo', type: '拗音', form: '平假名' },

  { kana: 'しゃ', romanji: ['sha', 'sya'], type: '拗音', form: '平假名' },
  { kana: 'しゅ', romanji: ['shu', 'syu'], type: '拗音', form: '平假名' },
  { kana: 'しょ', romanji: ['sho', 'syo'], type: '拗音', form: '平假名' },

  { kana: 'ちゃ', romanji: ['cha', 'tya'], type: '拗音', form: '平假名' },
  { kana: 'ちゅ', romanji: ['chu', 'tyu'], type: '拗音', form: '平假名' },
  { kana: 'ちょ', romanji: ['cho', 'tyo'], type: '拗音', form: '平假名' },

  { kana: 'にゃ', romanji: 'nya', type: '拗音', form: '平假名' },
  { kana: 'にゅ', romanji: 'nyu', type: '拗音', form: '平假名' },
  { kana: 'にょ', romanji: 'nyo', type: '拗音', form: '平假名' },

  { kana: 'ひゃ', romanji: 'hya', type: '拗音', form: '平假名' },
  { kana: 'ひゅ', romanji: 'hyu', type: '拗音', form: '平假名' },
  { kana: 'ひょ', romanji: 'hyo', type: '拗音', form: '平假名' },

  { kana: 'みゃ', romanji: 'mya', type: '拗音', form: '平假名' },
  { kana: 'みゅ', romanji: 'myu', type: '拗音', form: '平假名' },
  { kana: 'みょ', romanji: 'myo', type: '拗音', form: '平假名' },

  { kana: 'りゃ', romanji: 'rya', type: '拗音', form: '平假名' },
  { kana: 'りゅ', romanji: 'ryu', type: '拗音', form: '平假名' },
  { kana: 'りょ', romanji: 'ryo', type: '拗音', form: '平假名' },

  { kana: 'ぎゃ', romanji: 'gya', type: '拗音', form: '平假名' },
  { kana: 'ぎゅ', romanji: 'gyu', type: '拗音', form: '平假名' },
  { kana: 'ぎょ', romanji: 'gyo', type: '拗音', form: '平假名' },

  { kana: 'じゃ', romanji: ['ja', 'zya'], type: '拗音', form: '平假名' },
  { kana: 'じゅ', romanji: ['ju', 'zyu'], type: '拗音', form: '平假名' },
  { kana: 'じょ', romanji: ['jo', 'zyo'], type: '拗音', form: '平假名' },

  { kana: 'びゃ', romanji: 'bya', type: '拗音', form: '平假名' },
  { kana: 'びゅ', romanji: 'byu', type: '拗音', form: '平假名' },
  { kana: 'びょ', romanji: 'byo', type: '拗音', form: '平假名' },

  { kana: 'ぴゃ', romanji: 'pya', type: '拗音', form: '平假名' },
  { kana: 'ぴゅ', romanji: 'pyu', type: '拗音', form: '平假名' },
  { kana: 'ぴょ', romanji: 'pyo', type: '拗音', form: '平假名' },


  // 片假名 (清音)
  { kana: 'ア', romanji: 'a', type: '清音', form: '片假名' },
  { kana: 'イ', romanji: 'i', type: '清音', form: '片假名' },
  { kana: 'ウ', romanji: 'u', type: '清音', form: '片假名' },
  { kana: 'エ', romanji: 'e', type: '清音', form: '片假名' },
  { kana: 'オ', romanji: 'o', type: '清音', form: '片假名' },

  { kana: 'カ', romanji: 'ka', type: '清音', form: '片假名' },
  { kana: 'キ', romanji: 'ki', type: '清音', form: '片假名' },
  { kana: 'ク', romanji: 'ku', type: '清音', form: '片假名' },
  { kana: 'ケ', romanji: 'ke', type: '清音', form: '片假名' },
  { kana: 'コ', romanji: 'ko', type: '清音', form: '片假名' },

  { kana: 'サ', romanji: 'sa', type: '清音', form: '片假名' },
  { kana: 'シ', romanji: ['shi', 'si'], type: '清音', form: '片假名' },
  { kana: 'ス', romanji: 'su', type: '清音', form: '片假名' },
  { kana: 'セ', romanji: 'se', type: '清音', form: '片假名' },
  { kana: 'ソ', romanji: 'so', type: '清音', form: '片假名' },

  { kana: 'タ', romanji: 'ta', type: '清音', form: '片假名' },
  { kana: 'チ', romanji: ['chi', 'ti'], type: '清音', form: '片假名' },
  { kana: 'ツ', romanji: ['tsu', 'tu'], type: '清音', form: '片假名' },
  { kana: 'テ', romanji: 'te', type: '清音', form: '片假名' },
  { kana: 'ト', romanji: 'to', type: '清音', form: '片假名' },

  { kana: 'ナ', romanji: 'na', type: '清音', form: '片假名' },
  { kana: 'ニ', romanji: 'ni', type: '清音', form: '片假名' },
  { kana: 'ヌ', romanji: 'nu', type: '清音', form: '片假名' },
  { kana: 'ネ', romanji: 'ne', type: '清音', form: '片假名' },
  { kana: 'ノ', romanji: 'no', type: '清音', form: '片假名' },

  { kana: 'ハ', romanji: 'ha', type: '清音', form: '片假名' },
  { kana: 'ヒ', romanji: 'hi', type: '清音', form: '片假名' },
  { kana: 'フ', romanji: ['fu', 'hu'], type: '清音', form: '片假名' },
  { kana: 'ヘ', romanji: 'he', type: '清音', form: '片假名' },
  { kana: 'ホ', romanji: 'ho', type: '清音', form: '片假名' },

  { kana: 'マ', romanji: 'ma', type: '清音', form: '片假名' },
  { kana: 'ミ', romanji: 'mi', type: '清音', form: '片假名' },
  { kana: 'ム', romanji: 'mu', type: '清音', form: '片假名' },
  { kana: 'メ', romanji: 'me', type: '清音', form: '片假名' },
  { kana: 'モ', romanji: 'mo', type: '清音', form: '片假名' },

  { kana: 'ヤ', romanji: 'ya', type: '清音', form: '片假名' },
  { kana: 'ユ', romanji: 'yu', type: '清音', form: '片假名' },
  { kana: 'ヨ', romanji: 'yo', type: '清音', form: '片假名' },

  { kana: 'ラ', romanji: 'ra', type: '清音', form: '片假名' },
  { kana: 'リ', romanji: 'ri', type: '清音', form: '片假名' },
  { kana: 'ル', romanji: 'ru', type: '清音', form: '片假名' },
  { kana: 'レ', romanji: 're', type: '清音', form: '片假名' },
  { kana: 'ロ', romanji: 'ro', type: '清音', form: '片假名' },

  { kana: 'ワ', romanji: 'wa', type: '清音', form: '片假名' },
  { kana: 'ヲ', romanji: ['wo', 'o'], type: '清音', form: '片假名' },

  // 片假名 (拔音)
  { kana: 'ン', romanji: 'n', type: '拔音', form: '片假名' },

  // 片假名 (浊音)
  { kana: 'ガ', romanji: 'ga', type: '浊音', form: '片假名' },
  { kana: 'ギ', romanji: 'gi', type: '浊音', form: '片假名' },
  { kana: 'グ', romanji: 'gu', type: '浊音', form: '片假名' },
  { kana: 'ゲ', romanji: 'ge', type: '浊音', form: '片假名' },
  { kana: 'ゴ', romanji: 'go', type: '浊音', form: '片假名' },

  { kana: 'ザ', romanji: 'za', type: '浊音', form: '片假名' },
  { kana: 'ジ', romanji: ['ji', 'zi'], type: '浊音', form: '片假名' },
  { kana: 'ズ', romanji: 'zu', type: '浊音', form: '片假名' },
  { kana: 'ゼ', romanji: 'ze', type: '浊音', form: '片假名' },
  { kana: 'ゾ', romanji: 'zo', type: '浊音', form: '片假名' },

  { kana: 'ダ', romanji: 'da', type: '浊音', form: '片假名' },
  { kana: 'ヂ', romanji: ['ji', 'zi'], type: '浊音', form: '片假名' },
  { kana: 'ヅ', romanji: 'zu', type: '浊音', form: '片假名' },
  { kana: 'デ', romanji: 'de', type: '浊音', form: '片假名' },
  { kana: 'ド', romanji: 'do', type: '浊音', form: '片假名' },

  { kana: 'バ', romanji: 'ba', type: '浊音', form: '片假名' },
  { kana: 'ビ', romanji: 'bi', type: '浊音', form: '片假名' },
  { kana: 'ブ', romanji: 'bu', type: '浊音', form: '片假名' },
  { kana: 'ベ', romanji: 'be', type: '浊音', form: '片假名' },
  { kana: 'ボ', romanji: 'bo', type: '浊音', form: '片假名' },

  // 片假名 (半浊音)
  { kana: 'パ', romanji: 'pa', type: '半浊音', form: '片假名' },
  { kana: 'ピ', romanji: 'pi', type: '半浊音', form: '片假名' },
  { kana: 'プ', romanji: 'pu', type: '半浊音', form: '片假名' },
  { kana: 'ペ', romanji: 'pe', type: '半浊音', form: '片假名' },
  { kana: 'ポ', romanji: 'po', type: '半浊音', form: '片假名' },


  // 片假名 (拗音)
  { kana: 'キャ', romanji: 'kya', type: '拗音', form: '片假名' },
  { kana: 'キュ', romanji: 'kyu', type: '拗音', form: '片假名' },
  { kana: 'キョ', romanji: 'kyo', type: '拗音', form: '片假名' },

  { kana: 'シャ', romanji: ['sha', 'sya'], type: '拗音', form: '片假名' },
  { kana: 'シュ', romanji: ['shu', 'syu'], type: '拗音', form: '片假名' },
  { kana: 'ショ', romanji: ['sho', 'syo'], type: '拗音', form: '片假名' },

  { kana: 'チャ', romanji: ['cha', 'tya'], type: '拗音', form: '片假名' },
  { kana: 'チュ', romanji: ['chu', 'tyu'], type: '拗音', form: '片假名' },
  { kana: 'チョ', romanji: ['cho', 'tyo'], type: '拗音', form: '片假名' },

  { kana: 'ニャ', romanji: 'nya', type: '拗音', form: '片假名' },
  { kana: 'ニュ', romanji: 'nyu', type: '拗音', form: '片假名' },
  { kana: 'ニョ', romanji: 'nyo', type: '拗音', form: '片假名' },

  { kana: 'ヒャ', romanji: 'hya', type: '拗音', form: '片假名' },
  { kana: 'ヒュ', romanji: 'hyu', type: '拗音', form: '片假名' },
  { kana: 'ヒョ', romanji: 'hyo', type: '拗音', form: '片假名' },

  { kana: 'ミャ', romanji: 'mya', type: '拗音', form: '片假名' },
  { kana: 'ミュ', romanji: 'myu', type: '拗音', form: '片假名' },
  { kana: 'ミョ', romanji: 'myo', type: '拗音', form: '片假名' },

  { kana: 'リャ', romanji: 'rya', type: '拗音', form: '片假名' },
  { kana: 'リュ', romanji: 'ryu', type: '拗音', form: '片假名' },
  { kana: 'リョ', romanji: 'ryo', type: '拗音', form: '片假名' },

  { kana: 'ギャ', romanji: 'gya', type: '拗音', form: '片假名' },
  { kana: 'ギュ', romanji: 'gyu', type: '拗音', form: '片假名' },
  { kana: 'ギョ', romanji: 'gyo', type: '拗音', form: '片假名' },

  { kana: 'ジャ', romanji: ['ja', 'zya'], type: '拗音', form: '片假名' },
  { kana: 'ジュ', romanji: ['ju', 'zyu'], type: '拗音', form: '片假名' },
  { kana: 'ジョ', romanji: ['jo', 'zyo'], type: '拗音', form: '片假名' },

  { kana: 'ビャ', romanji: 'bya', type: '拗音', form: '片假名' },
  { kana: 'ビュ', romanji: 'byu', type: '拗音', form: '片假名' },
  { kana: 'ビョ', romanji: 'byo', type: '拗音', form: '片假名' },
  
  { kana: 'ピャ', romanji: 'pya', type: '拗音', form: '片假名' },
  { kana: 'ピュ', romanji: 'pyu', type: '拗音', form: '片假名' },
  { kana: 'ピョ', romanji: 'pyo', type: '拗音', form: '片假名' },
  
  //特殊假名-片假名
  { kana: 'ヴァ', romanji: 'va', type: '特殊假名', form: '片假名' },
  { kana: 'ヴィ', romanji: 'vi', type: '特殊假名', form: '片假名' },
  { kana: 'ヴ', romanji: 'vu', type: '特殊假名', form: '片假名' },
  { kana: 'ヴェ', romanji: 've', type: '特殊假名', form: '片假名' },
  { kana: 'ヴォ', romanji: 'vo', type: '特殊假名', form: '片假名' },

  { kana: 'ウィ', romanji: 'wi', type: '特殊假名', form: '片假名' },
  { kana: 'ウェ', romanji: 'we', type: '特殊假名', form: '片假名' },
  { kana: 'ウォ', romanji: 'wo', type: '特殊假名', form: '片假名' },
];
