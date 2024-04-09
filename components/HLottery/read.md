```html
	<HLottery v-model="list"></HLottery>
```

```js
	let list = [
	{ title: '牛仔裤', 'imgurl': "https://img.alicdn.com/imgextra/i3/183800141/O1CN01VAbVUI1Cuchhxy3wr_!!0-saturn_solar.jpg_360x360xzq75.jpg_.webp" },
	{ title: '连衣裙', 'imgurl': "https://img.alicdn.com/imgextra/i4/2212109100441/O1CN01nknsmE1F81UwsA3wx_!!2212109100441-0-alimamacc.jpg_360x360xzq75.jpg_.webp" },
	{ title: '项链', 'imgurl': "https://img.alicdn.com/imgextra/i4/1811380094/O1CN01nbhpWq1CZ6AlbuDaC_!!0-saturn_solar.jpg_360x360xzq75.jpg_.webp" },
	{ title: 'Nike', 'imgurl': "https://img.alicdn.com/imgextra/i1/1177680045/O1CN01EhmE1V1CCelPtmqia_!!0-saturn_solar.jpg_360x360xzq75.jpg_.webp" },
	{ title: 'GO', 'imgurl': "" },
	{ title: 'Dior香水', 'imgurl': "https://img.alicdn.com/imgextra/i2/1154420016/O1CN01iZ91k01BzNGnwcaZF_!!0-saturn_solar.jpg_360x360xzq75.jpg_.webp" },
	{ title: 'Dior口红', 'imgurl': "https://img.alicdn.com/imgextra/i4/1154420016/O1CN01P1isC91BzNFTGl3T9_!!0-saturn_solar.jpg_360x360xzq75.jpg_.webp" },
	{ title: '耳机', 'imgurl': "https://img.alicdn.com/imgextra/i3/2207307928536/O1CN01Xe78af2CvXfeb2lqB_!!2207307928536-0-alimamacc.jpg_360x360xzq75.jpg_.webp" },
	{ title: '谢谢参与', 'imgurl': "https://img2.baidu.com/it/u=296361838,3765386837&fm=253&fmt=auto&app=138&f=JPG?w=161&h=203" },
]
```

### UploadImg Props

|属性名			|类型	| 默认值|说明	| 是否必填	| 
|:-:			|:-:	|:-:	|:-:	|:-:	|
|modelValue		|Array	| [] | 奖品列表 | 是 |
|delay		|Number	| 100 | 动画转圈速度 | 否 |
|circleNum		|Number	| 3 | 动画转几圈 | 否 |