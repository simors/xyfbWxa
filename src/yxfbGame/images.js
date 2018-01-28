/**
 * Created by lilu on 2018/1/25.
 */
const imageSrc = "../asset/png/";  //图片url前缀


var gameImg = {
  "bg": {
    src: imageSrc+'game_bg_cell.png',
    height: '75',
    width: '75',
  },
  "cellLight": {
    src: imageSrc+'game_cell_light100.png',
    height: '75',
    width: '75',
  },
  "redEnvelopes": {
    src: imageSrc+'game_red_envelopes.png',
    height: '75',
    width: '75',
  },
  "share_bg": {
    src: imageSrc+'share_bg.png',
    height: '200',
    width: '300',
  },
  "game_money_mark": {
    src: imageSrc+'game_money_mark.png',
    height: '200',
    width: '300',
  },
  "game_receive_record_bg": {
    src: imageSrc+'game_receive_record_bg.png',
    height: '200',
    width: '300',
  },
  "game_receive_record": {
    src: imageSrc+'game_receive_record.png',
    height: '200',
    width: '300',
  },
}

module.exports = gameImg