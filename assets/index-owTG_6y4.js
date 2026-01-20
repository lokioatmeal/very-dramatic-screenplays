(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const s of t.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function a(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function n(e){if(e.ep)return;e.ep=!0;const t=a(e);fetch(e.href,t)}})();async function c(o){try{const n=await fetch("https://very-dramatic-screenplays.vercel.app/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)});if(!n.ok){let t="Failed to generate story";try{t=(await n.json()).error||t}catch{t=await n.text()||t}throw new Error(t)}return await n.json()}catch(r){throw console.error("API Error:",r),r}}function l(o){return o.split(`
`).map(n=>{const e=n.trim(),t=e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");return e===e.toUpperCase()&&/^[A-Z\s()]+$/.test(e)&&e.length>3?`<p class="fw-bold">${t}</p>`:e.startsWith("(")&&e.endsWith(")")?`<p class="fst-italic text-muted">${t}</p>`:e.startsWith("INT.")||e.startsWith("EXT.")?`<p class="fw-semibold">${t}</p>`:`<p>${t}</p>`}).join("")}const p=document.getElementById("storyForm"),i=document.getElementById("output");p.addEventListener("submit",async o=>{o.preventDefault(),i.innerHTML=`
<div class="d-flex flex-row align-items-center gap-1">
  <div class="spinner-border" role="status"></div>
  <p class="mb-0">Generating Rom-Com…</p>
</div>
  `;try{let r=document.querySelector('input[name="season"]:checked')?.value||"Spring";if(r==="randomize"){const s=["Spring","Summer","Fall","Winter"];r=s[Math.floor(Math.random()*s.length)]}const n=(document.querySelector('input[name="adultThemed"]:checked')?.value||"false")==="true",e={protagonistName:document.getElementById("protagonistName").value.trim(),setting:document.getElementById("setting").value.trim(),season:r,romanticInterest:document.getElementById("romanticInterest").value.trim(),adultThemed:n},t=await c(e);i.innerHTML=`
<p class="fw-semibold">${t.title}</p>
<div class="screenplay-text">
  ${l(t.content)}
</div>
    `}catch(r){i.innerHTML=`
<div class="alert alert-danger">
  <p class="fw-semibold">Whoopsie Daisy!</p>
  <p class="mb-0">Thee Rom-Cominatooorrrr barfed… ${r instanceof Error&&r.message}</p>
</div>
    `}i.scrollIntoView({behavior:"smooth",block:"nearest"})});
