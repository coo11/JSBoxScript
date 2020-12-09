let pic = $context.dataItems;

if (pic) {
  isHorizontal(pic[0]);
} else {
  $ui.menu({
    items: ["从相册选", "最后一张"],
    handler: (title, idx) => {
      idx == 0 ? pickImage() : lastImage();
    }
  });
}

async function pickImage() {
  let resp = await $photo.pick({ format: "data" });
  isHorizontal(resp.data);
}

async function lastImage() {
  let resp = await $photo.fetch({
    count: 1,
    format: "data"
  });
  isHorizontal(resp[0]);
}

function isHorizontal(data) {
  $ui.menu({
    items: ["水平翻转", "垂直翻转"],
    handler: (t, i) => {
      i == 0 ? getType(data, 1) : getType(data, -1)
    }
  })
}

function getType(data, i) {
  console.log(data.image.scale)
  console.log(data.image.size)
  let type = data.info.mimeType
  let imagedata = type == "image/gif" ? gifReverse(data, i) : reverse(data.image, i)
  let outputImage
  if (type == "image/gif") outputImage = imagedata;
  else if (type == "image/png") outputImage = imagedata.png;
  else outputImage = imagedata.jpg(1.0)
  console.log(outputImage.image.size)
  $photo.save({
    data: outputImage,
    handler: (success)=>{
      $ui.toast("已保存到相册",0.6)
    }
  })
}
function reverse(image, i) {
  let size = image.size,
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
          props: {
            frame: frame
          },
          events: {
            draw: function(view, ctx) {
              ctx.scaleCTM(-i, i);
              i == 1
                ? ctx.translateCTM(-size.width, 0)
                : ctx.translateCTM(0, -size.height);
              ctx.drawImage(frame, image);
            }
          }
        }
      ]
    },
    canvas = $ui.create(view);
    let reversed = canvas.snapshotWithScale(1);
  return reversed;
}

let encoder = $objc("YYImageEncoder").invoke("alloc.initWithType", 7); // 7 -> YYImageTypeGIF

function gifReverse(data, _i) {
  let decoder = $objc("YYImageDecoder").invoke(
    "decoderWithData:scale",
    data,
    1
  );
  let frameCount = decoder.invoke("frameCount");
  let _frame, rFrame;
  for (let i = 0; i < frameCount; i++) {
    let duration = decoder.invoke("frameDurationAtIndex", i);
    let frame = decoder.invoke("frameAtIndex:decodeForDisplay", i, 0);
    _frame = frame.invoke("image").rawValue();
    rFrame = reverse(_frame, _i);
    $("temp").remove()
    encoder.invoke("addImage:duration", rFrame.runtimeValue(), duration);
  }
  return encoder.invoke("encode").rawValue();
}
