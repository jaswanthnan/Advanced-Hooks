import { useCallback, useMemo, useRef, forwardRef, useImperativeHandle } from "react";
import { AgGridReact } from "ag-grid-react";
import { 
  ColDef, 
  GridApi, 
  GridReadyEvent, 
  SelectionChangedEvent,
  ColumnResizedEvent,
  ColumnVisibleEvent,
  ColumnMovedEvent
} from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

interface AgGridTableProps {
  rowData: any[];
  columnDefs: ColDef[];
  onGridReady?: (params: GridReadyEvent) => void;
  onSelectionChanged?: (event: SelectionChangedEvent) => void;
  onColumnChanged?: (event: ColumnResizedEvent | ColumnVisibleEvent | ColumnMovedEvent) => void;
  paginationPageSize?: number;
  gridId?: string;
  enableCheckboxes?: boolean;
  theme?: string;
  defaultColDef?: ColDef;
  [key: string]: any;
}

export interface AgGridTableHandle {
  getApi: () => GridApi | undefined;
  exportData: (fileName: string) => void;
  setQuickFilter: (text: string) => void;
  getSelectedRows: () => any[];
}

/**
 * AgGridTable: Refactored to use forwardRef and useImperativeHandle.
 * This allows parents to call grid methods directly via a ref.
 */
const AgGridTable = forwardRef<AgGridTableHandle, AgGridTableProps>(({
  rowData,
  columnDefs,
  onGridReady,
  onSelectionChanged,
  onColumnChanged,
  paginationPageSize = 10,
  gridId = "defaultGrid",
  enableCheckboxes = true,
  ...props
}, ref) => {
  const gridRef = useRef<AgGridReact>(null);

  // Expose specific grid APIs to the parent component
  useImperativeHandle(ref, () => ({
    getApi: () => gridRef.current?.api,
    exportData: (fileName: string) => {
      gridRef.current?.api?.exportDataAsCsv({ fileName });
    },
    setQuickFilter: (text: string) => {
      gridRef.current?.api?.setGridOption("quickFilterText", text);
    },
    getSelectedRows: () => gridRef.current?.api?.getSelectedRows() || []
  }));

  const defaultColDef = useMemo<ColDef>(() => ({
    resizable: true,
    sortable: true,
    filter: true,
    minWidth: 100,
    flex: 1,
    ...props.defaultColDef,
  }), [props.defaultColDef]);

  const internalOnGridReady = useCallback((params: GridReadyEvent) => {
    params.api.setGridOption("domLayout", "autoHeight");
    if (onGridReady) onGridReady(params);
  }, [onGridReady]);

  const themeClass = props.theme || "ag-theme-alpine";
  
  const rowSelectionConfig: any = enableCheckboxes ? {
    mode: "multiRow",
    headerCheckbox: true,
    checkboxes: true,
    enableClickSelection: false,
  } : undefined;

  return (
    <div id={gridId} className={themeClass} style={{ width: "100%" }}>
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        onGridReady={internalOnGridReady}
        onColumnVisible={onColumnChanged as any}
        onColumnResized={onColumnChanged as any}
        onColumnMoved={onColumnChanged as any}
        domLayout="autoHeight"
        rowSelection={rowSelectionConfig}
        pagination={true}
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={[5, 10, 20, 50]}
        onSelectionChanged={onSelectionChanged}
        defaultColDef={defaultColDef}
        rowHeight={52}
        headerHeight={48}
        {...props}
      />
    </div>
  );
});

AgGridTable.displayName = 'AgGridTable';

export default AgGridTable;
