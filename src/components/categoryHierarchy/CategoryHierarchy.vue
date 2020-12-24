<template>
  <div>
    <div class="panel-categories w-100 d-md-flex justify-content-center">
      <Category
        v-for="(item, index) in maxLv"
        v-bind:key="index"
        :index="index"
        :list="levelList[`lv${item}List`]"
        @handleSelect="handleSelect"
        :selected="list"
        :arrow="maxLv != item ? true : false"
        :maxLv="maxLv"
      />
    </div>
    <div v-if="v && v.$error">
      <span class="text-danger" v-if="v.required == false">{{$t('selectCategoryRequired')}}</span>
    </div>
  </div>
</template>

<script>
import Category from "@/components/categoryHierarchy/Category";

export default {
  props: {
    catagories: {
      required: true,
      type: Array,
    },
    dataList: {
      required: true,
      type: Array,
    },
    v: {
      required: false,
      type: Object,
    },
  },
  components: {
    Category,
  },
  data() {
    return {
      maxLv: 4,
      levelList: {
        lv1List: this.catagories,
        lv2List: [],
        lv3List: [],
        lv4List: [],
      },
      list: this.dataList,
    };
  },
  created: async function () {
    let categoryList = {
      categoryList: [],
      isLast: true,
      selectId: this.dataList[this.dataList.length - 1],
    };
    for (let i = 1; i <= this.maxLv; i++) {
      let filtered = await this.levelList[`lv${i}List`].filter((el) => {
        return el.id == this.dataList[i - 1];
      });
      if (filtered.length > 0) {
        this.levelList[`lv${i + 1}List`] = filtered[0].categoryList;
        categoryList.selectId = filtered[0].id;
        categoryList.isLast = filtered[0].isLast;
        categoryList.categoryList.push(filtered[0].id);
        if (filtered[0].categoryList.length == 0) {
          break;
        }
      }
    }
    this.$emit("onDataChange", categoryList);
  },
  methods: {
    async handleSelect(index, data) {
      let id = typeof this.list[index] === "undefined" ? 0 : this.list[index];
      if (id != data.id) {
        let categoryList = {
          categoryList: [],
          isLast: data.isLast,
          selectId: data.id,
        };
        let isLast = data.isLast;
        if (this.list[index]) this.list[index] = data.id;
        else this.list.push(data.id);

        let thsIndex = index + 1;
        let filtered = await this.levelList[`lv${thsIndex}List`].filter(
          function (el) {
            return el.id == data.id;
          }
        );
        if (filtered.length)
          this.levelList[`lv${thsIndex + 1}List`] = filtered[0].categoryList;

        for (let i = thsIndex; i <= this.maxLv; i++) {
          this.levelList[`lv${i + 2}List`] = [];

          let max = this.maxLv - i + 2;
          await this.list.splice(index + 1, 1);
        }

        categoryList.categoryList = this.list;

        this.$emit("onDataChange", categoryList);
      }
    },
  },
};
</script>

<style scoped>
.panel-categories {
  border: 1px solid #d8dbe0;
  border-right: 0px;
}
@media (max-width: 767.98px) {
  .panel-categories {
    border-right: 1px solid #d8dbe0;
  }
}
</style>

