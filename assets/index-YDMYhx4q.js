(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const c of t.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function n(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function s(e){if(e.ep)return;e.ep=!0;const t=n(e);fetch(e.href,t)}})();async function i(o){try{const n=`${window.location.hostname==="localhost"?"http://localhost:3001":"https://very-dramatic-screenplays.vercel.app"}/api/generate`,s=await fetch(n,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)});if(!s.ok){const t=await s.json();throw new Error(t.error||"Failed to generate screenplay")}return await s.json()}catch(r){throw console.error("API Error:",r),r}}const d=document.getElementById("storyForm"),a=document.getElementById("output");d.addEventListener("submit",async o=>{o.preventDefault(),a.innerHTML=`
    <div class="card shadow-sm">
      <div class="card-body">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Generating screenplay...</span>
        </div>
        <p class="mt-3">Generating your screenplay...</p>
      </div>
    </div>
  `;try{const r={protagonistName:document.getElementById("protagonistName").value.trim(),setting:document.getElementById("setting").value.trim(),season:document.getElementById("season").value,romanticInterest:document.getElementById("romanticInterest").value.trim(),adultThemed:document.getElementById("adultThemed").checked},n=await i(r);a.innerHTML=`
      <div class="card shadow-sm">
        <div class="card-body">
          <h2 class="card-title h5 mb-3">${n.title}</h2>
          <pre class="screenplay-content">${n.content}</pre>
        </div>
      </div>
    `}catch(r){a.innerHTML=`
      <div class="card shadow-sm border-danger">
        <div class="card-body">
          <h2 class="card-title h5 text-danger mb-3">Error</h2>
          <p class="card-text">${r instanceof Error?r.message:"Failed to generate screenplay. Please try again."}</p>
        </div>
      </div>
    `}a.scrollIntoView({behavior:"smooth",block:"nearest"})});
