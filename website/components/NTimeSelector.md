# NTimeSelector

## Props

<!-- @vuese:NTimeSelector:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|label|-|`String`|`false`|-|
|value|-|`Date`|`false`|-|
|id|-|`String`|`false`|-|
|placeholder|-|`String`|`false`|-|
|name|-|`String`|`false`|-|
|required|-|`Boolean`|`false`|false|
|disabled|-|`Boolean`|`false`|false|
|displayHours|-|`Boolean`|`false`|true|
|displayMinutes|-|`Boolean`|`false`|true|
|displaySeconds|-|`Boolean`|`false`|false|
|separator|-|`String`|`false`|':'|
|initialView|-|`Boolean`|`false`|false|
|padTime|-|`Boolean`|`false`|false|
|form|-|`Boolean`|`false`|false|
|displayFormat|-|`String`|`false`|-|
|returnFormat|-|`String`|`false`|-|
|h24|-|`Boolean`|`false`|true|
|utc|-|`Boolean`|`false`|false|

<!-- @vuese:NTimeSelector:props:end -->


## Events

<!-- @vuese:NTimeSelector:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|formatedTime|-|-|
|input|Emit event because input has changed|-|
|selectedDisabled|Emit event because disabled time has been clicked|-|

<!-- @vuese:NTimeSelector:events:end -->


## Slots

<!-- @vuese:NTimeSelector:slots:start -->
|Name|Description|Default Slot Content|
|---|---|---|
|hours|-|-|
|minutes|-|-|

<!-- @vuese:NTimeSelector:slots:end -->


