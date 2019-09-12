import { Component, Mixins } from 'vue-property-decorator'
import _ from 'lodash'
import NBase from '../Base/NBase'
import axios from 'axios'
import NTableProp from './NTableProp'
import NDataSource from './../Base/NDataSource'
@Component({})
export default class NTableCRUD extends Mixins(NBase, NDataSource, NTableProp) {
  vModal = {
    visible: false,
    data: {},
    new: false,
    loading: false,
    valid: true
  }

  async create() {
    if (!this.creatable) return
    if (_.isEmpty(this.createUrl)) return
    this.vModal.loading = true
    try {
      if ((this.$refs.form as any).validate()) {
        await axios.put(this.createUrl, this.vModal.data)
        this.vModal.visible = false
        this.$emit('created', this.vModal.data)
        await this.read()
      }
    } catch (e) {
      this.error(e)
    }
    this.vModal.loading = false
  }
  async update() {
    if (!this.updatable) return
    if (_.isEmpty(this.updateUrl)) return
    this.vModal.loading = true
    try {
      if ((this.$refs.form as any).validate()) {
        await axios.post(this.updateUrl, this.vModal.data)
        this.vModal.visible = false
        this.$emit('updated', this.vModal.data)
        await this.read()
      }
    } catch (e) {
      this.error(e)
    }
    this.vModal.loading = false
  }
  async delete(item) {
    if (!this.deletable) return
    if (_.isEmpty(this.deleteUrl)) return
    this.vLoading = true
    try {
      if (confirm('Bạn có chắc muốn xóa?')) {
        await axios.delete(this.deleteUrl, { data: item })
        this.$emit('deleted', item)
        await this.read()
      }
    } catch (e) {
      this.error(e)
    }
    this.vLoading = false
  }
}
