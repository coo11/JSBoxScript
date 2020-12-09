/*
 Powered by coo11
 Contact with me via Telegram https://t.me/coo11
- 快速查看一张图片的基本信息比如大小、 尺寸、类型，复制图片的 MD5
- 加入 SM.MS Imugr Upload.cc Elimage Catbox Baidu Niupic 几家图床 请勿滥用或者上传非法照片
- 图片大小调整(PNG, JPG) GIF倒放 水平、垂直翻转(GIF, PNG, JPG)
- TinyPNG图片压缩(PNG, JPG) 清除图片Exif信息
- 提示：轻触白色顶栏退出 一些功能请自行申请 API Key
- 查看二维码
- Remove.bg AI 抠图
- 生成符合 Telegram Sticker 大小的图片
- 下载 Pixiv Ugoira 动图，可转换为 GIF 格式
- 制作九宫格
*/

const dark = $device.isDarkMode,
  separatorColor = dark ? $rgba(100, 100, 100, 0.8) : $color("separator"),
  sW = $device.info.screen.width,
  sH = sW * 0.618,
  pic = $context.dataItems,
  list = [
    ["调整大小", "水平翻转", "垂直翻转", "GIF 倒放"],
    [
      "Upload.cc",
      "SM.MS",
      "Imgur",
      "Catbox",
      "Elimage",
      "Baidu",
      "Niupic",
      "删除已上传"
    ],
    [
      "扫描二维码",
      "TinyPNG",
      "Remove.bg",
      "删除 EXIF",
      "制作 Telegram Sticker",
      "下载 Pixiv 动图",
      "制作九宫格"
    ]
  ];

let imgurApi = $cache.get("imgur") || "",
  tinyApi = $cache.get("tinypng") || "",
  removeApi = $cache.get("remove") || "",
  engines = [
    {
      url: "https://upload.cc/image_upload",
      method: "POST",
      deleteUrl: "https://upload.cc/delete",
      name: "uploaded_file[]",
      dheader: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    },
    {
      url: "https://sm.ms/api/upload",
      method: "GET",
      deleteUrl: "https://sm.ms/api/delete/",
      name: "smfile"
    },
    {
      url: "https://api.imgur.com/3/image",
      name: "image",
      method: "DELETE",
      deleteUrl: "https://api.imgur.com/3/image/",
      header: {
        Authorization: `Client-ID ${imgurApi}`
      }
    },
    {
      url: "https://catbox.moe/user/api.php",
      name: "fileToUpload",
      form: {
        reqtype: "fileupload"
      }
    },
    {
      url: "https://img.vim-cn.com/",
      name: "image"
    },
    {
      url:
        "https://graph.baidu.com/upload?tn=wise&type=general&range=%7b%22page_from%22:%20%22shituIndex%22%7d&extUiData%5bisLogoShow%5d=1&uptime=" +
        Date.parse(new Date()),
      name: "image",
      form: { tn: "wise", type: "general" }
    },
    {
      url: "http://www.niupic.com/api/upload",
      name: "image_field"
    }
  ],
  type;

function uploadMenu(i, url, del) {
  const upload = [
    ["链接", "分享", "更多", "二维码", "删除已上传", "链接 & Delete Key/Hash"],
    ["以下全部", "URL", "HTML", "BBCode", "Markdown", "Delete Key/Hash"]
  ];
  let uploadMenu = upload;
  if (![0, 1, 2].includes(i)) {
    uploadMenu[0].splice(4, 2);
    uploadMenu[1].splice(5, 1);
  }
  $ui.menu({
    items: uploadMenu[0],
    handler: (t, idx) => {
      switch (idx) {
        case 0:
          $clipboard.text = url;
          $ui.toast("链接已复制", 0.6);
          break;
        case 1:
          $share.sheet(url);
          break;
        case 2:
          uploadMenu1(uploadMenu[1], url, del);
          break;
        case 3: {
          let x = $qrcode.encode(url);
          $ui.menu(["保存", "预览"]).then(resp => {
            if ("index" in resp) {
              if (resp.index == 0)
                $photo.save({
                  image: x,
                  handler: res => res && $ui.toast("已保存", 0.6)
                });
              else $quicklook.open({ image: x });
            }
          });
          break;
        }
        case 4:
          uploadDelete(i, del);
          break;
        case 5:
          $share.sheet(`链接: ${url}\n删除: ${del}`);
          break;
      }
    }
  });
}

function uploadMenu1(menu, url, del) {
  $ui.menu({
    items: menu,
    handler: (t, i) => {
      let html = `<img src="${url}" alt="Image" title="Image">`,
        bbcode = `[img]${url}[/img]`,
        md = `![Image](${url})`,
        all = `${url}\n${html}\n${bbcode}\n${md}`;
      switch (i) {
        case 0:
          all = del !== undefined ? all.concat("\n" + del) : all;
          $share.sheet(all);
          break;
        case 1:
          $clipboard.text = url;
          break;
        case 2:
          $clipboard.text = html;
          break;
        case 3:
          $clipboard.text = bbcode;
          break;
        case 4:
          $clipboard.text = md;
          break;
        case 5:
          $clipboard.text = del;
          break;
      }
      i != 0 && $ui.toast(menu[i] + "已复制", 0.6);
    }
  });
}

