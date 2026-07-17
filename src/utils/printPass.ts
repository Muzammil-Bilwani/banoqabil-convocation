import type { PassActionResponse } from '../api/convocation'

const RECEIPT_ID = '__bq_receipt__'
const STYLE_ID = '__bq_receipt_style__'

function escapeHtml(value: string | number): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// Print isolation lives in the MAIN document because Chrome
// --kiosk-printing always prints the top-level frame (an iframe's
// window.print() would silently print this page blank). We hide the whole
// app for @media print and reveal only the receipt node.
function receiptStyles(): string {
  return `
    #${RECEIPT_ID} { display: none; }

    @media print {
      @page { size: 80mm auto; margin: 0; }

      html, body {
        margin: 0 !important;
        padding: 0 !important;
        background: #fff !important;
      }

      /* Hide everything, then reveal only the receipt subtree. Using
         visibility (not display) keeps layout stable so the thermal
         printer never captures a blank frame. */
      body * { visibility: hidden !important; }
      #${RECEIPT_ID}, #${RECEIPT_ID} * { visibility: visible !important; }

      #${RECEIPT_ID} {
        display: block !important;
        position: absolute;
        left: 0;
        top: 0;
        width: 80mm;
        padding: 4mm 2mm 10mm;
        font-family: 'Courier New', monospace;
        color: #000;
        text-align: center;
      }

      #${RECEIPT_ID} * { margin: 0; padding: 0; box-sizing: border-box; }
      #${RECEIPT_ID} .title { font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
      #${RECEIPT_ID} .divider { border-top: 1px dashed #000; margin: 2mm 0; }
      #${RECEIPT_ID} .pass-label { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; }
      #${RECEIPT_ID} .pass-number { font-size: 52px; font-weight: bold; line-height: 1; }
      #${RECEIPT_ID} .cluster { font-size: 16px; font-weight: bold; margin-top: 1mm; }
      #${RECEIPT_ID} .info { font-size: 12px; line-height: 1.4; }
      #${RECEIPT_ID} .info .name { font-size: 16px; font-weight: bold; margin-bottom: 1mm; }
      #${RECEIPT_ID} .info .cnic { font-size: 13px; font-weight: bold; }
      #${RECEIPT_ID} .welcome { font-size: 11px; font-weight: bold; margin-top: 1mm; line-height: 1.3; }
      #${RECEIPT_ID} .footer { font-size: 10px; margin-top: 1mm; }
    }
  `
}

function receiptInnerHtml(result: PassActionResponse, reprint = false): string {
  const { student, pass } = result
  const time = new Date().toLocaleString('en-PK', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
  const footerLabel = reprint ? 'Reprinted' : 'Attended'

  return `
    <div class="title">Bano Qabil Convocation</div>
    <div class="divider"></div>
    <div class="pass-label">Pass Number</div>
    <div class="pass-number">${escapeHtml(pass.passNumber)}</div>
    <div class="cluster">Station ${escapeHtml(pass.cluster)}</div>
    <div class="divider"></div>
    <div class="info">
      <div class="name">${escapeHtml(student.fullName)}</div>
      <div class="cnic">CNIC: ${escapeHtml(student.cnic)}</div>
      <div>Student ID: ${escapeHtml(student.studentId)}</div>
    </div>
    <div class="divider"></div>
    <div class="welcome">
      Welcome to the Bano Qabil Convocation!<br />
      Congratulations on your achievement.
    </div>
    <div class="divider"></div>
    <div class="footer">${footerLabel}: ${escapeHtml(time)}</div>
  `
}

export function printPassReceipt(result: PassActionResponse, reprint = false) {
  // Clear any leftover node/style from a previous print.
  document.getElementById(RECEIPT_ID)?.remove()
  document.getElementById(STYLE_ID)?.remove()

  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = receiptStyles()

  const node = document.createElement('div')
  node.id = RECEIPT_ID
  node.innerHTML = receiptInnerHtml(result, reprint)

  document.head.appendChild(style)
  document.body.appendChild(node)

  const cleanup = () => {
    node.remove()
    style.remove()
  }
  window.addEventListener('afterprint', cleanup, { once: true })

  // Wait for the browser to paint the injected node before printing so the
  // captured frame is never blank. Double rAF = layout + paint committed.
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      window.print()
      // afterprint is unreliable under --kiosk-printing; guarantee cleanup.
      setTimeout(cleanup, 1500)
    }),
  )
}
