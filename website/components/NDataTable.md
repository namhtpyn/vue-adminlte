# NDataTable

## Props

<!-- @vuese:NDataTable:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|bordered|-|`Boolean`|`false`|true|
|hovered|-|`Boolean`|`false`|true|
|densed|-|`Boolean`|`false`|false|
|striped|-|`Boolean`|`false`|false|
|hideBottom|-|`Boolean`|`false`|false|
|hideTop|-|`Boolean`|`false`|false|
|hideFooter|-|`Boolean`|`false`|false|
|hideHeader|-|`Boolean`|`false`|false|
|searchable|-|`Boolean`|`false`|false|
|expandable|-|`Boolean`|`false`|false|
|autoRead|CRUD|`Boolean`|`false`|true|
|creatable|-|`Boolean`|`false`|false|
|updatable|-|`Boolean`|`false`|false|
|deletable|-|`Boolean`|`false`|false|
|newItem|eslint-disable-next-line prettier/prettier|`Object`|`false`|default() {
  return {};
}|
|readUrl|-|`String`|`false`|-|
|createUrl|-|`String`|`false`|-|
|updateUrl|-|`String`|`false`|-|
|deleteUrl|-|`String`|`false`|-|
|selectable|Selection|`Boolean`|`false`|false|
|multiple|-|`Boolean`|`false`|false|
|rowSelect|-|`Boolean`|`false`|false|
|keyField|-|`String`|`false`|-|
|caption|-|`String`|`false`|-|
|noDataText|-|`String`|`false`|'Không có dữ liệu'|
|headers|-|`Array`|`false`|-|

<!-- @vuese:NDataTable:props:end -->


## Events

<!-- @vuese:NDataTable:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|input|-|-|
|error|-|-|
|create-click|-|-|
|update-click|-|-|
|row-click|-|-|
|row-dblclick|-|-|
|row-contextmenu|-|-|
|delete|-|-|
|create|-|-|
|update|-|-|
|created|-|-|
|updated|-|-|
|deleted|-|-|

<!-- @vuese:NDataTable:events:end -->


## Slots

<!-- @vuese:NDataTable:slots:start -->
|Name|Description|Default Slot Content|
|---|---|---|
|top.prepend|-|-|
|top|-|-|
|top.append|-|-|
|`footer.${kebabCase(header.value)}`|-|-|
|bottom.prepend|-|-|
|bottom|-|-|
|bottom.append|-|-|
|modal|-|-|
|default|-|-|

<!-- @vuese:NDataTable:slots:end -->


