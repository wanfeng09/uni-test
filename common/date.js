// 定义补零
function zeroFill(n) {
  return n < 10 ? "0" + n : n
}

// 时间格式化（处理后端传过来的格式时间）
export const handleDateFormat = (date) => {
	if (date) {
	  let time = new Date(date)
	  let Year = time.getFullYear() // 年
	  let Month = zeroFill(time.getMonth() + 1) //月
	  let Day = zeroFill(time.getDate()) // 日
	  // let Week = time.getDay() // 周
	  let hour = zeroFill(time.getHours()) // 时
	  let minute = zeroFill(time.getMinutes()) // 分
	  let second = zeroFill(time.getSeconds()) // 秒
	  return Year + "-" + Month + "-" + Day + " " + hour + ":" + minute + ":" + second
	} else {
	  return ''
	}
}

// 获取当前时间
export const getCurrentDate = () => {
	let date = new Date()
	let year = date.getFullYear()
	let month = date.getMonth() + 1
	let day = date.getDate()
	let hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
	let minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
	let second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
	month >= 1 && month <= 9 ? (month = "0" + month) : ""
	day >= 0 && day <= 9 ? (day = "0" + day) : ""
	return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
}

// 获取年份
export const getYearArr = () => {
	let date = new Date()
	let year = date.getFullYear()
	let arr = []
	for (var i = 0; i < 8; i++) {
		let val = (year - i) + '年'
		arr.push(val)
	}
	return arr
}

// 获取月份
export const getMonthArr = () => {
	let arr = []
	for (var i = 0; i < 12; i++) {
		let val = (i + 1) + '月'
		arr.push(val)
	}
	return arr
}

// 获取当前月份的第一天 date(new Date('2023-10-10'))
export function getStartTime(date) {
	date.setDate(1) // 将当前时间的日期设置成第一天
	let year = date.getFullYear() // 得到当前年份 
	let month = date.getMonth() + 1 // 得到当前月份（0-11月份，+1是当前月份）
	month = month > 9 ? month : '0' + month // 补零
	let day = date.getDate() // 得到当前天数，实际是本月第一天，因为前面setDate(1) 设置过了
	// console.log(month) 03
	return year + '-' + month + '-' + day
};

// 获取当前月份的最后一天
export function getEndTime(date) {
	let year = date.getFullYear()
	let month = date.getMonth() + 1
	month = month > 9 ? month : '0' + month // 补零
	// 这里传入的是整数时间，返回的是下个月的第一天，因为月份是0-11
	let nextMonthFirthDay = new Date(year, month, 1) // 下个月的第一天
	// console.log(nextMonthFirthDay)
	let oneDay = 1000 * 60 * 60 * 24 // 一天的时间毫秒数
	let endDay = new Date(nextMonthFirthDay - oneDay)
	let day = endDay.getDate() // 本月最后一天
	// 这里传入的是字符串格式的时间，返回的是传入字符串的时间
	return year + '-' + month + '-' + day
}