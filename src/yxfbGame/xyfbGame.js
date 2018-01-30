/**
 * Created by lilu on 2018/1/25.
 */
const xyfbImages = require('./images.js');
const emitter = require('../utils/emitter.js');

//屏幕单位配置
var  clientWidth = wx.getSystemInfoSync()
let ratio = Math.floor(clientWidth.screenWidth*1000/375)/1000

//画图单位配置
var rectLine = 80*ratio

//游戏配置
var config = {
  "gameStartSpeed": 400,
  "gameSpeed": 100,  //游戏速度
  "rectList": [
    {
      x: 0,
      y: 0,
      w: rectLine,
      h: rectLine,
    }, {
      x: rectLine,
      y: 0,
      w: rectLine,
      h: rectLine,
    }, {
      x: rectLine * 2,
      y: 0,
      w: rectLine,
      h: rectLine,
    }, {
      x: rectLine * 3,
      y: 0,
      w: rectLine,
      h: rectLine,
    }, {
      x: rectLine * 3,
      y: rectLine,
      w: rectLine,
      h: rectLine,
    }, {
      x: rectLine * 3,
      y: rectLine * 2,
      w: rectLine,
      h: rectLine,
    }, {
      x: rectLine * 3,
      y: rectLine * 3,
      w: rectLine,
      h: rectLine,
    },
    {
      x: rectLine * 3,
      y: rectLine * 4,
      w: rectLine,
      h: rectLine,
    }, {
      x: rectLine * 2,
      y: rectLine * 4,
      w: rectLine,
      h: rectLine,
    }, {
      x: rectLine,
      y: rectLine * 4,
      w: rectLine,
      h: rectLine,
    }, {
      x: 0,
      y: rectLine * 4,
      w: rectLine,
      h: rectLine,
    },
    {
      x: 0,
      y: rectLine * 3,
      w: rectLine,
      h: rectLine,
    }, {
      x: 0,
      y: rectLine * 2,
      w: rectLine,
      h: rectLine,
    }, {
      x: 0,
      y: rectLine,
      w: rectLine,
      h: rectLine,
    },
  ],
};

function xyfbGame(opts) {
  var ctx = this.ctx = wx.createCanvasContext(opts.id)
  var walked = this.walked = opts.walked
  var isEnd = this.isEnd = opts.isEnd
  let hasred = this.hasred = opts.hasred
  let balance = this.balance = opts.balance
  let count = 1

  //等待动画刷新事件
  var refresh = ()=> {
    drawText()
    drawBoxList();
    drawRedNum()
    drawIsEnd()
    ctx.draw()
  }

  //文字
  function drawText() {
    ctx.setFontSize(17*ratio)
    ctx.setFillStyle('#EBB52B')
    ctx.fillText('按住【开始】按钮', rectLine+12*ratio, rectLine * 1.5)
    ctx.fillText('开始找红包吧', rectLine+rectLine*0.2+12*ratio, rectLine * 2)
    ctx.setFontSize(15*ratio)
    ctx.setFillStyle('#EBB52B')
    ctx.fillText('剩余金额： ¥'+balance, rectLine, rectLine * 3)

  }

  //画红包数量
  function drawRedNum() {
    ctx.setFontSize(12*ratio)
    ctx.setFillStyle('#EBB52B')
    ctx.drawImage(xyfbImages['game_receive_record_bg'].src, rectLine, rectLine*3+rectLine*0.2, rectLine *2, rectLine*0.8)
    ctx.drawImage(xyfbImages['game_receive_record'].src, rectLine, rectLine*3+rectLine*0.2, rectLine*0.6, rectLine*0.6)
    ctx.fillText('已领7／8', rectLine*2, rectLine*3+rectLine*0.7)
  }

  //画大红包
  function drawIsEnd() {
    if (isEnd) {
        ctx.save()
        ctx.setFillStyle('#FFFFFF')
        ctx.setFontSize(24*ratio)
        ctx.drawImage(xyfbImages['share_bg'].src, 0, rectLine, rectLine*4, rectLine*3)
        ctx.fillText('恭喜领到红包咯', rectLine, rectLine * 3)
        ctx.restore()
    }
  }

  //画发光的线条
  function drawLight(item) {
    let center = {
      x: item.x+item.w/2,
      y: item.y+item.h/2,
    }
      if(count<50){
        count = count + 10
      }else{
        count=1
      }
      ctx.save()
      const grd = ctx.createCircularGradient(item.x/2, center.x, center.y)
      grd.addColorStop(0, 'red')
      grd.addColorStop(1, 'white')
      ctx.setLineWidth(5)
      ctx.setStrokeStyle(grd);
      ctx.moveTo(center.x,center.y)
      ctx.lineTo(center.x+count,center.y+count)
      ctx.moveTo(center.x,center.y)
      ctx.lineTo(center.x,center.y+count)
      ctx.moveTo(center.x,center.y)
      ctx.lineTo(center.x+count,center.y)
      ctx.stroke()
      ctx.restore()

  }
  //设置背景
  function drawBoxList() {
    let rectList = config['rectList']
    for (let i = 0; i < rectList.length; i++) {
      let item = rectList[i]
      if (isEnd == true && i == walked) {
        ctx.drawImage(xyfbImages['cellLight'].src, item.x, item.y, item.w, item.h)
        ctx.drawImage(hasred ? xyfbImages["redEnvelopes"].src : xyfbImages["share_bg"].src, item.x - 1, item.y - 1, item.w - 3, item.h - 3)
        // drawLight(item)
      } else if (i == walked) {
        ctx.drawImage(xyfbImages['cellLight'].src, item.x, item.y, item.w, item.h)

      } else {
        ctx.drawImage(xyfbImages['bg'].src, item.x, item.y, item.w, item.h)
      }
    }
  }

  var game = this.game = {}
  game.stop = () => {
    clearInterval(loadingClock);
  }

  //修改选中盒子
  game.changeWalked = (result) => {
    walked = this.walked = result
  }
  //修改结束
  game.changeEnd = (item, item2) => {
    isEnd = this.isEnd = item
    hasred = this.hasred = item2

  }

  //开始动画
  var loadingClock = setInterval(refresh, 50);

}

xyfbGame.prototype.stop = function () {
  this.game.stop()
}

xyfbGame.prototype.changeWalked = function (item) {
  this.game.changeWalked(item)
}

xyfbGame.prototype.changeEnd = function (item, item2) {
  this.game.changeEnd(item, item2)
}
emitter.setup(xyfbGame.prototype);

module.exports = xyfbGame;