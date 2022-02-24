"user strict";
/** @constant {boolean} 👇 值为 true 时，可分享获取的 HTML */
const isShareHtml = false;
/** @constant {boolean} 👇 值为 true 时，可以作为下载器保存推特或微博上的媒体至 JSBox 脚本共享文件夹（低电量时下载较大的视频会导致闪退，因此不直接弹出分享菜单） */
const justSaveMedia = false;

/* 👇 引号内填入印象笔记私有邮箱或者置空, 如 ["myaccount@m.yinxiang.com"] */
const to = [""];

/* 👇 填入知乎 cookie */
const z_c0 = '';

/* 👇 引号内填入微博 cookie（推荐填写，否则会导致部分微博或微博头条文章无法获取或查看权限不足）*/
const SUB = "";
/*
#### 简介

这是一款 iOS 端印象笔记剪藏工具，借助私有邮箱，可抓取
    - 微博，包括转发、长微博、微博头条文章；
    - 推文，包括带评锐推；
    - 知乎的回答和专栏。
以上内容，其中的图片、视频、Animated GIF 或 Live Photo 皆是以最高分辨率或品质抓取。

#### 配置说明

cookie 获取方法如下，任选其一：
![桌面端](https://i.niupic.com/images/2020/05/31/8a7o.PNG)
![移动端](https://i.niupic.com/images/2020/05/30/89By.jpg)

#### 使用方法

将知乎回答、专栏文章、微博、微博头条文章或者推文链接传递给剪贴板、分享扩展或 Safari 分享再运行本脚本即可。

#### 注意事项

> ⚠️ 脚本仅供学习交流，禁止用于其它用途，请于下载 24 小时内删除。剪藏、保存内容版权归原作者所有。

- 仅使用印象笔记测试，Evernote International 使用效果未知；
- 对于付费查看全文的知乎内容，使用会员账号的 Cookie 即可保存；
- 能否保存微博头条文章内容取决于填入 Cookie 对应的账号是否有访问权限；
- 需配合 iOS 自带邮箱使用。提示附件过大时，请勿使用「邮包」选项。

#### TODO
- 添加保存 Twitter Card 媒体内容的功能。
    https://twitter.com/KATETOKYO_PR/status/1356422084872781824
- 使用 Twitter API 2.0

2020.9.22 版本 1.71 
2021-2.8 修复微博文章无法抓取的问题。
2022-2.20 版本 1.74 修复知乎付费回答无法保存的 BUG。
2022-2.24 版本 1.75 修复知乎保存链接卡片时出现的 BUG。
有其它问题请通过 Telegram 向[作者](https://t.me/coo11)反馈。
*/
let link =
  $app.env == $env.safari
    ? $context.safari.items.baseURI
    : $app.env == $env.action
    ? $context.link || $detector.link($context.text)[0]
    : $clipboard.link;

if (!link) return;
if (/https?:\/\/t\.cn\/\w+/.test(link)) link = await $http.lengthen(link);
//Weibo web version on desktop may give you a shortened link

const regex = [
  /https?:\/\/((?:media|card)?\.?weibo\.c(?:n|om))\/t{0,2}article.*?(\d+)/,
  /https?:\/\/(weibointl|share)\.api\.weibo.*?weibo_id=(\d+)/i,
  /https?:\/\/((?:m\.)?weibo\.c(?:n|om))\/tv\/v\/(\w+)/,
  /https?:\/\/((?:m\.)?weibo\.c(?:n|om))\/s\/video\/.*?blog_mid=(\w+)/,
  /https?:\/\/((?:m\.)?weibo\.c(?:n|om))\/\w+\/?(\w*)/,
  /https?:\/\/www\.zhihu\.com\/(?:question\/\d+\/)?answer\/(\d+)/,
  /https?:\/\/zhuanlan\.zhihu\.com\/p\/(\d+)/,
  /https?:\/\/(?:mobile\.)?twitter\.com\/(?:\w+|i\/web)\/status\/(\d{18,19})/
];

let matched,
  i = 0;
while (!(matched = link.match(regex[i]))) i++;

if (i > 7) return;

