$app.theme = "auto";

/*
 * 因联通的支付宝小程序查询接口的改动，该脚本已失效。
 * 新的接口只能获取余额、已用流量和剩余语音三个数据，
 * 并且测试发现 Cookie 有效期不超过一天。
 */

/* 👇 引号内填入联通号码，不需要加 +86 */
let tel = "";

/*
- 使用前请确定已经登陆过联通支付宝小程序，建议小组件折叠使用或者设置高度 180
- 作者 coo11 有问题请通过 Telegram 反馈 https://t.me/coo11 
*/

let queryTime = "-";
let remainFee = "-";
let comboName = "查询中, 请稍候…";

let s1 = 0;
let s2 = 0;
let used = [0, 0, 0];
let quota = [1, 1, 1];
let remain = [1, 1, 1];
let pieData = [[], [], [], []];
let miniData = [
  ["剩余語音", "?", "分"],
  ["話費余額", "?", "元"],
  ["流量剩余", "?", "TB"]
];

const dark = Number($device.isDarkMode);
const textColor = $color(dark ? "#FFF" : "#333");
const color = $color(dark ? "white" : "darkGray");
const ver = parseInt($device.info.version.split(".")[0]) - 12;

let bgcolor;
if ($app.env == 2) {
  ver ? (bgcolor = $color("clear")) : (bgcolor = $rgba(255, 255, 255, 0.28));
} else {
  dark ? (bgcolor = $color("black")) : $color("white");
}

let feeLabel = $objc("UILabel").$new();
feeLabel.$setFont($font(18));
setupfeeLabel("?");

let Micheal = $objc("UILabel").$new();
let Gabriel = $objc("UILabel").$new();
let Lucifer = $objc("UILabel").$new();
setupMiniLabel(miniData[0], Micheal);
setupMiniLabel(miniData[1], Gabriel);
setupMiniLabel(miniData[2], Lucifer);

let callDescription, flowDescription;

let details = `https://mina.10010.com/wxapplet/bind/getCombospare/alipay/alipaymini?stoken=&user_id=${tel}`;
let fee = `https://mina.10010.com/wxapplet/bind/getCurrFare/alipay/alipaymini?stoken=&user_id=${tel}`;
let basic = `https://mina.10010.com/wxapplet/bind/getIndexData/alipay/alipaymini?user_id=${tel}`;

$http.get(details).then(resp => {
  if (resp.data != "" && resp.data.woFeePolicy !== null) {
    console.log(resp.data);
    (used = [0, 0, 0]), (quota = [0, 0, 0]), (remain = []);
    queryTime = resp.data.queryTime;
    let det = resp.data.woFeePolicy;
    for (const i in det) {
      if (i == "indexVf") {
        $ui.error("AOBH! Restart or Clear APP Cache!", 3);
        return;
      }
      let allVal = det[i].addUpUpper;
      let resType = det[i].resourceType;
      !Number(allVal) && resType == "M0" && (allVal = "1024"); //米粉卡不会正确显示日租包配额。
      if (allVal != 0) {
        let type = det[i].elemType,
          useVal = det[i].xUsedValue,
          typeName = det[i].feePolicyName,
          canUseVal =
            resType == "M0" ? allVal - useVal : det[i].canUseResourceVal, // Same as the former comment
          unit = det[i].totalUnitVal;
        if (type == 3) {
          quota[2] += parseFloat(allVal);
          if (canUseVal != 0) {
            if (det[i].canUseUnitVal == "GB") canUseVal = canUseVal * 1024;
            pieData[2].push([typeName, Number(canUseVal), "MB"]);
          }
          if (useVal != 0) {
            if (det[i].usedUnitVal == "GB") useVal = useVal * 1024;
            used[2] += parseFloat(useVal);
            pieData[2].unshift([typeName + " 已用", Number(useVal), "MB"]);
          }
        } else {
          quota[type - 1] += parseInt(allVal);
          used[type - 1] += parseInt(useVal);
          if (canUseVal != 0)
            pieData[type - 1].push([typeName, Number(canUseVal), unit]);
          if (useVal != 0)
            pieData[type - 1].unshift([
              typeName + " 已用",
              Number(useVal),
              unit
            ]);
        }
      }
    }
    used.forEach((ele, i) => {
      remain.push(quota[i] - ele);
    });
    const setUnit = i => {
      if (i < 1024) return i.toFixed(2) + " MB";
      else return (i / 1024).toFixed(2) + " GB";
    };
    callDescription =
      "已用 " +
      used[0] +
      " 分钟 剩余 " +
      remain[0] +
      " 分钟 配额 " +
      quota[0] +
      " 分钟";
    flowDescription =
      "已用 " +
      setUnit(used[2]) +
      "  剩余 " +
      setUnit(remain[2]) +
      "  合计 " +
      setUnit(quota[2]);
    let rFlow = setUnit(remain[2]).split(" ");
    miniData[2][1] = rFlow[0];
    miniData[2][2] = rFlow[1];
    $("α").views[2].text = `截止至 ${queryTime}`;
    $("β").views[2].text = callDescription;
    $("β").userInteractionEnabled = 1;
    $("γ").views[2].text = flowDescription;
    $("γ").userInteractionEnabled = 1;
    (s1 = 1), updateStatus();
  }
});

