/* =========================================================================
   Japan Payroll Rules — bundled 2026 prototype-production data
   ========================================================================= */

const JP_PAYROLL_RULES_2026 = {
  version: 'jp-payroll-2026.04',
  verifiedAt: '2026-04-25',
  sources: {
    kyokaiKenpo: 'https://www.kyoukaikenpo.or.jp/about/business/insurance_rate/premium_prefectures/r08/',
    kyokaiKenpoWorkbook: 'https://www.kyoukaikenpo.or.jp/assets/r8ippan3.xlsx',
    employmentInsurance: 'https://www.mhlw.go.jp/content/001692566.pdf',
    nationalPension: 'https://www.nenkin.go.jp/section/faq/kokunen/seido/hokenryo/seidosetsumei/20150331.html',
    ntaWithholding: 'https://www.nta.go.jp/publication/pamph/gensen/zeigakuhyo2026/01.htm',
    overseasDependents: 'https://www.nta.go.jp/taxes/tetsuzuki/shinsei/annai/gensen/kokugai/',
    residentTax: 'https://www.tax.metro.tokyo.lg.jp/kazei/life/kojin_ju/tokubetsu/about'
  },
  socialInsurance: {
    careAgeFrom: 40,
    careAgeTo: 64,
    healthAgeTo: 74,
    pensionAgeTo: 69,
    childSupportRate: 0.0023,
    pensionRate: 0.183
  },
  employmentInsurance: {
    general: { label: 'General', workerRate: 0.005 },
    agricultureSakeConstruction: { label: 'Agriculture / sake / construction', workerRate: 0.006 },
    none: { label: 'Not enrolled', workerRate: 0 }
  },
  nationalPensionMonthly: 17920,
  incomeTaxEstimate: {
    reconstructionSurtaxRate: 0.021,
    basicDeduction: 580000,
    dependentDeduction: 380000,
    salaryDeductionMinimum: 650000
  },
  residentTaxEstimate: {
    incomeRate: 0.10,
    perCapitaAnnual: 5000,
    basicDeduction: 430000,
    dependentDeduction: 330000
  },
  prefectures: [
    ['hokkaido','北海道','Hokkaido',0.1028,0.1190], ['aomori','青森','Aomori',0.0985,0.1147],
    ['iwate','岩手','Iwate',0.0951,0.1113], ['miyagi','宮城','Miyagi',0.1010,0.1172],
    ['akita','秋田','Akita',0.1001,0.1163], ['yamagata','山形','Yamagata',0.0975,0.1137],
    ['fukushima','福島','Fukushima',0.0950,0.1112], ['ibaraki','茨城','Ibaraki',0.0952,0.1114],
    ['tochigi','栃木','Tochigi',0.0982,0.1144], ['gunma','群馬','Gunma',0.0968,0.1130],
    ['saitama','埼玉','Saitama',0.0967,0.1129], ['chiba','千葉','Chiba',0.0973,0.1135],
    ['tokyo','東京','Tokyo',0.0985,0.1147], ['kanagawa','神奈川','Kanagawa',0.0992,0.1154],
    ['niigata','新潟','Niigata',0.0921,0.1083], ['toyama','富山','Toyama',0.0959,0.1121],
    ['ishikawa','石川','Ishikawa',0.0970,0.1132], ['fukui','福井','Fukui',0.0971,0.1133],
    ['yamanashi','山梨','Yamanashi',0.0955,0.1117], ['nagano','長野','Nagano',0.0963,0.1125],
    ['gifu','岐阜','Gifu',0.0980,0.1142], ['shizuoka','静岡','Shizuoka',0.0961,0.1123],
    ['aichi','愛知','Aichi',0.0993,0.1155], ['mie','三重','Mie',0.0977,0.1139],
    ['shiga','滋賀','Shiga',0.0988,0.1150], ['kyoto','京都','Kyoto',0.0989,0.1151],
    ['osaka','大阪','Osaka',0.1013,0.1175], ['hyogo','兵庫','Hyogo',0.1012,0.1174],
    ['nara','奈良','Nara',0.0991,0.1153], ['wakayama','和歌山','Wakayama',0.1006,0.1168],
    ['tottori','鳥取','Tottori',0.0986,0.1148], ['shimane','島根','Shimane',0.0994,0.1156],
    ['okayama','岡山','Okayama',0.1005,0.1167], ['hiroshima','広島','Hiroshima',0.0978,0.1140],
    ['yamaguchi','山口','Yamaguchi',0.1015,0.1177], ['tokushima','徳島','Tokushima',0.1024,0.1186],
    ['kagawa','香川','Kagawa',0.1002,0.1164], ['ehime','愛媛','Ehime',0.0998,0.1160],
    ['kochi','高知','Kochi',0.1005,0.1167], ['fukuoka','福岡','Fukuoka',0.1011,0.1173],
    ['saga','佐賀','Saga',0.1055,0.1217], ['nagasaki','長崎','Nagasaki',0.1006,0.1168],
    ['kumamoto','熊本','Kumamoto',0.1008,0.1170], ['oita','大分','Oita',0.1008,0.1170],
    ['miyazaki','宮崎','Miyazaki',0.0977,0.1139], ['kagoshima','鹿児島','Kagoshima',0.1013,0.1175],
    ['okinawa','沖縄','Okinawa',0.0944,0.1106]
  ].map(p => ({ id: p[0], name: p[1], en: p[2], healthRate: p[3], healthCareRate: p[4] })),
  healthStandardMonthly: [
    [1,58000,0,63000], [2,68000,63000,73000], [3,78000,73000,83000], [4,88000,83000,93000],
    [5,98000,93000,101000], [6,104000,101000,107000], [7,110000,107000,114000], [8,118000,114000,122000],
    [9,126000,122000,130000], [10,134000,130000,138000], [11,142000,138000,146000], [12,150000,146000,155000],
    [13,160000,155000,165000], [14,170000,165000,175000], [15,180000,175000,185000], [16,190000,185000,195000],
    [17,200000,195000,210000], [18,220000,210000,230000], [19,240000,230000,250000], [20,260000,250000,270000],
    [21,280000,270000,290000], [22,300000,290000,310000], [23,320000,310000,330000], [24,340000,330000,350000],
    [25,360000,350000,370000], [26,380000,370000,395000], [27,410000,395000,425000], [28,440000,425000,455000],
    [29,470000,455000,485000], [30,500000,485000,515000], [31,530000,515000,545000], [32,560000,545000,575000],
    [33,590000,575000,605000], [34,620000,605000,635000], [35,650000,635000,665000], [36,680000,665000,695000],
    [37,710000,695000,730000], [38,750000,730000,770000], [39,790000,770000,810000], [40,830000,810000,855000],
    [41,880000,855000,905000], [42,930000,905000,955000], [43,980000,955000,1005000], [44,1030000,1005000,1055000],
    [45,1090000,1055000,1115000], [46,1150000,1115000,1175000], [47,1210000,1175000,1235000],
    [48,1270000,1235000,1295000], [49,1330000,1295000,1355000], [50,1390000,1355000,null]
  ].map(x => ({ grade: x[0], amount: x[1], lower: x[2], upper: x[3] })),
  pensionStandardMonthly: [
    [1,4,88000,0,93000], [2,5,98000,93000,101000], [3,6,104000,101000,107000], [4,7,110000,107000,114000],
    [5,8,118000,114000,122000], [6,9,126000,122000,130000], [7,10,134000,130000,138000], [8,11,142000,138000,146000],
    [9,12,150000,146000,155000], [10,13,160000,155000,165000], [11,14,170000,165000,175000], [12,15,180000,175000,185000],
    [13,16,190000,185000,195000], [14,17,200000,195000,210000], [15,18,220000,210000,230000], [16,19,240000,230000,250000],
    [17,20,260000,250000,270000], [18,21,280000,270000,290000], [19,22,300000,290000,310000], [20,23,320000,310000,330000],
    [21,24,340000,330000,350000], [22,25,360000,350000,370000], [23,26,380000,370000,395000], [24,27,410000,395000,425000],
    [25,28,440000,425000,455000], [26,29,470000,455000,485000], [27,30,500000,485000,515000], [28,31,530000,515000,545000],
    [29,32,560000,545000,575000], [30,33,590000,575000,605000], [31,34,620000,605000,635000], [32,35,650000,635000,null]
  ].map(x => ({ grade: x[0], healthGrade: x[1], amount: x[2], lower: x[3], upper: x[4] }))
};
