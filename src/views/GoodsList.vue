<template>
    <div>
        <nav-header></nav-header>
        <nav-bread>
            <span>Goods</span>
        </nav-bread>
        <div class="accessory-result-page accessory-page">
            <div class="container">
                <div class="filter-nav">
                <span class="sortby">Sort by:</span>
                <a href="javascript:void(0)" class="default" :class="{'cur':sortFlag}" @click="sortGoods">Default</a>
                <a href="javascript:void(0)" class="price" :class="{'cur':!sortFlag}" @click="sortGoods">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
                <a href="javascript:void(0)" class="filterby stopPop" @click="filterFun">Filter by</a>
                </div>
                <div class="accessory-result">
                <!-- filter -->
                <div class="filter stopPop" id="filter" :class="{'filterby-show':isShowFilter}">
                    <dl class="filter-price">
                    <dt>Price:</dt>
                    <dd @click="setPriceLevel('all')"><a href="javascript:void(0)" @click="setCur('all')" :class="{'cur':nowPriceFilter=='all'}">All</a></dd>
                    <dd v-for="(item,index) in priceFilter" :key="index" @click="setPriceLevel(index)">
                        <a href="javascript:void(0)" @click="setCur(index)" :class="{'cur':nowPriceFilter===index}">{{item.startPrice}} - {{item.endPrice}}</a>
                    </dd>
                    </dl>
                </div>

                <!-- search result accessories list -->
                <div class="accessory-list-wrap">
                    <div class="accessory-list col-4">
                    <ul>
                        <li v-for="(item,index) in goodsList" :key="index">
                            <div class="pic">
                                <a href="#"><img v-lazy="'static/'+item.productImage" alt=""></a>
                            </div>
                            <div class="main">
                                <div class="name">{{item.productName}}</div>
                                <div class="price">{{item.salePrice}}</div>
                                <div class="btn-area">
                                <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div v-infinite-scroll="loadMore" class="load-more" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                    {{loadMoreInfo}}
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
        <modal v-bind:mdShow="mdShow" v-on:close="closeModal">
          <p slot="message">
             请先登录,否则无法加入到购物车中!
          </p>
          <div slot="btnGroup">
              <a class="btn btn--m" href="javascript:;" @click="mdShow = false">关闭</a>
          </div>
        </modal>
        <modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
          <p slot="message">
            <svg class="icon-status-ok">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
            </svg>
            <span>加入购物车成功!</span>
          </p>
          <div slot="btnGroup">
            <a class="btn btn--m" href="javascript:;" @click="mdShowCart = false">继续购物</a>
            <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">查看购物车</router-link>
          </div>
        </modal>
        <div class="md-overlay" v-show="isShowFilter" @click.stop="closeFilter"></div>
        <nav-footer></nav-footer>
    </div>
</template>

<script>
import NavHeader from "@/components/NavHeader";
import NavFooter from "@/components/NavFooter";
import NavBread from "@/components/NavBread";
import Modal from "@/components/Modal";
import {mapGetters} from 'vuex'

const ERR_OK = 0;

export default {
  data() {
    return {
      goodsList: [],
      priceFilter: [
        {
          startPrice: "0.00",
          endPrice: "100.00"
        },
        {
          startPrice: "100.00",
          endPrice: "500.00"
        },
        {
          startPrice: "500.00",
          endPrice: "1000.00"
        },
        {
          startPrice: "1000.00",
          endPrice: "5000.00"
        }
      ],
      nowPriceFilter: "all",
      isShowFilter: false,
      page: 1,
      pageSize: 8,
      sortFlag: true,
      priceChecked: "all",
      busy: false,
      loadMoreInfo: "加载更多...",
      mdShow:false,
      mdShowCart:false
    };
  },
  methods: {
    setCur(index) {
      this.nowPriceFilter = index;
      this.closeFilter();
    },
    filterFun() {
      this.isShowFilter = true;
    },
    closeFilter() {
      this.isShowFilter = false;
    },
    getGoodsList(noFirstFlag) {
      let param = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
        priceLevel: this.priceChecked
      };
      this.$http({
        method: "GET",
        url: "/goods/list",
        params: param
      }).then(res => {
        if (ERR_OK == res.data.status) {
          if (noFirstFlag) {
            this.goodsList = this.goodsList.concat(res.data.result.list);
          } else {
            this.goodsList = res.data.result.list;
          }
          if (res.data.result.count < this.pageSize) {
            this.busy = true;
            this.loadMoreInfo = '加载完成';
          } else {
            this.busy = false;
          }
        }
      });
    },
    sortGoods() {
      this.sortFlag = !this.sortFlag;
      this.page = 1;
      this.loadMoreInfo = '加载更多...';
      this.getGoodsList(false);
    },
    loadMore() {
      this.busy = true;
      setTimeout(() => {
        this.firstFlag = false;
        this.page++;
        this.getGoodsList(true);
      }, 50);
    },
    setPriceLevel(index){
        this.page = 1;
        this.loadMoreInfo = '加载更多...';
        this.priceChecked = index;
        this.getGoodsList(false);
    },
    addCart(productId){
        console.log(this.getUserInfo)
        if(!this.getUserInfo.userName){
          this.mdShow = true;
          return;
        }
        this.$http.post('/goods/addCart',{
            'productId':productId
        }).then((res)=>{
            if(res.data.status == ERR_OK){
                // alert('添加成功');
                this.mdShowCart = true;
            }
        })
    },
    closeModal(){
      this.mdShow = false;
      this.mdShowCart = false;
    }
  },
  mounted() {
    this.getGoodsList(false);
  },
  computed:{
    ...mapGetters([
      'getUserInfo'
    ])
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread,
    Modal
  }
};
</script>
<style>
.load-more {
  text-align: center;
  height: 100px;
}
</style>