function reloadProgress(id, t) {
  $ui.animate({
    duration: 0.6,
    delay: 0.3,
    animation: () => {
      id.views[0].views[0].alpha = 0;
      id.views[0].views[0].remove();
    },
    completion: () => {
      id.views[0].add({
        type: "progress",
        props: {
          radius: 2,
          progressColor: $color("#4DD964"),
          trackColor: $color("clear")
        },
        layout: (make, view) => {
          make.top.left.right.inset(1.6);
          make.height.equalTo(4.8);
          make.centerY.equalTo(view.super);
        },
        events: {
          ready: sender => {
            let val = remain[t] / quota[t];
            if (val < 0.2) sender.progressColor = $color("red");
            $delay(0.0, () => {
              $ui.animate({
                duration: 1.2,
                velocity: 0,
                damping: 0,
                animation: () => {
                  sender.value = val;
                  sender.relayout();
                }
              });
            });
          }
        }
      });
    }
  });
}

$http.get(basic).then(resp => {
  if (resp.data != "" && resp.data.dataList !== null) {
    console.log(resp.data);
    comboName = resp.data.packageName;
    remainFee = resp.data.dataList[0].number;
    comboName.replace(/（(.*?)）/, "($1)");
    $("α").views[1].text = comboName;
    setupfeeLabel(String(remainFee));
    miniData[1][1] = remainFee;
    miniData[0][1] = resp.data.dataList[2].number;
    s2 = 1;
    updateStatus();
  }
});

const updateStatus = () => {
  if (s1 === 1 && s2 === 1) {
    $delay(0.0, () => {
      $("super")
        .ocValue()
        .$layoutSubviews();
    });

    (s1 = 0), (s2 = 0);
    reloadProgress($("β"), 0);
    reloadProgress($("γ"), 2);
    $("banner").views[0].text = `截止至 ${queryTime}`;
    setupMiniLabel(miniData[0], Micheal);
    setupMiniLabel(miniData[1], Gabriel);
    setupMiniLabel(miniData[2], Lucifer);
  }
};

$http.get(fee).then(resp => {
  if (resp.data != "" && resp.data.fee !== null) {
    console.log(resp.data);
    let fe = resp.data.realfeeinfo[0].itemInfo;
    pieData[3].push(["话费余额", Number(resp.data.balance), "元"]);
    for (const i in fe) {
      if (fe[i].integrateFee != 0)
        pieData[3].unshift([
          fe[i].integrateItemName,
          Number(fe[i].integrateFee),
          "元"
        ]);
    }
    $("α").userInteractionEnabled = 1;
  }
});

