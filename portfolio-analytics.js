/* Inactive until the owner's real GA4 ID is set. */
(() => {
"use strict";
const ID = ""; // Actual G-... measurement ID
if (!/^G-[A-Z0-9]+$/.test(ID) || window.top !== window.self) return;
const key="my-portfolio_oksakoval:analytics-consent:v1", flag="ga-disable-"+ID;
let active=false, loaded=false, project="";
const page=location.origin+location.pathname;
const get=()=>{try{return localStorage.getItem(key)}catch(e){return null}};
const set=v=>{try{localStorage.setItem(key,v)}catch(e){}};
const track=(name,params={})=>{if(active)window.gtag("event",name,{page_location:page,...params})};
function enable(){
 if(active)return;
 active=true;window[flag]=false;
 if(!loaded){
  loaded=true;window.dataLayer=window.dataLayer||[];
  window.gtag=function(){window.dataLayer.push(arguments)};
  window.gtag("consent","default",{analytics_storage:"denied",ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied"});
  window.gtag("consent","update",{analytics_storage:"granted"});
  window.gtag("js",new Date());
  let ref="";try{if(document.referrer)ref=new URL(document.referrer).origin}catch(e){}
  window.gtag("config",ID,{send_page_view:false,page_location:page,page_referrer:ref,allow_google_signals:false,allow_ad_personalization_signals:false,cookie_prefix:"portfolio",cookie_path:"/my-portfolio_oksakoval/"});
  const script=document.createElement("script");script.async=true;script.src="https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(ID);document.head.append(script);
 }else window.gtag("consent","update",{analytics_storage:"granted"});
 track("page_view",{page_title:document.title});
}
function disable(){
 active=false;window[flag]=true;
 if(loaded)window.gtag("consent","update",{analytics_storage:"denied"});
 document.cookie.split(";").forEach(part=>{const name=part.split("=")[0].trim();if(/^portfolio_/.test(name)){for(const domain of ["","; domain="+location.hostname])document.cookie=name+"=; Max-Age=0; path=/my-portfolio_oksakoval/"+domain}});
}
const css=document.createElement("style");css.textContent="#portfolio-privacy-control{position:fixed;bottom:12px;right:12px;z-index:2147483000;font:12px Arial,sans-serif;color:#39252c;background:#fff8fa;border:1px solid #c7a4ae;border-radius:7px;padding:8px 12px;cursor:pointer} #portfolio-privacy-panel{position:fixed;right:12px;bottom:53px;z-index:2147483001;width:min(360px,calc(100vw - 24px));box-sizing:border-box;background:#fff8fa;color:#39252c;padding:17px;border:1px solid #c7a4ae;border-radius:10px;box-shadow:0 6px 24px #0002;font:14px/1.45 Arial,sans-serif;text-align:left} #portfolio-privacy-panel[hidden]{display:none!important} #portfolio-privacy-panel p{margin:8px 0 12px} #portfolio-privacy-panel button{font:inherit;padding:8px 11px;border:1px solid #a16b7b;border-radius:5px;background:#fff;color:#39252c;cursor:pointer;margin:4px 5px 0 0} #portfolio-privacy-panel a{color:#70354b;text-decoration:underline}";document.head.append(css);
const button=document.createElement("button");button.id="portfolio-privacy-control";button.type="button";button.textContent="Налаштування приватності";button.setAttribute("aria-controls","portfolio-privacy-panel");
const panel=document.createElement("section");panel.id="portfolio-privacy-panel";panel.setAttribute("aria-label","Налаштування аналітики");panel.innerHTML='<strong>Аналітика відвідувань</strong><p>За вашою згодою Google Analytics вимірює перегляди, дії на сайті, приблизне місто й країну, тип пристрою та джерело переходу. Рекламні cookies не використовуються. Відмова не обмежує доступ до портфоліо. Згоду можна змінити будь-коли.</p><p><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Політика конфіденційності Google</a></p><button type="button" data-choice="yes">Дозволити</button><button type="button" data-choice="no">Відмовитися</button>';
document.body.append(button,panel);
function show(v){panel.hidden=!v;button.setAttribute("aria-expanded",String(v))}
button.addEventListener("click",()=>show(panel.hidden));
panel.addEventListener("click",e=>{const b=e.target.closest("button[data-choice]");if(!b)return;set(b.dataset.choice);b.dataset.choice==="yes"?enable():disable();show(false);button.focus()});
const consent=get();show(consent!=="yes"&&consent!=="no");consent==="yes"?enable():disable();
window.addEventListener("storage",e=>{if(e.key===key){e.newValue==="yes"?enable():disable();show(e.newValue===null)}});
document.addEventListener("click",e=>{
 if(!(e.target instanceof Element))return;
 const card=e.target.closest(".project-card,.video-card");
 if(card){project=(card.querySelector("h3")?.textContent||card.getAttribute("aria-label")||"").trim().slice(0,100);track("project_open",{project_name:project,project_type:card.matches(".blender-video-card")?"blender_video":card.matches(".video-card")?"ai_video":"graphic"})}
 const a=e.target.closest("a[href]");if(!a)return;
 let u;try{u=new URL(a.href,location.href)}catch(err){return}
 const h=u.hostname.toLowerCase().replace(/^www\./,"");let channel="";
 if(u.protocol==="mailto:")channel="email";else if(u.protocol==="tel:")channel="phone";else if(/(^|\.)instagram\.com$/.test(h))channel="instagram";else if(/(^|\.)facebook\.com$/.test(h))channel="facebook";else if(h==="t.me"||h==="telegram.me")channel="telegram";else if(/(^|\.)behance\.net$/.test(h))channel="behance";else if(/(^|\.)linkedin\.com$/.test(h))channel="linkedin";
 if(channel)track("contact_click",{contact_channel:channel});
},true);
const states=new WeakMap();
function state(v){if(!states.has(v))states.set(v,{started:false,marks:new Set()});return states.get(v)}
const title=v=>(v.id==="blenderVideoPlayer"&&project?project:document.title).slice(0,100);
document.addEventListener("loadstart",e=>{if(e.target instanceof HTMLVideoElement)states.delete(e.target)},true);
document.addEventListener("playing",e=>{const v=e.target;if(!active||!(v instanceof HTMLVideoElement))return;const s=state(v);if(!s.started){s.started=true;track("portfolio_video_start",{video_title:title(v)})}},true);
document.addEventListener("timeupdate",e=>{const v=e.target;if(!active||!(v instanceof HTMLVideoElement)||!Number.isFinite(v.duration)||v.duration<=0)return;const s=state(v);if(!s.started)return;for(const m of [25,50,75])if(v.currentTime/v.duration*100>=m&&!s.marks.has(m)){s.marks.add(m);track("portfolio_video_progress",{video_title:title(v),video_percent:m})}},true);
document.addEventListener("ended",e=>{const v=e.target;if(!active||!(v instanceof HTMLVideoElement))return;const s=state(v);if(s.started&&!s.marks.has(100)){s.marks.add(100);track("portfolio_video_complete",{video_title:title(v),video_percent:100})}},true);
})();
