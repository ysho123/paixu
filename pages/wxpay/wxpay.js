// pages/pay/pay.js
var app = getApp();
var wxUtils = require('../../wxUtils/wxUtils.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderid: '',//订单号
    paymoney: '',//支付
    orderType: 1// 1 成功模板 2失败模板
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderid: options.oid,
      paymoney: options.money,
      type: options.type
    })

    var that = this;
    wxUtils.getOpenId(function (openid) {
      console.log(openid)
      that.payinfo(openid);
    })
  },
  onShow: function () {
    // this.payinfo();
  },
  // 充值
  charge: function (e) {
    var that = this;
    var data = that.data.requestpay;
    var timeStamp = data.timeStamp;
    var nonceStr = data.nonceStr;
    var package1 = data.package;
    var signType = data.signType;
    var paySign = data.paySign;
    wx.requestPayment({
      'timeStamp': timeStamp,
      'nonceStr': nonceStr,
      'package': package1,
      'signType': signType,
      'paySign': paySign,
      'success': function (res) {
        console.log(res)

        console.log(that.data.successUrl);
        
        wx.navigateTo({
          url: '../suanming/suanming?web=' + encodeURIComponent(that.data.successUrl)
        })
      },
      'fail': function (res) {
      
        console.log("android失败" + res)
        wx.navigateTo({
          url: '../suanming/suanming?web=' + encodeURIComponent(that.data.failUrl)
        })

      },
      'complete': function (res) {
        console.log("complete" + res)
        
      }
    })
  },
  //获取数据
  payinfo: function (res) {
    var openid = res || wx.getStorageSync('openId');
 
    var that = this;
    wx.request({
      url: 'https://sm.chuzx.com/xcxprepay_pay.php',
      // url: 'https://sm.yo91m.cn/xcxprepay_pay.php',
      data: {
        openid: openid,
        money: that.data.paymoney,
        type: that.data.type,
        oid: that.data.orderid
      },
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if(res.data.code==1){    
          console.info("请求支付",res);
          that.setData({
            requestpay: res.data.jsApiPara,
            successUrl: res.data.success,
            failUrl: res.data.fail
          })
        }
      }
    })
  }

})