function setupfeeLabel(fee) {
  const text = `话费余额 ${fee} 元`;
  let string = $objc("NSMutableAttributedString")
    .$alloc()
    .$initWithString(text);
  string.$addAttribute_value_range(
    "NSFont",
    $font("Georgia-Bold", 20),
    $range(text.indexOf(fee), fee.length)
  );
  string.$addAttribute_value_range(
    "NSColor",
    textColor,
    $range(0, text.length)
  );
  feeLabel.$setAttributedText(string);
}

function setupMiniLabel(arr, miniLabel) {
  const text = `${arr[0]}\n ${arr[1]} ${arr[2]}`;
  const range = $range(0, text.length);
  let string = $objc("NSMutableAttributedString")
    .$alloc()
    .$initWithString(text);
  string.$setAlignment_range($align.center, range);
  const style = ["HiraMinProN-W3", "Georgia-Bold", "HiraMinProN-W3"];
  for (let i = 0; i < arr.length; i++) {
    const font = $font(style[i], 20 - i * 2),
      range = $range(text.indexOf(arr[i]), arr[i].length);
    string.$addAttribute_value_range("NSFont", font, range);
  }
  string.$addAttribute_value_range("NSColor", color, range);
  string.$addAttribute_value_range(
    "NSColor",
    textColor,
    $range(text.indexOf(arr[1]), arr[1].length)
  );
  let para = $objc("NSMutableParagraphStyle").$new();
  para.$setParagraphSpacing(5);
  para.$setAlignment($align.center);
  string.$addAttribute_value_range("NSParagraphStyle", para, range);
  miniLabel.$setAttributedText(string);
}

