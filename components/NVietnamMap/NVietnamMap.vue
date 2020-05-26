<template>
  <div class="map" :id="vnMapID"></div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from '@namhoang/vue-property-decorator'
import _ from 'lodash'
import L, { LatLngBoundsExpression, Layer } from 'leaflet'
import 'leaflet-hash'
import vnData from './data'
import { Feature, Geometry } from 'geojson'

@Component
export default class NTab extends Vue {
  @Prop({ type: Boolean, default: false }) zoomControl!: boolean
  @Prop({ type: Number, default: 12 }) maxZoom!: number
  @Prop({ type: Number, default: 4 }) minZoom!: number
  @Prop({ type: Number, default: 6 }) zoom!: number
  @Prop({
    type: Array,
    default: () => [
      [8.006006996187176, 93.23522663188905],
      [23.573945396187177, 120.91755730502598]
    ]
  })
  fitBounds!: LatLngBoundsExpression

  @Prop({ type: Number, default: 1 }) opacity!: number
  @Prop({ type: String, default: '#232323' }) color!: string
  @Prop({ type: String, default: 'butt' }) lineCap!: 'butt' | 'round' | 'square' | 'inherit' | undefined
  @Prop({ type: String, default: 'miter' }) lineJoin!: 'round' | 'inherit' | 'bevel' | 'miter' | undefined
  @Prop({ type: Number, default: 1 }) weight!: number
  @Prop({ type: Boolean, default: true }) fill!: boolean
  @Prop({ type: Number, default: 1 }) fillOpacity!: number
  @Prop({ type: String, default: '#ffffff' }) fillColor!: string

  @Prop(Number) hoverOpacity!: number
  @Prop({ type: String, default: '#63b8ff' }) hoverColor!: string
  @Prop(String) hoverLineCap!: 'butt' | 'round' | 'square' | 'inherit' | undefined
  @Prop(String) hoverLineJoin!: 'round' | 'inherit' | 'bevel' | 'miter' | undefined
  @Prop({ type: Number, default: 2.5 }) hoverWeight!: number
  @Prop(Boolean) hoverFill!: boolean
  @Prop(Number) hoverFillOpacity!: number
  @Prop(String) hoverFillColor!: string
  map?: L.Map = undefined

  get vnMapID() {
    return _.uniqueId('n_vietnam_map_')
  }
  normalStyle(): L.PathOptions {
    return {
      opacity: this.opacity,
      color: this.color,
      lineCap: this.lineCap,
      lineJoin: this.lineJoin,
      weight: this.weight,
      fill: this.fill,
      fillOpacity: this.fillOpacity,
      fillColor: this.fillColor
    }
  }
  hoverStyle(): L.PathOptions {
    return {
      opacity: this.hoverOpacity || this.opacity,
      color: this.hoverColor || this.color,
      lineCap: this.hoverLineCap || this.lineCap,
      lineJoin: this.hoverLineJoin || this.lineJoin,
      weight: this.hoverWeight || this.weight,
      fill: this.hoverFill || this.fill,
      fillOpacity: this.hoverFillOpacity || this.fillOpacity,
      fillColor: this.hoverFillColor || this.fillColor
    }
  }
  @Emit() provinceClick(e) {}
  @Emit() provinceInit(p, l) {}
  onEachProvince(feature: Feature<Geometry, any>, layer: L.Layer) {
    layer.bindTooltip(feature.properties.Name)

    layer.on({
      mouseover: e => e.target.setStyle(this.hoverStyle()).openTooltip(),
      mouseout: e => e.target.setStyle(this.normalStyle()).closeTooltip(),
      click: e => this.provinceClick(e)
    })

    this.provinceInit(feature.properties, layer)
  }
  renderMap() {
    this.map = L.map(this.vnMapID, {
      zoomControl: this.zoomControl,
      maxZoom: this.maxZoom,
      minZoom: this.minZoom
    })
      .fitBounds(this.fitBounds)
      .setZoom(this.zoom)

    //Add data to map
    const mapLayer = L.geoJSON(vnData, {
      style: this.normalStyle,
      onEachFeature: this.onEachProvince
    })

    mapLayer.addTo(this.map)

    //retain location on url
    new (L as any).Hash(this.map)
  }
  mounted() {
    this.renderMap()
  }
}
</script>

<style scoped>
.map {
  height: 300px;
  background-color: transparent !important;
}
</style>
