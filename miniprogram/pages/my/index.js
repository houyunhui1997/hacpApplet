


// pages/me/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openId: '',
    showUploadTip: false,
    userInfo: {
      avatarUrl:"",
      nickName:""
    },
    basketItems:[],
    myBasket:[]
  },
  getUserProfile() {
    this.getOpenid();
    wx.getUserProfile({
      desc: '用于查看个人操作记录',
      success: (res) => {
        const userInfoData = res.userInfo;
        console.log(res);
        wx.cloud.callFunction({
          name: 'saveUserInfo',
          data: {
            userInfoData
          },
          success: (response) => {
            console.log(response);
            if (response.result.success) {
              wx.setStorageSync('userInfo', userInfoData);
              wx.showToast({
                title: '登录成功',
                icon: 'success'
              });
              this.setData({
                userInfo:userInfoData
              })
            } else {
              console.log(response);
              wx.showToast({
                title: '登录失败',
                icon: 'none'
              });
            }
          },
          fail: (error) => {
            wx.showToast({
              title: '云函数调用失败',
              icon: 'none'
            });
          }
        });
      },
      fail: (err) => {
        console.error('获取用户信息失败', err);
        wx.showToast({
          title: '信息获取失败',
          icon: 'none'
        });
      }
    });
  },
  getOpenid() {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        this.setData({
          openId: res.result.openid,
        });
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err);
      }
    });
  },
  getMyBasket() {
    if(this.data.openId === ""){
      wx.showToast({
        title: '请登录',
        icon: 'none'
      });
      return;
    }
    const db = wx.cloud.database();
    const basket = db.collection('basket');
    basket.where({
      _openid: this.data.openId,
    }).get({
      success: res => {
        console.log(res);
        this.setData({
          myBasket: res.data
        });
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询失败',
        });
        console.error('查询菜篮子数据失败：', err);
      }
    });
  },
  showTip(){
    wx.showToast({
      title: '开发中，敬请期待',
      icon: 'none'
    });
  },
  gotoWxCodePage() {
    wx.navigateTo({
      url: `/pages/exampleDetail/index?envId=${envList?.[0]?.envId}&type=getMiniProgramCode`,
    });
  },
});
