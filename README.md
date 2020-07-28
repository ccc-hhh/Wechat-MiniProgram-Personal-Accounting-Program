# Wechat-MiniProgram-Personal-Accounting-Program
# 微信小程序 模拟支付宝账单的个人记账小程序

初学微信小程序开发，为了锻炼自己的开发能力，一共写了两个小程序，一个是个人相册小程序，一个是这篇文章要介绍的模拟支付宝账单的个人记账小程序。

## 一、准备阶段

首先得了解支付宝账单的界面：
![支付宝账单界面](https://img-blog.csdnimg.cn/20200728221724948.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Njb29wcHBsdXM=,size_16,color_FFFFFF,t_70)
账单界面就是几个筛选分类的按钮和消费记录的列表，统计界面有一个一月的日消费、支出折线图和消费、收入的环形图，还有消费、支出的榜单。
所以用小程序模拟这个账单也是不难的，大致要用到tabBar、weui、选择器picker、icon、wx:for渲染和绘图插件echarts或者wx-charts，这里我选用了echarts。
其次就是icon的选用，weui里的icon不能满足消费类别图标的需求，可以使用阿里矢量图标库https://www.iconfont.cn/，搜索官方的支付宝图标。

## 二、写代码
### 1、登录界面
登录界面使用weui的From表单输入框，简单写一个页面就好了。
![登录界面](https://img-blog.csdnimg.cn/20200728223438891.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Njb29wcHBsdXM=,size_16,color_FFFFFF,t_70)
这里没有写注册界面，直接登录，识别到不在云数据库里的用户名就直接算作注册。
### 2、记账界面
记账界面和登录界面差不多，不过输入框旁边的变成了picker选择框，选择消费类别和支出/收入。
![记账界面](https://img-blog.csdnimg.cn/20200728223818682.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Njb29wcHBsdXM=,size_16,color_FFFFFF,t_70)
### 3、账单界面
账单界面要做到与支付宝账单界面相同还是用一定难度的，支付宝账单界面顶部的筛选、分类下拉栏要在微信小程序实现的话要写挺多的代码，所以这里我就改为了一个weui的navbar，然后用picker和九宫格嵌入弹出式菜单实现时间选择和类别选择。
账单列表使用wx:for渲染。
![账单界面](https://img-blog.csdnimg.cn/20200728224810357.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Njb29wcHBsdXM=,size_16,color_FFFFFF,t_70)
### 4、统计界面
统计界面需要用到echarts（在使用echarts时遇到一个坑，使用在echarts官方下载的精简版的插件时，真机调试图表无法显示，需要下载比较全的js包：https://github.com/WsmDyj/echarts-for-taro/tree/master/src/components/ec-canvas）
关于echarts的使用可以看下载的echarts包里的例子。在制作收入/支出日数据折线图时得要动态加载数据，教程可以参考：[https://blog.csdn.net/hao_0420/article/details/80931339?utm_source=blogxgwz9](https://blog.csdn.net/hao_0420/article/details/80931339?utm_source=blogxgwz9)，
多个图表的加载参考：[https://www.jianshu.com/p/d71d8ea3cb1b](https://www.jianshu.com/p/d71d8ea3cb1b)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200728225215638.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Njb29wcHBsdXM=,size_16,color_FFFFFF,t_70)
## 三、总结
从开始到完成这个小程序共用了近4天，期间遇到各种bug，幸好都一一解决的，其中遇到的最大的问题就是云函数的使用，在测试云函数的时候获取到的都是undefine，怎么调整都搞不定，在快完成这个小程序时，发现应该是异步的问题，下次可以用promise设置返回时间试试。
最后项目地址：https://github.com/ccc-hhh/Wechat-MiniProgram-Personal-Accounting-Program/