function uploadDelete(i, del) {
  $http.request({
    method: engines[i].method,
    url: i == 0 ? engines[0].deleteUrl : engines[i].deleteUrl + del,
    header: i == 2 ? engines[i].header : engines[i].dheader,
    body: i == 0 ? { key: del } : {},
    handler: resp => {
      console.log(resp);
      switch (i) {
        case 0:
          if (resp.data.total_success == 1) $ui.toast("图片删除成功", 0.6);
          else if (resp.data.total_success == 0) alert("删除失败");
          break;
        case 1:
          if (/(File already deleted)|(File delete success)/i.test(resp.data))
            $ui.toast("图片删除成功", 0.6);
          else if (/Hash id not found/i.test(resp.data))
            $ui.alert({
              title: "删除失败",
              message: "Hash id not found."
            });
          break;
        case 2:
          if (resp.data.success) $ui.toast("图片删除成功", 0.6);
          else if (!resp.data.success)
            $ui.alert({
              title: "删除失败",
              message: resp.data.data.error
            });
          break;
      }
    }
  });
}

function uploadImg(img, i) {
  $http.upload({
    url: engines[i].url,
    header: engines[i].header,
    files: [{ data: img, name: engines[i].name, filename: "img." + type }],
    form: engines[i].form,
    handler: function(resp) {
      if (resp.response.statusCode != 200) {
        $ui.error("上传失败");
        return;
      }
      let data = resp.data;
      console.log(resp);
      let url, del;
      switch (i) {
        case 0:
          if (data.total_success == 1) {
            let path = data.success_image[0].url,
              _del = data.success_image[0].delete;
            url = "https://upload.cc/" + path;
            del = `[{"path":"${path}","key":"${_del}"}]`;
          } else {
            alert("上传失败");
            return;
          }
          break;
        case 1:
          if (data.success) {
            url = data.data.url;
            del = data.data.hash;
          } else {
            $ui.alert({
              title: "上传失败",
              message: data.message
            });
            return;
          }
          break;
        case 2:
          if (data.success) {
            url = data.data.link;
            del = data.data.deletehash;
          } else {
            $ui.alert({
              title: "上传失败",
              message: data.data.error
            });
            return;
          }
          break;
        case 3:
          url = data;
          break;
        case 4:
          if (/^https:\/\/img\.vim-cn\.com\//i.test(data))
            url = data.replace("\n", "");
          else {
            $ui.alert({
              title: "上传失败",
              message: data
            });
            return;
          }
          break;
        case 5:
          type = type == "png" ? "png" : "jpg";
          if (data.msg == "Success")
            url =
              "https://graph.baidu.com/resource/" + data.data.sign + "." + type;
          else {
            $ui.alert({
              title: "上传失败",
              message: data.msg
            });
            return;
          }
          break;
        case 6:
          if (data.status != "success") alert("上传失败");
          else url = "https://" + data.img_puburl;
          break;
      }
      uploadMenu(i, url, del);
    }
  });
}

function initList(i) {
  let items = [];
  list[i].map(x => {
    items = items.concat({
      list: { text: x }
    });
  });
  return items;
}

let _type = ["image/gif", "image/jpeg", "image/png"].includes(
  pic === undefined ? "" : pic[0].info.mimeType
);
if (pic && _type) {
  type = pic[0].info.mimeType.replace("image/", "").toLowerCase();
  render(pic[0]);
} else if ($context.imageItems) {
  type = "jpeg";
  render($context.image.jpg(1.0));
} else {
  $ui.menu({
    items: ["从相册选", "最后一张"],
    handler: (t, i) => {
      i == 0 ? pick() : last();
    }
  });
}

async function pick() {
  let resp = await $photo.pick({ format: "data" });
  type = resp.data.info.mimeType.replace("image/", "").toLowerCase();
  render(resp.data);
}

async function last() {
  let resp = await $photo.fetch({ count: 1, format: "data" });
  type = resp[0].info.mimeType.replace("image/", "").toLowerCase();
  render(resp[0]);
}

function format(bytes) {
  let formatter = $objc("NSByteCountFormatter");
  let string = formatter.$stringFromByteCount_countStyle(bytes, 0);
  return string.rawValue();
}

function reverse(img, i) {
  let size = img.size,
    frame = $rect(0, 0, size.width, size.height),
    view = {
      type: "view",
      props: {
        id: "temp",
        frame: frame
      },
      views: [
        {
          type: "canvas",
          layout: $layout.fill,
          props: { frame: frame },
          events: {
            draw: (view, ctx) => {
              ctx.scaleCTM(-i, i);
              i == 1
                ? ctx.translateCTM(-size.width, 0)
                : ctx.translateCTM(0, -size.height);
              ctx.drawImage(frame, img);
            }
          }
        }
      ]
    },
    canvas = $ui.create(view);
  let reversed = canvas.snapshotWithScale(1);
  return reversed;
}

function gifReverse(data, _i) {
  let decoder = $objc("YYImageDecoder").invoke(
      "decoderWithData:scale",
      data,
      1
    ),
    encoder = $objc("YYImageEncoder").invoke("alloc.initWithType", 7),
    frameCount = decoder.invoke("frameCount"),
    _frame,
    rFrame;
  for (let i = 0; i < frameCount; i++) {
    let duration = decoder.invoke("frameDurationAtIndex", i);
    let frame = decoder.invoke("frameAtIndex:decodeForDisplay", i, 0);
    _frame = frame.invoke("image").jsValue();
    rFrame = reverse(_frame, _i);
    $("temp").remove();
    encoder.invoke("addImage:duration", rFrame.ocValue(), duration);
  }
  return encoder.invoke("encode").jsValue();
}

function gifPlayback(data) {
  let decoder = $objc("YYImageDecoder").invoke(
      "decoderWithData:scale",
      data,
      1
    ),
    encoder = $objc("YYImageEncoder").invoke("alloc.initWithType", 7),
    frameCount = decoder.invoke("frameCount");
  for (let i = frameCount - 1; i >= 0; i--) {
    let duration = decoder.invoke("frameDurationAtIndex", i);
    let frame = decoder.invoke("frameAtIndex:decodeForDisplay", i, 0);
    encoder.invoke("addImage:duration", frame.invoke("image"), duration);
  }
  return encoder.invoke("encode").jsValue();
}

function resizedImage(img) {
  let outputImage;
  if (type == "gif") outputImage = img;
  else if (type == "png") outputImage = img.png;
  else outputImage = img.jpg(1.0);
  shareIt(outputImage);
}

function setApikey(api) {
  $input.text({
    type: $kbType.ascii,
    placeholder: "请输入 API Key",
    text: $cache.get(api) || "",
    handler: text => {
      $cache.set(api, text);
      $ui.toast("已保存", 0.6);
    }
  });
}

function tinyPNG(data) {
  if (tinyApi == "") {
    setApikey("tinypng");
    tinyApi = $cache.get("tinypng") || "";
  } else {
    $ui.toast("正在上传图片至 TinyPNG……");
    $http.request({
      method: "POST",
      url: "https://api.tinify.com/shrink",
      header: {
        Authorization:
          "Basic " + $text.base64Encode("api:" + $cache.get("tinypng"))
      },
      body: data,
      handler: resp => {
        console.log(resp);
        let response = resp.response;
        if (response.statusCode === 201) {
          $ui.toast("正在压缩……");
          let compressedImageUrl = response.headers["Location"];
          $ui.toast("正在下载压缩后的图片……");
          $http.download({
            url: compressedImageUrl,
            handler: resp => {
              if (resp.data) {
                $ui.alert({
                  title: "图片压缩完成",
                  message:
                    "本月配额使用统计: " +
                    response.headers["compression-count"] +
                    " / 500",
                  actions: [
                    {
                      title: "分享",
                      style: "cancel",
                      handler: () => {
                        $share.sheet(resp.data);
                      }
                    },
                    {
                      title: "保存",
                      handler: () => {
                        $photo.save({
                          data: resp.data,
                          handler: result => {
                            if (result == true) $ui.toast("已保存至相册");
                            else
                              $ui.alert({
                                title: "错误",
                                message: result
                              });
                          }
                        });
                      }
                    }
                  ]
                });
              }
            }
          });
        } else if (response.statusCode == 401)
          $ui.alert({
            title: "验证失败",
            message: "请确认 API KEY 填写正确"
          });
        else
          $ui.alert({
            title: "上传失败",
            message: response.statusCode
          });
      }
    });
  }
}

function imgResize(img) {
  let size = img.image.size;
  return {
    type: "blur",
    props: {
      style: dark ? 3 : 5,
      alpha: 0,
      hidden: 1,
      radius: 10,
      id: "resize",
      borderWidth: 0.4,
      bgcolor: $color("clear"),
      borderColor: $rgba(100, 100, 100, 0.25)
    },
    layout: (make, view) => {
      make.size.equalTo($size(sW * 0.75, sH * 0.75));
      make.centerX.equalTo(view.super);
      make.top.equalTo(view.super.safeAreaTop).offset(44 + sH * 0.5);
    },
    views: [
      {
        type: "input",
        props: {
          id: "width",
          text: String(size.width),
          borderWidth: 0.4,
          textColor: $color(dark ? "white" : "black"),
          bgcolor: $color(dark ? "#A2A2A2" : "white"),
          borderColor: $rgba(100, 100, 100, 0.25),
          type: $kbType.decimal,
          placeholder: "宽"
        },
        layout: resizeLayout(-1, -1),
        events: {
          tapped(sender) {
            sender.focus();
          },
          changed: sender => {
            $("height").text =
              $("type").title == "比例"
                ? (sender.text * size.height) / size.width
                : sender.text;
            if (sender.text == "") $("height").text == "";
          }
        }
      },
      {
        type: "input",
        props: {
          id: "height",
          text: String(size.height),
          borderWidth: 0.4,
          textColor: $color(dark ? "white" : "black"),
          bgcolor: $color(dark ? "#A2A2A2" : "white"),
          borderColor: $rgba(100, 100, 100, 0.25),
          type: $kbType.decimal,
          placeholder: "高"
        },
        layout: resizeLayout(-1, 1),
        events: {
          tapped(sender) {
            sender.focus();
          },
          changed: sender => {
            $("width").text =
              $("type").title == "比例"
                ? (sender.text * size.width) / size.height
                : sender.text;
            if (sender.text == "") $("width").text == "";
          }
        }
      },
      {
        type: "button",
        props: {
          id: "type",
          title: "比例",
          titleColor: $color(dark ? "white" : "tint"),
          borderWidth: 0.4,
          bgcolor: $rgba(255, 255, 255, 0.25),
          borderColor: $rgba(100, 100, 100, 0.25)
        },
        layout: resizeLayout(1, -1),
        events: {
          tapped(sender) {
            $device.taptic(0);
            if (sender.title == "比例") {
              sender.title = "像素";
              if ($("width").text != "")
                $("width").text = $("width").text / size.width;
              if ($("height").text != "")
                $("height").text = $("height").text / size.height;
            } else {
              sender.title = "比例";
              if ($("width").text != "")
                $("width").text = $("width").text * size.width;
              if ($("height").text != "")
                $("height").text = $("height").text * size.height;
            }
          }
        }
      },
      {
        type: "button",
        props: {
          title: "完成",
          borderWidth: 0.4,
          bgcolor: $rgba(255, 255, 255, 0.25),
          borderColor: $rgba(100, 100, 100, 0.25),
          titleColor: $color(dark ? "white" : "tint")
        },
        layout: resizeLayout(1, 1),
        events: {
          tapped(sender) {
            $("width").blur();
            $("height").blur();
            let resized =
              $("type").title == "比例"
                ? img.image.resized($size($("width").text, $("height").text))
                : img.image.resized(
                    $size(
                      $("width").text * size.width,
                      $("height").text * size.height
                    )
                  );
            resizedImage(resized);
            $("menubg").remove();
            menuAnimate(sender.super.super);
          }
        }
      }
    ]
  };
}

function resizeLayout(a, b) {
  return (make, view) => {
    make.width.equalTo(sW * 0.25 * 0.75);
    make.height.equalTo(30);
    make.centerY.equalTo(view.super).offset(sH * 0.14 * a);
    make.centerX.equalTo(view.super).offset(sW * 0.14 * b);
  };
}

function menuAnimate(view) {
  if (view.hidden == false)
    $ui.animate({
      duration: 0.5,
      damping: 1,
      velocity: 1,
      animation: () => {
        view.alpha = 0;
      },
      completion: () => {
        view.remove();
      }
    });
  else {
    view.hidden = 0;
    $ui.animate({
      duration: 0.5,
      damping: 0,
      velocity: 1,
      animation: () => {
        view.alpha = 1;
      }
    });
  }
}

function render(img) {
  let size = format(img.info.size),
    MD5 = $text.MD5(img),
    W = img.image.size.width,
    H = img.image.size.height,
    U = H / W >= 0.618,
    pW = (W * sH) / H, //以屏宽的 0.618 为基准缩放
    pH = (H * sW) / W, //以屏宽为基准缩放
    rW = W >= sW,
    rH = H >= sH;
  $ui.render({
    props: {
      navBarHidden: 1,
      statusBarStyle: Number(dark),
      bgcolor: $color(dark ? "black" : "white")
    },
    views: [
      {
        type: "scroll",
        props: {
          bounces: 0,
          bgcolor: $color("clear"),
          scrollEnabled: rW || rH,
          showsVerticalIndicator: 0,
          showsHorizontalIndicator: 0,
          contentSize: $size(rH ? pW : W, rW ? pH : H)
        },
        layout: (make, view) => {
          make.left.right.inset(0);
          make.height.equalTo(sH);
          make.top.equalTo(view.super.safeAreaTop).offset(44);
        },
        events: {
          ready: sender => {
            sender.clipsToBounds = 0;
          },
          tapped: () => {
            $quicklook.open({ data: img });
          }
        },
        views: [
          {
            type: "image",
            props: { data: img, bgcolor: $color("clear") },
            layout: (make, view) => {
              if (!rW && !rH) {
                make.center.equalTo(view.super);
              } else if (U) {
                make.centerX.equalTo(view.super);
                make.width.equalTo(rW ? sW : W);
                make.height.equalTo(rW ? pH : H);
              } else {
                make.centerY.equalTo(view.super);
                make.height.equalTo(rH ? sH : H);
                make.width.equalTo(rH ? pW : W);
              }
            }
          }
        ]
      },
      {
        type: "list",
        props: {
          separatorColor,
          bounces: 0,
          stickyHeader: 1,
          borderWidth: 0.4,
          bgcolor: $color(dark ? "black" : "white"),
          borderColor: $rgba(100, 100, 100, 0.25),
          data: [
            { title: "调整", rows: initList(0) },
            { title: "图床", rows: initList(1) },
            { title: "其他", rows: initList(2) }
          ],
          template: {
            props: { bgcolor: $color("clear") },
            views: [
              {
                type: "label",
                props: {
                  id: "list",
                  textColor: $color(dark ? "white" : "#333")
                },
                layout: (make, view) => {
                  make.centerY.equalTo(view.super);
                  make.top.right.bottom.inset(0);
                  make.left.inset(15);
                }
              }
            ]
          }
        },
        layout: (make, view) => {
          make.left.right.inset(0);
          make.top.equalTo(view.prev.bottom);
          make.bottom.equalTo(view.super.safeAreaBottom).offset(-81);
        },
        events: {
          didSelect: (sender, indexPath) => {
            let sec = indexPath.section,
              row = indexPath.row;
            switch (sec) {
              case 0:
                switch (row) {
                  case 0:
                    if (type == "gif") {
                      $ui.error("暂时不支持 GIF", 0.6);
                      return;
                    }
                    $ui.window.add({
                      type: "view",
                      props: { id: "menubg" },
                      layout: $layout.fill,
                      events: {
                        tapped(sender) {
                          menuAnimate($("resize"));
                          sender.remove();
                        }
                      }
                    });
                    $ui.window.add(imgResize(img));
                    menuAnimate($("resize"));
                    break;
                  case 1:
                    resizedImage(
                      type == "gif" ? gifReverse(img, 1) : reverse(img.image, 1)
                    );
                    break;
                  case 2:
                    resizedImage(
                      type == "gif"
                        ? gifReverse(img, -1)
                        : reverse(img.image, -1)
                    );
                    break;
                  case 3:
                    type == "gif"
                      ? resizedImage(gifPlayback(img))
                      : $ui.error("该图片格式不是 GIF", 0.6);
                    break;
                }
                break;
              case 1:
                switch (row) {
                  case 0:
                    uploadImg(img, row);
                    break;
                  case 1:
                    uploadImg(img, row);
                    break;
                  case 2:
                    console.log(imgurApi);
                    if (imgurApi == "") {
                      setApikey("imgur");
                      imgurApi = $cache.get("imgur") || "";
                    } else uploadImg(img, row);
                    break;
                  case 3:
                    uploadImg(img, row);
                    break;
                  case 4:
                    uploadImg(img, row);
                    break;
                  case 5:
                    uploadImg(img, row);
                    break;
                  case 6:
                    uploadImg(img, row);
                    break;
                  case 7:
                    $ui.menu({
                      items: ["Upload.cc", "SM.MS", "Imgur"],
                      handler: (t, i) => {
                        $input.text({
                          type: $kbType.ascii,
                          placeholder: "输入 Delete Hash/Key",
                          handler: text => {
                            uploadDelete(i, text);
                          }
                        });
                      }
                    });
                    break;
                }
                break;
              case 2:
                switch (row) {
                  case 0:
                    scanQrCode(img.image);
                    break;
                  case 1:
                    tinyPNG(img);
                    break;
                  case 2:
                    removeBg(img);
                    break;
                  case 3:
                    $ui.menu({
                      items: ["PNG", "JPEG"],
                      handler: (t, i) => {
                        i == 0
                          ? $share.sheet(img.image.png)
                          : $share.sheet(img.image.jpg(1.0));
                      }
                    });
                    break;
                  case 4:
                    img2Stk(img.image);
                    break;
                  case 5:
                    $ui
                      .menu(["仅下载 ZIP 格式数据", "下载并转换为 GIF"])
                      .then(res => {
                        if (!res) return;
                        $input.text({
                          type: $kbType.number,
                          placeholder: "填入作品 ID 即可下载",
                          handler: async text => {
                            if (
                              /^([4-9][0-9]{1,2}|[1-9][0-9]{2,7})$/.test(text)
                            )
                              await ugoiSrcDl(text, res.index);
                            else {
                              $ui.error("输入有误");
                              return;
                            }
                          }
                        });
                      });
                    break;
                  case 6:
                    nineColumn(img.image);
                }
                break;
            }
          },
          didLongPress: (sender, indexPath) => {
            if (indexPath.section == 1) {
              if (indexPath.row == 2) setApikey("imgur");
            } else if (indexPath.section == 2) {
              if (indexPath.row == 1) setApikey("tinypng");
              else if (indexPath.row == 2) setApikey("remove");
            }
          }
        }
      },
      {
        type: "blur",
        props: {
          bgcolor: $color("clear"),
          style: dark ? 3 : 5,
          borderWidth: 0.4,
          borderColor: $rgba(100, 100, 100, 0.25)
        },
        layout: (make, view) => {
          make.top.left.right.inset(0);
          make.bottom.equalTo(view.super.safeAreaTop).offset(44);
        },
        views: [
          {
            type: "label",
            props: {
              text: "Img+",
              font: $font("Lato-Medium", 20),
              textColor: $color(dark ? "white" : "tint")
            },
            layout: (make, view) => {
              make.centerX.equalTo(view.super);
              make.centerY.equalTo(view.super.safeArea);
            }
          }
        ],
        events: { tapped: () => $app.close() }
      },
      {
        type: "blur",
        props: {
          style: dark ? 3 : 5,
          bgcolor: $color("clear")
        },
        layout: (make, view) => {
          make.left.right.bottom.inset(0);
          make.top.equalTo(view.super.safeAreaBottom).offset(-81);
        },
        views: [
          {
            type: "label",
            props: {
              text:
                "尺寸:  " +
                W +
                " * " +
                H +
                "   大小:  " +
                size +
                "   类型:  " +
                type.toUpperCase(),
              font: $font(12),
              textColor: $color(dark ? "white" : "#333")
            },
            layout: (make, view) => {
              make.centerX.equalTo(view.super);
              make.centerY.equalTo(view.super).offset(-13.5);
            }
          },
          {
            type: "label",
            props: {
              text: "MD5: ",
              font: $font(12),
              textColor: $color(dark ? "white" : "#333")
            },
            layout: (make, view) => {
              make.left.equalTo(view.prev);
              make.centerY.equalTo(view.super).offset(13.5);
            }
          },
          {
            type: "button",
            props: {
              radius: 10,
              font: $font(11),
              borderWidth: 0.8,
              title: " " + MD5 + " ",
              titleColor: $color(dark ? "white" : "#333"),
              bgcolor: $rgba(200, 200, 200, 0.25),
              borderColor: $rgba(100, 100, 100, 0.25)
            },
            layout: (make, view) => {
              make.left.equalTo(view.prev.right).offset(2);
              make.centerY.equalTo(view.prev);
              make.height.equalTo(20);
            },
            events: {
              tapped(sender) {
                $clipboard.text = MD5;
                $ui.toast("MD5 已复制到剪贴板", 0.6);
              }
            }
          }
        ]
      }
    ]
  });
}

const sizeRB = {
    小: "small",
    中: "medium",
    HD: "hd",
    "4K": "4k",
    自动: "auto"
  },
  typeRB = { 自动: "auto", 汽车: "car", 人物: "person", 产品: "product" };

let _chanRB = $cache.get("chan_rb") || "rgba";
let _typeRB = $cache.get("bg_rb") === undefined ? "" : $cache.get("bg_rb")[1];
let _sizeRB =
  $cache.get("size_rb") === undefined ? "auto" : $cache.get("size_rb")[1];

let formData = {
  format: $cache.get("type_rb") || "",
  bg_color: $cache.get("color_rb") || "",
  channels: _chanRB.toLowerCase(),
  type: _typeRB,
  size: _sizeRB,
  image_url: "",
  image_file_b64: ""
};

function removeBg(img) {
  if (removeApi == "") {
    setApikey("remove");
    removeApi = $cache.get("remove") || "";
  } else {
    $ui.push({
      props: {
        title: "Remove.bg",
        navBarHidden: 1,
        statusBarStyle: Number(dark),
        bgcolor: $color(dark ? "black" : "white")
      },
      //      layout: $layout.fillSafeArea,
      views: [
        {
          type: "list",
          props: {
            separatorColor,
            id: "list_rb",
            bgcolor: $color(dark ? "black" : "white"),
            rowHeight: 64,
            clipsToBounds: 0,
            data: [
              {
                title: "选项",
                id: "list_rb",
                rows: [
                  {
                    α: { text: "输出尺寸" },
                    β: {
                      text:
                        "默认: 小。自动: 最高分辨率(基于图片大小, 订阅计划); 消耗信用点数: 小: 1, 中: 3, HD: 5, 4K: 8"
                    },
                    γ: {
                      text:
                        $cache.get("size_rb") === undefined
                          ? "默认"
                          : $cache.get("size_rb")[0]
                    }
                  },
                  {
                    α: { text: "通道类型" },
                    β: {
                      text:
                        "默认 RGBA, 可选仅 Alpha。Remove.bg 在边缘上应用 RGB 颜色校正，仅用后者会降低图像质量"
                    },
                    γ: { text: $cache.get("chan_rb") || "默认" }
                  },
                  {
                    α: { text: "输出格式" },
                    β: {
                      text:
                        "除非处理后的图片存在透明通道时输出 PNG 格式，默认输出 JPG 格式, 也可以指定"
                    },
                    γ: { text: $cache.get("type_rb") || "默认" }
                  },
                  {
                    α: { text: "前景预判" },
                    β: { text: "可选择裁剪产品, 人物, 汽车, 也可以自动判断" },
                    γ: {
                      text:
                        $cache.get("bg_rb") === undefined
                          ? "自动"
                          : $cache.get("bg_rb")[0]
                    }
                  },
                  {
                    α: { text: "背景颜色" },
                    β: {
                      text:
                        "默认透明, 可指定背景颜色(6 或 3 位 Hex 值,或颜色英文名), 也可为半透明图片指定 8 位 Hex 值"
                    },
                    γ: { text: $cache.get("color_rb") || "默认" }
                  },
                  {
                    α: { text: "剩余额度" },
                    β: {
                      text:
                        "点此刷新信用额度和剩余使用额度, 免费账户每月拥有 50 次处理额度"
                    },
                    γ: { font: $font(10), text: "" }
                  }
                ]
              }
            ],
            template: {
              props: { bgcolor: $color(dark ? "#191919" : "#FFF") },
              views: [
                {
                  type: "label",
                  props: {
                    id: "α",
                    font: $font(16),
                    textColor: $color(dark ? "white" : "#333")
                  },
                  layout: (make, view) => {
                    make.left.inset(15);
                    make.top.inset(8);
                  }
                },
                {
                  type: "label",
                  props: {
                    id: "β",
                    font: $font(10),
                    lines: 2,
                    textColor: $color(dark ? "#A2A2A2" : "darkGray"),
                    align: $align.left
                  },
                  layout: (make, view) => {
                    make.top.equalTo(view.prev.bottom).offset(5);
                    make.left.inset(15);
                    make.width.equalTo(view.super).multipliedBy(0.72);
                  }
                },
                {
                  type: "label",
                  props: {
                    id: "γ",
                    lines: 2,
                    font: $font(12),
                    align: $align.right,
                    textColor: $color(dark ? "white" : "#333")
                  },
                  layout: (make, view) => {
                    make.centerY.equalTo(view.super);
                    make.left.equalTo(view.prev.right);
                    make.right.inset(20);
                  }
                }
              ]
            }
          },
          layout: (make, view) => {
            make.left.right.inset(0);
            make.top.equalTo(view.super.safeAreaTop).offset(44);
            make.bottom.equalTo(view.super.safeAreaBottom).offset(-104);
          },
          events: {
            didSelect: (sender, indexPath, object) => {
              let row = indexPath.row;
              switch (row) {
                case 0:
                  $ui.menu(Object.keys(sizeRB)).then(resp => {
                    if ("index" in resp) {
                      updataCellTitle(row, resp.title);
                      let _size = sizeRB[resp.title];
                      formData.size = _size;
                      $cache.set("size_rb", [resp.title, _size]);
                    }
                  });
                  break;
                case 1:
                  if (object.γ.text != "Alpha") {
                    updataCellTitle(row, "Alpha");
                    formData.channels = "alpha";
                    $cache.set("chan_rb", "Alpha");
                  } else {
                    updataCellTitle(row, "RGBA");
                    formData.channels = "rgba";
                    $cache.set("chan_rb", "RGBA");
                  }
                  break;
                case 2:
                  $ui.menu(["自动", "PNG", "JPG"]).then(resp => {
                    if ("index" in resp) {
                      updataCellTitle(row, resp.title);
                      if (resp.index == 0) formData.format = "auto";
                      else formData.format = resp.title.toLowerCase();
                      $cache.set("type_rb", formData.format);
                    }
                  });
                  break;
                case 3:
                  $ui.menu(Object.keys(typeRB)).then(resp => {
                    if ("index" in resp) {
                      updataCellTitle(row, resp.title);
                      formData.type = typeRB[resp.title];
                      $cache.set("bg_rb", [resp.title, formData.type]);
                    }
                  });
                  break;
                case 4:
                  $input.text().then(resp => {
                    if (resp) {
                      let reg = /^#?[0-9a-zA-Z]{3,}$/;
                      if (reg.test(resp)) {
                        updataCellTitle(row, resp);
                        formData.bg_color = resp;
                        $cache.set("color_rb", resp);
                      } else {
                        $ui.error("输入有误");
                        updataCellTitle(row, "默认");
                        formData.bg_color = "";
                        $cache.remove("color_rb");
                      }
                    }
                  });
                  break;
                case 5:
                  getAccountInfo();
                  break;
              }
            }
          }
        },
        {
          type: "button",
          props: {
            title: "取消",
            font: $font(18),
            bgcolor: $color(dark ? "darkGray" : "tint")
          },
          layout: (make, view) => {
            let width = $device.info.screen.width;
            make.left.inset(8);
            make.height.equalTo(40);
            make.width.equalTo((width - 32) / 3);
            make.top.equalTo(view.super.safeAreaBottom).offset(-48);
          },
          events: {
            tapped: () => {
              $ui.pop();
            }
          }
        },
        {
          type: "button",
          props: {
            title: "恢复默认",
            font: $font(18),
            bgcolor: $color(dark ? "darkGray" : "tint")
          },
          layout: (make, view) => {
            make.centerY.equalTo(view.prev);
            make.height.equalTo(40);
            make.width.equalTo(view.prev);
            make.left.equalTo(view.prev.right).offset(8);
          },
          events: {
            tapped(sender) {
              $cache.remove("chan_rb");
              $cache.remove("bg_rb");
              $cache.remove("size_rb");
              $cache.remove("type_rb");
              $cache.remove("color_rb");
              $ui.pop();
              removeBg(img);
            }
          }
        },
        {
          type: "button",
          props: {
            title: "开始",
            font: $font(18),
            bgcolor: $color(dark ? "darkGray" : "tint")
          },
          layout: (make, view) => {
            make.right.inset(8);
            make.centerY.equalTo(view.prev);
            make.height.equalTo(40);
            make.left.equalTo(view.prev.right).offset(8);
          },
          events: { tapped: () => execute(img) }
        },
        {
          type: "text",
          props: {
            radius: 8,
            font: $font(10),
            textColor: $color(dark ? "#A2A2A2" : "darkGray"),
            text: "准备就绪",
            editable: 0,
            scrollEnabled: 0,
            borderColor: $rgba(100, 100, 100, 0.25),
            borderWidth: 0.2,
            bgcolor: $rgba(200, 200, 200, 0.25)
          },
          layout: (make, view) => {
            make.left.right.inset(8);
            make.bottom.equalTo(view.prev.top).inset(8);
            make.height.equalTo(40);
          }
        },
        {
          type: "blur",
          props: {
            bgcolor: $color("clear"),
            style: dark ? 3 : 5,
            borderWidth: 0.4,
            borderColor: $rgba(100, 100, 100, 0.25)
          },
          layout: (make, view) => {
            make.top.left.right.inset(0);
            make.bottom.equalTo(view.super.safeAreaTop).offset(44);
          },
          views: [
            {
              type: "label",
              props: {
                text: "Remove.bg",
                font: $font("Lato-Medium", 20),
                textColor: $color(dark ? "white" : "tint")
              },
              layout: (make, view) => {
                make.centerX.equalTo(view.super);
                make.centerY.equalTo(view.super.safeArea);
              }
            }
          ]
        }
      ]
    });
  }
}

const updataCellTitle = (row, title) => {
  let temp = $("list_rb").data;
  temp[0].rows[row].γ.text = title;
  $("list_rb").data = temp;
};

function getAccountInfo() {
  let url = "https://api.remove.bg/v1.0/account";
  $http.get({ url: url, header: { "X-Api-Key": removeApi } }).then(resp => {
    console.log(resp);
    if (resp.response.statusCode == 200) {
      let data = resp.data.data.attributes;
      updataCellTitle(
        5,
        `剩余次数 ${data.api.free_calls}\n信用额度 ${data.credits.payg} / ${data.credits.total}`
      );
    } else $("text").text = "查询失败\n" + resp.data.errors[0].title;
  });
}

function execute(img) {
  if (type != "png" && type != "jpg" && type != "jpeg") {
    $ui.error("图片格式错误");
    return;
  } else formData.image_file_b64 = btoa(img);
  $http.post({
    url: "https://api.remove.bg/v1.0/removebg",
    header: { "X-Api-Key": removeApi },
    body: formData,
    progress: p => {
      $("text").text = "已上传 " + Math.round(p * 100) + "%";
      if (p == 1) $("text").text = "上传完毕, 处理中…";
    },
    handler: resp => {
      if (resp.response.statusCode == 200) {
        $("text").text = "处理完毕";
        let data = resp.rawData;
        shareIt(data);
      } else {
        let wrong = resp.data.errors[0];
        $delay(0.0, () => {
          //          let x = wrong.code || wrong.detail;
          //          x = x === undefined ? "" : " | " + x
          $("text").text = wrong.title;
        });
      }
    }
  });
}

function img2Stk(img) {
  $ui.menu(["拉伸", "适应", "填充", "仅调整位置", "设置"]).then(resp => {
    if ("index" in resp) {
      let i = resp.index;
      if (i == 3) {
        let menu = [
          "居中",
          "居上",
          "居下",
          "居左",
          "居右",
          "左上",
          "右上",
          "左下",
          "右下"
        ];
        $ui.menu(menu).then(res => {
          if ("index" in res) img2Sticker(img, res.index + 4);
        });
      } else if (i == 4)
        $ui.menu(["保留透明边缘", "尽可能裁剪边缘"]).then(res => {
          if ("index" in res) {
            $cache.set("marginStyle", res.index);
            $ui.toast("设置完毕");
          }
        });
      else img2Sticker(img, i);
    }
  });
}

function img2Sticker(img, i) {
  let size = img.size;
  let throwStickerMargin = $cache.get("marginStyle") || 1;
  let test = [1, 4, 5, 6, 7, 8].includes(i);
  let frame =
    throwStickerMargin && test ? stickerMargin(size, i) : $rect(0, 0, 512, 512);
  let view = {
      type: "image",
      props: { frame: frame, image: img, contentMode: i }
    },
    _view = $ui.create(view);
  let sticker = _view.snapshotWithScale(1);
  $ui.menu(["预览", "保存", "保存并打开 StickerBot"]).then(res => {
    if ("index" in res) {
      let i = res.index;
      if (i == 0) $quicklook.open({ image: sticker });
      else
        $photo.save({
          data: sticker.png,
          handler: success => {
            if (success) {
              $ui.toast("已保存至相册");
              if (i == 2) $app.openURL("https://t.me/Stickers");
            }
          }
        });
    }
  });
}

function stickerMargin(size, i) {
  let s;
  let h = size.height,
    w = size.width,
    x = w >= h;
  if (i == 1) s = x ? [512, (512 * h) / w] : [(512 * w) / h, 512];
  else if (i == 4) s = [512, Math.min(512, h)];
  else if ([5, 6].includes(i)) s = [Math.min(512, w), 512];
  else if ([7, 8].includes(i)) s = [512, Math.min(512, h)];
  return $rect(0, 0, ...s);
}

async function ugoiSrcDl(pid, isConvert) {
  let { data } = await $http.get(
    `https://www.pixiv.net/ajax/illust/${pid}/ugoira_meta`
  );
  if (data.error) {
    $ui.error("ID 指向的作品不是动图，或者已被删除", 0.6);
    return;
  }
  let dl = await $http.download({
    url: data.body.originalSrc,
    header: { Referer: "https://www.pixiv.net" }
  });
  if (dl.response.statusCode != 200) {
    $ui.error("下载出错，请重试", 0.6);
    return;
  }
  if (!isConvert) {
    $share.sheet([dl.data]);
    return;
  }
  let delay = data.body.frames.map(i => {
    return i.delay;
  });
  ugoira2Gif(dl.data, delay);
}

function ugoira2Gif(ugoira, delay) {
  let folder = `shared://tmp${new Date().valueOf()}`;
  $file.mkdir(folder);
  $archiver
    .unzip({ file: ugoira, dest: folder })
    .then(success => {
      if (success) {
        let list = $file.list(folder);
        for (let i of list) {
          if (!/^0+\d+\.(jpeg|jpg|bmp|png)$/i.test(i)) {
            $ui.error("非法的 Ugoira 数据", 0.6);
            return;
          }
        }
        return list.sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
      } else return;
    })
    .then(list => {
      if (!list) {
        $file.delete(folder);
        return;
      } else {
        if (delay.length != list.length) {
          $ui.error("数据和作品 ID 信息不符", 0.6);
          return;
        }
        let encoder = $objc("YYImageEncoder").invoke("alloc.initWithType", 7);
        for (let i in list) {
          let frame = $file.read(`${folder}/${list[i]}`).image;
          let duration = Number(delay[i]) * 0.001;
          encoder.invoke("addImage:duration", frame.ocValue(), duration);
        }
        let data = encoder.invoke("encode").jsValue();
        shareIt(data);
        $file.delete(folder);
      }
    });
}

function scanQrCode(img) {
  let menu = ["分享文本", "复制文本"];
  let _menu = ["打开链接", "发送邮件", "拨打电话", "发送短信"];
  let i;
  let t = $qrcode.decode(img);
  let c = $detector.link(t);
  if (t == "") {
    $ui.error("未检测出二维码内容", 0.6);
    return;
  } else if (c.length > 0) i = 0;
  else {
    c = t.match(/^([a-zA-Z0-9])(\w|-)+@[a-zA-Z0-9-]+\.([a-zA-Z]{2,6})$/) || [];
    if (c.length > 0) i = 1;
    else {
      c = $detector.phoneNumber(t);
      if (c.length > 0) i = 2;
    }
  }
  typeof i === "number" && menu.push(_menu[i]);
  i === 2 && menu.push(_menu[3]);
  $ui.menu(menu).then(resp => {
    if ("index" in resp) {
      let j = resp.index;
      if (j == 0) $share.sheet(t);
      else if (j == 1) {
        $clipboard.text = t;
        $ui.toast("已复制", 0.6);
      } else {
        if (i === 0) $app.openURL(c[0]);
        else if (i === 1) $app.openURL("mailto:" + c[0]);
        else
          j === 2 ? $app.openURL("tel:" + c[0]) : $app.openURL("sms:" + c[0]);
      }
    }
  });
}

function nineColumn(img) {
  const { width, height } = img.size;
  if (Math.min(width, height) < 3) {
    $ui.error("图片尺寸过小");
    return;
  }
  const w = width / 3,
    h = height / 3,
    locations = [
      [0, 0],
      [-w, 0],
      [-w * 2, 0],
      [0, -h],
      [-w, -h],
      [-w * 2, -h],
      [0, -h * 2],
      [-w, -h * 2],
      [-w * 2, -h * 2]
    ];
  let sets = [];
  for (let i of locations) {
    let view = $ui.create({
      type: "canvas",
      props: {
        frame: $rect(0, 0, w, h)
      },
      views: [
        {
          type: "image",
          props: {
            image: img,
            contentMode: $contentMode.center,
            frame: $rect(...i, width, height)
          }
        }
      ]
    });
    sets.push(view.snapshotWithScale(1));
  }
  $ui.menu({
    items: ["PNG", "JPEG"],
    handler: (t, i) => {
      sets = i == 0 ? sets.map(x => x.png) : sets.map(x => x.jpg(1.0));
      $share.sheet({
        items: sets,
        handler: success => success && $ui.toast("操作完毕")
      });
    }
  });
}

function shareIt(data) {
  $ui.menu(["预览", "分享", "保存"]).then(res => {
    if ("index" in res) {
      if (res.index == 0) $quicklook.open({ data: data });
      else if (res.index == 1)
        $share.sheet({
          items: [data],
          handler: success => success && $ui.toast("已分享", 0.6)
        });
      else
        $photo.save({
          data: data,
          handler: success => success && $ui.toast("已保存至相册", 0.6)
        });
    }
  });
}

(async () => {
  if ($app.env != $env.app) return;
  let res = await $http.get("http://t.cn/AiWvsbMn");
  let ver = res.data.imgp;
  if (ver == 1.91 || ver === undefined) return;
  let { index } = await $ui.alert({
    message: `发现新版本 ${ver}，是否更新？`,
    actions: ["取消", "更新"]
  });
  if (index == 0) return;
  let url = "http://t.cn/AiWPvXAA";
  let name = $addin.current.name;
  let redirURL = `jsbox://import?url=${encodeURIComponent(
    url
  )}&name=${encodeURIComponent(name)}`;
  $app.openURL(redirURL);
  $app.close();
})();
