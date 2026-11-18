/**
 * Absensi AlbiFirst — Google Apps Script
 * Menerima data dari halaman web dan menulisnya ke Google Sheet.
 *
 * 1. Ganti TOKEN di bawah dengan kata rahasia milikmu.
 * 2. Deploy > New deployment > Web app
 *      Execute as: Me
 *      Who has access: Anyone
 * 3. Salin URL Web App (…/exec) ke halaman web (Panel Panitia).
 */

const TOKEN = 'albiverse-japan-2026';
const SHEET_NAME = 'Absensi';
const TZ = 'Asia/Jakarta';
// Kolom Sekolah ditaruh di akhir agar data lama di Sheet tidak bergeser.
const HEADERS = ['ID', 'Waktu', 'Nama Anak', 'Karakter', 'Usia', 'Perangkat', 'Sekolah'];
const MAX_NAMA = 40;
const MAX_SEKOLAH = 60;

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#ffe8b3');
    sh.getRange('B:B').setNumberFormat('dd/MM/yyyy HH:mm:ss');
  } else if (sh.getRange(1, HEADERS.length).getValue() !== HEADERS[HEADERS.length - 1]) {
    // Sheet lama: tambahkan header kolom Sekolah
    sh.getRange(1, HEADERS.length).setValue(HEADERS[HEADERS.length - 1])
      .setFontWeight('bold').setBackground('#ffe8b3');
  }
  return sh;
}

function getIds_(sh) {
  const last = sh.getLastRow();
  if (last < 2) return [];
  return sh.getRange(2, 1, last - 1, 1).getValues().map(r => String(r[0]));
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Simpan atau hapus peserta. */
function doPost(e) {
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: 'format' });
  }
  if (data.token !== TOKEN) return json_({ ok: false, error: 'token' });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = getSheet_();
    const ids = getIds_(sh);

    if (data.action === 'delete') {
      const i = ids.indexOf(String(data.id));
      if (i >= 0) sh.deleteRow(i + 2);
      return json_({ ok: true });
    }

    // Abaikan data ganda (misalnya terkirim ulang setelah koneksi putus)
    if (ids.indexOf(String(data.id)) >= 0) return json_({ ok: true, duplicate: true });

    const nama = String(data.nama || '').slice(0, MAX_NAMA);
    if (!nama) return json_({ ok: false, error: 'nama kosong' });

    sh.appendRow([
      String(data.id),
      new Date(data.waktu || Date.now()),
      nama,
      String(data.karakter || ''),
      String(data.usia || ''),
      String(data.perangkat || ''),
      String(data.sekolah || '').slice(0, MAX_SEKOLAH)   // boleh kosong
    ]);
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

/** Kirim daftar peserta hari ini (untuk pohon kehadiran di semua tablet). */
function doGet(e) {
  if ((e.parameter.token || '') !== TOKEN) return json_({ ok: false, error: 'token' });
  const sh = getSheet_();
  const last = sh.getLastRow();
  if (last < 2) return json_({ ok: true, data: [] });

  const today = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd');
  const rows = sh.getRange(2, 1, last - 1, HEADERS.length).getValues();
  const data = rows
    .filter(r => r[1] instanceof Date && Utilities.formatDate(r[1], TZ, 'yyyy-MM-dd') === today)
    .map(r => ({ id: String(r[0]), waktu: r[1].toISOString(), nama: r[2], karakter: r[3], sekolah: r[6] || '' }));
  return json_({ ok: true, data: data });
}
