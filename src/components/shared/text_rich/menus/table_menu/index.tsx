import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { TableCellsIcon } from "@heroicons/react/24/outline";
import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";

const COLUMNS = 7;
const ROWS = 5;

type GridSize = { cols: number; rows: number };

interface TableBuilderProps {
  onCreate: (value: GridSize) => void;
  onClose: () => void;
}

const TableBuilder = ({
  onCreate,
  onClose,
}: TableBuilderProps): React.ReactElement => {
  const [gridSize, setGridSize] = useState<GridSize>({ cols: 1, rows: 1 });
  const builderRef = useRef<HTMLDivElement>(null);

  const isActiveCell = useCallback(
    (rowIndex: number, colIndex: number) => {
      return rowIndex < gridSize.rows && colIndex < gridSize.cols;
    },
    [gridSize]
  );

  const handleCellClick = useCallback(() => {
    onCreate(gridSize);
    onClose();
  }, [gridSize, onCreate, onClose]);

  // Cerrar si se hace clic fuera del TableBuilder
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        builderRef.current &&
        !builderRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const grid = useMemo(
    () =>
      Array.from({ length: ROWS }, (_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex">
          {Array.from({ length: COLUMNS }, (_, colIndex) => (
            <div
              key={`col-${colIndex}`}
              className={`w-6 h-6 border border-stone-300 m-0.5 cursor-pointer ${
                isActiveCell(rowIndex, colIndex)
                  ? "bg-blue-500"
                  : "bg-white hover:bg-blue-100"
              }`}
              onMouseMove={() =>
                setGridSize({ cols: colIndex + 1, rows: rowIndex + 1 })
              }
              onClick={handleCellClick}
            />
          ))}
        </div>
      )),
    [ROWS, COLUMNS, isActiveCell, handleCellClick]
  );

  return (
    <div
      ref={builderRef}
      className="absolute z-10 mt-2 p-2 bg-white shadow-lg border "
    >
      <div className="grid gap-0.5">{grid}</div>
      <div className="text-center mt-1 text-sm">
        {gridSize.rows} x {gridSize.cols}
      </div>
    </div>
  );
};

interface TableMenuProps {
  editor: Editor | null;
}

export const TableMenu = ({ editor }: TableMenuProps) => {
  const [isTableBuilderOpen, setIsTableBuilderOpen] = useState(false);

  // Mover el useCallback antes del return para mantener el orden correcto de los hooks
  const handleCreateTable = useCallback(
    (size: GridSize) => {
      console.log("Creando tabla con tamaño:", size);
      if (!editor) return;
      editor
        .chain()
        .focus()
        .insertTable({ rows: size.rows, cols: size.cols, withHeaderRow: true })
        .run();
      setIsTableBuilderOpen(false);
    },
    [editor]
  );

  if (!editor) return null;

  const toggleTableBuilder = () => {
    setIsTableBuilderOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={toggleTableBuilder}
        className={`h-9 px-2 rounded-none ${
          editor.isActive("table") ? "bg-stone-200" : ""
        } ${isTableBuilderOpen ? "bg-stone-200" : ""}`}
        title="Insertar tabla"
      >
        <TableCellsIcon className="h-5 w-5" />
      </Button>
      {isTableBuilderOpen && (
        <TableBuilder
          onCreate={handleCreateTable}
          onClose={() => setIsTableBuilderOpen(false)}
        />
      )}
    </div>
  );
};
