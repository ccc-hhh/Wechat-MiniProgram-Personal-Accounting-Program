// pages/statistics/statistics.js
import * as echarts from '../../ec-canvas/echarts';

const app = getApp()
const db = wx.cloud.database({
	env: 'ccc-hhh-zmio9'
});
const _ = db.command
const in_or_sp = ['income', 'spending']
const title_line = ['每日收入', '每日支出']
const title_pie = ['收入分类', '支出分类']

function setFirstOption(chart, xlist, ylist, title) {
	var option1 = {
		title: {
			text: title_line[in_or_sp.indexOf(title)],
			left: 'center'
		},
		color: ["#46A3FF"],
		grid: {
			containLabel: true
		},
		tooltip: {
			show: true,
			trigger: 'axis'
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: xlist
		},
		yAxis: {
			x: 'center',
			type: 'value',
			splitLine: {
				lineStyle: {
					type: 'dashed'
				}
			},
		},
		series: [{
			name: '日数据',
			type: 'line',
			smooth: false,
			data: ylist
		}]
	};
	chart.setOption(option1);
}

function setSecondOption(chart, frequency, title) {
	var option2 = {
		title: {
			text: title_pie[in_or_sp.indexOf(title)],
			left: 'center'
		},
		color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F", "#FF0000", "#6C6C6C", "#02C874", "#02C874", "#A8FF24", "#009393"],
		series: [{
			label: {
				normal: {
					fontSize: 14
				}
			},
			type: 'pie',
			center: ['50%', '50%'],
			radius: ['40%', '60%'],
			data: frequency
		}]
	};
	chart.setOption(option2);
}



Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		ec: {
			lazyLoad: true
		},
		ec2: {
			lazyLoad: true
		},
		userID: '',
		date_month: '',
		index: 0,
		date: '2020-01',
		classify: '分类',
		dialog: false,
		chooseDate: false,
		accounts: [],
		income: 0,
		spending: 0,
		income_or_spending: "income",
		weui_navbar: {
			on: "weui-navbar__item weui-bar__item_on",
			off: "weui-navbar__item"
		},
		xLine: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
		yLine: [],
		frequency: [],
		ranking: [],
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
		//console.log(userID)
		var userID = app.globalData.userID
		var date_month = app.globalData.date
		this.getAccounts(userID, date_month).then((result) => {
			app.globalData.accounts = result
			this.setData({
				userID: userID,
				accounts: result,
				date_month: date_month,
				date: date_month
			})
			//console.log(this.data.accounts)
			this.income()
			this.spending()
			this.getFirstOption()
			this.getSecondOption()
		});
		this.getRanking(userID, date_month, this.data.income_or_spending).then((result) => {
			//console.log(result)
			this.setData({
				ranking: result
			})
		})
	},

	onReady: function () {},
	onShow: function () {},
	onHide: function () {},
	onUnload: function () {},
	onPullDownRefresh: function () {},
	onReachBottom: function () {},
	onShareAppMessage: function () {},
	//获取日期选择器数据
	bindDateChange: function (e) {
		this.setData({
			date: e.detail.value
		});
		app.globalData.date = e.detail.value
		this.getAccounts(this.data.userID, e.detail.value).then((result) => {
			this.setData({
				accounts: result
			})
		})
	},
	//关闭日期选择器
	chooseDate: function () {
		this.setData({
			chooseDate: true
		});
	},
	//获取收入
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
	//获取支出
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
	//income高亮
	openIncome: function () {
		this.setData({
			income_or_spending: 'income'
		})
		this.getFirstOption()
		this.getSecondOption()
		this.getRanking(this.data.userID, this.data.date, this.data.income_or_spending).then((result) => {
			//console.log(result)
			this.setData({
				ranking: result
			})
		})
	},
	//spending高亮
	openSpending: function () {
		this.setData({
			income_or_spending: 'spending'
		})
		this.getFirstOption()
		this.getSecondOption()
		this.getRanking(this.data.userID, this.data.date, this.data.income_or_spending).then((result) => {
			//console.log(result)
			this.setData({
				ranking: result
			})
		})
	},
	//获取数据并按日期排序
	getAccounts: function (userID, expectDate) {
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
	//获取daily数据并按日期排序
	getDaily: function (userID, expectDate, i_or_s) {
		return new Promise(function (resolve, reject) {
			db.collection('project_accounts').doc(userID).get({
				success: res => {
					var daily = res.data.daily
					var dailyList = []
					for (var key in daily) {
						daily[key].date = key
						dailyList.push(daily[key])
					}
					dailyList = dailyList.sort(function (a, b) {
						return a.date.split("-").join("") - b.date.split("-").join("")
					})
					dailyList = dailyList.filter(function (fp) {
						return fp.date.substring(0, 7) == expectDate
					})
					if (i_or_s == 'income') {
						var income = []
						for (var json of dailyList) {
							income.push(json['收入'])
						}
						resolve(income)
					} else {
						var spending = []
						for (var json of dailyList) {
							spending.push(json['支出'])
						}
						resolve(spending)
					}
				},
				fail: error => {
					console.log(error)
				}
			})
		}).catch(function (e) {
			console.log(e);
		})
	},
	//获取frequency数据
	getFrequency: function (userID, expectDate, i_or_s) {
		if (i_or_s == 'income') {
			return new Promise(function (resolve, reject) {
				db.collection('project_accounts').doc(userID).get({
					success: res => {
						var frequency = res.data.frequency
						var frequencyList = []
						for (var key in frequency[expectDate]['收入']) {
							frequencyList.push({
								value: frequency[expectDate]['收入'][key],
								name: key
							})
						}
						resolve(frequencyList.filter(function (fr) {
							return fr.value != 0
						}))
					},
					fail: error => {
						console.log(error)
					}
				})
			}).catch(function (e) {
				console.log(e);
			})
		} else {
			return new Promise(function (resolve, reject) {
				db.collection('project_accounts').doc(userID).get({
					success: res => {
						var frequency = res.data.frequency
						var frequencyList = []
						for (var key in frequency[expectDate]['支出']) {
							frequencyList.push({
								value: frequency[expectDate]['支出'][key],
								name: key
							})
						}
						resolve(frequencyList.filter(function (fr) {
							return fr.value != 0
						}))
					},
					fail: error => {
						console.log(error)
					}
				})
			}).catch(function (e) {
				console.log(e);
			})
		}
	},
	//获取榜单
	getRanking: function (userID, expectDate, i_or_s) {
		if (i_or_s == 'income') {
			return new Promise(function (resolve, reject) {
				db.collection('project_accounts').doc(userID).get({
					success: res => {
						var accounts = res.data.accounts
						accounts = accounts.filter(function (fp) {
							return fp.date.substring(0, 7) == expectDate
						})
						accounts = accounts.filter(function (fp) {
							return fp.money > 0
						})
						resolve(accounts.sort(function (a, b) {
							return -(a.money - b.money)
						}))
					},
					fail: error => {
						console.log(error)
					}
				})
			}).catch(function (e) {
				console.log(e);
			})
		} else {
			return new Promise(function (resolve, reject) {
				db.collection('project_accounts').doc(userID).get({
					success: res => {
						var accounts = res.data.accounts
						accounts = accounts.filter(function (fp) {
							return fp.date.substring(0, 7) == expectDate
						})
						accounts = accounts.filter(function (fp) {
							return fp.money < 0
						})
						resolve(accounts.sort(function (a, b) {
							return a.money - b.money
						}))

					},
					fail: error => {
						console.log(error)
					}
				})
			}).catch(function (e) {
				console.log(e);
			})
		}
	},
	//绘图
	getFirstOption: function () {
		this.getDaily(app.globalData.userID, this.data.date, this.data.income_or_spending).then((result) => {
			//console.log(result)
			this.setData({
				yLine: result,
			})
			this.init_first(this.data.xLine, this.data.yLine)
		})
	},
	//初始化第一个图表
	init_first: function (xdata, yline) {
		this.firstComponent = this.selectComponent('#mychart1')
		this.firstComponent.init((canvas, width, height, dpr) => {
			const chart1 = echarts.init(canvas, null, {
				width: width,
				height: height,
				devicePixelRatio: dpr
			});
			setFirstOption(chart1, xdata, yline, this.data.income_or_spending) //赋值给echart图表
			this.chart1 = chart1;
			return chart1;
		});
	},
	getSecondOption: function () {
		this.getFrequency(app.globalData.userID, this.data.date, this.data.income_or_spending).then((result) => {
			//console.log(result)
			this.setData({
				frequency: result,
			})
			this.init_second(this.data.frequency)
		})
	},
	//初始化第二个图表
	init_second: function (data) {
		this.secondComponent = this.selectComponent('#mychart2')
		this.secondComponent.init((canvas, width, height, dpr) => {
			const chart2 = echarts.init(canvas, null, {
				width: width,
				height: height,
				devicePixelRatio: dpr
			});
			setSecondOption(chart2, data, this.data.income_or_spending) //赋值给echart图表
			this.chart2 = chart2;
			return chart2;
		});
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
})