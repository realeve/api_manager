import browser from './browser';
import moment from '../../plugins/moment';

let tips = (
  setting = {
    text: 'info',
    type: 0,
    delay: 10
  }
) => {
  let typeArr = ['info', 'danger', 'success', 'warning'];
  if (!Reflect.has(setting, 'type')) {
    setting.type = 0;
  }
  if (!Reflect.has(setting, 'delay')) {
    setting.delay = 10;
  }

  $.bootstrapGrowl(setting.text, {
    ele: 'body', // which element to append to
    type: typeArr[setting.type], // (null, 'info', 'danger', 'success', 'warning')
    offset: {
      from: 'top',
      amount: 100
    }, // 'top', or 'bottom'
    align: 'right', // ('left', 'right', or 'center')
    width: 'auto', // (integer, or 'auto')
    delay: setting.delay * 1000, // Time while the message will be displayed. It's not equivalent to the *demo* timeOut!
    allow_dismiss: true, // If true then will display a cross to close the popup.
    stackup_spacing: 10 // spacing between consecutively stacked growls.
  });
};
let tip = (text, type = 2, delay = 10) => {
  let typeArr = ['info', 'danger', 'success', 'warning'];

  $.bootstrapGrowl(text, {
    ele: 'body', // which element to append to
    type: typeArr[type], // (null, 'info', 'danger', 'success', 'warning')
    offset: {
      from: 'top',
      amount: 100
    }, // 'top', or 'bottom'
    align: 'right', // ('left', 'right', or 'center')
    width: 'auto', // (integer, or 'auto')
    delay: delay * 1000, // Time while the message will be displayed. It's not equivalent to the *demo* timeOut!
    allow_dismiss: true, // If true then will display a cross to close the popup.
    stackup_spacing: 10 // spacing between consecutively stacked growls.
  });
};
let alert = (
  setting = {
    text: 'info',
    type: 0,
    delay: 10
  }
) => {
  let typeArr = ['info', 'danger', 'success', 'warning'];

  if (!Reflect.has(setting, 'type')) {
    setting.type = 0;
  }
  if (!Reflect.has(setting, 'delay')) {
    setting.delay = 10;
  }

  App.alert({
    container: '.page-content', // alerts parent container
    place: 'prepend', // append or prepent in container
    type: typeArr[setting.type], // alert's type
    message: setting.text, // alert's message
    close: true, // make alert closable
    reset: false, // close all previouse alerts first
    focus: true, // auto scroll to the alert after shown
    closeInSeconds: setting.delay, // auto close after defined seconds
    icon: 'fa fa-check' // put icon class before the message
  });
};

let getBrowser = () => {
  // IE5 "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729)"
  // IE7 "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729)"
  // IE8 "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729)"
  // IE9 "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729)"
  // IE10 "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729)"
  // IE11 "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; rv:11.0) like Gecko"
  // EDGE Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299""
  // chrome44 "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36"
  // chrome63 "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3236.0 Safari/537.36"
  return browser.version;
};

let openUrl = (src, isimage = true) => {
  // chrome 60以后 不允许直接打开dataURL,需用iframe.
  // https://stackoverflow.com/questions/45493234/jspdf-not-allowed-to-navigate-top-frame-to-data-url
  // https://stackoverflow.com/questions/10755749/base64-encode-decode-and-download-content-generated-in-url

  let env = getBrowser();
  console.log(env);
  if (env.browser == 'Chrome' && env.browserVersion < 60) {
    window.open(src, '_blank');
    return;
  }
  let doc = window.open().document;
  doc.open();
  if (!isimage) {
    let iframe = `
        <style>
            body{
                margin:0;
            }
            iframe {
                border:0; 
                top:0px; 
                left:0px; 
                bottom:0px; 
                right:0px; 
                width:100%; 
                height:100%;
            }
        </style>
        <iframe src="${src}" frameborder="0" allowfullscreen>
        </iframe>`;
    doc.write(iframe);
  } else {
    let image = new Image();
    image.src = src;
    doc.write(image.outerHTML);
    doc.write(`
        <script>
            setTimeout(function(){
                window.print();
            }, 500);
        </script>`);
  }
  doc.close();
};

let now = () => moment().format('YYYY-MM-DD HH:mm:ss');
let ymd = () => moment().format('YYYYMMDD');

let checkStatus = (name) => $('[name="' + name + '"]:checked').length == 1;
export default {
  tips,
  alert,
  openUrl,
  checkStatus,
  tip,
  getBrowser,
  now,
  ymd
};
