import { request } from '../../http.js'

// 获取聊天详情
export const getChatInfo = (params) => {
	return new Promise((resolve, reject) => {
		request('/chat/index', 'GET', params).then(res => {
			resolve(res.data)
		}).catch(err => {
			reject(err)
		})
	})
}