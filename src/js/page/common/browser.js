// start browser detect
var nVer = navigator.appVersion,
    nAgt = navigator.userAgent,
    browser = navigator.appName,
    version = '' + parseFloat(navigator.appVersion),
    majorVersion, nameOffset, verOffset, ix, network = 'unknown';
// Opera
if ((verOffset = nAgt.indexOf('Opera')) != -1) {
    browser = 'Opera';
    version = nAgt.substring(verOffset + 6);
    if ((verOffset = nAgt.indexOf('Version')) != -1) {
        version = nAgt.substring(verOffset + 8);
    }
} else if ((verOffset = nAgt.indexOf('OPR')) != -1) {
    browser = 'Opera';
    version = nAgt.substring(verOffset + 4);
} else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
    browser = 'IE';
    version = nAgt.substring(verOffset + 5);
} else if ((verOffset = nAgt.indexOf('Edge')) != -1) {
    browser = 'Edge';
    version = nAgt.substring(verOffset + 5);
} else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
    browser = 'Chrome';
    version = nAgt.substring(verOffset + 7);
} else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
    browser = 'Safari';
    version = nAgt.substring(verOffset + 7);
    if ((verOffset = nAgt.indexOf('Version')) != -1) {
        version = nAgt.substring(verOffset + 8);
    }
} else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
    browser = 'Firefox';
    version = nAgt.substring(verOffset + 8);
} else if (nAgt.indexOf('Trident/') != -1) {
    browser = 'Microsoft Internet Explorer 11+';
    version = nAgt.substring(nAgt.indexOf('rv:') + 3);
} else if (nAgt.toLowerCase().indexOf('micromessenger') != -1) {
    browser = 'WeiXin';
    if (nAgt.indexOf('NetType/WIFI') != -1) {
        network = 'WIFI';
    } else if (nAgt.indexOf('NetType/2G') != -1) {
        network = '2G';
    } else if (nAgt.indexOf('NetType/3G+') != -1) {
        network = '3G+';
    } else if (nAgt.indexOf('NetType/4G') != -1) {
        network = '4G';
    }
    verOffset = nAgt.lastIndexOf('/')
    version = nAgt.substring(verOffset + 1);
    // if (browser.toLowerCase() == browser.toUpperCase()) {
    //     browser = navigator.appName;
    // }
} else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
    browser = nAgt.substring(nameOffset, verOffset);
    version = nAgt.substring(verOffset + 1);
    if (browser.toLowerCase() == browser.toUpperCase()) {
        browser = navigator.appName;
    }
}

// trim the version string
if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);
majorVersion = parseInt('' + version, 10);
if (isNaN(majorVersion)) {
    version = '' + parseFloat(navigator.appVersion);
    majorVersion = parseInt(navigator.appVersion, 10);
}
// mobile version
var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

// start system detect
var os = '';
var clientStrings = [{
    s: 'Windows 10',
    r: /(Windows 10.0|Windows NT 10.0)/
}, {
    s: 'Windows 8.1',
    r: /(Windows 8.1|Windows NT 6.3)/
}, {
    s: 'Windows 8',
    r: /(Windows 8|Windows NT 6.2)/
}, {
    s: 'Windows 7',
    r: /(Windows 7|Windows NT 6.1)/
}, {
    s: 'Windows Vista',
    r: /Windows NT 6.0/
}, {
    s: 'Windows Server 2003',
    r: /Windows NT 5.2/
}, {
    s: 'Windows XP',
    r: /(Windows NT 5.1|Windows XP)/
}, {
    s: 'Windows 2000',
    r: /(Windows NT 5.0|Windows 2000)/
}, {
    s: 'Windows ME',
    r: /(Win 9x 4.90|Windows ME)/
}, {
    s: 'Windows 98',
    r: /(Windows 98|Win98)/
}, {
    s: 'Windows 95',
    r: /(Windows 95|Win95|Windows_95)/
}, {
    s: 'Windows NT 4.0',
    r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/
}, {
    s: 'Windows CE',
    r: /Windows CE/
}, {
    s: 'Windows 3.11',
    r: /Win16/
}, {
    s: 'Android',
    r: /Android/
}, {
    s: 'Open BSD',
    r: /OpenBSD/
}, {
    s: 'Sun OS',
    r: /SunOS/
}, {
    s: 'Linux',
    r: /(Linux|X11)/
}, {
    s: 'iOS',
    r: /(iPhone|iPad|iPod)/
}, {
    s: 'Mac OS X',
    r: /Mac OS X/
}, {
    s: 'Mac OS',
    r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/
}, {
    s: 'QNX',
    r: /QNX/
}, {
    s: 'UNIX',
    r: /UNIX/
}, {
    s: 'BeOS',
    r: /BeOS/
}, {
    s: 'OS/2',
    r: /OS\/2/
}, {
    s: 'Search Bot',
    r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/
}];
for (var id in clientStrings) {
    var cs = clientStrings[id];
    if (cs.r.test(nAgt)) {
        os = cs.s;
        break;
    }
}
var osVersion = '';
if (/Windows/.test(os)) {
    osVersion = /Windows (.*)/.exec(os)[1];
    os = 'Windows';
}
switch (os) {
    case 'Mac OS X':
        osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
        break;
    case 'Android':
        osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
        break;
    case 'iOS':
        osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
        osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
        break;
}
//detect data
var params = {};
params.os = os; //操作系统
params.osVersion = osVersion ? osVersion : 'unknown'; //操作系统版本
params.mobile = mobile; //是否移动端访问
params.browser = browser; //浏览器
params.browserVersion = version; //浏览器版本
params.browserMajorVersion = majorVersion; //浏览器major版本

export default {
    version: params
}