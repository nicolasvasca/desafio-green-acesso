export const styleSheets = {
  styled(sheet) {
    sheet.getColumn(1).width = 20.5;
    sheet.getColumn(2).width = 20.5;
    sheet.getColumn(3).width = 20.5;
    sheet.getColumn(4).width = 40.5;
    sheet.getColumn(5).width = 20.5;

    sheet.getRow(1).height = 30.5;

    sheet.getRow(1).font = {
      size: 11.5,
      bold: true,
      color: { argb: 'FFFFFF' },
    };

    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      bgColor: { argb: '000000' },
      fgColor: { argb: '000000' },
    };

    sheet.getRow(1).alignment = {
      vertical: 'middles',
      horizontal: 'center',
      wrapText: true,
    };

    sheet.getRow(1).border = {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: 'FFFFFF' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: 'FFFFFF' } },
    };

    const blackBorder = { style: 'medium', color: { argb: '000000' } };
    for (let i = 2; i <= 5; i++) {
      sheet.getColumn(i).border = blackBorder;
    }

    sheet.eachRow((row) => {
      row.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };
    });

    return sheet;
  },
  firstColumn() {
    const firstColumn = {
      id: 'id',
      nome_sacado: 'nome_sacado',
      id_lote: 'id_lote',
      valor: 'valor',
      linha_digitavel: 'linha_digitavel',
    };
    return firstColumn;
  },
};
