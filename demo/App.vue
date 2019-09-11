<template>
  <div>
    <!-- <n-form>
      <div class="row">
        <div class="col-xs-4">
          <n-text-box hint="abc" label="example textbox" small></n-text-box>
        </div>
        <div class="col-xs-4">
          <n-select
            label="example select"
            small
            @input="textboxinput"
            read-url="http://127.0.0.1:3001/home"
            item-text="provinceName"
            item-value="provinceCode"
          ></n-select>
        </div>
        <div class="col-xs-4">
          <n-drop-down-tree label="example dropdowntree" small></n-drop-down-tree>
        </div>
      </div>
    </n-form>
    <n-form inline>
      <n-text-box label="example textbox"></n-text-box>
      <n-select2 label="example select"></n-select2>
      <n-drop-down-tree
        ref="treeselect"
        label="example dropdowntree"
        item-value="UnitID"
        item-text="UnitName"
        tree-parent-key="ParentID"
        :tree-expand-to-level="1"
        drop-down-width="500"
        hint="Example hint"
        searchable
      ></n-drop-down-tree>
<<<<<<< HEAD
    </n-form> -->
=======
    </n-form>
    <n-drop-down-table
      v-model="value"
      label="drop down list"
      :items="items"
      item-text="NamE"
      item-value="NamE"
      searchable
      :rules="[v => v < 1 || 'Không lớn hơn 1']"
      modal
    >
      <items>
        <text-item :header-valign.camel="`middle`" text="Name" value="NamE"></text-item>
        <text-item header-valign="middle" text="Calories" value="calories"></text-item>
        <band-item text="band" align="center">
          <items>
            <text-item text="Calories" value="calories" summary="sum"></text-item>
            <number-item text="Fat" value="calories"></number-item>
          </items>
        </band-item>
      </items>
    </n-drop-down-table>

    <n-drop-down-table
      label="Tỉnh/Tp"
      read-url="http://127.0.0.1:3001/home"
      item-text="provinceName"
      item-value="provinceCode"
      v-model="provinceCode"
      multiple
    >
      <items>
        <text-item text="Code" value="provinceCode"></text-item>
        <text-item text="Tên tỉnh/tp" value="provinceName"></text-item>
        <text-item text="Khu vực" value="areaID"></text-item>
      </items>
    </n-drop-down-table>
>>>>>>> e0f92527297753c7f1b200fa0f8c9b0bbafa5b3e
    <!-- <n-drop-down-tree
      ref="treeselect"
      searchable
      item-value="UnitID"
      item-text="UnitName"
      tree-parent-key="ParentID"
      :tree-expand-to-level="1"
      label="Đơn vị"
    ></n-drop-down-tree> -->
    <!-- {{ unitID2 }}
    <n-tree
      :read-url="`https://localhost:5001/linetest/vnptunit/GetUnitListByID?unitID=${unitID}`"
      item-value="UnitID"
      item-text="UnitName"
      parent-key="ParentID"
      @select="select_node"
      :expand-to-level="1"
      fixed-search
      height="500px"
      v-model="unitID2"
    ></n-tree>
    <input type="text" v-model="unitID" /> -->
    <!-- <div class="col-xs-3">
      <n-select2
        :read-url="`https://localhost:5001/Linetest/Test/GetActivatedAdslPort?deviceIp=172.20.225.101`"
        item-text="SlotPort"
        item-value="SlotPort"
        label="cake"
      ></n-select2>
    </div> -->
    <!-- {{ cake }} -->
    <!-- <div style="width:50%">
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
    <!-- {{ value }} -->
    <!-- <n-radio label="radio 1" value="1"></n-radio>

    {{ checkbox }}
    <n-btn app color="primary" text-color="white" @click="abc"> <n-icon color="yellow">play</n-icon>Play </n-btn> -->
    {{ radio }} {{ check }}
    <input type="number" v-model="radio" />
    <n-radio v-model="radio" :value="1"></n-radio>
    <n-radio v-model="radio" :value="2"></n-radio>
    <n-radio v-model="radio" :value="3"></n-radio>
    <n-radio v-model="radio" :value="4"></n-radio>
    <n-checkbox v-model="check" :value="1"></n-checkbox>
    <n-checkbox v-model="check" :value="2"></n-checkbox>
    <n-checkbox v-model="check" :value="3"></n-checkbox>
    <n-checkbox v-model="check" :value="4"></n-checkbox>
    {{ def }}
    <n-data-table ref="table" v-model="def" :items="items" updatable deletable creatable expandable selectable row-select>
      <items>
        <text-item :header-valign.camel="`middle`" text="Name" value="NamE"></text-item>
        <text-item header-valign="middle" text="Calories" value="calories"></text-item>
        <band-item text="band" align="center">
          <items>
            <text-item text="Calories" value="calories" summary="sum"></text-item>
            <number-item text="Fat" value="calories"></number-item>
          </items>
        </band-item>
      </items>
      <css-class></css-class>
    </n-data-table>

    <!-- <n-pagination :length="10" v-model="page"></n-pagination>




    <n-modal caption="OK" v-model="modalVisibility" hide-footer>tui thu ne haha</n-modal>
    <n-btn @click="modalVisibility = !modalVisibility">Click</n-btn> -->
    <n-modal v-model="modal" scrollable large>
      <n-btn @click="modal = !modal">Click Me</n-btn>
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
      a<br />
    </n-modal>
    <n-btn @click="modal = !modal">Click Me</n-btn>
    <n-text-box v-model="textbox" @input="textboxinput"></n-text-box>
    <n-text-box v-model="textbox"></n-text-box>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
