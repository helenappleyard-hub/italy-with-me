/**
 * Italy With Me: register-interest sign-ups.
 *
 * Paste into Extensions > Apps Script of Helen's "Italy With Me sign-ups"
 * Google Sheet, then Deploy > New deployment > Web app
 * (Execute as: Me, Who has access: Anyone). Put the /exec URL into
 * SIGNUP_ENDPOINT in site/js/signup.js. Full steps are in README.md.
 */

var NOTIFY_EMAIL = 'helenappleyard@live.com.au';
var SHEET_NAME = 'Sign-ups';
var HEADERS = ['Date', 'First name', 'Email', 'When', 'Who', 'Which walk', 'ID'];
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

var LABELS = {
  when: { soon: 'Within 6 months', year: 'In 6–12 months', later: 'Later' },
  who: { solo: 'Just me', partner: 'My partner', friends: 'A friend or two', group: 'A small group' },
  walk: { artisans: 'The Hidden Artisans of Santo Spirito', wine: 'Florence Wine Window Tour' }
};

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (data.action === 'details') return json_(saveDetails_(data));
    return json_(saveSignup_(data));
  } catch (err) {
    return json_({ ok: false, error: 'Could not save' });
  } finally {
    lock.releaseLock();
  }
}

function saveSignup_(data) {
  // Honeypot filled in: almost certainly a bot. Pretend success, save nothing.
  if (data.website) return { ok: true, id: '' };

  var email = clean_(data.email, 254);
  if (!EMAIL_RE.test(email)) return { ok: false, error: 'Invalid email' };
  var name = clean_(data.name, 80);
  var id = Utilities.getUuid();

  sheet_().appendRow([new Date(), name, email, '', '', '', id]);

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: 'New Italy With Me sign-up: ' + (name || email),
    body: 'Someone joined the list.\n\nName: ' + (name || '(not given)') + '\nEmail: ' + email +
      '\n\nAll sign-ups are in your "Italy With Me sign-ups" Google Sheet.'
  });
  return { ok: true, id: id };
}

function saveDetails_(data) {
  var id = clean_(data.id, 64);
  if (!id) return { ok: false, error: 'Missing id' };
  var sheet = sheet_();
  var ids = sheet.getRange(2, 7, Math.max(sheet.getLastRow() - 1, 1), 1).getValues();
  for (var i = ids.length - 1; i >= 0; i--) {
    if (ids[i][0] === id) {
      sheet.getRange(i + 2, 4, 1, 3).setValues([[
        label_('when', data.when), label_('who', data.who), label_('walk', data.walk)
      ]]);
      return { ok: true };
    }
  }
  return { ok: false, error: 'Not found' };
}

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function label_(field, value) {
  return LABELS[field][value] || '';
}

// Trim, cap length, and stop spreadsheet formula injection.
function clean_(value, max) {
  var s = String(value || '').trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
