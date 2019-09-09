<template>
  <div>
    <n-drop-down-tree
      v-model="unitID"
      label="Đơn vị"
      :tree-items="treeItems"
      item-value="UnitID"
      item-text="UnitName"
      parent-key="ParentID"
      searchable
      :expand-to-level="1"
    ></n-drop-down-tree>
    <!-- <n-tree
      :items="treeItems"
      item-value="UnitID"
      item-text="UnitName"
      parent-key="ParentID"
      @select="select_node"
      :expand-to-level="expandToLevel"
    ></n-tree> -->
    {{ unitID }}
    <!-- <n-select2
      :items="selectItems"
      item-text="name"
      item-value="fat"
      :rules="[v => v != 3.7 || 'fat']"
      v-model="cake"
      label="cake"
    ></n-select2>
    {{ cake }}
    <div style="width:50%">
      <n-form ref="form" lazy-validation>
        <n-drop-down-table
          v-model="value"
          label="drop down list"
          :table-headers="tableHeaders"
          :table-items="tableItems"
          item-text="SystemName"
          item-value="DeviceID"
          searchable
          :rules="[v => v < 1 || 'Không lớn hơn 1']"
        ></n-drop-down-table>
      </n-form>
      <n-btn @click="validate">Validate</n-btn> -->

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
    {{ value }}
    <!-- <n-radio label="radio 1" value="1"></n-radio>
    <n-checkbox form label="checkbox" v-model="checkbox"></n-checkbox>
    {{ checkbox }}
    <n-btn app color="primary" text-color="white" @click="abc"> <n-icon color="yellow">play</n-icon>Play </n-btn> -->
    {{ def }}
    <n-data-table v-model="def" :items="items" selectable updatable deletable creatable expandable>
      <items>
        <text-item :editable="false" header-valign="middle" text="Calories" value="calories"></text-item>
        <band-item text="band" align="center">
          <items>
            <text-item text="Calories" value="calories" summary="sum"></text-item>
            <number-item text="Fat" value="calories"></number-item>
            <date-item></date-item>
          </items>
        </band-item>
      </items>
      <!-- <template v-slot:item.iron="{ item }">
        <span class="badge bg-red">{{ item.iron }}</span>
      </template>
      <template v-slot:item.protein="{ item }">
        <span class="badge bg-green">{{ item.protein }}</span>
      </template>
      <template v-slot:item.Name="{ item }">
        <span class="badge bg-green">{{ item.protein }}</span>
      </template> -->
    </n-data-table>

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
import data3 from './data3.json'
import NSelect2 from '../component/NSelect2.vue'
import NModal from '../component/NModal.vue'
import NCheckbox from '../component/NCheckbox.vue'
import NRadio from '../component/NRadio.vue'
import NDropDownList from '../component/NDropDownList.vue'
import NDropDownTable from '../component/NDropDownTable.vue'
import NForm from '../component/NForm.vue'
import NTree from '../component/NTree.vue'
import NDropDownTree from '../component/NDropDownTree.vue'

@Component({
  components: {
    NDataTable,
    NBtn,
    NIcon,
    NPagination,
    NSelect2,
    NModal,
    NCheckbox,
    NRadio,
    NDropDownList,
    NDropDownTable,
    NForm,
    NTree,
    NDropDownTree
  }
})
export default class extends Vue {
  def: any = {}
  expandToLevel = null
  select_node(node) {
    console.log(node)
  }
  cake: any = null
  value: any = null

  //checkbox
  checkbox: boolean = true

  //pagination
  page = 1

  //Table
  tableHeaders: TableHeader[] = [
    { text: 'IpAddress', value: 'DeviceID', width: '500px' },
    { text: 'IpAddress', value: 'DeviceID' },
    { text: 'IpAddress', value: 'DeviceID' },
    { text: 'IpAddress', value: 'DeviceID' },
    { text: 'IpAddress', value: 'DeviceID' },
    { text: 'SystemName', value: 'SystemName' }
  ]
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
  validate() {
    ;(this.$refs.form as any).validate()
  }
  abc(a) {
    console.log(a)
  }
  headers = [
    {
      text: 'Dessert (100g serving)',
      value: 'Name'
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

    { text: 'Iron (%))', value: 'iron' }
  ]
  items: any[] = jsonData
  treeItems: any[] = []
  unitID = 2
  mounted() {
    this.treeItems = data3
  }
}
</script>

<style>
#app {
  font-size: 18px;
  font-family: 'Roboto', sans-serif;
  color: blue;
}
</style>