$ui.render({
  props: {
    id: "super",
    title: "10010+",
    bgcolor,
    navButtons: [
      {
        icon: "062",
        handler: () => support()
      }
    ]
  },
  layout: $layout.fillSafeArea,
  events: {
    layoutSubviews: view => {
      if ($app.env == $env.today && $widget.mode == 0) {
        $("∑").alpha = 0;
        $("∑").hidden = 1;
        $ui.animate({
          duration: 0.3,
          animation: () => {
            $("banner").updateLayout((make, view) => {
              make.bottom
                .equalTo(view.super.top)
                .offset(view.super.frame.height);
              make.height.equalTo(view.super.frame.height);
            });
            $("banner").relayout();
            if ($("blur")) $("blur").alpha = 0;
          },
          completion: () => {
            if ($("blur")) $("blur").remove();
          }
        });
      } else {
        if ($app.env == $env.today) {
          $("banner").updateLayout((make, view) => {
            make.bottom.equalTo(view.super.top);
          });
          $("∑").hidden = 0;
          $delay(0.0, () => {
            $("super").setNeedsLayout();
            $ui.animate({
              duration: 0.8,
              animation: () => {
                $("∑").alpha = 1;
              }
            });
          });
        }

        //      let inset = 1.0 / $device.info.screen.scale;
        let H = $("∑").frame.height;
        let W = $("∑").frame.width;
        let h = H * 0.3;
        let w = W - 40;
        for (const v in $("∑").views) {
          $("∑").views[v].frame = $rect(20, H * 0.05 + v * h, w, h);
        }

        const getSize = (t, i) =>
          $text.sizeThatFits({ text: t, width: 520.1314, font: $font(i) });

        let ff = 50;
        let gf = $("Δ").frame.width == 0 ? $rect(0, 6, 110, 24) : $("Δ").frame;
        let _w1 = w - gf.width - 5;
        let tef = comboName;
        let _1f = getSize(tef, 25);
        if (_1f.width > _w1) {
          while (getSize(tef, ff / 2).width > _w1) ff--;
          _1f = getSize(tef, ff / 2);
        }
        $("α").views[1].font = $font(ff / 2).rawValue();

        $("α").views[1].frame = $rect(
          w - _1f.width,
          h * 0.4 + 12 - _1f.height,
          _1f.width,
          _1f.height
        );

        let stf = 24;
        let _w2 = w - 80;
        let tes = $("β").views[2].text;
        let tet = $("γ").views[2].text;
        let _2s = getSize(tes, 12);
        let _2t = getSize(tet, 12);
        let widthest = Math.max(_2s.width, _2t.width);
        if (widthest > _w2) {
          while (
            getSize(widthest == _2s.width ? tes : tet, stf / 2).width > _w2
          )
            stf--;
        }
        _2s = getSize(tes, stf / 2);
        _2t = getSize(tet, stf / 2);
        let fz = $font(stf / 2).rawValue();
        $("α").views[2].font = fz;
        $("β").views[2].font = fz;
        $("γ").views[2].font = fz;

        console.log($("α").views[0].frame);

        let v0 = $rect(0, (h * 2) / 3 - 4, w, 8);
        const rectV2 = (x, y) => $rect(w - x, (h * 2) / 3 - 9 - y, x, y);
        $("β").views[0].frame = v0;
        $("β").views[2].frame = rectV2(_2s.width, _2s.height);
        $("γ").views[0].frame = v0;
        $("γ").views[2].frame = rectV2(_2t.width, _2t.height);
      }
    }
  },
  views: [
    {
      type: "view",
      props: {
        id: "banner",
        color: $color("clear")
      },
      layout: (make, view) => {
        make.left.right.inset(0);
        make.bottom.equalTo(view.super.top);
      },
      views: [
        {
          type: "label",
          props: {
            text: "査詢中, 請稍候…",
            textColor: color,
            font: $font("HiraMinProN-W3", 12)
          },
          layout: (make, view) => {
            make.centerX.equalTo(view.super);
            make.top.inset(0);
          }
        },
        {
          type: "runtime",
          props: { view: Micheal, lines: 2, align: $align.center },
          layout: (make, view) => {
            make.height.equalTo(view.super);
            make.width.equalTo(view.super).dividedBy(3);
            make.left.top.inset(0);
          }
        },
        separateLine(),
        {
          type: "runtime",
          props: { view: Gabriel, lines: 2, align: $align.center },
          layout: (make, view) => {
            make.height.equalTo(view.super);
            make.width.equalTo(view.super).dividedBy(3);
            make.center.equalTo(view.super);
          }
        },
        separateLine(),
        {
          type: "runtime",
          props: { view: Lucifer, lines: 2, align: $align.center },
          layout: (make, view) => {
            make.height.equalTo(view.super);
            make.width.equalTo(view.super).dividedBy(3);
            make.right.top.inset(0);
          }
        }
      ]
    },
    {
      type: "view",
      props: { id: "∑" },
      layout: (make, view) => {
        make.top.equalTo(view.prev.bottom);
        make.left.right.inset(0);
        make.bottom.equalTo(view.super.top).offset(180);
      },
      events: {
        ready: () => {
          if ($app.env == $env.app)
            $delay(0.0, () => {
              $("super")
                .ocValue()
                .$layoutSubviews();
            });
        }
      },
      views: [
        {
          type: "views",
          props: { id: "α" },
          views: [
            {
              type: "runtime",
              props: { id: "Δ", view: feeLabel },
              layout: (make, view) => {
                make.centerY.equalTo(view.super).offset(-5);
                make.left.inset(0);
                make.height.equalTo(24);
              }
            },
            {
              type: "label",
              props: { text: comboName, textColor }
            },
            {
              type: "label",
              props: { textColor },
              layout: make => {
                make.right.bottom.inset(0);
              }
            }
          ],
          events: {
            ready: sender => {
              sender.userInteractionEnabled = 0;
            },
            tapped(sender) {
              if ($app.env == $env.today) $widget.height = 240;
              showPie("余额明细", pieData[3]);
            }
          }
        },
        {
          type: "views",
          props: { id: "β" },
          views: useProgress("语音时长"),
          events: {
            ready: sender => {
              sender.userInteractionEnabled = 0;
            },
            tapped(sender) {
              if ($app.env == $env.today) $widget.height = 240;
              showPie("语音明细", pieData[0]);
            }
          }
        },
        {
          type: "views",
          props: { id: "γ" },
          views: useProgress("流量使用", 0.9),
          events: {
            ready: sender => {
              sender.userInteractionEnabled = 0;
            },
            tapped(sender) {
              if ($app.env == $env.today) $widget.height = 240;
              showPie("余额明细", pieData[2]);
            }
          }
        }
      ]
    }
  ]
});

