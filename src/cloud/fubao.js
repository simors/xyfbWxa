/**
 * Created by yangyang on 2018/1/30.
 */
import AV from '../utils/av-weapp-min'

export default class fubao {
  static async createLuckyDip(payload) {
    let params = {
      amount: payload.amount,
      count: payload.count,
      remark: payload.remark
    }
    return await AV.Cloud.run('fubaoCreateLuckyDip', params)
  }
  
  static async getLastFubao() {
    return await AV.Cloud.run('fubaoGetLastFubao')
  }
  
  static async fetchLuckyDipById(payload) {
    let params = {
      luckyDipId: payload.luckyDipId
    }
    return await AV.Cloud.run('fubaoFetchLuckyDipById', params)
  }
  
  static async fetchSendLuckyDip(payload) {
    let params = {
      lastTime: payload.lastTime,
      limit: payload.limit
    }
    return await AV.Cloud.run('fubaoFetchSendLuckyDip', params)
  }
  
  static async fetchFetchRecvedFubao(payload) {
    let params = {
      lastTime: payload.lastTime,
      limit: payload.limit
    }
    return await AV.Cloud.run('fubaoFetchRecvedFubao', params)
  }
}