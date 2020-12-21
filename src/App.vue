<template>
	<div id="app">
		<router-view />
	</div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
	data() {
		return {
			timer: null
		};
	},
	created() {
		this.resize();
		window.addEventListener('resize', () => {
			// 防抖处理
			if (this.timer) {
				clearTimeout(this.timer);
			}

			this.timer = setTimeout(() => {
				this.resize();
			}, 200);
		});
	},
	methods: {
		...mapMutations(['SET_MOBILE']),
		// 动态font-size
		resize: function() {
			let screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
			if (screenWidth < 769) {
				document.getElementsByTagName('html')[0].style.fontSize = 20 * (screenWidth / 375) + 'px';
				this.SET_MOBILE(true);
			} else {
				document.getElementsByTagName('html')[0].style.fontSize = 20 * (screenWidth / 960) + 'px';
				this.SET_MOBILE(false);
			}
		}
	}
};
</script>
