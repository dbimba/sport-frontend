import { useMemo } from 'react';

const CATEGORY_NAMES = {
  1: 'Протеїни',
  2: 'Амінокислоти та Креатин',
  3: 'Передтренувальні комплекси',
  4: 'Вітаміни та БАДи',
  5: 'Здорове харчування та Снеки',
};

export function useStatsAnalytics(products) {
  return useMemo(() => {
    if (!products || products.length === 0) {
      return { totalValue: 0, totalCount: 0, categories: [] };
    }

    const totalValue = products.reduce(
      (acc, p) => acc + Number(p.current_price || 0),
      0
    );

    const grouped = products.reduce((acc, p) => {
      const id = p.category_id ?? 0;
      if (!acc[id]) acc[id] = { sum: 0, count: 0 };
      acc[id].sum   += Number(p.current_price || 0);
      acc[id].count += 1;
      return acc;
    }, {});

    const categories = Object.entries(grouped)
      .map(([id, { sum, count }]) => ({
        name:    CATEGORY_NAMES[id] ?? `Категорія ${id}`,
        sum,
        count,
        percent: totalValue > 0
          ? Math.round((sum / totalValue) * 100)
          : 0,
      }))
      
      .sort((a, b) => b.sum - a.sum);

    return { totalValue, totalCount: products.length, categories };

  }, [products]);
}