function separateLine() {
  return {
    type: "label",
    props: { radius: 1, bgcolor: color },
    layout: (make, view) => {
      make.width.equalTo(1);
      make.height.equalTo(view.super).multipliedBy(0.6);
      make.left.equalTo(view.prev.right).offset(-0.5);
      make.centerY.equalTo(view.super);
    }
  };
}

function useProgress(title, dly = 0.3) {
  return [
    {
      type: "label",
      props: {
        radius: 3,
        borderWidth: 1.5,
        bgcolor: $color("clear"),
        borderColor: dark ? $color("#A2A2A2") : $rgba(100, 100, 100, 0.25)
      },
      views: [
        {
          type: "progress",
          props: {
            radius: 2,
            progressColor: $color("#4DD964"),
            trackColor: $color("clear")
          },
          layout: (make, view) => {
            make.centerY.equalTo(view.super);
            make.left.right.inset(1.6);
            make.height.equalTo(4.8);
          },
          events: {
            ready: sender => {
              $delay(dly, () => {
                $ui.animate({
                  duration: 1.2,
                  velocity: 0,
                  damping: 1,
                  options: 26,
                  animation: () => {
                    sender.value = 1;
                    sender.relayout();
                  }
                });
              });
            }
          }
        }
      ]
    },
    {
      type: "label",
      props: { text: title, font: $font(18), textColor },
      layout: (make, view) => {
        make.size.equalTo($size(72, 20));
        make.left.inset(0);
        make.bottom.equalTo(view.prev.top).offset(-4.5);
      }
    },
    { type: "label", props: { font: $font(12), textColor } }
  ];
}

function showPie(qName, pie) {
  $ui.window.add({
    type: "blur",
    props: {
      style: dark ? 3 : 1,
      alpha: 0,
      radius: 8
    },
    layout: (make, view) => {
      make.right.bottom.equalTo(view.super.safeArea).offset(-4);
      make.left.top.equalTo(view.super.safeArea).offset(4);
    },
    views: [
      {
        type: "chart",
        props: { options: getPieData(qName, pie) },
        layout: (make, view) => {
          make.center.equalTo(view.super);
          make.width.equalTo(view.super);
          make.height.equalTo(240);
        },
        events: {
          ready: sender => {
            sender.views[0].transparent = 1;
            sender.views[0].bounces = 0;
            sender.userInteractionEnabled = 1;
          }
        }
      },
      {
        type: "button",
        props: {
          icon: $icon("225", textColor, $size(22, 22)),
          bgcolor: $color("clear")
        },
        layout: make => make.top.right.inset(6),
        events: {
          tapped(sender) {
            if ($app.env == $env.today) $widget.height = 180;
            $ui.animate({
              duration: 0.4,
              animation: () => {
                $("blur").alpha = 0;
              },
              completion: () => {
                $("blur").remove();
              }
            });
          }
        }
      }
    ]
  });
  $ui.animate({
    duration: 0.4,
    animation: () => ($("blur").alpha = 1)
  });
}

