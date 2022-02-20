# My JSBox Script

## Share2Evernote

> **版本 1.7.4**
> [点此安装](https://xteko.com/redir?name=Share2Evernote&url=https%3A%2F%2Fgithub.com%2Fcoo11%2FJSBoxScript%2Fraw%2Fmaster%2FShare2Evernote.js&icon=icon_080.png&types=7&version=1.7.4&author=coo11)

**2022年2月20日更新**
- 替换失效的 API 以解决知乎付费回答无法保存的问题。

**2021年2月8日更新**
- 修复微博文章无法抓取的问题。

**2020年9月1日更新**
- 修复知乎盐选会员无法获取付费内容的问题。
- 新增：按脚本开头的说明配置，可以将本脚本变成一个推特、微博媒体文件下载器。

**2020年6月8日更新**
- 现在支持剪藏 Live Photo。
- 紧急修复推文配图无法获取最佳分辨率的问题。

**2020年6月2日更新**
- 支持微博国际版并修复其它 Bug。

**2020年5月30日更新**
- 现在，被带评锐推的推文和被转发的微博内容也可以完整保存了。
- 其他问题 BUG 修复。

**2020年1月13日更新**
- 微博更换了内容获取接口，因此不再需要特意从 Safari 浏览器中获取一些有限制的内容，但为了保存部分需要一定权限的内容（比如设置了关注查看全文的头条文章），也需要填写微博的 Cookie。
- 其他问题 BUG 修复。

##### 简介
- 这是一款 iOS 端印象笔记剪藏工具，借助私有邮箱，弥补印象笔记在移动端糟糕的剪藏体验。可抓取
    - 微博，包括转发、长微博、微博头条文章；
    - 推文，包括带评锐推；
    - 知乎的回答和专栏。

##### 特色
- 相比于微博 @我的印象笔记，可完整保留话题、超话、链接以及其它富文本，亦可保存微博头条文章；
- 剪藏内容，包括图片、视频、Animated GIF 或 Live Photo 皆是以最高分辨率或品质抓取；
- 进行了一定的排版，在尽可能保证剪藏内容足够美观的情况下，亦不会被新网页版印象笔记客户端识别为不可编辑的网页内容。

##### 配置
- 剪藏知乎或部分微博头条文章内容，需提供 cookie，在桌面端或 iOS 端获取教程分别如下，任选其一

![桌面端](https://i.niupic.com/images/2020/05/31/8a7o.PNG)
![移动端](https://i.niupic.com/images/2020/05/30/89By.jpg)

##### 注意
- 仅使用印象笔记测试，Evernote International 使用效果未知；
- 对于付费查看全文的知乎内容，使用会员账号的 cookie 即可保存；
- 能否保存微博头条文章内容取决于填入 Cookie 对应的账号是否有访问权限；
- 需配合 iOS 自带邮箱使用。提示附件过大时，请勿使用“邮包”选项发送；
- 抓取推文时，若点击脚本无反应，再点一次即可。

#### 使用方法

将知乎回答、专栏文章、微博、微博头条文章或者推文链接传递给剪贴板、分享扩展或 Safari 分享再运行本脚本即可。

## 10010+

> **版本 0.5**
> [点此安装]()

#### 联通资费查询 - Widget小组件

**2020年8月14日更新**
- 因联通的支付宝小程序查询接口的改动，该脚本已失效。新的接口只能获取余额、已用流量和剩余语音三个数据，并且测试发现 Cookie 有效期不超过一天。

- ~~通过联通支付宝小程序接口取得数据。~~

- ~~注意：脚本第一行填入联通手机号码，用前进入[联通小程序](https://qr.alipay.com/s7x01578knlcingf2oit0bc)(点此跳转)登录一下即可。建议使用时设置小组件高度为 180，打开性能模式以保证动画效果~~

- ~~使用：小组件展开状态下点击上三分之一查看话费明细，点击中间查看语音统计，点击下三分之一查看流量明细，进入饼图界面后轻触右上角即可返回；小组件折叠状态下变换样式。~~

## Color+

> **版本 1.3**
> [点此安装](http://t.cn/A6ZTb9cK)

#### 一个快捷的取色脚本

- 收集整理了中国传统色160种，日本传统色480种，以及140种 CSS 颜色名

- 查看 iOS 的 [UI Element Colors](https://developer.apple.com/documentation/uikit/uicolor/ui_element_colors?language=objc)、[Standard Colors](https://developer.apple.com/documentation/uikit/uicolor/standard_colors?language=objc) 和 JSBox 的 [$color(string)](https://docs.xteko.com/#/data/method?id=colorstring)。

该脚本未包括 `clearColor`(JSBox 中为 `$color("clear")`)。

## ImgReverse

> [点此安装](http://t.cn/E9xk9nL)

#### 图片翻转脚本，支持 JPG, PNG，GIF 格式

## Remove.bg

> [点此安装](http://t.cn/E9I5ajA)

#### 来自于 Remove.bg 的 AI 抠图，内有多项参数可选

## Img+

> **版本 1.91**
> [点此安装](http://t.cn/AiHFLP4M)

**注意：鉴于 iOS 13 基础编辑功能的完善和接口 `$imageKit` 的引入，本脚本停止开发。**

#### 本脚本可用于弥补个别 iOS 缺失的基础图片功能，并整合了其他工具

- 制作九宫格
- 下载 Pixiv Ugoira 动图，可转换为 GIF 格式
- 生成符合制作 Telegram Stikcer 大小的图片，方便移动端操作
- Remove.bg AI 抠图功能，多项参数可选
- 查看二维码
- 快速查看一张图片的基本信息比如大小、 尺寸、类型，复制图片的 MD5
- 加入 SM.MS Imugr Upload.cc Elimage Catbox Baidu 6 家图床 请勿滥用或者上传非法照片
- 图片大小调整(PNG, JPG)
- GIF 倒放(原作者 wr1241)
- 水平、垂直翻转(GIF, PNG, JPG)
- TinyPNG 图片压缩(PNG, JPG)(原作者 JunM)
- 清除图片 EXIF 信息
- 提示：轻触上方白色顶栏退出

## EhHepler

> **版本 0.2**
> [点此安装](http://t.cn/Aid6Uqo5)

**EhHelper 是一个 iOS 端浏览 E 绅士的辅助工具。**
- E 绅士 Tag 查询。引用数据来自 https://github.com/EhTagTranslation
- ~~方便 iOS 端获取熊猫书签 Exkey 以登录 E-hentai 里站~~

## 如果觉的好用，欢迎赞赏

![](https://i.niupic.com/images/2020/12/09/962C.png)