Page({
  data: {
    recipe:{},
    openid:"",
    id:"",
  },
  onReady(){
    const detailData = wx.getStorageSync('detailData');
    this.setData({
      recipe:detailData.foodIngredients,
      id : detailData._id
    })
    console.log(detailData);
    let pages = getCurrentPages();
    let index = pages[pages.length - 1];
    index.setData(detailData)
  },
  onLoad() {
    this.getOpenid();
  },
  getOpenid() {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        this.setData({
          openid: res.result.openid,
        });
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err);
      }
    });
  },
  
  addToBasket() {
    const db = wx.cloud.database();
    const basket = db.collection('basket');
    const recipeId = this.data.id;
    const foodIngredients = this.data.recipe;

    // 先检查 basket 集合中是否已经存在相同的 recipeId
    basket.where({
        recipeId: recipeId
    }).get({
        success: res => {
            if (res.data.length > 0) {
                // 已经存在相同的 recipeId，不再添加
                wx.showToast({
                    title: '已在菜篮子中',
                    icon: 'none'
                });
            } else {
                // 如果没有相同的 recipeId，则添加数据
                basket.add({
                    data: {
                        foodIngredients: foodIngredients,
                        recipeId: recipeId,
                        createdAt: new Date().getTime(),
                    },
                    success: res => {
                        wx.showToast({
                            title: '添加成功',
                        });
                    },
                    fail: err => {
                        wx.showToast({
                            icon: 'none',
                            title: '添加失败',
                        });
                        console.error('添加到菜篮子失败：', err);
                    }
                });
            }
        },
        fail: err => {
            wx.showToast({
                icon: 'none',
                title: '检查失败',
            });
            console.error('检查 basket 集合失败：', err);
        }
    });
}

  
});