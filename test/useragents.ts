export const useragents = [
  /**
   * IE 6
   */
  {
    ua: 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727; .NET CLR 3.0.04506.648; .NET CLR 3.5.21022)',
    yes: ['ie 6', 'ie >= 5', 'ie 6-7']
  },
  /**
   * IE 7
   */
  {
    ua: 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.2; .NET CLR 1.1.4322; .NET CLR 2.0.50727; .NET CLR 3.0.04506.648; .NET CLR 3.5.21022)',
    yes: ['ie 7', 'ie >= 7', 'ie 6-7']
  },
  /**
   * IE 8
   */
  {
    ua: 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.2; Trident/4.0; .NET CLR 1.1.4322; .NET CLR 2.0.50727; .NET CLR 3.0.04506.648; .NET CLR 3.5.21022)',
    yes: ['ie 8', 'ie >= 8', 'ie 8-9']
  },
  /**
   * IE 8 Compatability Mode
   */
  {
    ua: 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.2; Trident/4.0; .NET CLR 1.1.4322; .NET CLR 2.0.50727; .NET CLR 3.0.04506.648; .NET CLR 3.5.21022)',
    yes: ['ie 8', 'ie >= 8', 'ie 8-9']
  },
  /**
   * IE 9
   */
  {
    ua: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)',
    yes: ['ie 9', 'ie >= 9', 'ie 8-9']
  },
  /**
   * IE 9 Compatability Mode
   */
  {
    ua: 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET4.0C; .NET4.0E)',
    yes: ['ie 9', 'ie >= 9', 'ie 8-9']
  },
  /**
   * IE 10
   */
  {
    ua: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)',
    yes: ['ie 10', 'ie >= 10', 'ie 10-11']
  },
  {
    ua: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Win64; x64; Trident/6.0)',
    yes: ['ie 10', 'ie >= 10', 'ie 10-11']
  },
  /**
   * IE 10 Compatability Mode
   */
  {
    ua: 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; WOW64; Trident/6.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET4.0C; .NET4.0E)',
    yes: ['ie 10', 'ie >= 10', 'ie 10-11']
  },
  /**
   * IE 11
   */
  {
    ua: 'Mozilla/5.0 (Windows NT 6.3; Win64; x64; Trident/7.0; rv:11.0) like Gecko',
    yes: ['ie 11', 'ie >= 11', 'ie 10-11']
  },
  /**
   * IE 11 Compatability Mode
   */
  {
    ua: 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729)',
    yes: ['ie 11', 'ie >= 11', 'ie 10-11']
  },
  /**
   * Edge on EdgeHTML
   */
  {
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36 Edge/15.15063',
    yes: ['edge 15', 'edge >= 15', 'edge 15-18'],
    no: ['chrome >= 50']
  },
  {
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.18363',
    yes: ['edge 18', 'edge >= 18', 'edge 15-18'],
    no: ['chrome >= 50']
  },
  /**
   * Edge on Chromium
   */
  {
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 Edg/80.0.361.62',
    yes: ['edge 80', 'edge >= 80', 'chrome 80']
  },
  {
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.25',
    yes: ['edge 105', 'edge >= 105', 'chrome 105']
  },
  /**
   * Edge bug #1530
   */
  {
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36 Edge/120.0',
    allowHigherVersions: false,
    yes: ['edge 120'],
    no: ['edge 12']
  },
  /**
   * Firefox Desktop
   */
  {
    ua: 'Mozilla/5.0 (Windows NT 5.2; rv:42.0) Gecko/20100101 Firefox/42.0',
    yes: ['firefox >= 40']
  },
  /**
   * Firefox Desktop bug #1530
   */
  {
    ua: 'Mozilla/5.0 (Windows NT 5.2; rv:42.0) Gecko/20100101 Firefox/120.0',
    allowHigherVersions: false,
    yes: ['firefox 120'],
    no: ['firefox 12']
  },
  /**
   * Chrome Desktop
   */
  {
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.92 Safari/537.36',
    yes: ['chrome >= 60']
  },
  /**
   * Chrome Desktop bug #1530
   */
  {
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
    allowHigherVersions: false,
    yes: ['chrome 120'],
    no: ['chrome 12']
  },
  /**
   * Safari Desktop
   */
  {
    ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.3 Safari/605.1.15',
    yes: ['safari 15']
  },
  /**
   * Safari iPad Desktop-like
   */
  {
    ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Safari/605.1.15',
    yes: ['safari 14']
  },
  {
    // Weird case with comma
    ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6,2 Safari/605.1.15',
    yes: ['safari 15']
  },
  /**
   * Opera Desktop on Presto
   */
  {
    ua: 'Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; en) Presto/2.8.131 Version/11.11',
    yes: ['opera 11']
  },
  {
    ua: 'Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8) Presto/2.12.388 Version/12.15',
    yes: ['opera 12']
  },
  /**
   * Opera Desktop on Chromium
   */
  {
    ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.95 Safari/537.36 OPR/15.0.1147.153',
    yes: ['opera 15']
  },
  {
    ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 OPR/91.0.4516.16',
    yes: ['opera 91', 'chrome 105']
  },
  /**
   * iOS iPhone Safari
   */
  {
    ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Mobile/15E148 Safari/604.1',
    yes: ['ios_saf 15']
  },
  /**
   * iOS iPhone App (WKWebView)
   */
  {
    ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148',
    yes: ['ios_saf 15']
  },
  /**
   * Opera Mini
   */
  {
    ua: 'Opera/9.80 (Android; Opera Mini/12.0.1987/37.7327; U; pl) Presto/2.12.423 Version/12.16',
    yes: ['op_mini all']
  },
  /**
   * Android
   */
  {
    ua: 'Mozilla/5.0 (Linux; U; Android 4.4.2; en-us; SCH-I535 Build/KOT49H) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
    yes: ['android 4']
  },
  /**
   * Opera Mobile
   */
  {
    ua: 'Opera/9.80 (S60; SymbOS; Opera Mobi/SYB-1107071606; U; en) Presto/2.8.149 Version/11.10',
    yes: ['op_mob 11']
  },
  {
    ua: 'Opera/12.02 (Android 4.1; Linux; Opera Mobi/ADR-1111101157; U; en-US) Presto/2.9.201 Version/12.02',
    yes: ['op_mob 12']
  },
  /**
   * IE Mobile
   */
  {
    ua: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 920)',
    yes: ['ie_mob >= 1']
  },
  {
    ua: 'Mozilla/5.0 (Mobile; Windows Phone 8.1; Android 4.0; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; NOKIA; Lumia 635) like iPhone OS 7_0_3 Mac OS X AppleWebKit/537 (KHTML, like Gecko) Mobile Safari/537',
    yes: ['ie_mob >= 1'],
    no: ['android 4', 'ios 7']
  }
]
