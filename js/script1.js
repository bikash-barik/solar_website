// Enable PDF button after agreement generation
function generateAgreement() {
 document.getElementById("out_system_size").textContent =
    document.getElementById("system_size").value;

  document.getElementById("out_slab").textContent =
    document.getElementById("slab").value;

  document.getElementById("out_commission_amount").textContent =
    document.getElementById("commission_amount").value;
  // Agreement details
  a_date.textContent = date.value;
  a_company.textContent = company.value;
  a_company2.textContent = company.value;
  a_vendor.textContent = vendor.value;
  a_duration.textContent = duration.value;

  // Authorized Company
  out_authorized_name.textContent = a_authorized_name.value;
  out_authorized_designation.textContent = a_authorized_designation.value;
  out_authorized_date.textContent = authorized_date.value;

  // Authorized Dealer
  out_dealer_name.textContent = a_dealer_name.value;
  out_dealer_designation.textContent = a_dealer_designation.value;
  out_dealer_date.textContent = dealer_date.value;

  // Agreement number
  agreementNo.textContent =
    new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);

  // Show agreement
  agreement.style.display = "block";

  // Enable PDF button
  pdfBtn.disabled = false;
}

// Print to PDF (clean output)
function downloadPDF() {

  const content = agreement.outerHTML;

  const win = window.open("", "_blank");
  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Vendor Agreement</title>
      <link rel="stylesheet" href="style.css">
      <style>
        @media print {
          .no-print { display: none !important; }
        }
      </style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `);

  win.document.close();

  win.onload = () => win.print();
}
