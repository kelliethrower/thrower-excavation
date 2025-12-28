// Toggle collapsible sections
document.querySelectorAll('.collapsible h2').forEach(header => {
  header.addEventListener('click', () => {
    const section = header.parentElement.querySelector('.employeeFields');
    if (section) section.style.display = section.style.display === 'block' ? 'none' : 'block';
  });
});

document.getElementById('quoteForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const client = document.getElementById('client').value;
  const service = document.getElementById('service').value;
  const street = document.getElementById('street').value;
  const city = document.getElementById('city').value;
  const state = document.getElementById('state').value.toUpperCase();
  const zip = document.getElementById('zip').value;

  const hours = parseFloat(document.getElementById('hours').value);
  const ownerRate = parseFloat(document.getElementById('ownerRate').value);
  const equipRate = parseFloat(document.getElementById('equipRate').value);
  const materials = parseFloat(document.getElementById('materials').value);

  let employeeCost = 0;
  if (document.getElementById('hasEmployee').checked) {
    const numEmp = parseInt(document.getElementById('numEmp').value);
    const empRate = parseFloat(document.getElementById('empRate').value);
    employeeCost = numEmp * empRate * hours;
  }

  const laborCost = hours * ownerRate;
  const equipmentCost = hours * equipRate;
  const subtotal = laborCost + equipmentCost + employeeCost + materials;
  const tax = subtotal * 0.07;
  let ccFee = 0;
  if (document.getElementById('ccPayment').checked) ccFee = (subtotal + tax) * 0.03;
  const total = subtotal + tax + ccFee;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("THROWER EXCAVATION", 105, 20, null, null, "center");
  doc.setFontSize(12);
  doc.text("ESTIMATE", 105, 30, null, null, "center");

  doc.setFontSize(10);
  let y = 50;
  doc.text(`Client: ${client}`, 20, y); y += 6;
  doc.text(`Service: ${service}`, 20, y); y += 6;
  doc.text(`Job Address: ${street}, ${city}, ${state} ${zip}`, 20, y); y += 6;
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, y); y += 12;

  doc.text(`Owner Labor: $${laborCost.toFixed(2)}`, 20, y); y += 6;
  doc.text(`Equipment: $${equipmentCost.toFixed(2)}`, 20, y); y += 6;
  if (employeeCost > 0) { doc.text(`Employee Labor: $${employeeCost.toFixed(2)}`, 20, y); y += 6; }
  doc.text(`Materials/Disposal: $${materials.toFixed(2)}`, 20, y); y += 6;
  doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 20, y); y += 6;
  doc.text(`Tax (7%): $${tax.toFixed(2)}`, 20, y); y += 6;
  if (ccFee > 0) { doc.text(`Processing Fee (3%): $${ccFee.toFixed(2)}`, 20, y); y += 6; }
  doc.text(`TOTAL ESTIMATE: $${total.toFixed(2)}`, 20, y); y += 12;

  doc.text("Valid for 30 days", 20, y); y += 12;
  doc.text("Authorized Signature: ____________________", 20, y); y += 6;
  doc.text("Client Signature: _________________________", 20, y);

  doc.save(`estimate_${client.replace(" ","_")}.pdf`);
});
