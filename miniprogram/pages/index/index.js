// index.js
// const { indexData } = require('../../api/list.js')
Page({
  data: {
    showUploadTip: false,
    indexData: [],
  },
  onLoad() {
    this.getList();
  },
  detail(e){
    const index = parseInt(e.currentTarget.dataset.index);
    const path = "/pages/detail/index";
    wx.setStorageSync('detailData', this.data.indexData[index]);
    wx.navigateTo({
      url: path,
    })
  },
  getList(){
    const db = wx.cloud.database();
    db.collection('todos').where({}).get({
      success: (res) => { 
        console.log(res,);
        this.setData({
          indexData: res.data
        });
      },
      fail: (err) => { 
        console.error(err);
      }
    });
  }
});
