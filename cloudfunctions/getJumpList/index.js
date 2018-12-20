// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  let JumpList = [
    {
      appid: 'wx23f8dd2d800bcf42',
      path: '',
      name: '2048',
      imageUrl: 'https://game-1256868251.cos.ap-guangzhou.myqcloud.com/zhuajiu/jumpList/2048.png'
    },
    {
      appid: 'wxf1e4f980142cf270',
      path: '',
      name: '萌宠运动',
      imageUrl: 'https://game-1256868251.cos.ap-guangzhou.myqcloud.com/zhuajiu/jumpList/animal.png'
    },
    {
      appid: 'wx463953cb83a580ed',
      path: '',
      name: '刀刀爆橘',
      imageUrl: 'https://game-1256868251.cos.ap-guangzhou.myqcloud.com/zhuajiu/jumpList/knife.png'
    },
    {
      appid: 'wx594916c44759c264',
      path: '',
      name: '球球射手',
      imageUrl: 'https://game-1256868251.cos.ap-guangzhou.myqcloud.com/zhuajiu/jumpList/ballshoter.png'
    }
  ];

  return JumpList
}