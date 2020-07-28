//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database({
  env: 'ccc-hhh-zmio9'
});
const _ = db.command

Page({
  data: {
    userName: "",
    password: "",
    showClearBtn: false,
    isWaring: false
  },

  onLoad: function () {},

  clearPassword() {
    this.setData({
      password: '',
      showClearBtn: false,
      isWaring: false,
    });
  },

  userNameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  login: function () {
    var userName = this.data.userName
    var password = this.data.password
    db.collection('project_accounts').doc('61e74b6a5f1ac91e0002d7a35ccef98a').get({
      success: (res) => {
        //console.log(res)
        var userList = res.data.userName
        var passwordList = res.data.password
        var idList = res.data.userID
        var idx_user = userList.indexOf(userName)
        var idx_password = passwordList.indexOf(password)
        if (idx_user > -1) {
          //console.log(idx_user)
          if (idx_password > -1) {
            app.globalData.userID = idList[idx_user]
            app.globalData.date = this.nowDate_month()
            wx.showToast({
              title: '登录成功',
            });
            wx.switchTab({
              url: '../home/home',
            })
          } else {
            wx.showToast({
              title: '密码错误',
            });
          }
        } else {
          db.collection('project_accounts').add({
            data: {
              userName: userName,
              accounts: []
            },
            success: (res) => {
              var userID = res["_id"].toString()
              db.collection('project_accounts').doc('61e74b6a5f1ac91e0002d7a35ccef98a').update({
                data: {
                  userName: _.push(userName),
                  password: _.push(password),
                  userID: _.push(userID)
                },
                success: (res) => {
                  this.globalData.userID = userID
                  app.globalData.date = this.nowDate_month()
                  wx.showToast({
                    title: '注册成功',
                  });
                  wx.switchTab({
                    url: '../home/home',
                  })
                },
                fail: (error) => {
                  console.log(error)
                }
              })
            }
          })
        }
      },
      fail: (error) => {
        console.log(error)
      }
    })
  },
  //获取当前时间年-月
  nowDate_month: function () {
    let now = new Date();
    let _month = (10 > (now.getMonth() + 1)) ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
    return now.getFullYear() + '-' + _month;
  }
})