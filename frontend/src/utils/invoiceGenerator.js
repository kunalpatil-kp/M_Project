import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generateInvoice = (order) => {
  const doc = new jsPDF();

  // ===== Header =====
  doc.setFontSize(22);
  doc.setTextColor(34, 139, 34);
  doc.text("Fresh Grocery", 15, 20);

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("INVOICE", 15, 30);

  // ===== Divider =====
  doc.setDrawColor(200, 200, 200);
  doc.line(15, 36, 195, 36);

  // ===== Order Details =====
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);

  doc.text(`Order ID : ${order._id}`, 15, 46);
  doc.text(
    `Date     : ${new Date(order.date || Date.now()).toLocaleDateString("en-IN")}`,
    15,
    54
  );
  doc.text(`Status   : ${order.status || "Processing"}`, 15, 62);

  // ===== Items Table =====
  autoTable(doc, {
    startY: 74,
    head: [["Item", "Qty", "Unit Price", "Total"]],
    body: order.items.map((item) => [
      item.name,
      item.quantity,
      `Rs.${item.price}`,
      `Rs.${item.price * item.quantity}`,
    ]),
    headStyles: {
      fillColor: [34, 139, 34],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 255, 245],
    },
    styles: {
      fontSize: 11,
    },
  });

  let finalY = doc.lastAutoTable.finalY + 12;

  // Calculate totals
  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 0 ? 2 : 0;
  const discount = Math.max(0, subtotal + deliveryFee - order.amount);

  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  
  doc.text(`Subtotal : Rs.${subtotal}`, 15, finalY);
  finalY += 8;
  doc.text(`Delivery Fee : Rs.${deliveryFee}`, 15, finalY);
  finalY += 8;
  
  if (discount > 0) {
    doc.setTextColor(34, 139, 34);
    doc.text(`Discount${order.couponCode ? ` (${order.couponCode})` : ""} : - Rs.${discount}`, 15, finalY);
    finalY += 10;
  } else {
    finalY += 4;
  }

  // ===== Grand Total =====
  doc.setFontSize(13);
  doc.setTextColor(0, 0, 0);
  doc.text(`Grand Total : Rs.${order.amount}`, 15, finalY);

  doc.setFontSize(11);
  doc.setTextColor(0, 128, 0);
  doc.text("Payment Status : Paid", 15, finalY + 10);

  doc.setTextColor(100, 100, 100);
  doc.text("Thank you for shopping with Fresh Grocery!", 15, finalY + 22);

  // ===== Save =====
  doc.save(`Invoice-${order._id}.pdf`);
};

export default generateInvoice;
