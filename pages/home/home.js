// pages/home/home.js
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
		index: 0,
		date: '2020-01',
		classify: '分类',
		dialog: false,
		chooseDate: false,
		accounts: [],
		income: 0,
		spending: 0,
		iconClass: {
			娱乐: 'iconfont icon-yule',
			交通: 'iconfont icon-jiaotong',
			食品: 'iconfont icon-lingshi',
			学习: 'iconfont icon-xuexi',
			医疗: 'iconfont icon-yiliao',
			运动: 'iconfont icon-yundong',
			服饰: 'iconfont icon-fushi',
			社交: 'iconfont icon-shejiao',
			数码: 'iconfont icon-shuma',
			美容: 'iconfont icon-meirong',
			工资: 'iconfont icon-gongzi',
			理财: 'iconfont icon-licaishouyi'
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var ID = app.globalData.userID
		var date_month = this.nowDate_month()
		//console.log(userID)
		this.setData({
			userID: ID,
			date: date_month
		});
		this.getData(ID, date_month).then((result) => {
			//console.log(result)
			this.setData({
				accounts: result
			})
			//console.log(this.data.accounts)
			this.income()
			this.spending()
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

	bindDateChange: function (e) {
		this.setData({
			date: e.detail.value
		});
		this.getData(this.data.userID, e.detail.value).then((result) => {
			this.setData({
				accounts: result
			})
		})
	},
	closeChooseClass: function () {
		this.setData({
			dialog: false
		});
	},
	openChooseClass: function () {
		this.setData({
			dialog: true
		});
	},
	chooseDate: function () {
		this.setData({
			chooseDate: true
		});
	},
	gotoWrite: function () {
		wx.switchTab({
			url: '../write/write',
		})
	},
	getData: function (userID, expectDate) {
		return new Promise(function (resolve, reject) {
			db.collection('project_accounts').doc(userID).get({
				success: res => {
					var accounts = res.data.accounts.sort(function (a, b) {
						return -(a.date.split("-").join("") - b.date.split("-").join(""))
					})
					resolve(accounts.filter(function (fp) {
						return fp.date.substring(0, 7) == expectDate
					}))
				},
				fail: error => {
					console.log(error)
				}
			})
		}).catch(function (e) {
			console.log(e);
		})
	},
	income: function () {
		var incomeList = this.data.accounts.filter(function (a) {
			return a.money > 0
		})
		var income = 0
		for (const m of incomeList) {
			income = income + m['money']
		}
		this.setData({
			income: income
		})
	},
	spending: function () {
		var spendingList = this.data.accounts.filter(function (a) {
			return a.money < 0
		})
		var spending = 0
		for (const m of spendingList) {
			spending = spending + m['money']
		}
		this.setData({
			spending: -spending
		})
	},
	//获取当前时间年-月-日
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
	chooseClass: function (e) {
		this.getData(this.data.userID, this.data.date).then((result) => {
			var the_class = e.currentTarget.dataset.text
			this.setData({
				accounts: result.filter(function (a) {
					return a.class == the_class
				})
			})
		})
	},
})
