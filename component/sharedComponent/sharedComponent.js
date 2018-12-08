// component/sharedComponent/sharedComponent.js
let wxUtils = require('../../wxUtils/wxUtils.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    ac_id : {
      type : String,
      value : ''
    },
    ac_Name : {
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    picSrc : '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeComponent(e){
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('closeComponent', myEventDetail, myEventOption)
    },

    drawSharedImage() {
      let userInfo = wxUtils.getUserInfo();
      let data = {
        para : this.data.ac_id,
        title : this.data.ac_Name,
        head: userInfo.imageurl,
        nickname: userInfo.nickname,
      }

      wxUtils.request('getQrcode', data, (res) => {
        console.log('二维码',res);
        this.setData({
          picSrc: res.imgpath
        });
      },undefined,undefined,"GET");
    },

    showPic(e) {
      let self = this;
      wx.previewImage({
        urls: [self.data.picSrc],
      });
    },
  },

  attached(){
    //初始化 第二个参数this 传的是组件的作用域
    this.drawSharedImage();
  },

  detached(){

  },
})
