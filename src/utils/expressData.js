const expressData = [
  {express_name: '顺丰速运', express_coding: 'SF'},
  {express_name: '百世快递', express_coding: 'HTKY'},
  {express_name: '中通快递', express_coding: 'ZTO'},
  {express_name: '申通快递', express_coding: 'STO'},
  {express_name: '圆通速递', express_coding: 'YTO'},
  {express_name: '韵达速递', express_coding: 'YD'},
  {express_name: '邮政快递包裹', express_coding: 'YZPY'},
  {express_name: 'EMS', express_coding: 'EMS'},
  {express_name: '天天快递', express_coding: 'HHTT'},
  {express_name: '京东快递', express_coding: 'JD'},
  {express_name: '优速快递', express_coding: 'UC'},
  {express_name: '德邦快递', express_coding: 'DBL'},
  {express_name: '宅急送', express_coding: 'ZJS'},
  {express_name: 'TNT快递', express_coding: 'TNT'},
  {express_name: 'UPS', express_coding: 'UPS'},
  {express_name: 'DHL', express_coding: 'DHL'},
  {express_name: 'FEDEX联邦(国内件）', express_coding: 'FEDEX'},
  {express_name: 'FEDEX联邦(国际件）', express_coding: 'FEDEX_GJ'},
  {express_name: '安捷快递', express_coding: 'AJ'},
  {express_name: '阿里跨境电商物流', express_coding: 'ALKJWL'},
  {express_name: '安讯物流', express_coding: 'AXWL'},
  {express_name: '安邮美国', express_coding: 'AYUS'},
  {express_name: '亚马逊物流', express_coding: 'AMAZON'},
  {express_name: '澳门邮政', express_coding: 'AOMENYZ'},
  {express_name: '安能物流', express_coding: 'ANE'},
  {express_name: '澳多多', express_coding: 'ADD'},
  {express_name: '澳邮专线', express_coding: 'AYCA'},
  {express_name: '安鲜达', express_coding: 'AXD'},
  {express_name: '安能快运', express_coding: 'ANEKY'},
  {express_name: '八达通  ', express_coding: 'BDT'},
  {express_name: '百腾物流', express_coding: 'BETWL'},
  {express_name: '北极星快运', express_coding: 'BJXKY'},
  {express_name: '奔腾物流', express_coding: 'BNTWL'},
  {express_name: '百福东方', express_coding: 'BFDF'},
  {express_name: '贝海国际 ', express_coding: 'BHGJ'},
  {express_name: '八方安运', express_coding: 'BFAY'},
  {express_name: '百世快运', express_coding: 'BTWL'},
  {express_name: '春风物流', express_coding: 'CFWL'},
  {express_name: '诚通物流', express_coding: 'CHTWL'},
  {express_name: '传喜物流', express_coding: 'CXHY'},
  {express_name: '程光   ', express_coding: 'CG'},
  {express_name: '城市100', express_coding: 'CITY100'},
  {express_name: '城际快递', express_coding: 'CJKD'},
  {express_name: 'CNPEX中邮快递', express_coding: 'CNPEX'},
  {express_name: 'COE东方快递', express_coding: 'COE'},
  {express_name: '长沙创一', express_coding: 'CSCY'},
  {express_name: '成都善途速运', express_coding: 'CDSTKY'},
  {express_name: '联合运通', express_coding: 'CTG'},
  {express_name: '疯狂快递', express_coding: 'CRAZY'},
  {express_name: 'CBO钏博物流', express_coding: 'CBO'},
  {express_name: '承诺达', express_coding: 'CND'},
  {express_name: 'D速物流', express_coding: 'DSWL'},
  {express_name: '到了港', express_coding: 'DLG '},
  {express_name: '大田物流', express_coding: 'DTWL'},
  {express_name: '东骏快捷物流', express_coding: 'DJKJWL'},
  {express_name: '德坤', express_coding: 'DEKUN'},
  {express_name: '德邦快运', express_coding: 'DBLKY'},
  {express_name: 'E特快', express_coding: 'ETK'},
  {express_name: 'EWE', express_coding: 'EWE'},
  {express_name: '快服务', express_coding: 'KFW'},
  {express_name: '飞康达', express_coding: 'FKD'},
  {express_name: '富腾达  ', express_coding: 'FTD'},
  {express_name: '凡宇货的', express_coding: 'FYKD'},
  {express_name: '速派快递', express_coding: 'FASTGO'},
  {express_name: '丰通快运', express_coding: 'FT'},
  {express_name: '冠达   ', express_coding: 'GD'},
  {express_name: '国通快递', express_coding: 'GTO'},
  {express_name: '广东邮政', express_coding: 'GDEMS'},
  {express_name: '共速达', express_coding: 'GSD'},
  {express_name: '广通       ', express_coding: 'GTONG'},
  {express_name: '迦递快递', express_coding: 'GAI'},
  {express_name: '港快速递', express_coding: 'GKSD'},
  {express_name: '高铁速递', express_coding: 'GTSD'},
  {express_name: '汇丰物流', express_coding: 'HFWL'},
  {express_name: '黑狗冷链', express_coding: 'HGLL'},
  {express_name: '恒路物流', express_coding: 'HLWL'},
  {express_name: '天地华宇', express_coding: 'HOAU'},
  {express_name: '鸿桥供应链', express_coding: 'HOTSCM'},
  {express_name: '海派通物流公司', express_coding: 'HPTEX'},
  {express_name: '华强物流', express_coding: 'hq568'},
  {express_name: '环球速运  ', express_coding: 'HQSY'},
  {express_name: '华夏龙物流', express_coding: 'HXLWL'},
  {express_name: '豪翔物流 ', express_coding: 'HXWL'},
  {express_name: '合肥汇文', express_coding: 'HFHW'},
  {express_name: '辉隆物流', express_coding: 'HLONGWL'},
  {express_name: '华企快递', express_coding: 'HQKD'},
  {express_name: '韩润物流', express_coding: 'HRWL'},
  {express_name: '青岛恒通快递', express_coding: 'HTKD'},
  {express_name: '货运皇物流', express_coding: 'HYH'},
  {express_name: '好来运快递', express_coding: 'HYLSD'},
  {express_name: '皇家物流', express_coding: 'HJWL'},
  {express_name: '捷安达  ', express_coding: 'JAD'},
  {express_name: '京广速递', express_coding: 'JGSD'},
  {express_name: '九曳供应链', express_coding: 'JIUYE'},
  {express_name: '急先达', express_coding: 'JXD'},
  {express_name: '晋越快递', express_coding: 'JYKD'},
  {express_name: '加运美', express_coding: 'JYM'},
  {express_name: '景光物流', express_coding: 'JGWL'},
  {express_name: '佳怡物流', express_coding: 'JYWL'},
  {express_name: '京东快运', express_coding: 'JDKY'},
  {express_name: '跨越速运', express_coding: 'KYSY'},
  {express_name: '跨越物流', express_coding: 'KYWL'},
  {express_name: '快速递物流', express_coding: 'KSDWL'},
  {express_name: '龙邦快递', express_coding: 'LB'},
  {express_name: '立即送', express_coding: 'LJSKD'},
  {express_name: '联昊通速递', express_coding: 'LHT'},
  {express_name: '民邦快递', express_coding: 'MB'},
  {express_name: '民航快递', express_coding: 'MHKD'},
  {express_name: '美快    ', express_coding: 'MK'},
  {express_name: '门对门快递', express_coding: 'MDM'},
  {express_name: '迈隆递运', express_coding: 'MRDY'},
  {express_name: '明亮物流', express_coding: 'MLWL'},
  {express_name: '南方', express_coding: 'NF'},
  {express_name: '能达速递', express_coding: 'NEDA'},
  {express_name: '平安达腾飞快递', express_coding: 'PADTF'},
  {express_name: '泛捷快递', express_coding: 'PANEX'},
  {express_name: '品骏快递', express_coding: 'PJ'},
  {express_name: 'PCA Express', express_coding: 'PCA'},
  {express_name: '全晨快递', express_coding: 'QCKD'},
  {express_name: '全日通快递', express_coding: 'QRT'},
  {express_name: '快客快递', express_coding: 'QUICK'},
  {express_name: '全信通', express_coding: 'QXT'},
  {express_name: '如风达', express_coding: 'RFD'},
  {express_name: '日日顺物流', express_coding: 'RRS'},
  {express_name: '瑞丰速递', express_coding: 'RFEX'},
  {express_name: '赛澳递', express_coding: 'SAD'},
  {express_name: '苏宁物流', express_coding: 'SNWL'},
  {express_name: '圣安物流', express_coding: 'SAWL'},
  {express_name: '晟邦物流', express_coding: 'SBWL'},
  {express_name: '上大物流', express_coding: 'SDWL'},
  {express_name: '盛丰物流', express_coding: 'SFWL'},
  {express_name: '速通物流', express_coding: 'ST'},
  {express_name: '速腾快递', express_coding: 'STWL'},
  {express_name: '速必达物流', express_coding: 'SUBIDA'},
  {express_name: '速递e站', express_coding: 'SDEZ'},
  {express_name: '速呈宅配', express_coding: 'SCZPDS'},
  {express_name: '速尔快递', express_coding: 'SURE'},
  {express_name: '台湾邮政', express_coding: 'TAIWANYZ'},
  {express_name: '唐山申通', express_coding: 'TSSTO'},
  {express_name: '通用物流', express_coding: 'TYWL'},
  {express_name: '全一快递', express_coding: 'UAPEX'},
  {express_name: '优联吉运', express_coding: 'ULUCKEX'},
  {express_name: 'UEQ Express', express_coding: 'UEQ'},
  {express_name: '万家康  ', express_coding: 'WJK'},
  {express_name: '万家物流', express_coding: 'WJWL'},
  {express_name: '武汉同舟行', express_coding: 'WHTZX'},
  {express_name: '维普恩', express_coding: 'WPE'},
  {express_name: '微特派', express_coding: 'WTP'},
  {express_name: '迅驰物流  ', express_coding: 'XCWL'},
  {express_name: '信丰物流', express_coding: 'XFEX'},
  {express_name: '希优特', express_coding: 'XYT'},
  {express_name: '新杰物流', express_coding: 'XJ'},
  {express_name: '源安达快递', express_coding: 'YADEX'},
  {express_name: '远成物流', express_coding: 'YCWL'},
  {express_name: '远成快运', express_coding: 'YCSY'},
  {express_name: '义达国际物流', express_coding: 'YDH'},
  {express_name: '易达通  ', express_coding: 'YDT'},
  {express_name: '原飞航物流', express_coding: 'YFHEX'},
  {express_name: '亚风快递', express_coding: 'YFSD'},
  {express_name: '运通快递', express_coding: 'YTKD'},
  {express_name: '亿翔快递', express_coding: 'YXKD'},
  {express_name: '运东西网', express_coding: 'YUNDX'},
  {express_name: '壹米滴答', express_coding: 'YMDD'},
  {express_name: '邮政国内标快', express_coding: 'YZBK'},
  {express_name: '一站通速运', express_coding: 'YZTSY'},
  {express_name: '驭丰速运', express_coding: 'YFSUYUN'},
  {express_name: '余氏东风', express_coding: 'YSDF'},
  {express_name: '增益快递', express_coding: 'ZENY'},
  {express_name: '汇强快递', express_coding: 'ZHQKD'},
  {express_name: '众通快递', express_coding: 'ZTE'},
  {express_name: '中铁快运', express_coding: 'ZTKY'},
  {express_name: '中铁物流', express_coding: 'ZTWL'},
  {express_name: '郑州速捷', express_coding: 'SJ'},
  {express_name: '中通快运', express_coding: 'ZTOKY'},
  {express_name: '中邮快递', express_coding: 'ZYKD'},
  {express_name: '中粮我买网', express_coding: 'WM'},
  {express_name: 'AAE全球专递', express_coding: 'AAE'},
  {express_name: 'ACS雅仕快递', express_coding: 'ACS'},
  {express_name: 'ADP Express Tracking', express_coding: 'ADP'},
  {express_name: '安圭拉邮政', express_coding: 'ANGUILAYOU'},
  {express_name: 'APAC', express_coding: 'APAC'},
  {express_name: 'Aramex', express_coding: 'ARAMEX'},
  {express_name: '奥地利邮政', express_coding: 'AT'},
  {express_name: 'Australia Post Tracking', express_coding: 'AUSTRALIA'},
  {express_name: '比利时邮政', express_coding: 'BEL'},
  {express_name: 'BHT快递', express_coding: 'BHT'},
  {express_name: '秘鲁邮政', express_coding: 'BILUYOUZHE'},
  {express_name: '巴西邮政', express_coding: 'BR'},
  {express_name: '不丹邮政', express_coding: 'BUDANYOUZH'},
  {express_name: 'CDEK', express_coding: 'CDEK'},
  {express_name: '加拿大邮政', express_coding: 'CA'},
  {express_name: '递必易国际物流', express_coding: 'DBYWL'},
  {express_name: '大道物流', express_coding: 'DDWL'},
  {express_name: '德国云快递', express_coding: 'DGYKD'},
  {express_name: '到乐国际', express_coding: 'DLGJ'},
  {express_name: 'DHL德国', express_coding: 'DHL_DE'},
  {express_name: 'DHL(英文版)', express_coding: 'DHL_EN'},
  {express_name: 'DHL全球', express_coding: 'DHL_GLB'},
  {express_name: 'DHL Global Mail', express_coding: 'DHLGM'},
  {express_name: '丹麦邮政', express_coding: 'DK'},
  {express_name: 'DPD', express_coding: 'DPD'},
  {express_name: 'DPEX', express_coding: 'DPEX'},
  {express_name: 'EMS国际', express_coding: 'EMSGJ'},
  {express_name: '易客满', express_coding: 'EKM'},
  {express_name: 'EPS (联众国际快运)', express_coding: 'EPS'},
  {express_name: 'EShipper', express_coding: 'ESHIPPER'},
  {express_name: '丰程物流', express_coding: 'FCWL'},
  {express_name: '法翔速运', express_coding: 'FX'},
  {express_name: 'FQ', express_coding: 'FQ'},
  {express_name: '国际e邮宝', express_coding: 'GJEYB'},
  {express_name: '国际邮政包裹', express_coding: 'GJYZ'},
  {express_name: 'GE2D', express_coding: 'GE2D'},
  {express_name: '冠泰', express_coding: 'GT'},
  {express_name: 'GLS', express_coding: 'GLS'},
  {express_name: '安的列斯群岛邮政', express_coding: 'IADLSQDYZ'},
  {express_name: '欧洲专线(邮政)', express_coding: 'IOZYZ'},
  {express_name: '澳大利亚邮政', express_coding: 'IADLYYZ'},
  {express_name: '阿尔巴尼亚邮政', express_coding: 'IAEBNYYZ'},
  {express_name: '阿尔及利亚邮政', express_coding: 'IAEJLYYZ'},
  {express_name: '阿富汗邮政', express_coding: 'IAFHYZ'},
  {express_name: '安哥拉邮政', express_coding: 'IAGLYZ'},
  {express_name: '阿根廷邮政', express_coding: 'IAGTYZ'},
  {express_name: '埃及邮政', express_coding: 'IAJYZ'},
  {express_name: '阿鲁巴邮政', express_coding: 'IALBYZ'},
  {express_name: '奥兰群岛邮政', express_coding: 'IALQDYZ'},
  {express_name: '阿联酋邮政', express_coding: 'IALYYZ'},
  {express_name: '阿曼邮政', express_coding: 'IAMYZ'},
  {express_name: '阿塞拜疆邮政', express_coding: 'IASBJYZ'},
  {express_name: '爱沙尼亚邮政', express_coding: 'IASNYYZ'},
  {express_name: '博茨瓦纳邮政', express_coding: 'IBCWNYZ'},
  {express_name: '波多黎各邮政', express_coding: 'IBDLGYZ'},
  {express_name: '冰岛邮政', express_coding: 'IBDYZ'},
  {express_name: '白俄罗斯邮政', express_coding: 'IBELSYZ'},
  {express_name: '波黑邮政', express_coding: 'IBHYZ'},
  {express_name: '保加利亚邮政', express_coding: 'IBJLYYZ'},
  {express_name: '巴基斯坦邮政', express_coding: 'IBJSTYZ'},
  {express_name: '黎巴嫩邮政', express_coding: 'IBLNYZ'},
  {express_name: '便利速递', express_coding: 'IBLSD'},
  {express_name: '玻利维亚邮政', express_coding: 'IBLWYYZ'},
  {express_name: '百慕达邮政', express_coding: 'IBMDYZ'},
  {express_name: '波兰邮政', express_coding: 'IBOLYZ'},
  {express_name: '宝通达', express_coding: 'IBTD'},
  {express_name: '贝邮宝', express_coding: 'IBYB'},
  {express_name: '出口易', express_coding: 'ICKY'},
  {express_name: '达方物流', express_coding: 'IDFWL'},
  {express_name: '德国邮政', express_coding: 'IDGYZ'},
  {express_name: '危地马拉邮政', express_coding: 'IWDMLYZ'},
  {express_name: '乌干达邮政', express_coding: 'IWGDYZ'},
  {express_name: '乌克兰EMS', express_coding: 'IWKLEMS'},
  {express_name: '乌克兰邮政', express_coding: 'IWKLYZ'},
  {express_name: '乌拉圭邮政', express_coding: 'IWLGYZ'},
  {express_name: '林克快递', express_coding: 'ILKKD'},
  {express_name: '文莱邮政', express_coding: 'IWLYZ'},
  {express_name: '新喀里多尼亚邮政', express_coding: 'IXGLDNYYZ'},
  {express_name: '爱尔兰邮政', express_coding: 'IE'},
  {express_name: '夏浦物流', express_coding: 'IXPWL'},
  {express_name: '叙利亚邮政', express_coding: 'IXLYYZ'},
  {express_name: '印度邮政', express_coding: 'IYDYZ'},
  {express_name: '夏浦世纪', express_coding: 'IXPSJ'},
  {express_name: '厄瓜多尔邮政', express_coding: 'IEGDEYZ'},
  {express_name: '俄罗斯邮政', express_coding: 'IELSYZ'},
  {express_name: '厄立特里亚邮政', express_coding: 'IELTLYYZ'},
  {express_name: '飞特物流', express_coding: 'IFTWL'},
  {express_name: '瓜德罗普岛邮政', express_coding: 'IGDLPDYZ'},
  {express_name: '哥斯达黎加邮政', express_coding: 'IGSDLJYZ'},
  {express_name: '韩国邮政', express_coding: 'IHGYZ'},
  {express_name: '华翰物流', express_coding: 'IHHWL'},
  {express_name: '互联易', express_coding: 'IHLY'},
  {express_name: '哈萨克斯坦邮政', express_coding: 'IHSKSTYZ'},
  {express_name: '黑山邮政', express_coding: 'IHSYZ'},
  {express_name: '津巴布韦邮政', express_coding: 'IJBBWYZ'},
  {express_name: '吉尔吉斯斯坦邮政', express_coding: 'IJEJSSTYZ'},
  {express_name: '捷克邮政', express_coding: 'IJKYZ'},
  {express_name: '加纳邮政', express_coding: 'IJNYZ'},
  {express_name: '柬埔寨邮政', express_coding: 'IJPZYZ'},
  {express_name: '克罗地亚邮政', express_coding: 'IKNDYYZ'},
  {express_name: '肯尼亚邮政', express_coding: 'IKNYYZ'},
  {express_name: '科特迪瓦EMS', express_coding: 'IKTDWEMS'},
  {express_name: '科特迪瓦邮政', express_coding: 'IKTDWYZ'},
  {express_name: '罗马尼亚邮政', express_coding: 'ILMNYYZ'},
  {express_name: '摩尔多瓦邮政', express_coding: 'IMEDWYZ'},
  {express_name: '马耳他邮政', express_coding: 'IMETYZ'},
  {express_name: '尼日利亚邮政', express_coding: 'INRLYYZ'},
  {express_name: '塞尔维亚邮政', express_coding: 'ISEWYYZ'},
  {express_name: '塞浦路斯邮政', express_coding: 'ISPLSYZ'},
  {express_name: '乌兹别克斯坦邮政', express_coding: 'IWZBKSTYZ'},
  {express_name: '西班牙邮政', express_coding: 'IXBYYZ'},
  {express_name: '新加坡EMS', express_coding: 'IXJPEMS'},
  {express_name: '希腊邮政', express_coding: 'IXLYZ'},
  {express_name: '新西兰邮政', express_coding: 'IXXLYZ'},
  {express_name: '意大利邮政', express_coding: 'IYDLYZ'},
  {express_name: '英国邮政', express_coding: 'IYGYZ'},
  {express_name: '亚美尼亚邮政', express_coding: 'IYMNYYZ'},
  {express_name: '也门邮政', express_coding: 'IYMYZ'},
  {express_name: '智利邮政', express_coding: 'IZLYZ'},
  {express_name: '日本邮政', express_coding: 'JP'},
  {express_name: '今枫国际', express_coding: 'JFGJ'},
  {express_name: '极光转运', express_coding: 'JGZY'},
  {express_name: '吉祥邮转运', express_coding: 'JXYKD'},
  {express_name: '嘉里国际', express_coding: 'JLDT'},
  {express_name: '绝配国际速递', express_coding: 'JPKD'},
  {express_name: '佳惠尔', express_coding: 'SYJHE'},
  {express_name: '联运通', express_coding: 'LYT'},
  {express_name: '联合快递', express_coding: 'LHKDS'},
  {express_name: '林道国际', express_coding: 'SHLDHY'},
  {express_name: '荷兰邮政', express_coding: 'NL'},
  {express_name: '新顺丰', express_coding: 'NSF'},
  {express_name: 'ONTRAC', express_coding: 'ONTRAC'},
  {express_name: 'OCS', express_coding: 'OCS'},
  {express_name: '全球邮政', express_coding: 'QQYZ'},
  {express_name: 'POSTEIBE', express_coding: 'POSTEIBE'},
  {express_name: '啪啪供应链', express_coding: 'PAPA'},
  {express_name: '秦远海运', express_coding: 'QYHY'},
  {express_name: '启辰国际', express_coding: 'VENUCIA'},
  {express_name: '瑞典邮政', express_coding: 'RDSE'},
  {express_name: 'SKYPOST', express_coding: 'SKYPOST'},
  {express_name: '瑞士邮政', express_coding: 'SWCH'},
  {express_name: '首达速运', express_coding: 'SDSY'},
  {express_name: '穗空物流', express_coding: 'SK'},
  {express_name: '首通快运', express_coding: 'STONG'},
  {express_name: '申通快递国际单', express_coding: 'STO_INTL'},
  {express_name: '上海久易国际', express_coding: 'JYSD'},
  {express_name: '泰国138', express_coding: 'TAILAND138'},
  {express_name: 'USPS美国邮政', express_coding: 'USPS'},
  {express_name: '万国邮政', express_coding: 'UPU'},
  {express_name: '中越国际物流', express_coding: 'VCTRANS'},
  {express_name: '星空国际', express_coding: 'XKGJ'},
  {express_name: '迅达国际', express_coding: 'XD'},
  {express_name: '香港邮政', express_coding: 'XGYZ'},
  {express_name: '喜来快递', express_coding: 'XLKD'},
  {express_name: '鑫世锐达', express_coding: 'XSRD'},
  {express_name: '新元国际', express_coding: 'XYGJ'},
  {express_name: 'ADLER雄鹰国际速递', express_coding: 'XYGJSD'},
  {express_name: '日本大和运输(Yamato)', express_coding: 'YAMA'},
  {express_name: 'YODEL', express_coding: 'YODEL'},
  {express_name: '一号线', express_coding: 'YHXGJSD'},
  {express_name: '约旦邮政', express_coding: 'YUEDANYOUZ'},
  {express_name: '玥玛速运', express_coding: 'YMSY'},
  {express_name: '鹰运', express_coding: 'YYSD'},
  {express_name: '易境达', express_coding: 'YJD'},
  {express_name: '洋包裹', express_coding: 'YBG'},
  {express_name: 'AOL（澳通）', express_coding: 'AOL'},
  {express_name: 'BCWELT   ', express_coding: 'BCWELT'},
  {express_name: '笨鸟国际', express_coding: 'BN'},
  {express_name: '优邦国际速运', express_coding: 'UBONEX'},
  {express_name: 'UEX   ', express_coding: 'UEX'},
  {express_name: '韵达国际', express_coding: 'YDGJ'},
  {express_name: '爱购转运', express_coding: 'ZY_AG'},
  {express_name: '爱欧洲', express_coding: 'ZY_AOZ'},
  {express_name: '澳世速递', express_coding: 'ZY_AUSE'},
  {express_name: 'AXO', express_coding: 'ZY_AXO'},
  {express_name: '贝海速递', express_coding: 'ZY_BH'},
  {express_name: '八达网', express_coding: 'ZY_BDA'},
  {express_name: '蜜蜂速递', express_coding: 'ZY_BEE'},
  {express_name: '百利快递', express_coding: 'ZY_BL'},
  {express_name: '斑马物流', express_coding: 'ZY_BM'},
  {express_name: '百通物流', express_coding: 'ZY_BT'},
  {express_name: '策马转运', express_coding: 'ZY_CM'},
  {express_name: 'EFS POST', express_coding: 'ZY_EFS'},
  {express_name: '宜送转运', express_coding: 'ZY_ESONG'},
  {express_name: 'ETD', express_coding: 'ZY_ETD'},
  {express_name: '飞碟快递', express_coding: 'ZY_FD'},
  {express_name: '飞鸽快递', express_coding: 'ZY_FG'},
  {express_name: '风行快递', express_coding: 'ZY_FX'},
  {express_name: '风行速递', express_coding: 'ZY_FXSD'},
  {express_name: '飞洋快递', express_coding: 'ZY_FY'},
  {express_name: '皓晨快递', express_coding: 'ZY_HC'},
  {express_name: '华兴速运', express_coding: 'ZY_HXSY'},
  {express_name: '海悦速递', express_coding: 'ZY_HYSD'},
  {express_name: '君安快递', express_coding: 'ZY_JA'},
  {express_name: '时代转运', express_coding: 'ZY_JD'},
  {express_name: '骏达快递', express_coding: 'ZY_JDKD'},
  {express_name: '骏达转运', express_coding: 'ZY_JDZY'},
  {express_name: '久禾快递', express_coding: 'ZY_JH'},
  {express_name: '金海淘', express_coding: 'ZY_JHT'},
  {express_name: '联邦转运FedRoad', express_coding: 'ZY_LBZY'},
  {express_name: '领跑者快递', express_coding: 'ZY_LPZ'},
  {express_name: '赤兔马转运', express_coding: 'ZY_CTM'},
  {express_name: '龙象快递', express_coding: 'ZY_LX'},
  {express_name: '量子物流', express_coding: 'ZY_LZWL'},
  {express_name: '美国转运', express_coding: 'ZY_MGZY'},
  {express_name: '美速通', express_coding: 'ZY_MST'},
  {express_name: '美西转运', express_coding: 'ZY_MXZY'},
  {express_name: 'QQ-EX', express_coding: 'ZY_QQEX'},
  {express_name: '瑞天快递', express_coding: 'ZY_RT'},
  {express_name: '瑞天速递', express_coding: 'ZY_RTSD'},
  {express_name: '速达快递', express_coding: 'ZY_SDKD'},
  {express_name: '四方转运', express_coding: 'ZY_SFZY'},
  {express_name: '上腾快递', express_coding: 'ZY_ST'},
  {express_name: '天际快递', express_coding: 'ZY_TJ'},
  {express_name: '天马转运', express_coding: 'ZY_TM'},
  {express_name: '滕牛快递', express_coding: 'ZY_TN'},
  {express_name: 'TrakPak', express_coding: 'ZY_TPAK'},
  {express_name: '太平洋快递', express_coding: 'ZY_TPY'},
  {express_name: '唐三藏转运', express_coding: 'ZY_TSZ'},
  {express_name: 'TWC转运世界', express_coding: 'ZY_TWC'},
  {express_name: '润东国际快线', express_coding: 'ZY_RDGJ'},
  {express_name: '同心快递', express_coding: 'ZY_TX'},
  {express_name: '天翼快递', express_coding: 'ZY_TY'},
  {express_name: '败欧洲', express_coding: 'ZY_BOZ'},
  {express_name: '德国海淘之家', express_coding: 'ZY_DGHT'},
  {express_name: '德运网', express_coding: 'ZY_DYW'},
  {express_name: '文达国际DCS', express_coding: 'ZY_WDCS'},
  {express_name: '同舟快递', express_coding: 'ZY_TZH'},
  {express_name: 'UCS合众快递', express_coding: 'ZY_UCS'},
  {express_name: '星辰快递', express_coding: 'ZY_XC'},
  {express_name: '先锋快递', express_coding: 'ZY_XF'},
  {express_name: '西邮寄', express_coding: 'ZY_XIYJ'},
  {express_name: '云骑快递', express_coding: 'ZY_YQ'},
  {express_name: '优晟速递', express_coding: 'ZY_YSSD'},
  {express_name: '运淘美国', express_coding: 'ZY_YTUSA'},
  {express_name: '至诚速递', express_coding: 'ZY_ZCSD'},
  {express_name: '增速海淘', express_coding: 'ZYZOOM'},
  {express_name: '中驰物流', express_coding: 'ZH'},
  {express_name: '中欧快运', express_coding: 'ZO'},
  {express_name: '准实快运', express_coding: 'ZSKY'},
  {express_name: '中外速运', express_coding: 'ZWSY'},
  {express_name: '郑州建华', express_coding: 'ZZJH'}
];
export default {expressData};
