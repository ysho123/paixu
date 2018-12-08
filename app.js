const ald = require('./AldUtils/ald-stat.js')
const wxUtils = require('./wxUtils/wxUtils.js');

//app.js
App({
  onLaunch: function () {

    this.shenhe();//审核接口
  
    this.globalData = {}
  },

  shenhe(){
    wxUtils.request('getIndexHide',{},(res)=>{
      console.log('shenhe',res);
      this.shenhe = res.status ;
    });
  }
  
})
