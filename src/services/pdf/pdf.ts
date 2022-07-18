import pdfmake from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { GetAcquisitionsByPaymentId } from '../../serverless/data/usecases/GetAcquisitonsByPaymentId';
import formatDate from '../../utils/formatDate';

export type ReportPurchaseInfo = Array<string | number>[]

const handlePDF = async (qrcode: string, content: GetAcquisitionsByPaymentId) => {
  const purchases: ReportPurchaseInfo = [];

  for (const data of content.purchases) {
    const purchaseCreateMonth = new Date(data.created_at).getMonth();
    const currentMonth = new Date().getMonth();

    if (purchaseCreateMonth === currentMonth) {
      purchases.push([data.description, data.value, formatDate(new Date(data.created_at))]);
    }
  }
  const template: TDocumentDefinitions = {
    info: {
      title: 'Pragmatic Money report',
      author: 'Pragmatic Money',
    },
    pageOrientation: 'landscape',
    content: [
      {
        text: `Relatório do mês até o dia ${new Date().getDate()}`,
        style: 'header',
      },
      'Este relatório contém as informações de todos os gastos guardados na plataforma referente a conta atual.',
      {
        text: `Apelido da conta: ${content.nickname}\nSaldo Atual: R$ ${Number(content.current_value).toFixed(2)}\n`,
        bold: true,
        style: 'tableExample',
      },
      {
        text: 'Gastos do mês',
        bold: true,
        fontSize: 18,
        margin: [15, 0, 15, 0],
      },
      {
        style: 'tableExample',
        table: {
          widths: '*',
          body: [
            ['DESCRIÇÃO', 'VALOR (R$)', 'DATA DE COMPRA'],
            ...purchases,
          ],
        },
      },
      {
        text: 'Leia o QRCode e entre em nossa plataforma. B)',
        style: 'qrImage',
      },

      {
        image: qrcode,
        width: 100,
        style: 'qrImage',
      },
      {
        text: 'Prag.Money$',
        style: ['qrImage', 'logoMargin'],
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
      },
      subheader: {
        fontSize: 15,
        bold: true,
      },
      quote: {
        italics: true,
      },
      small: {
        fontSize: 8,
      },
      tableExample: {
        margin: [15, 15, 15, 15],

      },

      logoMargin: {
        margin: [15, 0, 15, 0],

      },
      qrImage: {
        alignment: 'right',
      },
    },
  };

  pdfmake.vfs = pdfFonts.pdfMake.vfs;
  pdfmake.createPdf(template).open();
};

export default handlePDF;