$ui.loading("获取内容中");

switch (i) {
  case 0:
    getData({
      url: `https://card.weibo.com/article/m/aj/detail?id=${matched[2]}`,
      handler: getWeiboArticle
    });
    break;
  case 1:
  case 2:
  case 3:
  case 4:
    if (/\/(u|profile)\//.test(link)) return;
    getData({
      url: `https://m.weibo.cn/statuses/show?id=${matched[2]}`,
      handler: getWeiboInfo
    });
    break;
  case 5:
    getData({
      url: `https://api.zhihu.com/v4/answers/${matched[1]}?include=content,paid_info,paid_info_content,author,created_time,updated_time,question`,
      header: { Cookie: `z_c0="${z_c0}";` },
      handler: getZhihuInfo
    });
    break;
  case 6:
    getData({
      url: `https://www.zhihu.com/api/v4/articles/${matched[1]}`,
      header: { Cookie: `z_c0=${z_c0};` },
      handler: getZhihuInfo
    });
    break;
  case 7:
    getData({
      url: `https://api.twitter.com/1.1/statuses/show/${matched[1]}.json?tweet_mode=extended`,
      header: {
        Authorization:
          "Bearer AAAAAAAAAAAAAAAAAAAAAE306wAAAAAA36Mv3CcyOwbTQIaPnQO77gINgMo%3D9rGZZoPDYZ9bhKHz2WkMe3Nn8Fv2QEFucYL3QYJ1DZiuCGfKbh"
      },
      handler: getTweetInfo
    });
    break;
  default:
    return;
}

const prefix = "https://pic1.xuehuaimg.com/proxy/";
const parse = data => $xml.parse({ string: data, mode: "html" });
const stamp2Str = stamp =>
  new Date(parseInt(stamp) * 1000).toLocaleString().slice(0, -3);
const tagHr =
  '<hr style="display:block;height:1px;border:none;background-color:#0EA54A;margin:7px 0;"></hr>';
const tagA = (url, str) =>
  `<a href="${url}" style="text-decoration:none;color:#0EA54A;">${str}</a>`;
const gray2nd = (str, h = 14) =>
  `<span style="color:#969695;font-size:12px;line-height:${h}px;">${str}</span>`;

function tagImg(url, alt = "") {
  let content = `<img src="${url}" style="margin:2px;max-width:100%;">`;
  return alt
    ? `<div style="text-align:center;margin:0;padding:0;color:#969695;font-size:12px;overflow-wrap:break-word;">${content}<span>${alt}</span></div>`
    : content;
}

async function getData({
  url,
  header = { Cookie: `SUB=${SUB};`, Referer: "https://weibo.com/" },
  handler
}) {
  let { data } = await $http.get({ url, header });
  handler.count = 0;
  handler(data);
}

async function getWeiboInfo(dat) {
  if (typeof dat == "string") {
    failure();
    return;
  }

  let { text, id, bid, created_at, user, page_info, pics } = dat.data;
  let forwardInfo;

  ++getWeiboInfo.count;
  const { isLongText, retweeted_status: rs } = dat.data;
  const isNeedRequest = getWeiboInfo.count == 2 && isLongText;
  if (isNeedRequest) {
    let { data } = await $http.get({
      url: `https://m.weibo.cn/statuses/show?id=${bid}`,
      header: { Cookie: `SUB=${SUB};`, Referer: "https://weibo.com/" }
    });
    return await getWeiboInfo(data);
  } else if (rs) forwardInfo = await getWeiboInfo({ data: rs });

  text = parse(text);
  let main = text.node
    .replace(/^<html><body>(.*?)<\/body><\/html>$/, "$1")
    .replace(/^<p>(.*?)<\/p>$/, "$1");

  text.rootElement.enumerate({
    xPath: "//span",
    handler: (element, idx) => {
      let { string, attributes, node } = element;
      let type = attributes.class;
      if (type == "url-icon") {
        let emoji = node.match(/alt="(.*?)"/);
        emoji && (string = emoji[1]);
      }
      main = main.replace(node, string);
    }
  });

  text = parse(main);
  text.rootElement.enumerate({
    xPath: "//a",
    handler: (element, idx) => {
      let { string, attributes, node } = element;
      let url = attributes.href;
      if (/^https?:\/\/m\.weibo\.cn\/p\/index/.test(url)) {
        url = `https://weibo.com/p/${url.match(/\w{38}/)[0]}/super_index`;
        string = `${string}<超话>`;
      } else if (/m\.weibo\.cn\/.*?appointment_event/.test(url)) {
        string = `${string}<日程>`;
      } else if (/#.*?#/.test(string)) {
        let topic = encodeURI(url.match(/%23.*?%23/)[0]);
        url = `https://s.weibo.com/weibo?q=${topic}`;
      } else if (/^@/.test(string)) url = `https://weibo.com${url}`;
      main = main.replace(node, tagA(url, string));
    }
  });

  if (!user) user = { id: "unknown", screen_name: "未知博主" };
  let url = `https://weibo.com/${user.id}/${bid}`;
  let u_url = `https://weibo.com/u/${user.id}`;
  let date = new Date(created_at).toLocaleString();

  let l2d;
  let media = [];
  if (rs) {
    main += forwardInfo.main;
    media = forwardInfo.media;
  } else if (pics) {
    if (main) main += tagHr;
    if (Array.isArray(dat.data.live_photo)) {
      l2d = dat.data.pic_video.split(",").map(i => {
        const [a, b] = i.split(":");
        return { status: 0, id: a, hash: b };
      });
      let imgs = pics.map(async (i, n) => {
        if (justSaveMedia) {
          if (!l2d.some(j => j.id == n)) {
            let { data } = await $http.download(i.large.url);
            media.push(data);
          }
        } else tagImg(i.large.url);
      });
      let l2dDl = await dl();
      if (l2dDl) {
        for (let i of l2d) {
          let desc;
          if (i.status === 1) {
            desc = ` ${media.length}`;
            media.push(i.data);
          } else desc = "下载失败";
          if (!justSaveMedia) {
            /* prettier-ignore */
            imgs[i.id] += `<br><b><font color="#0EA54A">【配图 ${i.id} 的 Live Photo - 附件${desc}】</font></b><br>`;
          }
        }
        main += imgs.join("");
      } else return;
    } else {
      for (let i of pics) {
        if (justSaveMedia) {
          let { data } = await $http.download(i.large.url);
          media.push(data);
        } else main += tagImg(i.large.url);
      }
    }
  } else if (page_info) {
    let { urls, type, media_info } = page_info;
    if (type === "video") {
      let url;
      if (!urls) {
        url = media_info.stream_url_hd;
        !url && (url = media_info.stream_url);
      } else {
        let i = 0;
        let bitrate = ["1080p", "720p", "hd", "ld"];
        let dl = i => urls[`mp4_${bitrate[i]}_mp4`];
        while (!dl(i)) ++i;
        url = dl(i);
      }
      let { data } = await $http.download({ url, showsProgress: true });
      media = [data];
    }
  }

  if (getWeiboInfo.count > 1 && !rs) {
    /* prettier-ignore */
    let prev = `${gray2nd("<b>转发了</b>", 24)} <a href="${u_url}" style="text-decoration:none;color:#373B38;font-size:12px;line-height:24px;"><b>${user.screen_name}</b></a> ${gray2nd("<b>于</b>", 24)} ${gray2nd(date, 24)} ${gray2nd("<b>发布的</b>", 24)}<a href="${url}"style="text-decoration:none;color:#0EA54A;font-size:12px;line-height:24px;">微博</a>${gray2nd("<b>：</b>", 24)}<br>`;

    main = `${tagHr}${prev}${main}`;
    return { main, media };
  } else if (justSaveMedia) {
    $ui.loading(false);
    let dir = `shared://Weibo-${id}/`;
    $file.mkdir(dir);
    for (let i of media) {
      $file.write({ data: i, path: `${dir}${i.fileName}` });
    }
    $ui.success("保存完毕");
    //Maybe crash if low memory ↓
    //media.length && $share.sheet(media);
    return;
  }

  async function dl() {
    for (let i of l2d) {
      if (i.stauts === 1) continue;
      let url = `https://video.weibo.com/media/play?livephoto=https%3A%2F%2Flivephoto.us.sinaimg.cn%2F${i.hash}.mov`;
      $ui.loading(false);
      let { data, response } = await $http.download({
        url: url,
        timeout: 30,
        showsProgress: true
      });
      if (response.statusCode == 200) {
        i.data = data;
        i.status = 1;
      } else i.status = -1;
    }
    if (l2d.every(i => i.status == 1)) return true;
    else {
      let failure = l2d.filter(i => i.status == -1).length;
      let { index } = await $ui.alert({
        title: "Live Photo 下载完毕",
        message: `${l2d.length - failure} 个成功\n${failure} 个失败`,
        actions: ["重试", "继续", "取消"]
      });
      if (index === 0) return await dl();
      else if (index === 1) return true;
      else return;
    }
  }

  return getBody(user.screen_name, u_url, date, url, main, media);
}

async function getWeiboArticle(data) {
  if (typeof data == "string") {
    failure();
    return;
  } else if (data.code != "100000") {
    failure(data.msg);
    return;
  }
  let { object_info, update_at, create_at, title, url } = data.data;

  let pre = "https://weibo.com/ttarticle/p/show?id=";
  let main = data.data.content
    .replace(
      /<(h2)>(.*?)<\/\1>/g,
      `<p><span style="color:#373B38;font-size:14px;line-height:18px;"><b>$2</b></span></p>`
    )
    .replace(
      /<(h1)>(.*?)<\/\1>/g,
      `<p><span style="color:#373B38;font-size:18px;line-height:22px;"><b>$2</b></span></p>`
    )
    .replace(/<div\sclass="h5-hr".*?<\/div>/gi, tagHr)
    .replace(/<ul>/g, '<ul style="margin:0;">')
    .replace(/<p align="justify">/g, "<p>")
    .replace(/<p><br\/?><\/p>/g, "")
    .replace(
      /href="https:\/\/(card|media).weibo.c(om|n)\/article\/.*?(\d{22})(?=\/?")/g,
      `href="${pre}$3`
    )
    .replace(
      /<blockquote.*?>(.*?)<\/blockquote>/g,
      '<blockquote style="background: #E6F6EC;border-left:4px solid #0EA54A;margin:0;padding:10px 2px 10px 10px;border-radius:4px;">$1</blockquote>'
    )
    .replace(
      /<a.*?(href=".*?").*?>(.*?)<\/a>/g,
      '<a $1 style="text-decoration:none;color:#0EA54A;">$2</a>'
    );

  const imgs_tag = main.match(/<img.*?>/g);
  if (imgs_tag !== null) {
    const url = /src="(.*?)"/;
    for (let i of imgs_tag) {
      let j = i.match(url);
      let k = i.match(/alt="(.*?)"/);
      k = k ? k[1] : "";
      if (/(w[wsx].|tvax?.)\.sinaimg\.cn/.test(j[1]))
        main = main.replace(i, tagImg(j[1], k));
      else if (i.includes("r.sinaimg.cn")) {
        let { response } = await $http.get(j[1]);
        j = response.url.replace(
          /\.cn\/(small|mw\d+|thumb\d+|orj\d+|crop.*?|square)(?=\/)/,
          ".cn/large"
        );
        main = main.replace(i, tagImg(j, k));
      } //else if (i.includes("h5-video-img")) continue;
      else {
        console.warn(`出现未处理图片 ${j[1]}，建议复制该链接与作者联系解决`);
        continue;
      }
    }
  }

  let video = new Array();
  let v_num = 0,
    _v_num = 0;
  if (object_info) {
    for (let i in object_info) {
      object_info[i].object_type == "video" && v_num++;
    }
  }

  main = main
    .trim()
    .replace(/^<p><\/p>/, "")
    .replace(/<p><\/p>$/, "")
    .replace(/^<br\/?>/, "")
    .replace(/<br\/?>$/, "")
    .replace(/^<p><\/p>/, "")
    .replace(/<p><\/p>$/, "")
    .trim();

  let { idstr, screen_name } = data.data.userinfo;
  let u_url = `https://weibo.com/u/${idstr}`;
  /* prettier-ignore */
  let head = `<span style="color:#373B38;font-size:26px;line-height:36px;"><b>${title}</b></span><br><a href="${u_url}"style="text-decoration:none;color:#373B38;font-size:12px;line-height:14px;">${screen_name}</a><span style="color:#969695;font-size:12px;line-height:18px;"> ${update_at || create_at} </span><a href="${url}"style="text-decoration:none;color:#0EA54A;font-size:12px;line-height:18px;">查看原文</a><br><hr style="display:block;width:100%;height:1px;border:none;background-color:#0EA54A;margin:7px 0;"></hr>`;

  if (!v_num) {
    $ui.loading(false);
    mail(`${title} - ${screen_name} 发布的头条文章`, head + main);
    return;
  }

  main = main.replace(
    /<card\sdata-card-id="(.*?)".*?video.*?>(<\/card>)?/g,
    (...x) => {
      _v_num++;
      let { image, stream } = object_info[x[1]].object;
      video.push({ status: 0, id: x[1], url: stream.url });
      let img = `<img src="${image.url}" style="border-radius:10px;max-width:100%;"/>`;
      /* prettier-ignore */
      return `${img}<br/><b><font color="#0EA54A">【视频 - 附件 ${_v_num - 1}${x[1]}】</font></b><a href="${stream.url}" style="text-decoration:none;color:#0EA54A;"> 视频链接</a>`;
    }
  );
  async function dl() {
    for (let i of video) {
      if (i.status === 1) continue;
      let { data, response } = await $http.download(i.url);
      if (response.statusCode == 200) {
        i.data = data;
        i.status = 1;
      } else i.status = -1;
    }
    if (video.every(i => i.status == 1)) return true;
    else {
      let failure = video.filter(i => i.status == -1).length;
      let { index } = await $ui.alert({
        title: "正文视频下载完毕",
        message: `${video.length - failure} 个成功\n${failure} 个失败`,
        actions: ["重试", "继续", "取消"]
      });
      if (index === 0) return await dl();
      else if (index === 1) return true;
      else return;
    }
  }

  let dlSuccess = await dl();
  $ui.loading(false);
  if (dlSuccess) {
    let media = [];
    for (let i in video) {
      let x = new RegExp(`(附件) ${i}${video[i].id}`);
      if (video[i].status == 1) {
        media.push(video[i].data);
        main = main.replace(x, `$1 ${media.length - 1}`);
      } else main = main.replace(x, "$1下载失败");
    }
    mail(`${title} - ${screen_name} 发布的头条文章`, head + main, media);
  } else return;
}

