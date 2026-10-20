import { useState, type Dispatch, type SetStateAction } from 'react';
import { getApiErrorMessage } from '../api/client';

interface ManualOrderItem {
  id: number;
  isFeatured: boolean;
}

interface ManualOrderApi<T> {
  reorder: (ids: number[]) => Promise<T[]>;
  setFeatured: (id: number, isFeatured: boolean) => Promise<T>;
}

/**
 * Orden manual (drag & drop) y destacado de una lista del admin.
 * Ambos cambios se aplican al instante en pantalla y se revierten si el servidor falla.
 */
export function useManualOrder<T extends ManualOrderItem>(
  items: T[],
  setItems: Dispatch<SetStateAction<T[]>>,
  api: ManualOrderApi<T>,
) {
  const [isReordering, setIsReordering] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const reorder = async (reordered: T[]) => {
    const previous = items;
    setItems(reordered);
    setIsReordering(true);
    setActionError(null);
    try {
      setItems(await api.reorder(reordered.map((item) => item.id)));
    } catch (err) {
      setItems(previous);
      setActionError(getApiErrorMessage(err, 'No se pudo guardar el nuevo orden.'));
    } finally {
      setIsReordering(false);
    }
  };

  const toggleFeatured = async (item: T) => {
    const isFeatured = !item.isFeatured;
    const patch = (value: boolean) =>
      setItems((prev) => prev.map((current) => (current.id === item.id ? { ...current, isFeatured: value } : current)));

    patch(isFeatured);
    setTogglingId(item.id);
    setActionError(null);
    try {
      const saved = await api.setFeatured(item.id, isFeatured);
      setItems((prev) => prev.map((current) => (current.id === saved.id ? saved : current)));
      return saved;
    } catch (err) {
      patch(item.isFeatured);
      setActionError(getApiErrorMessage(err, 'No se pudo cambiar el destacado.'));
      return null;
    } finally {
      setTogglingId(null);
    }
  };

  return { reorder, toggleFeatured, isReordering, togglingId, actionError };
}
