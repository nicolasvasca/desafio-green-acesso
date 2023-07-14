export const transforNamesToObjectName = {
  nameCorrections(names: string[]): object {
    const nameCorrections = {};
    names.forEach((name) => {
      const nameWithoutSpaces = name.replace(/\s/g, '').toUpperCase();
      nameCorrections[nameWithoutSpaces] = name;
    });
    return nameCorrections;
  },
};
