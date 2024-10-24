const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const { Readable } = require("stream");

const exportToExcel = async (data, filename) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Report");

  // Assuming data is an array of objects
  if (Array.isArray(data) && data.length > 0) {
    // Add header row
    worksheet.columns = Object.keys(data[0]).map((key) => ({
      header: key,
      key,
    }));
    // Add data rows
    data.forEach((item) => worksheet.addRow(item));
  } else if (typeof data === "object") {
    // For single object data
    worksheet.addRow(data);
  }

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return {
    contentType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    filename,
    data: buffer,
  };
};

const exportToPDF = async (data, filename) => {
  const doc = new PDFDocument();
  let buffers = [];
  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {});

  // Add content to PDF
  doc.fontSize(12).text(JSON.stringify(data, null, 2));
  doc.end();

  const buffer = Buffer.concat(buffers);
  return {
    contentType: "application/pdf",
    filename,
    data: buffer,
  };
};

const exportToCSV = async (data, filename) => {
  let csv = "";
  if (Array.isArray(data) && data.length > 0) {
    const headers = Object.keys(data[0]);
    csv += headers.join(",") + "\n";
    data.forEach((item) => {
      csv += headers.map((key) => item[key]).join(",") + "\n";
    });
  } else if (typeof data === "object") {
    csv += Object.keys(data).join(",") + "\n";
    csv += Object.values(data).join(",") + "\n";
  }

  return {
    contentType: "text/csv",
    filename,
    data: Buffer.from(csv),
  };
};

module.exports = {
  exportToExcel,
  exportToPDF,
  exportToCSV,
};

/**
 * There she goes, fading into the night;
 * Goodbye, my dear cold friend.
 * I can't help but profoundly regret
 * the way our story has come to an end.
 */
