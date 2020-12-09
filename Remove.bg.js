const key = "";

//上行引号内填入在 remove.bg 申请的api
//申请地址 http://t.cn/E9cPLXF
//作者 coo11 有问题请通过Telegram反馈 https://t.me/coo11

const size = { 小: "small", 中: "medium", HD: "hd", "4K": "4k", 自动: "auto" },
  type = { 自动: "auto", 汽车: "car", 人物: "person", 产品: "product" };

let _chan = $cache.get("chan") || "rgba";
let _type = $cache.get("bg") === undefined ? "" : $cache.get("bg")[1];
let _size = $cache.get("size") === undefined ? "auto" : $cache.get("size")[1];

let formData = {
    format: $cache.get("type") || "",
    bg_color: $cache.get("color") || "",
    channels: _chan.toLowerCase(),
    type: _type,
    size: _size,
    image_url: "",
    image_file_b64: ""
  },
  imageDataOrUrl;

let img = $context.data,
  pic = $context.image,
  web = $context.safari,
  url = $clipboard.link,
  itm = ["从相册选", "最后一张", "从剪贴板", "当前页面"];

if ($app.env != $env.safari) itm.splice(3, 1);
if (url === undefined) itm.splice(2, 1);
if (img) initImage(img);
else if (pic) initImage(pic.png);
else
  $ui.menu(itm).then(resp => {
    if ("index" in resp) {
      let i = resp.index,
        t = resp.title;
      if (i == 0) pickImage();
      else if (i == 1) lastImage();
      else if (t == "从剪贴板") initImage(url);
      else if (t == "当前页面") {
        let safari = web.items.contentType;
        if (!safari.includes("image")) $ui.error("当前页面不是图片链接");
        else initImage(web.items.baseURI);
      }
    }
  });

const pickImage = () =>
  $photo.pick({
    format: "data",
    handler: resp => {
      let image = resp.data;
      if (image) initImage(image);
    }
  });

const lastImage = () =>
  $photo.fetch({
    count: 1,
    format: "data",
    handler: resp => {
      if (resp[0]) initImage(resp[0]);
    }
  });

function initImage(data) {
  imageDataOrUrl = data;
  render();
}

