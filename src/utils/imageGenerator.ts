export type ImageTheme = 'cyberpunk' | 'linkedin' | 'terminal' | 'sunset';

export interface GenerateImageOptions {
  title: string;
  category: string;
  takeaways?: string[];
  code?: string;
  theme?: ImageTheme;
  authorName?: string;
}

/**
 * Draws a rounded rectangle path on Canvas context
 */
function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Generates an ultra-engaging, high-res (1200x630) LinkedIn infographic image canvas data URL
 */
export function generateLinkedInCardImage(options: GenerateImageOptions): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const {
    title,
    category,
    takeaways = [],
    code = '',
    theme = 'cyberpunk',
    authorName = 'StudyPulse Learner',
  } = options;

  // 1. Background Canvas Setup
  if (theme === 'cyberpunk') {
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 630);
    bgGrad.addColorStop(0, '#0a0f1d');
    bgGrad.addColorStop(0.4, '#1e1b4b');
    bgGrad.addColorStop(0.8, '#2e1065');
    bgGrad.addColorStop(1, '#090d16');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 630);

    // Glowing mesh lights
    const glow1 = ctx.createRadialGradient(200, 150, 10, 200, 150, 350);
    glow1.addColorStop(0, 'rgba(168, 85, 247, 0.35)');
    glow1.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, 1200, 630);

    const glow2 = ctx.createRadialGradient(1050, 480, 10, 1050, 480, 400);
    glow2.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
    glow2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, 1200, 630);
  } else if (theme === 'linkedin') {
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 630);
    bgGrad.addColorStop(0, '#003366');
    bgGrad.addColorStop(0.5, '#0A66C2');
    bgGrad.addColorStop(1, '#002244');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 630);

    const glow = ctx.createRadialGradient(900, 200, 10, 900, 200, 450);
    glow.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 1200, 630);
  } else if (theme === 'terminal') {
    ctx.fillStyle = '#060913';
    ctx.fillRect(0, 0, 1200, 630);

    // Grid matrix overlay
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.07)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 1200; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 630);
      ctx.stroke();
    }
    for (let y = 0; y < 630; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1200, y);
      ctx.stroke();
    }

    const glow = ctx.createRadialGradient(600, 300, 10, 600, 300, 500);
    glow.addColorStop(0, 'rgba(16, 185, 129, 0.15)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 1200, 630);
  } else {
    // Sunset Glow
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 630);
    bgGrad.addColorStop(0, '#31103f');
    bgGrad.addColorStop(0.5, '#831843');
    bgGrad.addColorStop(1, '#9a3412');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 630);
  }

  // 2. Glassmorphic Central Container Card
  const cardX = 45;
  const cardY = 45;
  const cardW = 1110;
  const cardH = 540;

  drawRoundRect(ctx, cardX, cardY, cardW, cardH, 28);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.55)';
  ctx.fill();
  ctx.strokeStyle =
    theme === 'terminal'
      ? 'rgba(16, 185, 129, 0.4)'
      : theme === 'linkedin'
      ? 'rgba(56, 189, 248, 0.4)'
      : 'rgba(168, 85, 247, 0.35)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Top Header Bar inside card
  // Logo & App Name
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px Inter, system-ui, sans-serif';
  ctx.fillText('🎓 StudyPulse', 80, 95);

  ctx.fillStyle = theme === 'terminal' ? '#10b981' : '#c084fc';
  ctx.font = 'bold 15px Inter, sans-serif';
  ctx.fillText('• KNOWLEDGE RECAP', 225, 94);

  // Top Right Category Badge Pill
  const categoryText = (category || 'SOFTWARE ENGINEERING').toUpperCase();
  ctx.font = 'bold 14px Inter, sans-serif';
  const catMetrics = ctx.measureText(categoryText);
  const badgeW = catMetrics.width + 32;
  const badgeX = 1115 - badgeW;

  drawRoundRect(ctx, badgeX, 72, badgeW, 32, 16);
  ctx.fillStyle =
    theme === 'terminal'
      ? 'rgba(16, 185, 129, 0.25)'
      : theme === 'linkedin'
      ? 'rgba(14, 165, 233, 0.25)'
      : 'rgba(168, 85, 247, 0.25)';
  ctx.fill();
  ctx.strokeStyle =
    theme === 'terminal'
      ? '#10b981'
      : theme === 'linkedin'
      ? '#38bdf8'
      : '#c084fc';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.fillText(categoryText, badgeX + 16, 93);

  // 3. Main Title (Wrapped cleanly)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'extrabold 38px Inter, system-ui, sans-serif';

  const maxTitleWidth = 1020;
  const words = title.split(' ');
  let line = '';
  let curY = 160;
  const lineHeight = 48;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    if (ctx.measureText(testLine).width > maxTitleWidth && n > 0) {
      ctx.fillText(line, 80, curY);
      line = words[n] + ' ';
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 80, curY);
  curY += 38;

  // Gradient accent line below title
  const lineGrad = ctx.createLinearGradient(80, curY, 1100, curY);
  lineGrad.addColorStop(0, theme === 'terminal' ? '#10b981' : '#a855f7');
  lineGrad.addColorStop(0.5, '#3b82f6');
  lineGrad.addColorStop(1, 'rgba(255,255,255,0.1)');
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, curY);
  ctx.lineTo(1100, curY);
  ctx.stroke();
  curY += 38;

  // 4. Key Takeaways list box (up to 4 points with pill numbers)
  if (takeaways.length > 0) {
    ctx.fillStyle = theme === 'terminal' ? '#6ee7b7' : '#e9d5ff';
    ctx.font = 'extrabold 16px Inter, sans-serif';
    ctx.fillText('💡 CORE TAKEAWAYS & MENTAL MODELS:', 80, curY);
    curY += 34;

    takeaways.slice(0, 4).forEach((takeaway, idx) => {
      if (curY < 510) {
        // Pill index number
        drawRoundRect(ctx, 80, curY - 20, 28, 26, 13);
        ctx.fillStyle = theme === 'terminal' ? 'rgba(16, 185, 129, 0.35)' : 'rgba(168, 85, 247, 0.35)';
        ctx.fill();
        ctx.strokeStyle = theme === 'terminal' ? '#10b981' : '#c084fc';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.fillText(`${idx + 1}`, 89, curY - 2);

        // Takeaway Text
        ctx.font = '500 19px Inter, sans-serif';
        ctx.fillStyle = '#f8fafc';

        let displayT = takeaway.trim();
        if (ctx.measureText(displayT).width > 940) {
          while (ctx.measureText(displayT + '...').width > 940 && displayT.length > 0) {
            displayT = displayT.slice(0, -1);
          }
          displayT += '...';
        }

        ctx.fillText(displayT, 122, curY);
        curY += 46;
      }
    });
  }

  // 6. Bottom Branding Footer Bar
  const footerY = 548;

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, footerY - 20);
  ctx.lineTo(1100, footerY - 20);
  ctx.stroke();

  // Author & App info (Left)
  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 16px Inter, sans-serif';
  ctx.fillText(`Curated by ${authorName} • StudyPulse`, 80, footerY);

  // Live URL Pill (Right) - https://studyroom-amber.vercel.app/
  const liveUrlText = 'studyroom-amber.vercel.app';
  ctx.font = 'bold 15px Inter, sans-serif';
  const urlWidth = ctx.measureText(liveUrlText).width;
  const urlPillW = urlWidth + 28;
  const urlPillX = 1100 - urlPillW;

  drawRoundRect(ctx, urlPillX, footerY - 20, urlPillW, 28, 14);
  ctx.fillStyle =
    theme === 'terminal'
      ? 'rgba(16, 185, 129, 0.2)'
      : theme === 'linkedin'
      ? 'rgba(14, 165, 233, 0.2)'
      : 'rgba(168, 85, 247, 0.2)';
  ctx.fill();
  ctx.strokeStyle =
    theme === 'terminal'
      ? '#10b981'
      : theme === 'linkedin'
      ? '#38bdf8'
      : '#c084fc';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.fillText(liveUrlText, urlPillX + 14, footerY - 1);

  return canvas.toDataURL('image/png');
}
