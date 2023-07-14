export const queryBuilder = {
  bills(query, filter) {
    let first = true;
    if (filter?.name) {
      const nameWithoutSpaces = filter.name.replace(/\s/g, '');
      query = query.where('bill.nameDrawn ILIKE :name', {
        name: `%${nameWithoutSpaces}%`,
      });
      first = false;
    }

    if (filter?.valueMin && filter?.valueMax) {
      query = first
        ? query.where('bill.value BETWEEN :min AND :max', {
            min: filter.valueMin,
            max: filter.valueMax,
          })
        : query.andWhere('bill.value BETWEEN :min AND :max', {
            min: filter.valueMin,
            max: filter.valueMax,
          });
    } else if (filter?.valueMin) {
      query = first
        ? query.where('bill.value >= :min', { min: filter.valueMin })
        : query.andWhere('bill.value >= :min', { min: filter.valueMin });
    } else if (filter?.valueMax) {
      query = first
        ? query.where('bill.value <= :max', { max: filter.valueMax })
        : query.andWhere('bill.value <= :max', { max: filter.valueMax });
    }

    if (filter?.lotId) {
      query = first
        ? query.where('bill.lotId = :lotId', { lotId: filter.lotId })
        : query.andWhere('bill.lotId = :lotId', { lotId: filter.lotId });
    }
    return query;
  },
};
