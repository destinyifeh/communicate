/** Base email template wrapper */
export function baseTemplate(content: string, previewText?: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Communicate</title>
  ${previewText ? `<meta name="description" content="${previewText}">` : ''}
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f4f4f5;
      color: #18181b;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .card {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .logo {
      text-align: center;
      margin-bottom: 32px;
    }
    .logo h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: #18181b;
    }
    h2 {
      margin: 0 0 16px 0;
      font-size: 20px;
      font-weight: 600;
      color: #18181b;
    }
    p {
      margin: 0 0 16px 0;
      font-size: 16px;
      line-height: 1.6;
      color: #3f3f46;
    }
    .otp-code {
      background-color: #f4f4f5;
      border-radius: 8px;
      padding: 24px;
      text-align: center;
      margin: 24px 0;
    }
    .otp-code span {
      font-size: 36px;
      font-weight: 700;
      letter-spacing: 8px;
      color: #18181b;
    }
    .button {
      display: inline-block;
      background-color: #18181b;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 600;
      margin: 24px 0;
    }
    .button:hover {
      background-color: #27272a;
    }
    .footer {
      text-align: center;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e4e4e7;
    }
    .footer p {
      font-size: 14px;
      color: #71717a;
      margin: 0;
    }
    .muted {
      color: #71717a;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">
        <h1>Communicate</h1>
      </div>
      ${content}
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Communicate. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}
