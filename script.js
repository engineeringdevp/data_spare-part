const BASE_URL = "https://script.google.com/macros/s/AKfycbz80dvVERQFjaWHQufYmtFz-pq7NEL5RXuANc-iKTdmfifRYWxORCHIVqknq0wFGojR/exec";

// Load 1 sheet
async function loadSheet(sheetName) {
  try {
    const res = await fetch(BASE_URL + "?sheet=" + encodeURIComponent(sheetName));
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    return [];
  }
}

// Render ke tabel
function renderData(data) {
const tbody = document.getElementById("sp-body-chem");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7">Data kosong</td></tr>`;
    return;
  }

  data.forEach((item, i) => {

    const kode   = item["Kode Sparepart"] || "-";
    const nama   = item["Nama Spare Part"] || "-";
    const lokasi = item["Lokasi Stock"] || "-";
    const jumlah = item["Total kartu data (Data)"] || 0;
    const pakai  = item["Pemakaian bulanan"] || 0;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${nama}</td>
      <td>${kode}</td>
      <td>${lokasi}</td>
      <td>${jumlah}</td>
      <td>${pakai}</td>
      <td class="${jumlah > 0 ? 'status-tersedia' : 'status-kosong'}">
        ${jumlah > 0 ? "Tersedia" : "Kosong"}
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// LOAD pertama
document.addEventListener("DOMContentLoaded", async () => {

  // Load APA dulu
  const dataAPA = await loadSheet("APA&ASIATIK");
  renderData(dataAPA);

  // Load CHEMICHAL di background
  setTimeout(async () => {
    window.dataCHEM = await loadSheet("CHEMICHAL");
  }, 300);

});