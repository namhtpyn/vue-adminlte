import XLSX from 'xlsx'
import { TableItem } from '../../types/Table'
export function exportToExcel(items: TableItem[], sheetName: string = 'export.xlsx') {
  // let wb = XLSX.utils.book_new()
  // var ws_name = 'SheetJS'
  // var ws_data = [['oh lala'], [1, 2, 3, 4, 5]]
  // items.forEach(i => {
  //   let row = []
  // })
  // var ws = XLSX.utils.aoa_to_sheet(ws_data)
  // ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }]
  // XLSX.utils.book_append_sheet(wb, ws, ws_name)
  // XLSX.writeFile(wb, sheetName, { bookType: 'xlsx' })
}
