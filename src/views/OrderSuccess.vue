<template>
  <div>
      <nav-header></nav-header>
      <nav-bread>
           <span>My Success Order</span>
      </nav-bread>
      <div>
  <div class="container">
    <div class="page-title-normal">
      <h2 class="page-title-h2"><span>check out</span></h2>
    </div>
    <!-- 进度条 -->
    <div class="check-step">
      <ul>
        <li class="cur"><span>Confirm</span> address</li>
        <li class="cur"><span>View your</span> order</li>
        <li class="cur"><span>Make</span> payment</li>
        <li class="cur"><span>Order</span> confirmation</li>
      </ul>
    </div>

    <div class="order-create">
      <div class="order-create-pic"><img src="" alt=""></div>
      <div class="order-create-main">
        <h3>Congratulations! <br>Your order is under processing!</h3>
        <p>
          <span>Order ID：{{orderId}}</span>
          <span>Order total：{{orderTotal}}</span>
        </p>
        <div class="order-create-btn-wrap">
          <div class="btn-l-wrap">
            <router-link class="btn btn--m" :to="{path:'/cart'}">Cart List</router-link>
          </div>
          <div class="btn-r-wrap">
            <router-link class="btn btn--m" :to="{path:'/'}">Goods List</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<nav-footer></nav-footer>
  </div>
</template>

<script>
import NavHeader from "@/components/NavHeader";
import NavFooter from "@/components/NavFooter";
import NavBread from "@/components/NavBread";
import Modal from "@/components/Modal";

const ERR_OK = 0;

export default {
    data(){
        return{
            orderId:-1,
            orderTotal:-1
        }
    },
    components:{
        NavHeader,
        NavFooter,
        NavBread,
        Modal
    },
    mounted(){
        this.getOrderDetail();
    },
    methods:{
        getOrderDetail(){
            this.orderId = this.$route.query.orderId;
            this.$http({
                url:'/users/orderDetail',
                method:'GET',
                params:{
                    orderId:this.orderId
                }
            }).then((response)=>{
                let res = response.data;
                if(res.status == ERR_OK){
                    this.orderId = res.result.orderId;
                    this.orderTotal = res.result.orderTotal;
                }
            })
        }
    }
}
</script>

<style>

</style>