function getPieData(qName, pieData) {
  return {
    title: {
      text: qName,
      left: "center",
      top: 10,
      textStyle: { color: textColor.hexCode }
    },
    legend: {
      type: "scroll",
      orient: "vertical",
      width: 50,
      right: 20,
      bottom: 10,
      height: 140,
      formatter: x => {
        if (!x) return "";
        if (x.length > 8) x = x.slice(0, 7) + "...";
        return x;
      },
      tooltip: { show: 1 },
      itemWidth: 10,
      itemHeight: 10,
      pageIcons: {
        vertical: ["M0,0L12,-10L12,10z", "M0,0L-12,-10L-12,10z"]
      },
      pageIconSize: [12, 12],
      pageButtonGap: 6,
      textStyle: { textSize: 10, color: textColor.hexCode }
    },
    tooltip: {
      confine: 1,
      trigger: "item",
      formatter: y => {
        return (
          "<div class='showBox'>" +
          y.marker +
          y.seriesName +
          " " +
          y.value[1] +
          " " +
          y.value[2] +
          "<br/>" +
          y.name +
          "</div>"
        );
      },
      textStyle: { fontSize: 12 }
    },
    dataset: { source: pieData },
    series: [
      {
        type: "pie",
        name: qName,
        radius: 54,
        containLabel: 1,
        center: ["36%", "60%"],
        avoidLabelOverlap: 1,
        stillShowZeroSum: 0,
        itemStyle: {
          normal: {
            shadowBlur: 200,
            shadowColor: "rgba(100, 100, 100, 0.5)"
          }
        },
        label: {
          normal: {
            formatter(z) {
              let text = z.name;
              return text.length < 4
                ? text
                : `${text.slice(0, 4)}\n${text.slice(4)}`;
            },
            textStyle: {
              textShadowColor: "rgba(255, 255, 255, 1)",
              textShadowBlur: 15,
              align: "left",
              fontSize: 8,
              color: textColor.hexCode
            }
          }
        }
      }
    ]
  };
}

$app.tips("在统计视图中轻点右上角即可关闭。");

function support() {
  $ui.push({
    type: "view",
    props: {},
    layout: $layout.fill,
    views: [
      {
        type: "label",
        props: {
          text: "10010+",
          font: $font(72),
          align: $align.right
        },
        layout: make => {
          make.top.left.inset(30);
        }
      },
      {
        type: "label",
        props: {
          text: "感谢使用与支持。",
          font: $font("bold", 36),
          align: $align.right
        },
        layout: (make, view) => {
          make.top.equalTo(view.prev.bottom);
          make.left.inset(30);
        }
      },
      {
        type: "label",
        props: {
          lines: 2,
          text:
            "Made by coo11. Tap here to \nreport a bug via Telegram: @coo11",
          font: $font("bold", 14),
          align: $align.left
        },
        layout: (make, view) => {
          make.top.equalTo(view.prev.bottom).offset(10);
          make.left.right.inset(30);
        },
        events: {
          tapped(sender) {
            $app.openURL("https://t.me/coo11");
          }
        }
      },
      {
        type: "button",
        props: {
          bgcolor: $color("clear"),
          icon: $icon("074", $color("#1F95D3"), $size(75, 75))
        },
        layout: (make, view) => {
          make.left.inset(30);
          make.width.height.equalTo(75);
          make.top.equalTo(view.prev.bottom).offset(10);
        },
        events: {
          tapped(sender) {
            $ui.alert({
              message: "通过支付宝打赏",
              actions: [
                {
                  title: "好的",
                  handler: () => {
                    $app.openURL("http://t.cn/EXOp1a6");
                  }
                },
                { title: "算了" }
              ]
            });
          }
        }
      },
      {
        type: "button",
        props: {
          bgcolor: $color("clear"),
          icon: $icon("189", $color("#22AB39"), $size(75, 75))
        },
        layout: (make, view) => {
          make.centerY.equalTo(view.prev);
          make.width.height.equalTo(75);
          make.left.equalTo(view.prev.right).offset(30);
        },
        events: {
          tapped(sender) {
            $ui.alert({
              message: "通过微信打赏",
              actions: [
                {
                  title: "好的",
                  handler: () => {
                    $http.download({
                      url: "http://t.cn/EKWvgZs",
                      handler: resp => {
                        $photo.save({
                          data: resp.data,
                          handler: () => {
                            $app.openURL("weixin://scanqrcode");
                          }
                        });
                      }
                    });
                  }
                },
                { title: "算了" }
              ]
            });
          }
        }
      }
    ]
  });
}
