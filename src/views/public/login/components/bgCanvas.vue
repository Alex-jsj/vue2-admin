<template>
    <canvas id="bgCanvas"></canvas>
</template>

<script>
import { mapState } from 'vuex';
export default {
	name: 'bg-canvas',
	data() {
		return {
			// 定时器
			timer: null,
			point: 0
		};
	},
	computed: {
		...mapState(['isMobile'])
	},
	mounted: function() {
		this.$nextTick(() => {
			this.point = this.isMobile ? 15 : 30; // 设置PC端/移动端 点的数量
			this.bg_canvas();
		});
	},
	methods: {
		// 背景特效
		bg_canvas: function() {
			//定义画布宽高和生成点的个数
			let WIDTH =
				window.innerWidth ||
				document.documentElement.clientWidth ||
				document.body.clientWidth; //width
			let HEIGHT =
				window.innerHeight ||
				document.documentElement.clientHeight ||
				document.body.clientHeight; //height
			let POINT = this.point;

			let canvas = document.getElementById('bgCanvas');
			(canvas.width = WIDTH), (canvas.height = HEIGHT);
			let context = canvas.getContext('2d');
			(context.strokeStyle = 'rgba(255,255,255,0.3)'),
				(context.strokeWidth = 1),
				(context.fillStyle = 'rgba(255,255,255,0.2)');
			let circleArr = [];
			//线条：开始xy坐标，结束xy坐标，线条透明度
			function Line(x, y, _x, _y, o) {
				(this.beginX = x),
					(this.beginY = y),
					(this.closeX = _x),
					(this.closeY = _y),
					(this.o = o);
			}
			//点：圆心xy坐标，半径，每帧移动xy的距离
			function Circle(x, y, r, moveX, moveY) {
				(this.x = x),
					(this.y = y),
					(this.r = r),
					(this.moveX = moveX),
					(this.moveY = moveY);
			}
			//生成max和min之间的随机数
			function num(max, _min) {
				let min = arguments[1] || 0;
				return Math.floor(Math.random() * (max - min + 1) + min);
			}
			// 绘制原点
			function drawCricle(cxt, x, y, r, moveX, moveY) {
				let circle = new Circle(x, y, r, moveX, moveY);
				cxt.beginPath();
				cxt.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
				cxt.closePath();
				cxt.fill();
				return circle;
			}
			//绘制线条
			function drawLine(cxt, x, y, _x, _y, o) {
				let line = new Line(x, y, _x, _y, o);
				cxt.beginPath();
				cxt.strokeStyle = 'rgba(255,255,255,' + o + ')';
				cxt.moveTo(line.beginX, line.beginY);
				cxt.lineTo(line.closeX, line.closeY);
				cxt.closePath();
				cxt.stroke();
			}
			//每帧绘制
			function draw() {
				context.clearRect(0, 0, canvas.width, canvas.height);
				for (let i = 0; i < POINT; i++) {
					drawCricle(
						context,
						circleArr[i].x,
						circleArr[i].y,
						circleArr[i].r
					);
				}
				for (let i = 0; i < POINT; i++) {
					for (let j = 0; j < POINT; j++) {
						if (i + j < POINT) {
							let A = Math.abs(
									circleArr[i + j].x - circleArr[i].x
								),
								B = Math.abs(
									circleArr[i + j].y - circleArr[i].y
								);
							let lineLength = Math.sqrt(A * A + B * B);
							let C = (1 / lineLength) * 7 - 0.009;
							let lineOpacity = C > 0.03 ? 0.03 : C;
							if (lineOpacity > 0) {
								drawLine(
									context,
									circleArr[i].x,
									circleArr[i].y,
									circleArr[i + j].x,
									circleArr[i + j].y,
									lineOpacity
								);
							}
						}
					}
				}
			}
			//初始化生成原点
			function init() {
				circleArr = [];
				for (let i = 0; i < POINT; i++) {
					circleArr.push(
						drawCricle(
							context,
							num(WIDTH),
							num(HEIGHT),
							num(20, 2),
							num(10, -10) / 40,
							num(10, -10) / 40
						)
					);
				}
				draw();
			}
			//调用执行
			init();
			// 将定时器申明在window方便清除
			this.timer = setInterval(function() {
				for (let i = 0; i < POINT; i++) {
					let cir = circleArr[i];
					cir.x += cir.moveX;
					cir.y += cir.moveY;
					if (cir.x > WIDTH) {
						cir.x = 0;
					} else if (cir.x < 0) {
						cir.x = WIDTH;
					}
					if (cir.y > HEIGHT) {
						cir.y = 0;
					} else if (cir.y < 0) {
						cir.y = HEIGHT;
					}
				}
				draw();
			}, 16);
		}
	},
	destroyed: function() {
		// 离开时清除canvas背景图的定时器
		clearInterval(this.timer);
	}
};
</script>

<style lang="less" scoped>
@import '~@assets/css/mixin.less';
#bgCanvas {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
}
</style>


