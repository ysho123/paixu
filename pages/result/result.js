// miniprogram/pages/result/result.js
const wxUtils = require('../../wxUtils/wxUtils.js');
const APP = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ac_id: '',//当前活动id
    ac_Name: '晚会表演节目的顺序',
    showSharedPic : false,//是否展示分享图
    shenhe : 0,
    topInfo : {},
    listInfo : [],
    jumpItem: {},//跳转其他小程序(非分组排序投票)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { ac_id } = options;
    let ac_Name = options.ac_Name || '晚会表演节目的顺序'
    this.setData({
      ac_id: ac_id,
      ac_Name: ac_Name
    });
    wx.setNavigationBarTitle({ title: ac_Name });

    this.setData({
      shenhe : APP.shenhe
    });

    this.getResults();

    //获取互跳
    this.getJumpList();
  },

  getJumpList() {
    wxUtils.cloudRequest('getJumpList', {}, (res) => {
      console.log(res);
      if (res.result && res.result.length > 0) {
        setInterval((length) => {
          let index = parseInt(Math.random() * length);
          this.setData({
            jumpItem: res.result[index]
          });
        }, 4000, res.result.length);
      }
    });
  },

  jumpSuccess() {
    APP.aldstat.sendEvent(`互跳${this.data.jumpItem.name}`, { 'time': new Date().getHours().toString() });
  },

  getResults(){
    wxUtils.getOpenId((openid) => {
      if (this.data.ac_id) {
        let userInfo = wxUtils.getUserInfo();

        let data = {
          openid: this.data.openid,
          nickname: userInfo.nickname,
          headimgurl: userInfo.imageurl,
          aid: this.data.ac_id
        }
        wxUtils.request('getActiveSort', data, (res) => {
          console.log('结果页', res);
          if(res.status == 1){
            
            let topInfo = {
              already_num: res.already_num,
              total: res.total,
              unJoin: res.total - res.already_num,
            }
            let result = res.data;
            let listInfo = result;

            this.setData({
              topInfo: topInfo,
              listInfo: listInfo
            });
          }
        }, undefined, undefined, "GET");
      }
    });
  },

  refresh(){
    this.getResults();
  },

  getShareImage(e) {
    // console.log('getImage');
    this.setData({
      showSharedPic: true
    })
  },

  closeComponent(e) {
    // console.log('close Component');
    this.setData({
      showSharedPic: false
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    let self = this;
    // if (e.from == 'button') {
      return {
        title: `${self.data.ac_Name},谁和我一组?`,
        path: `pages/goPage/goPage?ac_id=${self.data.ac_id}&ac_Name=${self.data.ac_Name}`
      }
    // }
  },

  backIndex(e) {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
})