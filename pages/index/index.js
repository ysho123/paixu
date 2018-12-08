//index.js
const wxUtils = require('../../wxUtils/wxUtils.js');
const app = getApp()

Page({
  data: {
    openid : "",
    needLog: true,
    inputContent : '年会表演节目顺序',
    joinNum : 0,
    chooseNum : 0 ,
    hintShow : false,
  },

  onLoad: function() {
    //判断此用户有没有在缓存留下用户信息
    wxUtils.hasUserInfo((hasUserInfo)=>{
      this.setData({
        needLog: hasUserInfo ? false : true 
      });
    });

    wxUtils.getOpenId((openid)=>{
      this.setData({
        openid : openid
      });
    });
  },

  getUserInfo(res) {
    if (res.detail.userInfo) {
      let userInfo = res.detail.userInfo;
      userInfo.openid = this.data.openid ;

      wxUtils.saveUserInfo(userInfo,(res)=>{
        console.log('存用户信息',res);
        this.setData({
          needLog: false
        });
        this.submit();
      });
    }else{
      wx.showToast({
        title: '授权才能使用哦',
        icon : 'loading'
      })
    }
  },

  showHint(e){
    this.setData({
      hintShow : true,
    })
  },

  closeHint(e){
    this.setData({
      hintShow: false,
    })
  },

  inputWord(e){
    this.setData({
      inputContent: e.detail.value
    });
  },

  inputNum(e){
    let Type = e.currentTarget.dataset.id;
    let value = e.detail.value;
    let res = parseInt(value);
    let modify = 'joinNum' ;//(Type == 'join' ? 'joinNum' : 'chooseNum');
    this.setData({
      [modify] : res
    })
  },

  minusNum(e){
    let minusType = e.currentTarget.dataset.id;
    let modify = 'joinNum' ;//(minusType == 'join' ? 'joinNum' : 'chooseNum');
    let num = parseInt(this.data[modify]);
    if (num == 0) return;
    this.setData({
      [modify]: num - 1
    });
  },

  addNum(e){
    let addType = e.currentTarget.dataset.id;
    let modify = 'joinNum' ;//(addType == 'join' ? 'joinNum' : 'chooseNum');
    let num = parseInt(this.data[modify]);
    this.setData({
      [modify]: num + 1
    });
  },

  submit(e) {
    let self = this;

    if (this.data.joinNum == 0) {//|| this.data.chooseNum == 0
      wxUtils.showPopMessage('不能有数据为空',false,1500);
      return;
    }

    if (this.data.joinNum > 1000){
      wxUtils.showPopMessage('不能大于1000人', false, 1000);
      return;
    }

    // if (this.data.joinNum < this.data.chooseNum){
    //   wxUtils.showPopMessage('组数太多啦', false, 1500);
    //   return;
    // }
    //可以提交信息了
    let userInfo = wxUtils.getUserInfo();

    let data = {
      openid: this.data.openid ,
      title: this.data.inputContent,
      total: this.data.joinNum,
      // group_num: this.data.chooseNum,
      headimgurl: userInfo.imageurl,
      nickname: userInfo.nickname,
    }

    wxUtils.request('createSortActive', data,(res)=>{
      if(res.status == 1){
        let ac_id = res.aid ;
        wx.navigateTo({
          url: `/pages/goPage/goPage?ac_id=${ac_id}&ac_Name=${self.data.inputContent}&creater=true`,
        })
      }
    },
    undefined,undefined,"GET");
  },

  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function (e) {
    return {
      title: `来收集一下人员的顺序`,
      path: `pages/index/index`
    }
  }
})
