import type { ReactNode } from 'react';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableGridProps<T extends { id: number }> {
  items: T[];
  // Recibe la lista ya reordenada
  onReorder: (items: T[]) => void;
  className?: string;
  disabled?: boolean;
  // `dragHandle` es el botón de arrastre que cada tarjeta coloca donde quiera
  children: (item: T, dragHandle: ReactNode) => ReactNode;
}

/**
 * Lista/grid con drag & drop (dnd-kit). Solo se arrastra desde el asa para no
 * interferir con los botones y enlaces de la tarjeta. También funciona con teclado:
 * foco en el asa, Espacio para agarrar, flechas para mover y Espacio para soltar.
 * En pantallas táctiles el arrastre se activa con una pulsación larga sobre el asa,
 * así deslizar el dedo sigue haciendo scroll en la página.
 */
export default function SortableGrid<T extends { id: number }>({
  items,
  onReorder,
  className,
  disabled = false,
  children,
}: SortableGridProps<T>) {
  const sensors = useSensors(
    // Ratón: la distancia mínima evita que un clic en el asa cuente como arrastre
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    // Táctil: hay que mantener pulsado 250 ms sin moverse más de 5 px; si el dedo se
    // desplaza antes, el gesto se trata como scroll y no se arrastra la tarjeta
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = items.findIndex((item) => item.id === active.id);
    const to = items.findIndex((item) => item.id === over.id);
    if (from === -1 || to === -1) return;
    onReorder(arrayMove(items, from, to));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((item) => item.id)} strategy={rectSortingStrategy} disabled={disabled}>
        <div className={className}>
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id} disabled={disabled}>
              {(dragHandle) => children(item, dragHandle)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableItem({
  id,
  disabled,
  children,
}: {
  id: number;
  disabled: boolean;
  children: (dragHandle: ReactNode) => ReactNode;
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled,
  });

  const dragHandle = (
    <button
      type="button"
      ref={setActivatorNodeRef}
      {...attributes}
      {...listeners}
      aria-label="Arrastrar para cambiar el orden"
      title="Arrastrar para cambiar el orden"
      disabled={disabled}
      className="flex size-10 shrink-0 cursor-grab sm:size-8 touch-manipulation select-none items-center [-webkit-touch-callout:none] justify-center rounded-md text-slate-500 transition hover:bg-slate-700/60 hover:text-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-40"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
        <circle cx="9" cy="6" r="1.6" />
        <circle cx="15" cy="6" r="1.6" />
        <circle cx="9" cy="12" r="1.6" />
        <circle cx="15" cy="12" r="1.6" />
        <circle cx="9" cy="18" r="1.6" />
        <circle cx="15" cy="18" r="1.6" />
      </svg>
    </button>
  );

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`h-full ${isDragging ? 'relative z-10 opacity-80 shadow-2xl shadow-emerald-500/10' : ''}`}
    >
      {children(dragHandle)}
    </div>
  );
}
