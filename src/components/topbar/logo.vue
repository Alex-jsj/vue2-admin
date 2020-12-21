<template>
    <div id="logo">
        <router-link to="/views/index" class="link">
            <img :src="logoSrc" alt="logo" class="logo-img" />
            <!-- text -->
            <span class="logo-text">{{$t('base.websiteTitle')}}</span>
        </router-link>
    </div>
</template>

<script>
export default {
	name: 'logo',
	data() {
		return { logoSrc: './img/logo.png' };
	}
};
</script>

<style lang="less" scoped>
@import '~@assets/css/mixin.less';
#logo {
	height: 100%;
	.link {
		width: 100%;
		height: 60px;
		display: flex;
		align-items: center;
	}
	.logo-img {
		height: 40px;
		margin-right: 10px;
	}
	.logo-text {
		font-size: 22px;
		color: #fff;
		letter-spacing: 3px;
	}
}
</style>
