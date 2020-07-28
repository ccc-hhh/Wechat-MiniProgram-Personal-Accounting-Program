// pages/write/write.js
const app = getApp()
const db = wx.cloud.database({
	env: 'xxx-xxx-xxx'
});
const _ = db.command

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		userID: "",
		array1: ['娱乐', '交通', '食品', '学习', '医疗', '运动', '服饰', '社交', '数码', '美容', '工资', '理财'],
		array2: ['支出', '收入'],
		value1: 0,
		value2: 0,
		note: "",
		money: 0
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			userID: app.globalData.userID
		})
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {},
	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {},
	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {},
	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {},
	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {},
	bindPicker1Change: function (e) {
		this.setData({
			value1: e.detail.value
		})
	},
	bindPicker2Change: function (e) {
		this.setData({
			value2: e.detail.value
		})
	},
	note: function (e) {
		this.setData({
			note: e.detail.value
		})
	},
	money: function (e) {
		this.setData({
			money: e.detail.value
		})
	},
	submit: function () {
		var the_class = this.data.array1[this.data.value1]
		var the_note = this.data.note
		var the_money = 0
		var date = this.nowDate()
		var date_month = this.nowDate_month()
		if (this.data.array2[this.data.value2] == '支出') {
			the_money = -(this.data.money)
			console.log('支出', the_money)
			db.collection('project_accounts').doc(this.data.userID).update({
				data: {
					"accounts": _.push({
						class: the_class,
						note: the_note,
						money: the_money,
						date: date
					}),
					"daily": {
						[date]: {
							'支出': _.inc(-the_money)
						}
					},
					"frequency": {
						[date_month]: {
							'支出': {
								[the_class]: _.inc(1)
							}
						}
					}
				},
				success: (res) => {
					wx.showToast({
						title: '更新成功',
						duration: 500
					});
				},
				fail: (error) => {
					console.log(error)
				}
			})
		} else {
			the_money = this.data.money
			console.log('收入', the_money)
			db.collection('project_accounts').doc(this.data.userID).update({
				data: {
					"accounts": _.push({
						class: the_class,
						note: the_note,
						money: the_money,
						date: date
					}),
					"daily": {
						[date]: {
							'收入': _.inc(the_money)
						},
						"frequency": {
							[date_month]: {
								'收入': {
									[the_class]: _.inc(1)
								}
							}
						}
					}
				},
				success: (res) => {
					wx.showToast({
						title: '更新成功',
						duration: 500
					});
				},
				fail: (error) => {
					console.log(error)
				}
			})
		}
	},
	//获取当前时间
	nowDate: function () {
		let now = new Date();
		let _month = (10 > (now.getMonth() + 1)) ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
		let _day = (10 > now.getDate()) ? '0' + now.getDate() : now.getDate();
		return now.getFullYear() + '-' + _month + '-' + _day;
	},
	//获取当前时间年-月
	nowDate_month: function () {
		let now = new Date();
		let _month = (10 > (now.getMonth() + 1)) ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
		return now.getFullYear() + '-' + _month;
	},
})
