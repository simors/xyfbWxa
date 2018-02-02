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
      src: xyfbImages['game_item_list'][1]
    }, {
      x: rectLine,
      y: 0,
      w: rectLine,
      h: rectLine,
      src: xyfbImages['game_item_list'][2]
    }, {
      x: rectLine * 2,
      y: 0,
      w: rectLine,
      h: rectLine,
      src: xyfbImages['game_item_list'][3]
    }, {
      x: rectLine * 3,
      y: 0,
      w: rectLine,
      h: rectLine,
      src: xyfbImages['game_item_list'][4]
    }, {
      x: rectLine * 3,
      y: rectLine,
      w: rectLine,
      h: rectLine,
      src: xyfbImages['game_item_list'][5]
    }, {
      x: rectLine * 3,
      y: rectLine * 2,
      w: rectLine,
      h: rectLine,
      src: xyfbImages['game_item_list'][7]
    }, {
      x: rectLine * 3,
      y: rectLine * 3,
      w: rectLine,
      h: rectLine,
      src: xyfbImages['game_item_list'][2]
    },
    {
      x: rectLine * 3,
      y: rectLine * 4,
      w: rectLine,
      h: rectLine,
      src: xyfbImages['game_item_list'][1]
    }, {
      x: rectLine * 2,
      y: rectLine * 4,
      w: rectLine,
      h: rectLine,
      src: xyfbImages['game_item_list'][4]
    }, {
      x: rectLine,
      y: rectLine * 4,
      w: rectLine,
      h: rectLine,
      src: xyfbImages['game_item_list'][5]
    }, {
      x: 0,
      y: rectLine * 4,
      w: rectLine,
      h: rectLine,
      src: xyfbImages['game_item_list'][6]
    },
    {
      x: 0,
      y: rectLine * 3,
      w: rectLine,
      h: rectLine,
      src: xyfbImages['game_item_list'][7]
    }, {
      x: 0,
      y: rectLine * 2,
      w: rectLine,
      h: rectLine,
      src: xyfbImages['game_item_list'][8]
    }, {
      x: 0,
      y: rectLine,
      w: rectLine,
      h: rectLine,
      src: xyfbImages['game_item_list'][0]
    },
  ],
};

