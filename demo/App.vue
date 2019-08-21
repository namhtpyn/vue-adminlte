<template>
  <div id="app">
    <n-btn app color="primary" text-color="white" @click="abc">
      <n-icon color="yellow">play</n-icon>Play
    </n-btn>

    <n-data-table
      caption="Title here"
      :headers="headers"
      :items="items"
      :enable-search="true"
      bordered
    >
      <template v-slot:item.action>aaaaa</template>
      <template v-slot:item.iron="{item}">
        <span class="badge bg-red">{{item.iron}}</span>
      </template>
      <template v-slot:item.protein="{item}">
        <span class="badge bg-green">{{item.protein}}</span>
      </template>
    </n-data-table>

    <n-pagination :length="10" v-model="page"></n-pagination>

    <n-table :headers="tableHeaders" :items="tableItems">
      <css-class
        header-row="bg-blue"
        header-cell="text-white"
        footer-row="bg-blue"
        footer-cell="text-white"
      ></css-class>
      <template v-slot:footer.fat="{item}">{{item.reduce((a, b) => a + (b.fat || 0), 0)}}</template>
      <template v-slot:footer.calories="{item}">{{item.reduce((a, b) => a + (b.calories || 0), 0)}}</template>
    </n-table>

    <n-select2 :items="selectItems" item-text="name" item-value="fat"></n-select2>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NTable from "../component/NTable.vue";
import NDataTable from "../component/NDataTable.vue";
import NBtn from "../component/NBtn.vue";
import NIcon from "../component/NIcon.vue";
import NPagination from "../component/NPagination.vue";
import { TableHeader } from "../types/Table";
import axios from "axios";
import jsonData from "./data.json";
import NSelect2 from "../component/NSelect2.vue";

@Component({
  components: { NDataTable, NBtn, NIcon, NPagination, NTable, NSelect2 }
})
export default class extends Vue {
  //pagination
  page = 1;

  //Table
  tableHeaders: TableHeader[] = [
    {
      text: "Dessert (100g serving)",
      value: "name"
    },
    { text: "Calories", value: "calories" },
    { text: "Fat (g)", value: "fat", sortable: true },
    { text: "Carbs (g)", value: "carbs" },
    { text: "Protein (g)", value: "protein" }
  ];
  tableItems: any[] = jsonData;

  //Select
  selectItems: any[] = jsonData;

  message = "hello world";

  abc(a) {
    console.log(a);
  }
  headers = [
    {
      text: "Dessert (100g serving)",
      value: "name"
    },
    {
      text: "abc",
      children: [
        { text: "Calories", value: "calories" },
        { text: "Fat (g)", value: "fat", sortable: true },
        {
          text: "def",
          children: [
            { text: "Carbs (g)", value: "carbs" },
            { text: "Protein (g)", value: "protein" },
            {
              text: "def",
              children: [
                { text: "Carbs (g)", value: "carbs" },
                { text: "Protein (g)", value: "protein" }
              ]
            }
          ]
        }
      ]
    },

    { text: "Iron (%))", value: "iron" },
    { text: "Action", value: "action" }
  ];
  items: any[] = jsonData;

  mounted() {}
}
</script>

<style>
#app {
  font-size: 18px;
  font-family: "Roboto", sans-serif;
  color: blue;
}
</style>