async function getZhihuInfo(data) {
  let { type, content, error, ...info } = data;
  if (error) {
    failure(error.message, error.name);
    return;
  }
  const { header, title } =
    type === "answer" ? getZhihuAnswerInfo(info) : getZhihuZhuanlanInfo(info);
  let video = new Array();
  if ("paid_info" in info && info.paid_info.has_purchased) {
    content = info.paid_info.content.replace(/<span.*?>(.*?)<\/span>/g, "$1");
  }
  content = content
    .replace(
      /<blockquote.*?>(.*?)<\/blockquote>/g,
      '<blockquote style="background: #E6F6EC;border-left:4px solid #0EA54A;margin:0;padding:10px 2px 10px 10px;border-radius:4px;">$1</blockquote>'
    )
    .replace(
      /<pre.*?>([\d\D]*?)<\/pre>/g,
      '<pre style="background: #E6F6EC;margin:0;padding:10px;border-radius:4px;">$1</pre>'
    )
    .replace(/<ul>/g, '<ul style="margin:0;">')
    .replace(/<div.*?>([\d\D]*?)<\/div>/g, "$1")
    .replace(/<p class="ztext-empty-paragraph.*?<\/p>/g, "")
    .replace(/^<span.*?>(.*?)<\/span>$/, "$1")
    .replace(
      /<figure.*?data-actualsrc="(.*?)".*?(<figcaption>(.*?)<\/figcaption>)?<\/figure>/g,
      (...args) => {
        let url = args[1].replace("50/", "").replace(/_(hd|b)(?=\.)/, "_r");
        return `<p>${tagImg(url, args[3])}</p>`;
      }
    ); //Some Images do not provide original url
  content = content.replace(/<a.*?href="(.*?)"(.*?)>(.*?)<\/a>/g, (...x) => {
    let [, url, xxx, text] = x;
    url.includes("link.zhihu.com") &&
      (url = decodeURIComponent(url.slice(url.indexOf("=") + 1)));
      //console.log([url, xxx, text])
    if (xxx.indexOf("link-card") > -1) {
      let img = xxx.match(/data-image="(.*?)"/);
      if (!img || img[1].endsWith("svg"))
        img =
          "https://static.zhihu.com/heifetz/assets/apple-touch-icon-120.b3e6278d.png";
      else img = img[1];
      /^<span.*<\/span>$/.test(text) &&
        (text = text.replace(/<\/?span(?:.*?visible")?>/g, ""));
      return `<p><a href="${url}"style="text-decoration:none;color:#0EA54A;"><b><font color="#1A7CD3">【卡片链接】</font>${text}</b><br/><img src="${img}" style="border-radius:10px;width:100px;"/></a></p>`;
    } else if (xxx.includes("data-video-id")) {
      let vid = xxx.match(/data-lens-id="(.*?)"/)[1];
      video.push({ id: vid, status: 0 });
      let img = xxx.match(/data-poster="(.*?)"/)[1];
      text = xxx.match(/data-name="(.*?)"/)[1];
      /* prettier-ignore */
      return `<p><a href="${url}" ><img src="${img}" style="border-radius:10px 6px 10px 10px;width:100%;max-width:100%;"/></a><br/><b><font color="#1A7CD3">【视频 - 附件 ${video.length - 1}${vid}】</font></b><font color="#0EA54A">${text}</font></p>`;
    } else
      return `<a href="${url}" style="text-decoration:none;color:#0EA54A;">${text}</a>`;
  }); //delete redirect prefix or remake LinkCard
  console.log(`${header}${content}`);
  if (!video.length) {
    $ui.loading(false);
    mail(title, `${header}${content}`);
    return;
  }

  async function dl() {
    for (let i of video) {
      if (i.status === 1) continue;
      let res = await $http.get(`https://lens.zhihu.com/api/videos/${i.id}`);
      console.log(res.data);
      let { data, response } = await $http.download(
        res.data.playlist.hd.play_url
      );
      if (response.statusCode == 200) {
        i.data = data;
        i.status = 1;
      } else i.status = -1;
    }
    if (video.every(i => i.status == 1)) return true;
    else {
      let failure = video.filter(i => i.status == -1).length;
      let { index } = await $ui.alert({
        title: "正文视频下载完毕",
        message: `${video.length - failure} 个成功\n${failure} 个失败`,
        actions: ["重试", "继续", "取消"]
      });
      if (index === 0) return await dl();
      else if (index === 1) return true;
      else return;
    }
  }
  let dlSuccess = await dl();
  if (dlSuccess) {
    let media = [];
    for (let i in video) {
      let x = new RegExp(`(附件) ${i}${video[i].id}`);
      if (video[i].status == 1) {
        media.push(video[i].data);
        content = content.replace(x, `$1 ${media.length - 1}`);
      } else content = content.replace(x, "$1下载失败");
    }
    $ui.loading(false);
    mail(title, `${header}${content}`, media);
  } else return;
}

function getZhihuAnswerInfo(data) {
  let { author, updated_time, created_time, question } = data;
  let { url, name, headline } = author;
  let { id, title } = question;
  data.answer_type === "paid" &&
    $delay(1, () =>
      $app.tips(
        "对于付费可见全部内容的回答，需使用会员账户的 Cookie 完整保存。"
      )
    );
  let replyTime = stamp2Str(created_time);
  replyTime =
    updated_time === created_time
      ? replyTime
      : `创建于 ${replyTime} 编辑于 ${stamp2Str(updated_time)}`;
  url = url.replace("api/v4/", "");
  let qurl = `https://www.zhihu.com/question/${id}`;
  headline &&
    (headline = ` <font color="#0EA54A">|</font> <span style="color:#969695;font-size:12px;line-height:14px;">${headline}</span>`);
  return {
    /* prettier-ignore */
    header: `<a href="${qurl}"style="text-decoration:none;color:#373B38;font-size:18px;line-height:24px;">${title}</a><br/><a href="${url}"style="text-decoration:none;color:#373B38;font-size:12px;line-height:14px;">${name}</a>${headline}<br/>${gray2nd(replyTime)} <a href="${qurl}/answer/${data.id}"style="text-decoration:none;color:#0EA54A;font-size:12px;line-height:14px;">查看原文</a>${tagHr}`,
    title: `${title} - ${name}的回答`
  };
}

function getZhihuZhuanlanInfo(data) {
  const pre = "https://zhuanlan.zhihu.com/";
  let { created, updated, author, column, title_image } = data;
  let { url, name, headline } = author;
  url = url.replace("api", "www");
  let time = stamp2Str(created);
  time =
    updated === created ? time : `创建于 ${time} 更新于 ${stamp2Str(updated)}`;
  let sub = data.share_text.match(/.*?(?=，作者)/)[0];
  title_image &&
    (title_image = `<img src="${title_image.replace(
      /(b|hd)(?=\.)/,
      "r"
    )}" style="max-width:100%;border-radius:6px;"/>${tagHr}`);
  if (headline) {
    headline = ` <font color="#0EA54A">|</font> <span style="color:#969695;font-size:12px;line-height:14px;">${headline}</span>`;
  }
  column = column
    ? /* prettier-ignore */
      `<br/>${gray2nd("来自专栏")}<a href="${pre}${column.id}"style="text-decoration:none;color:#1A7CD3;font-size:12px;line-height:14px;"><b>【${column.title}】</b></a>`
    : "";
  return {
    /* prettier-ignore */
    header: `${title_image}<a href="${pre}p/${matched[1]}"style="text-decoration:none;color:#373B38;font-size:18px;line-height:24px;">${data.title}</a><br/><a href="${url}"style="text-decoration:none;color:#373B38;font-size:12px;line-height:14px;">${name}</a>${headline}<br/>${gray2nd(time)}${column}${tagHr}`,
    title: sub
  };
}

async function getTweetInfo(dat) {
  if ("errors" in dat) {
    failure(dat.errors[0].message);
    return;
  }

  ++getTweetInfo.count;
  let { id_str: id, created_at: date, full_text: main } = dat;
  let { name, screen_name: at, id_str: uid } = dat.user;
  let { entities: e, extended_entities: ee, quoted_status: qs } = dat;
  let quoted;
  if (dat.is_quote_status && qs /* 禁止套娃 */) quoted = await getTweetInfo(qs);

  let u_url = `https://twitter.com/i/user=${uid}`;
  let url = `https://twitter.com/user/status/${id}`;
  date = new Date(date).toLocaleString();
  // Start to fix full text ↓
  let tags = e.hashtags
    .concat(e.urls)
    .concat(e.user_mentions)
    .sort((a, b) => a.indices[0] > b.indices[0]);
  if (tags.length > 0) {
    main = tags
      .reduceRight(
        (a, { indices: b, text: c, id_str: d, expanded_url: e }) => {
          let f = a.slice(...b);
          let url;
          if (c) url = `https://twitter.com/hashtag/${encodeURI(c)}?src=hash`;
          else if (d) url = `https://twitter.com/i/user=${d}`;
          else if (e) {
            url = e;
            f = ["网页链接"];
          }
          let a_tag = tagA(url, f.join(""));
          a.splice(b[0], b[1] - b[0], a_tag);
          return a;
        },
        [...main]
      )
      .join("");
  }
  main = main.replace(/\n/g, "<br/>");
  if ("media" in e) main = main.replace(e.media[0].url, "").trim();
  console.log(main);
  /* Get media: Images, Video, Anmimated-gif ↓ */
  let media = [];
  if (ee) {
    if (main && ee.media[0].type == "photo") main += tagHr;
    for (let i of ee.media) {
      if (i.type == "photo") {
        if (justSaveMedia) {
          $ui.loading(false);
          let { data } = await $http.download({
            url: i.media_url.replace(/\.(png|jpg)$/i, "?format=$1&name=orig"),
            showsProgress: true
          });
          media.push(data);
        } else main += tagImg(`${prefix}${i.media_url}:orig`);
      } else if (i.type == "video" || i.type == "animated_gif") {
        let j = i.video_info.variants;
        j = j.filter(i => "bitrate" in i).sort((a, b) => a.bitrate < b.bitrate);
        $ui.loading(false);
        let { data } = await $http.download({
          url: j[0].url,
          showsProgress: true
        });
        media.push(data);
      }
    }
  }
  if (getTweetInfo.count == 2 && !qs) {
    /* prettier-ignore */
    let prev = `${gray2nd("<b>转发了</b>", 24)} <a href="${u_url}" style="text-decoration:none;color:#373B38;font-size:12px;line-height:24px;"><b>${name}</b></a> <a href="https://twitter.com/${at}"style="text-decoration:none;color:#969695;font-size:12px;line-height:24px;">@${at}</a> ${gray2nd("<b>于</b>", 24)} ${gray2nd(date, 24)} ${gray2nd("<b>发布的</b>", 24)}<a href="${url}"style="text-decoration:none;color:#0EA54A;font-size:12px;line-height:24px;">推文</a>${gray2nd("<b>：</b>", 24)}<br>`;
    main = `${tagHr}${prev}${main}`;
    return { main, media };
  } else if (dat.is_quote_status) {
    let { main: _main, media: _media } = quoted;
    const videoMark = (p = 0) =>
      `<br><b><font color="#0EA54A">【视频 - 附件${p}】</font></b>`;
    if (!media.length) {
      media = _media;
      if (_media.length) _main += videoMark();
    } else {
      main += videoMark();
      if (_media.length) {
        media = media.concat(_media);
        _main += videoMark("1");
      }
    }
    main += _main;
  }
  if (justSaveMedia) {
    $ui.loading(false);
    let dir = `shared://Tweet-${id}/`;
    $file.mkdir(dir);
    for (let i of media) {
      $file.write({ data: i, path: `${dir}${i.fileName}` });
    }
    $ui.success("保存完毕");
    return;
  }
  return getBody(name, u_url, date, url, main, media, at);
}

async function getBody(name, u_url, date, url, main, media, at_name) {
  console.log(main);
  let at_url = at_name
    ? `<a href="https://twitter.com/${at_name}"style="text-decoration:none;color:#969695;font-size:12px;line-height:14px;">@${at_name}</a>`
    : "";
  /* prettier-ignore */
  let body = `<a href="${u_url}"style="text-decoration:none;color:#373B38;font-size:18px;line-height:24px;">${name}</a> ${at_url}<br/>${gray2nd(date)} <a href="${url}"style="text-decoration:none;color:#0EA54A;font-size:12px;line-height:14px;">查看原文</a>${tagHr}${main}`;
  let sub = `${name} 发布的${/weibo/.test(url) ? "微博" : "推文"}`;
  $ui.loading(false);
  if (isShareHtml) {
    let { index } = await $ui.menu(["发送到私有邮箱", "分享 HTML"]);
    if (index) return $share.sheet(body);
  }
  return mail(sub, body, media);
}

function mail(subject, body, media) {
  $message.mail({
    to,
    body,
    subject,
    isHTML: 1,
    attachments: media,
    handler: result => {
      if (result == 0) $ui.error("已取消");
      else if (result == 1) $ui.toast("已保存");
      else if (result == 2) $ui.toast("已发送");
      else if (result == 3) $ui.error("发送失败");
      $delay(1, () => $context.close());
    }
  });
}

function failure(
  message = "可能是查看权限不足或者作者设置了展示时间",
  title = "获取失败"
) {
  $ui.loading(false);
  $ui.alert({ title, message });
}