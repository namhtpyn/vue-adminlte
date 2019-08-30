<template>
  <div>
    <n-select2 :items="selectItems" item-text="name" item-value="fat" multiple :close-on-select="false"></n-select2>
    <div style="width:50%">
      <n-drop-down-table
        v-model="value"
        :table-headers="tableHeaders"
        :table-items="tableItems"
        item-text="SystemName"
        item-value="DeviceID"
        searchable
      ></n-drop-down-table>

      <!-- drop-down-width="300"
      <n-drop-down-list v-model="value">
        <template #content="{data}">
          <n-data-table
            :headers="tableHeaders"
            :items="tableItems"
            :component-footer="false"
            :component-header="false"
            @row-click="item => itemSelect(item, data)"
          >
            <template v-slot:modal="{ modal }">
              <input class="form-control" autofocus v-model="modal.data.name" />
              <input class="form-control" v-model="modal.data.fat" />
            </template>
            <template v-slot:footer.fat="{ item }">{{ item.reduce((a, b) => a + (b.fat || 0), 0) }}</template>
            <template v-slot:footer.calories="{ item }">{{ item.reduce((a, b) => a + (b.calories || 0), 0) }}</template>
          </n-data-table>
        </template>
      </n-drop-down-list> -->
    </div>
    {{ value }}
    <!-- <n-radio label="radio 1" value="1"></n-radio>
    <n-checkbox form label="checkbox" v-model="checkbox"></n-checkbox>
    {{ checkbox }}
    <n-btn app color="primary" text-color="white" @click="abc"> <n-icon color="yellow">play</n-icon>Play </n-btn> -->

    <!-- <n-data-table caption="Title here" :headers="tableHeaders" :items="items" enable-search bordered selectable updatable>
      <template v-slot:item.iron="{ item }">
        <span class="badge bg-red">{{ item.iron }}</span>
      </template>
      <template v-slot:item.protein="{ item }">
        <span class="badge bg-green">{{ item.protein }}</span>
      </template>
    </n-data-table> -->

    <!-- <n-pagination :length="10" v-model="page"></n-pagination>




    <n-modal caption="OK" v-model="modalVisibility" hide-footer>tui thu ne haha</n-modal>
    <n-btn @click="modalVisibility = !modalVisibility">Click</n-btn> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import NDataTable from '../component/NDataTable.vue'
import NBtn from '../component/NBtn.vue'
import NIcon from '../component/NIcon.vue'
import NPagination from '../component/NPagination.vue'
import { TableHeader } from '../types/Table'
import jsonData from './data.json'
import data2 from './data2.json'
import NSelect2 from '../component/NSelect2.vue'
import NModal from '../component/NModal.vue'
import NCheckbox from '../component/NCheckbox.vue'
import NRadio from '../component/NRadio.vue'
import NDropDownList from '../component/NDropDownList.vue'
import NDropDownTable from '../component/NDropDownTable.vue'

@Component({
  components: { NDataTable, NBtn, NIcon, NPagination, NSelect2, NModal, NCheckbox, NRadio, NDropDownList, NDropDownTable }
})
export default class extends Vue {
  value: any = 26

  //checkbox
  checkbox: boolean = true

  //pagination
  page = 1

  //Table
  tableHeaders: TableHeader[] = [{ text: 'IpAddress', value: 'DeviceID' }, { text: 'SystemName', value: 'SystemName' }]
  tableItems: any[] = data2
  doAdd(modal) {
    console.log(modal)
    modal.visible = false
  }

  //Select
  selectItems: any[] = jsonData

  //Modal
  modalVisibility = false

  message = 'hello world'

  abc(a) {
    console.log(a)
  }
  headers = [
    {
      text: 'Dessert (100g serving)',
      value: 'name'
    },
    {
      text: 'abc',
      children: [
        { text: 'Calories', value: 'calories' },
        { text: 'Fat (g)', value: 'fat', sortable: true },
        {
          text: 'def',
          children: [
            { text: 'Carbs (g)', value: 'carbs' },
            { text: 'Protein (g)', value: 'protein' },
            {
              text: 'def',
              children: [{ text: 'Carbs (g)', value: 'carbs' }, { text: 'Protein (g)', value: 'protein' }]
            }
          ]
        }
      ]
    },

    { text: 'Iron (%))', value: 'iron' },
    { text: 'Action', value: 'action' }
  ]
  items: any[] = jsonData

  mounted() {}
}
</script>

<style>
#app {
  font-size: 18px;
  font-family: 'Roboto', sans-serif;
  color: blue;
}
</style>