function render() {
  $ui.render({
    props: {
      title: "Remove.bg"
    },
    layout: $layout.fillSafeArea,
    views: [
      {
        type: "button",
        props: {
          title: "取消",
          font: $font(18),
          tintColor: $color("tint")
        },
        layout: (make, view) => {
          let width = $device.info.screen.width;
          make.bottom.left.inset(8);
          make.height.equalTo(40);
          make.width.equalTo((width - 32) / 3);
        },
        events: {
          tapped(sender) {
            $app.close();
          }
        }
      },
      {
        type: "button",
        props: {
          title: "恢复默认",
          font: $font(18),
          tintColor: $color("darkGray")
        },
        layout: (make, view) => {
          make.bottom.inset(8);
          make.height.equalTo(40);
          make.width.equalTo(view.prev);
          make.left.equalTo(view.prev.right).offset(8);
        },
        events: {
          tapped(sender) {
            $cache.clear();
            $addin.restart();
          }
        }
      },
      {
        type: "button",
        props: {
          title: "开始",
          font: $font(18),
          tintColor: $color("darkGray")
        },
        layout: (make, view) => {
          make.bottom.right.inset(8);
          make.height.equalTo(40);
          make.left.equalTo(view.prev.right).offset(8);
        },
        events: {
          tapped(sender) {
            execute(imageDataOrUrl);
          }
        }
      },
      {
        type: "text",
        props: {
          radius: 8,
          font: $font(10),
          textColor: $color("darkGray"),
          text: "准备就绪",
          editable: 0,
          scrollEnabled: 0,
          borderColor: $rgba(100, 100, 100, 0.25),
          borderWidth: 0.2,
          bgcolor: $color("#f9f9f9")
        },
        layout: (make, view) => {
          make.left.right.inset(8);
          make.bottom.equalTo(view.prev.top).inset(8);
          make.height.equalTo(40);
        }
      },
      {
        type: "list",
        props: {
          id: "",
          rowHeight: 64,
          data: [
            {
              title: "选项",
              rows: [
                {
                  α: { text: "输出尺寸" },
                  β: {
                    text:
                      "默认: 小。自动: 最高分辨率(基于图片大小, 订阅计划); 消耗信用点数: 小: 1, 中: 3, HD: 5, 4K: 8"
                  },
                  γ: {
                    text:
                      $cache.get("size") === undefined
                        ? "默认"
                        : $cache.get("size")[0]
                  }
                },
                {
                  α: { text: "通道类型" },
                  β: {
                    text:
                      "默认 RGBA, 可选仅 Alpha。Remove.bg 在边缘上应用 RGB 颜色校正，仅用后者会降低图像质量"
                  },
                  γ: { text: $cache.get("chan") || "默认" }
                },
                {
                  α: { text: "输出格式" },
                  β: {
                    text:
                      "除非处理后的图片存在透明通道时输出 PNG 格式，默认输出 JPG 格式, 也可以指定"
                  },
                  γ: { text: $cache.get("type") || "默认" }
                },
                {
                  α: { text: "前景预判" },
                  β: { text: "可选择裁剪产品, 人物, 汽车, 也可以自动判断" },
                  γ: {
                    text:
                      $cache.get("bg") === undefined
                        ? "自动"
                        : $cache.get("bg")[0]
                  }
                },
                {
                  α: { text: "背景颜色" },
                  β: {
                    text:
                      "默认透明, 可指定背景颜色(6 或 3 位 Hex 值,或颜色英文名), 也可为半透明图片指定 8 位 Hex 值"
                  },
                  γ: { text: $cache.get("color") || "默认" }
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
            views: [
              {
                type: "label",
                props: {
                  id: "α",
                  font: $font(16),
                  textColor: $color("#333")
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
                  textColor: $color("darkGray"),
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
                  textColor: $color("#333")
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
          make.top.left.right.inset(0);
          make.bottom.equalTo(view.prev.top).inset(8);
        },
        events: {
          didSelect: (sender, indexPath, object) => {
            let row = indexPath.row;
            switch (row) {
              case 0:
                $ui.menu(Object.keys(size)).then(resp => {
                  if ("index" in resp) {
                    updataCellTitle(row, resp.title);
                    let _size = size[resp.title];
                    formData.size = _size;
                    $cache.set("size", [resp.title, _size]);
                  }
                });
                break;
              case 1:
                if (object.γ.text != "Alpha") {
                  updataCellTitle(row, "Alpha");
                  formData.channels = "alpha";
                  $cache.set("chan", "Alpha");
                } else {
                  updataCellTitle(row, "RGBA");
                  formData.channels = "rgba";
                  $cache.set("chan", "RGBA");
                }
                break;
              case 2:
                $ui.menu(["自动", "PNG", "JPG"]).then(resp => {
                  if ("index" in resp) {
                    updataCellTitle(row, resp.title);
                    if (resp.index == 0) formData.format = "auto";
                    else formData.format = resp.title.toLowerCase();
                    $cache.set("type", formData.format);
                  }
                });
                break;
              case 3:
                $ui.menu(Object.keys(type)).then(resp => {
                  if ("index" in resp) {
                    updataCellTitle(row, resp.title);
                    formData.type = type[resp.title];
                    $cache.set("bg", [resp.title, formData.type]);
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
                      $cache.set("color", resp);
                    } else {
                      $ui.error("输入有误");
                      updataCellTitle(row, "默认");
                      formData.bg_color = "";
                      $cache.remove("color");
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
      }
    ]
  });
}

const updataCellTitle = (row, title) => {
  let temp = $("list").data;
  temp[0].rows[row].γ.text = title;
  $("list").data = temp;
};

function getAccountInfo() {
  let url = "https://api.remove.bg/v1.0/account";
  $http.get({ url: url, header: { "X-Api-Key": key } }).then(resp => {
    if (resp.response.statusCode == 200) {
      let data = resp.data.data.attributes;
      let t = data.credits.total,
        p = data.credits.payg,
        f = data.api.free_calls;
      updataCellTitle(5, `剩余次数 ${f}\n信用额度 ${p} / ${t}`);
    } else $("text").text = "查询失败\n" + resp.data.errors[0].title;
  });
}

function execute(data) {
  let type;
  if (typeof data == "object") {
    type = data.info.mimeType.replace("image/", "").toLowerCase();
    if (type != "png" && type != "jpg" && type != "jpeg") {
      $ui.error("图片格式错误");
      return;
    } else formData.image_file_b64 = btoa(data);
  } else formData.image_url = data;
  $http.post({
    url: "https://api.remove.bg/v1.0/removebg",
    header: { "X-Api-Key": key },
    body: formData,
    progress: p => {
      $("text").text = "已上传 " + Math.round(p * 100) + "%";
      if (p == 1) $("text").text = "上传完毕, 处理中…";
    },
    handler: resp => {
      if (resp.response.statusCode == 200) {
        $("text").text = "处理完毕";
        let data = resp.rawData;
        $ui.menu(["预览", "分享", "保存"]).then(resp => {
          if ("index" in resp) {
            let i = resp.index;
            if (i == 0) $quicklook.open({ data: data });
            else if (i == 1) $share.sheet(data);
            else {
              $photo.save({
                data: data,
                handler: resp => {
                  $("text").text = "已保存至相册";
                }
              });
            }
          }
        });
        console.log(resp.data);
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
