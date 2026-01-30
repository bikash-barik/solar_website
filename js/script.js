function generateReceipt() {

  const total = Number(total_cost.value);
  const loan = Number(loan_amount.value);
  const cash = Number(cash_received.value);
  const margin= total-loan;
  const remaining = total - cash;

  receipt_no.textContent =
    "REC-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);

  receipt_date.textContent = new Date().toLocaleDateString();

  out_customer.textContent = customer_name.value;
  out_mobile.textContent = mobile.value;
  out_address.textContent = address.value;

document.querySelectorAll(".out_plant").forEach(el => {
  el.textContent = plant_size.value;
});

  out_qty.textContent= qty.value;

  out_total_cost.textContent = total.toLocaleString("en-IN");

  out_loan.textContent = loan.toLocaleString("en-IN");
  out_margin.textContent = margin.toLocaleString("en-IN");
  out_cash.textContent = cash.toLocaleString("en-IN");
  out_remaining.textContent = remaining.toLocaleString("en-IN");

  amount_words.textContent = numberToWords(total) + " rupees";

  receipt.style.display = "block";
  pdfBtn.disabled = false;
pdfBtn.style.display = "inline-block";

}

function printPDF() {
  window.print();
}

/* -------- Amount in Words (Indian System) -------- */

function numberToWords(num) {
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six',
    'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve',
    'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];

  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty',
    'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero';

  function inWords(n) {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + ' ' + a[n % 10];
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred ' + inWords(n % 100);
    if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand ' + inWords(n % 1000);
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh ' + inWords(n % 100000);
    return inWords(Math.floor(n / 10000000)) + ' Crore ' + inWords(n % 10000000);
  }

  return inWords(num).trim();
}
