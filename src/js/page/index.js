import app from './index/index';
let itvId = setInterval(()=>{
  if(apps.userInfo.uid == ''){
    return;
  }
  app.init();
  clearInterval(itvId)
},1000)