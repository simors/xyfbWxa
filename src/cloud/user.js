/**
 * Created by yangyang on 2017/11/20.
 */
import AV from '../utils/av-weapp-min'
import wepy from 'wepy'
import 'wepy-async-function'

export default class user {
  static weappConfig = {
    appId: 'wx78f26c221006d9c6',
    appSecret: '2b6673c4ba92f0f7b7d589ccd4c8170f'
  }
  
  static async userLogin() {
    try {
      let wxUser = await wepy.login()
      let wepyUser = await wepy.getUserInfo({lang: 'zh_CN', withCredentials: true})
      let authData = await AV.Cloud.run('weappGetAuthData', {
        appid: user.weappConfig.appId,
        secret: user.weappConfig.appSecret,
        code: wxUser.code,
        encryptedData: wepyUser.encryptedData,
        iv: wepyUser.iv
      })
      if (authData.uid) {
        await AV.User.signUpOrlogInWithAuthData(authData, 'lc_weapp_union')
      } else {
        await AV.User.loginWithWeapp()
      }
      let wepyUserInfo = wepyUser.userInfo
      if (!wepyUserInfo) {
        return undefined
      }
      wepy.$instance.globalData.userInfo = wepyUserInfo
      let params = {
        nickname: wepyUserInfo.nickName,
        gender: wepyUserInfo.gender,
        avatar: wepyUserInfo.avatarUrl,
        province: wepyUserInfo.province,
        city: wepyUserInfo.city
      }
      let updateUser = await AV.Cloud.run('userUpdateInfo', params)
      return updateUser
    } catch (e) {
      console.error('error in login', e)
    }
  }
  
  static async fetchUserInfo(payload) {
    let params = {
      userId: payload.userId
    }
    return await AV.Cloud.run('userFetchUserInfo', params)
  }
}