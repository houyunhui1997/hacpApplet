// 云函数示例
exports.main = async (event, context) => {
  const { recipeId, userOpenId, foodIngredients } = event;
  console.log("Received parameters:", recipeId, userOpenId, foodIngredients);

  // 数据库查询和插入逻辑
  try {
    const existingRecord = await db.collection('basket').where({
      recipeId: recipeId,
      _openid: userOpenId,
    }).get();
    console.log("Existing records:", existingRecord);

    if (existingRecord.data.length > 0) {
      return { success: false, message: '已存在相同的菜品' };
    } else {
      await db.collection('basket').add({
        data: {
          _openid: userOpenId,
          recipeId: recipeId,
          foodIngredients: foodIngredients,
        }
      });
      return { success: true };
    }
  } catch (error) {
    console.error("Error while adding to basket:", error);
    return { success: false, message: '添加失败，请稍后重试' };
  }
};