// import { TableHeader } from '../types/Table'
import jsonData from './data.json'
// import data2 from './data2.json'
//import data3 from './data3.json'
<<<<<<< HEAD
import NSelect2 from '../components/NSelect2.vue'
=======
//import NSelect2 from '../components/NSelect2.vue'
>>>>>>> e0f92527297753c7f1b200fa0f8c9b0bbafa5b3e

@Component({})
export default class VApp extends Vue {
  textboxinput(e) {
    console.log(e)
  }
  textbox = ''
  modal = false
  opentree(e) {
    console.log('open')
    console.log(e)
  }
  provinceCode = []
  def: any = {}
  radio = 1
  check = [1, 3]
  // expandToLevel = null
  // select_node(node) {
  //   console.log(node)
  // }
  // cake: any = null
  // value: any = null
  // //checkbox
  // checkbox: boolean = true
  // //pagination
  // page = 1
  // //Table
  // tableHeaders: TableHeader[] = [
  //   { text: 'IpAddress', value: 'DeviceID', width: '500px' },
  //   { text: 'IpAddress', value: 'DeviceID' },
  //   { text: 'IpAddress', value: 'DeviceID' },
  //   { text: 'IpAddress', value: 'DeviceID' },
  //   { text: 'IpAddress', value: 'DeviceID' },
  //   { text: 'SystemName', value: 'SystemName' }
  // ]
  // tableItems: any[] = data2
  // doAdd(modal) {
  //   console.log(modal)
  //   modal.visible = false
  // }
  // //Select
  // selectItems: any[] = jsonData
  // //Modal
  // modalVisibility = false
  // message = 'hello world'
  // validate() {
  //   ;(this.$refs.form as any).validate()
  // }
  // abc(a) {
  //   console.log(a)
  // }
  // headers = [
  //   {
  //     text: 'Dessert (100g serving)',
  //     value: 'Name'
  //   },
  //   {
  //     text: 'abc',
  //     children: [
  //       { text: 'Calories', value: 'calories' },
  //       { text: 'Fat (g)', value: 'fat', sortable: true },
  //       {
  //         text: 'def',
  //         children: [
  //           { text: 'Carbs (g)', value: 'carbs' },
  //           { text: 'Protein (g)', value: 'protein' },
  //           {
  //             text: 'def',
  //             children: [{ text: 'Carbs (g)', value: 'carbs' }, { text: 'Protein (g)', value: 'protein' }]
  //           }
  //         ]
  //       }
  //     ]
  //   },
  //   { text: 'Iron (%))', value: 'iron' }
  // ]
  items: any[] = jsonData
<<<<<<< HEAD
  // treeItems: any[] = []
  // unitID = 1
  // unitID2 = 0
  mounted() {
    // ;(this.$refs.treeselect as any).setItems(data3)
    // ;(this.$refs.table as any).setItems(jsonData)
  }
=======
  value: any | any[] = ['Frozen Yogurt', 'Eclair']
  provinceCode = []
  // treeItems: any[] = []
  // unitID = 1
  // unitID2 = 0
  mounted() {}
>>>>>>> e0f92527297753c7f1b200fa0f8c9b0bbafa5b3e
}
</script>

<style>
/* #app {
  font-size: 18px;
  font-family: 'Roboto', sans-serif;
  color: blue;
} */
</style>
