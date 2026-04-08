import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// @returns {Promise<string>} — PDF sertifikat yaratadi, fayl yo'lini qaytaradi
const generateCertificatePDF = (userName, section, uniqueId, issuedAt) => {
  return new Promise((resolve, reject) => {
    const dir = path.join(process.cwd(), 'uploads', 'certificates');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const filePath = path.join(dir, `${uniqueId}.pdf`);
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // Orqa fon
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#1a1a2e');

    // Chegara
    doc
      .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .lineWidth(3)
      .stroke('#4f46e5');

    // Sarlavha
    doc
      .fillColor('#ffffff')
      .fontSize(40)
      .font('Helvetica-Bold')
      .text('CODERS', 0, 80, { align: 'center' });

    doc
      .fontSize(18)
      .fillColor('#a5b4fc')
      .text('SERTIFIKAT', 0, 130, { align: 'center' });

    // Matn
    doc
      .fontSize(14)
      .fillColor('#e2e8f0')
      .text('Ushbu sertifikat quyidagi shaxsga beriladi:', 0, 190, { align: 'center' });

    doc
      .fontSize(28)
      .fillColor('#ffffff')
      .font('Helvetica-Bold')
      .text(userName, 0, 220, { align: 'center' });

    doc
      .fontSize(14)
      .fillColor('#e2e8f0')
      .font('Helvetica')
      .text(`${section} bo'limini muvaffaqiyatli tugatgani uchun`, 0, 270, { align: 'center' });

    // Sana va ID
    const date = new Date(issuedAt).toLocaleDateString('uz-UZ');
    doc
      .fontSize(11)
      .fillColor('#94a3b8')
      .text(`Sana: ${date}   |   ID: ${uniqueId}`, 0, 340, { align: 'center' });

    doc.end();

    stream.on('finish', () => resolve(`/uploads/certificates/${uniqueId}.pdf`));
    stream.on('error', reject);
  });
};

export { generateCertificatePDF };
