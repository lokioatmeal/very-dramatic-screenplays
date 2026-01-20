import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import { generateScreenplay, type ScreenplayInput } from './api';

function formatScreenplay(content: string): string {
  const lines = content.split('\n');
  const formatted = lines.map(line => {
    // if (!line.trim()) {
    //   return '<div class="my-2"></div>'; // blank line spacing
    // }
    const trimmed = line.trim();
    const escaped = trimmed
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    // Character names: ALL CAPS, no numbers
    if (trimmed === trimmed.toUpperCase() && /^[A-Z\s()]+$/.test(trimmed) && trimmed.length > 3) {
      return `<p class="fw-bold">${escaped}</p>`;
    }
    // Parentheticals: (action in parens)
    if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
      return `<p class="fst-italic text-muted">${escaped}</p>`;
    }
    // Scene headings: INT./EXT.
    if (trimmed.startsWith('INT.') || trimmed.startsWith('EXT.')) {
      return `<p class="fw-semibold">${escaped}</p>`;
    }
    // Regular line
    return `<p>${escaped}</p>`;
  });

  return formatted.join('');
}

const form = document.getElementById('storyForm') as HTMLFormElement;
const output = document.getElementById('output') as HTMLDivElement;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  output.innerHTML = `
<div class="d-flex flex-row align-items-center gap-1">
  <div class="spinner-border" role="status"></div>
  <p class="mb-0">Generating Rom-Com…</p>
</div>
  `;
  try {
    let season = (document.querySelector('input[name="season"]:checked') as HTMLInputElement)?.value || 'Spring';
    if (season === 'randomize') {
      const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
      season = seasons[Math.floor(Math.random() * seasons.length)];
    }
    const spiceValue = (document.querySelector('input[name="adultThemed"]:checked') as HTMLInputElement)?.value || 'false';
    const adultThemed = spiceValue === 'true';
    const input: ScreenplayInput = {
      protagonistName: (document.getElementById('protagonistName') as HTMLInputElement).value.trim(),
      setting: (document.getElementById('setting') as HTMLInputElement).value.trim(),
      season: season,
      romanticInterest: (document.getElementById('romanticInterest') as HTMLInputElement).value.trim(),
      adultThemed: adultThemed,
    };
    const screenplay = await generateScreenplay(input);
    output.innerHTML = `
<p class="fw-semibold">${screenplay.title}</p>
<div class="screenplay-text">
  ${formatScreenplay(screenplay.content)}
</div>
    `;
  } catch (error) {
    output.innerHTML = `
<div class="alert alert-danger">
  <p class="fw-semibold">Whoopsie Daisy!</p>
  <p class="mb-0">Thee Rom-Cominatooorrrr barfed… ${error instanceof Error && error.message}</p>
</div>
    `;
  }
  output.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
