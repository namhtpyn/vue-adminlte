<template>
  <div class="nav nav-tabs-custom">
    <ul class="nav nav-tabs">
      <li v-for="(i, k) in headers" :key="k" :class="{ active: k === tabActive - 1 }">
        <a :href="`#${id}-tab${k}`" data-toggle="tab">{{ i }}</a>
      </li>
    </ul>
    <div class="tab-content">
      <div v-for="(i, k) in contents" :key="k" :id="`${id}-tab${k}`" :class="{ 'tab-pane': true, active: k === tabActive - 1 }">
        <slot :name="`${id}-tab${k + 1}`">
          <p>{{ i }}</p>
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({ inheritAttrs: false })
export default class NTab extends Vue {
  @Prop({ type: String, required: true }) id!: string
  @Prop({ type: [Number, String], default: 1 }) value!: number | string
  @Prop() items!: any[]

  get headers() {
    return this.items.map(i => i.header)
  }

  get contents() {
    return this.items.map(i => i.content)
  }

  get tabActive() {
    return Number(this.value)
  }
}
</script>

<style scoped></style>
