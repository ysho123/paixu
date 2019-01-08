// pages/h5index/h5index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allsrc: '',
    web_url: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('h5页面options', options)
    if (JSON.stringify(options) != "{}"){ 
      console.log(options)
      console.log(decodeURIComponent(options.web))
  
      this.setData({
        allsrc: decodeURIComponent(options.web)
      })
    } else {
      console.log("kong")
      let hasIn = wx.getStorageSync('hasIn');
      if (hasIn){
        wx.switchTab({
          url: '/pages/index/index',
        });
      }else{
        this.setData({
          allsrc: "https://sm.chuzx.com?ac=bazijp_wx"
        })
        wx.setStorageSync('hasIn', true);
      }
    }
  },

  onshow:function(){

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    var that = this
    var return_url = options.webViewUrl
    var path = '/pages/index/index'
    console.log(path, options)
    return {
      title: that.data.title,
      path: path,
      success: function (res) {
        that.web_url = return_url
        // 转发成功
        wx.showToast({
          title: "转发成功",
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})