function xyfbGame(opts) {
  var ctx = this.ctx = wx.createCanvasContext(opts.id)
  var walked = this.walked = opts.walked
  var isEnd = this.isEnd = opts.isEnd
  let hasred = this.hasred = opts.hasred
  let balance = this.balance = opts.balance
  let luckyDip = this.luckyDip = opts.luckyDip
  let count = 1
  let animationR = this.animationR = 0
  let loadingClock = this.loadingClock = undefined
  let animationClock = this.animationClock = undefined
  for(let i = 0;i<config.rectList.length;i++){
    let roundNum = Math.round(Math.random()*11)
    config.rectList[i].src = xyfbImages['game_item_list'][roundNum]
  }

  //等待动画刷新事件
  var refresh = ()=> {
    drawText()
    drawBoxList();
    drawRedNum()
    // drawIsEnd()
    // console.log('here is clock')
    ctx.draw()
  }

  //文字
  function drawText() {
    if(luckyDip&&luckyDip.remain<=0){
      ctx.setFontSize(17*ratio)
      ctx.setFillStyle('#EBB52B')
      ctx.setTextAlign('center')
      ctx.fillText('这波福包已领完', rectLine*2, rectLine * 1.8)
      ctx.fillText('大家还在等你的福', rectLine*2, rectLine * 2.2)
      ctx.fillText('包呢！', rectLine*2, rectLine * 2.6)
    }else{
      ctx.setFontSize(17*ratio)
      ctx.setFillStyle('#EBB52B')
      ctx.setTextAlign('center')
      ctx.fillText('按住【开始】按钮', rectLine*2, rectLine * 1.5)
      ctx.fillText('开始找福包吧', rectLine*2, rectLine * 2)
      ctx.setFontSize(15*ratio)
      ctx.setFillStyle('#EBB52B')
      ctx.fillText('剩余金额： ¥'+luckyDip.balance, rectLine*2, rectLine * 3)
    }

  }

  //画福包数量
  function drawRedNum() {
    ctx.setTextAlign('right')
    ctx.setFontSize(12*ratio)
    ctx.setFillStyle('#EBB52B')
    ctx.drawImage(xyfbImages['game_receive_record_bg'].src, rectLine, rectLine*3+rectLine*0.2, rectLine *2, rectLine*0.8)
    ctx.drawImage(xyfbImages['game_receive_record'].src, rectLine, rectLine*3+rectLine*0.2, rectLine*0.6, rectLine*0.6)
    if(luckyDip.count==100){
      ctx.fillText('已领',rectLine*2-12*ratio, rectLine*3+rectLine*0.7)
      ctx.setFontSize(20*ratio)
      ctx.setFillStyle('#EBB52B')
      ctx.fillText((luckyDip.count-luckyDip.remain)+'/'+luckyDip.count, rectLine*3-12*ratio, rectLine*3+rectLine*0.7)
    }else if(luckyDip.count<10){
      ctx.fillText('已领',rectLine*2+24*ratio, rectLine*3+rectLine*0.7)
      ctx.setFontSize(20*ratio)
      ctx.setFillStyle('#EBB52B')
      ctx.fillText((luckyDip.count-luckyDip.remain)+'/'+luckyDip.count, rectLine*3-15*ratio, rectLine*3+rectLine*0.7)
    }else {
      ctx.fillText('已领',rectLine*2, rectLine*3+rectLine*0.7)
      ctx.setFontSize(20*ratio)
      ctx.setFillStyle('#EBB52B')
      ctx.fillText((luckyDip.count-luckyDip.remain)+'/'+luckyDip.count, rectLine*3-12*ratio, rectLine*3+rectLine*0.7)

    }
  }

  //画大福包
  function drawIsEnd() {
    if (isEnd && hasred && animationR>=rectLine) {
        ctx.save()
        ctx.setTextAlign('left')
        ctx.setFillStyle('#FFFFFF')
        ctx.setFontSize(24*ratio)
        ctx.drawImage(xyfbImages['share_bg'].src, 0, rectLine, rectLine*4, rectLine*3)
        ctx.fillText('恭喜领到福包咯', rectLine, rectLine * 3)
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

  //画动画
  function drawAnimation(item) {
    if(isEnd){
      if(animationR<item.w){
        animationR = animationR+4

      }else{
        // clearInterval(loadingClock)
        if(opts&&opts.success){
          opts.success()
        }

      }
      ctx.save()
      ctx.arc(item.x+item.w/2, item.y+item.h/2, animationR, 0, 2*Math.PI)
      ctx.clip()
      ctx.drawImage(hasred ? xyfbImages["redEnvelopes"].src : xyfbImages["game_bless"].src, item.x + 10, item.y + 10, item.w - 20, item.h - 20)
      ctx.restore()
    }
  }

  //设置背景
  function drawBoxList() {
    let rectList = config['rectList']
    for (let i = 0; i < rectList.length; i++) {
      let item = rectList[i]
      if (isEnd == true && i == walked) {
        ctx.drawImage(xyfbImages['cellLight'].src, item.x, item.y, item.w, item.h)
        // ctx.drawImage(hasred ? xyfbImages["redEnvelopes"].src : xyfbImages["game_bless"].src, item.x - 1, item.y - 1, item.w - 3, item.h - 3)
        // drawLight(item)
        drawAnimation(item)
      } else if (i == walked) {
        ctx.drawImage(xyfbImages['cellLight'].src, item.x, item.y, item.w, item.h)
        ctx.drawImage(item.src, item.x, item.y, item.w, item.h)

      } else {
        ctx.drawImage(xyfbImages['bg'].src, item.x, item.y, item.w, item.h)
         // drawAnimation(item)
        ctx.drawImage(item.src, item.x, item.y, item.w, item.h)
      }
    }
  }
  refresh()
  var game = this.game = {}

  game.stop = ()=>{
    // isEnd = this.isEnd = false
    // hasred = this.hasred = false
    // animationR = this.animationR = 0
    clearInterval(loadingClock);
    console.log('loadingClock========>',loadingClock)
  }
  //清除定时器
  game.clear = ()=>{
    isEnd = this.isEnd = false
    hasred = this.hasred = false
    animationR = this.animationR = 0
    // clearInterval(loadingClock);
  }
  //生成定时器
  game.start = ()=> {
    isEnd = this.isEnd = false
    hasred = this.hasred = false
    animationR = this.animationR = 0
    loadingClock = setInterval(refresh, 50)
    console.log('loadingClock========>',loadingClock)
  }
  //修改选中盒子
  game.changeWalked = (result)=>{
    walked = this.walked = result
  }
  //修改结束
  game.changeEnd = (item, item2)=>{
    if(item==true){
      animationR = this.animationR = 0
    }
    isEnd = this.isEnd = item
    hasred = this.hasred = item2

  }

  game.changeLuckyDip = (item)=>{
    luckyDip = this.luckyDip = item
  }

  //开始动画
  // var loadingClock = setInterval(refresh, 50);

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

xyfbGame.prototype.changeLuckyDip = function (item) {
  this.game.changeLuckyDip(item)
}

xyfbGame.prototype.clear = function () {
  this.game.clear()
}

xyfbGame.prototype.start = function () {
  this.game.start()
}

emitter.setup(xyfbGame.prototype);

module.exports = xyfbGame;