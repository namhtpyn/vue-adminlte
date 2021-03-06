import { Vue, Component, Prop } from '@namhoang/vue-property-decorator'
import { ExportCellData } from '../../types/Table'

@Component({})
export default class NTableProp extends Vue {
  @Prop({ type: Boolean, default: true }) readonly bordered!: boolean
  @Prop({ type: Boolean, default: true }) readonly hovered!: boolean
  @Prop({ type: Boolean, default: false }) readonly densed!: boolean
  @Prop({ type: Boolean, default: false }) readonly striped!: boolean

  @Prop({ type: Boolean, default: true }) readonly responsive!: boolean

  @Prop({ type: Boolean, default: false }) readonly hideBottom!: boolean
  @Prop({ type: Boolean, default: false }) readonly hideTop!: boolean
  @Prop({ type: Boolean, default: false }) readonly hideFooter!: boolean
  @Prop({ type: Boolean, default: false }) readonly hideHeader!: boolean

  @Prop({ type: Boolean, default: false }) readonly searchable!: boolean

  @Prop({ type: Boolean, default: false }) readonly multipleSort!: boolean
  @Prop({ type: Boolean, default: false }) readonly multipleFilter!: boolean

  @Prop({ type: Boolean, default: false }) readonly expandable!: boolean
  @Prop({ type: Boolean, default: false }) readonly multipleExpand!: boolean

  @Prop({ type: Boolean, default: false }) readonly stickyTop!: boolean

  @Prop({ type: Boolean, default: false }) readonly excelable!: boolean
  @Prop({ type: Boolean, default: false }) readonly ordinal!: boolean

  /**Enable selection */
  @Prop({ type: Boolean, default: false }) readonly selectable!: boolean
  @Prop({ type: Boolean, default: false }) readonly multipleSelect!: boolean
  @Prop({ type: Boolean, default: false }) readonly rowSelect!: boolean
  @Prop(String) readonly keyField!: string

  @Prop(String) readonly caption!: string

  /**Auto read on component initialize and when read-url is changed */
  @Prop({ type: Boolean, default: false }) readonly creatable!: boolean
  @Prop({ type: Boolean, default: false }) readonly updatable!: boolean
  @Prop({ type: Boolean, default: false }) readonly deletable!: boolean
  /**default value for new item */
  @Prop({
    type: Object,
    default: () => {
      return {}
    },
  })
  newItem!: string
  @Prop(String) readonly createUrl!: string
  @Prop(String) readonly updateUrl!: string
  @Prop(String) readonly deleteUrl!: string

  @Prop({ type: String, default: '' }) readonly appendModalCaption!: string
  @Prop({ type: String, default: '' }) readonly exportTitle!: string
  @Prop({ type: String }) readonly exportSheetName!: string
  @Prop({ type: String }) readonly exportHeaderColor!: string
  @Prop({ type: String }) readonly exportHeaderBgColor!: string
  @Prop({ type: Array, default: () => [] }) readonly exportAfterTitle!: ExportCellData[][]
}
