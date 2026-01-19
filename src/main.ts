import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import { generateScreenplay, type ScreenplayInput } from './api';

const form = document.getElementById('storyForm') as HTMLFormElement;
const output = document.getElementById('output') as HTMLDivElement;

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Show loading state
  output.innerHTML = `
    <div class="card shadow-sm">
      <div class="card-body">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Generating screenplay...</span>
        </div>
        <p class="mt-3">Generating your screenplay...</p>
      </div>
    </div>
  `;

  try {
    // Gather form inputs
    const input: ScreenplayInput = {
      protagonistName: (document.getElementById('protagonistName') as HTMLInputElement).value.trim(),
      setting: (document.getElementById('setting') as HTMLInputElement).value.trim(),
      season: (document.getElementById('season') as HTMLSelectElement).value,
      romanticInterest: (document.getElementById('romanticInterest') as HTMLInputElement).value.trim(),
      adultThemed: (document.getElementById('adultThemed') as HTMLInputElement).checked,
    };

    // Generate screenplay via API
    const screenplay = await generateScreenplay(input);

    // Display output
    output.innerHTML = `
      <div class="card shadow-sm">
        <div class="card-body">
          <h2 class="card-title h5 mb-3">${screenplay.title}</h2>
          <pre class="screenplay-content">${screenplay.content}</pre>
        </div>
      </div>
    `;
  } catch (error) {
    output.innerHTML = `
      <div class="card shadow-sm border-danger">
        <div class="card-body">
          <h2 class="card-title h5 text-danger mb-3">Error</h2>
          <p class="card-text">${error instanceof Error ? error.message : 'Failed to generate screenplay. Please try again.'}</p>
        </div>
      </div>
    `;
  }

  // Smooth scroll to output
  output.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
