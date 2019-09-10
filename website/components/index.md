# index

## Props

<!-- @vuese:index:props:start -->
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
|autoRead|Auto read on component initialize and when read-url is changed|`Boolean`|`false`|true|
|creatable|-|`Boolean`|`false`|false|
|updatable|-|`Boolean`|`false`|false|
|deletable|-|`Boolean`|`false`|false|
|newItem|default value for new item|`Object`|`false`|{}|
|readUrl|-|`String`|`false`|-|
|createUrl|-|`String`|`false`|-|
|updateUrl|-|`String`|`false`|-|
|deleteUrl|-|`String`|`false`|-|
|selectable|Enable selection|`Boolean`|`false`|false|
|multiple|Only work with selectable, enable checkbox instead of radio|`Boolean`|`false`|false|
|rowSelect|-|`Boolean`|`false`|false|
|keyField|-|`String`|`false`|-|
|caption|-|`String`|`false`|-|
|noDataText|-|`String`|`false`|'Không có dữ liệu'|
|headers|-|`Array`|`false`|-|

<!-- @vuese:index:props:end -->


## Events

<!-- @vuese:index:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|input|-|-|
|error|-|-|
|row-click|-|-|
|row-dblclick|-|-|
|row-contextmenu|-|-|
|created|-|-|
|updated|-|-|
|deleted|-|-|

<!-- @vuese:index:events:end -->


## Slots

<!-- @vuese:index:slots:start -->
|Name|Description|Default Slot Content|
|---|---|---|
|top.prepend|-|-|
|top|-|-|
|top.append|-|-|
|`item.${kebabCase(header.value)}`|-|-|
|`footer.${kebabCase(header.value)}`|-|-|
|bottom.prepend|-|-|
|bottom|-|-|
|bottom.append|-|-|
|modal|-|-|
|default|-|-|

<!-- @vuese:index:slots:end -->


