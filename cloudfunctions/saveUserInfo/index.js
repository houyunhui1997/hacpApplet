// cloudfunctions/saveUserInfo/index.js
const cloud = require('wx-server-sdk');

cloud.init();

const db = cloud.database();
const usersCollection = db.collection('users');

exports.main = async (event, context) => {
  const { userInfo } = event;
  const wxContext = cloud.getWXContext();
  
  try {
    // 根据 OPENID 查找用户
    const res = await usersCollection.where({
      openid: wxContext.OPENID
    }).get();
    
    if (res.data.length > 0) {
      // 如果用户存在，更新用户信息
      await usersCollection.doc(res.data[0]._id).update({
        data: {
          ...userInfo,
          updateTime: new Date()
        }
      });
    } else {
      // 如果用户不存在，添加用户信息
      await usersCollection.add({
        data: {
          ...userInfo,
          openid: wxContext.OPENID,
          createTime: new Date()
        }
      });
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
