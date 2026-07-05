import type { PassActionResponse } from '../api/convocation'

function escapeHtml(value: string | number): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function buildReceiptHtml(result: PassActionResponse): string {
  const { student, pass } = result
  const time = new Date().toLocaleString('en-PK', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  @page {
    size: 70mm 210mm;
    margin: 0;
  }
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    width: 70mm;
    margin: 0;
    padding: 6mm 3mm 12mm;
    font-family: 'Courier New', monospace;
    color: #000;
    background: #fff;
    text-align: center;
  }
  .title {
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .divider {
    border-top: 1px dashed #000;
    margin: 3mm 0;
  }
  .pass-label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  .pass-number {
    font-size: 64px;
    font-weight: bold;
    line-height: 1.1;
  }
  .cluster {
    font-size: 18px;
    font-weight: bold;
    margin-top: 1mm;
  }
  .info {
    font-size: 14px;
    line-height: 1.5;
  }
  .info .name {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 1mm;
  }
  .info .cnic {
    font-size: 16px;
    font-weight: bold;
  }
  .welcome {
    font-size: 13px;
    font-weight: bold;
    margin-top: 2mm;
    line-height: 1.4;
  }
  .footer {
    font-size: 11px;
    margin-top: 2mm;
  }
</style>
</head>
<body>
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
  <div class="footer">Attended: ${escapeHtml(time)}</div>
</body>
</html>`
}

export function printPassReceipt(result: PassActionResponse) {
  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.right = '0'
  iframe.style.bottom = '0'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = 'none'
  document.body.appendChild(iframe)

  const doc = iframe.contentWindow?.document
  if (!doc) {
    iframe.remove()
    return
  }

  doc.open()
  doc.write(buildReceiptHtml(result))
  doc.close()

  const cleanup = () => setTimeout(() => iframe.remove(), 500)

  iframe.onload = () => {
    const win = iframe.contentWindow
    if (!win) {
      cleanup()
      return
    }
    win.onafterprint = cleanup
    win.focus()
    win.print()
  }
}
