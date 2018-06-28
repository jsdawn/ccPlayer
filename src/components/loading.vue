 <template>
	<div class="loading_container">
	    <div class="load_img" :style="{backgroundPositionY: -(positionY%7)*2 + 'rem'}">
	    </div>
		<div class="load_ellipse_tip"></div>
	</div>
</template>

<script>
    export default {
		/* 页面跳转-加载动画 */
		name:'loading',
    	data(){
            return{
                positionY: 0,
                timer: null,
            }
        },
        mounted(){
        	this.timer = setInterval(() => {
        		this.positionY ++;
        	}, 600)
        },
        beforeDestroy(){
        	clearInterval(this.timer);
        }
    }
</script>

<style scoped>
	@keyframes load{
		0%   {transform: translateY(0px);}
		50%  {transform: translateY(-50px);}
		100% {transform: translateY(0px);}
	}
	@keyframes ellipse{
		0%   {transform: scale(1);}
		50%  {transform: scale(0.3);}
		100% {transform: scale(1);}
	}
    .loading_container{
    	position: fixed;
    	top: 50%;
    	left: 50%;
    	transform: translate(-50%, -50%);
    	width: 2rem;
		height: 2rem;
    }
    .load_img{
    	width: 100%;
		height: 100%;
    	background: url(../images/icon_loading.png) no-repeat 0 0;
    	background-size: 2rem auto;
    	transform: translateY(0px);
    	animation: load .6s infinite ease-in-out;
    	position: relative;
    	z-index: 11;
    }
	.load_ellipse_tip{
		position: absolute;
		background-color: #dddddd;
		border-radius: 50%;
		width: 100%;
		height: 1rem;
		top: 2rem;
        left: 0rem;
		z-index: 10;
		animation: ellipse .6s infinite ease-in-out;
	}
</style>
