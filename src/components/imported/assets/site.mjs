import {originalLoaders,originalMarkup} from '../gallery/loaders/originals.mjs';
import {onLanguageChange,setupLanguage,translate as t} from './locale.mjs';

const sun='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="10" cy="10" r="3.5"/><path d="M10 1v2m0 14v2M1 10h2m14 0h2M3.6 3.6 5 5m10 10 1.4 1.4M3.6 16.4 5 15M15 5l1.4-1.4"/></svg>';
const moon='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M16.5 12.2A7 7 0 0 1 7.8 3.5a7 7 0 1 0 8.7 8.7Z"/></svg>';

const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const allowMotion=()=>!reducedMotion.matches&&document.getElementById('motion')?.getAttribute('aria-pressed')!=='true';
function setupCategoryMarker(categories){
  const marker=document.createElement('span');
  marker.className='category-marker';
  marker.setAttribute('aria-hidden','true');
  let previousTab,slide;

  function positionMarker(){
    const tab=categories.querySelector('[data-category][aria-pressed="true"]');
    if(!tab)return;
    const previous=marker.getBoundingClientRect();
    const target=tab.getBoundingClientRect();
    const left=`${tab.offsetLeft}px`,width=`${tab.offsetWidth}px`;
    if(previousTab===tab&&marker.isConnected&&marker.style.left===left&&marker.style.width===width)return;

    slide?.cancel();
    marker.style.left=left;
    marker.style.width=width;
    if(!marker.isConnected)categories.append(marker);
    if(previousTab&&previousTab!==tab&&previous.width&&target.width&&allowMotion()){
      const delta=previous.left-target.left;
      const origin=delta<0?'right center':'left center';
      slide=marker.animate([
        {transform:`translateX(${delta+(delta<0?previous.width-target.width:0)}px) scaleX(${previous.width/target.width})`,transformOrigin:origin},
        {transform:'scaleX(1.24)',transformOrigin:origin,offset:.61},
        {transform:'scaleX(.94)',transformOrigin:origin,offset:.83},
        {transform:'none',transformOrigin:origin},
      ],{duration:360,easing:'cubic-bezier(.21,.65,.31,1)'});
    }
    previousTab=tab;
  }

  new MutationObserver(positionMarker).observe(categories,{childList:true,subtree:true,attributes:true,attributeFilter:['aria-pressed']});
  new ResizeObserver(positionMarker).observe(categories);
  document.fonts.ready.then(positionMarker);
  document.getElementById('motion')?.addEventListener('click',()=>{if(!allowMotion())slide?.cancel();});
}

export function setupSite(){
  const root=document.documentElement,button=document.getElementById('theme'),header=document.getElementById('top');
  setupLanguage();
  let theme=root.dataset.theme||'dark';try{theme=localStorage.getItem('ui-moments-theme')||theme;}catch{}
  root.dataset.theme=theme==='light'?'light':'dark';
  const paint=()=>{if(!button)return;const dark=root.dataset.theme!=='light';button.innerHTML=dark?sun:moon;button.setAttribute('aria-label',t(dark?'Switch to light mode':'Switch to dark mode'));button.title=button.getAttribute('aria-label');};
  paint();
  onLanguageChange(paint);
  const switchTheme=()=>{
    const previousForeground=foreground();
    root.dataset.theme=root.dataset.theme==='light'?'dark':'light';paint();
    try{localStorage.setItem('ui-moments-theme',root.dataset.theme);}catch{}
    root.dispatchEvent(new CustomEvent('ui-moments:theme',{detail:{theme:root.dataset.theme,previousForeground}}));
  };
  // 支持 View Transitions 的浏览器里，深浅切换以交叉淡化完成，避免卡片逐个闪变。
  button?.addEventListener('click',()=>{
    if(document.startViewTransition&&!reducedMotion.matches)document.startViewTransition(switchTheme);
    else switchTheme();
  });
  const scroll=()=>header?.classList.toggle('scrolled',scrollY>8);scroll();addEventListener('scroll',scroll,{passive:true});
  addEventListener('keydown',event=>{
    if(event.key!=='/'||event.metaKey||event.ctrlKey||event.altKey||document.querySelector('dialog[open]')||event.target.closest?.('input,textarea,[contenteditable]'))return;
    const search=document.getElementById('search')||document.getElementById('work-search');
    if(search){event.preventDefault();search.focus();}
  });
  const categories=document.getElementById('categories');
  if(categories)setupCategoryMarker(categories);
}

export function setupGalleryFavorites(onChange){
  const key='ui-moments-favorites',filter=document.getElementById('gallery-favorites');
  const buttons=[...document.querySelectorAll('[data-save-work]')];
  let saved=new Set(),selected,only=false;

  function restore(){
    try{
      const items=JSON.parse(localStorage.getItem(key)||'[]');
      if(Array.isArray(items))saved=new Set(items.filter(item=>typeof item==='string'));
    }catch{}
  }

  function paint(){
    const isSaved=saved.has(selected);
    for(const button of buttons){
      button.setAttribute('aria-pressed',String(isSaved));
      button.title=t(isSaved?'Remove from favorites':'Save component');
      button.setAttribute('aria-label',button.title);
    }
  }

  restore();
  onLanguageChange(paint);
  filter?.addEventListener('click',()=>{
    only=!only;
    filter.setAttribute('aria-pressed',String(only));
    onChange();
  });
  for(const button of buttons)button.addEventListener('click',()=>{
    if(!selected)return;
    if(saved.has(selected))saved.delete(selected);
    else saved.add(selected);
    try{localStorage.setItem(key,JSON.stringify([...saved]));}catch{}
    paint();

    if(allowMotion()){
      button.getAnimations().forEach(animation=>animation.cancel());
      button.animate([
        {transform:'translateY(2px) scale(1.13,.84)'},
        {transform:'translateY(-3px) scale(.89,1.13)',offset:.43},
        {transform:'scale(1.04,.96)',offset:.73},
        {transform:'none'},
      ],{duration:370,easing:'cubic-bezier(.22,.74,.37,1)'});
      const mark=button.querySelector('[data-bookmark-mark]');
      mark.getAnimations().forEach(animation=>animation.cancel());
      mark.animate([
        {transform:'translateY(3px) scaleY(.57)'},
        {transform:'translateY(-2px) scaleY(1.18)',offset:.52},
        {transform:'none'},
      ],{duration:340,easing:'cubic-bezier(.21,.73,.37,1)'});
    }
    if(only)onChange();
  });
  addEventListener('storage',event=>{
    if(event.key!==key&&event.key!==null)return;
    restore();
    paint();
    if(only)onChange();
  });

  return {
    has:id=>saved.has(id),
    get only(){return only;},
    showFor(id){selected=id;paint();},
  };
}

export function showLoadingAccent(element){
  const loader=originalLoaders.find(item=>item.key==='paper-fold');
  element.attachShadow({mode:'open'}).innerHTML=originalMarkup(loader,{size:18,color:'currentColor',speed:1.45});
}

export const foreground=()=>getComputedStyle(document.documentElement).getPropertyValue('--c-fg').trim();
export const background=()=>getComputedStyle(document.documentElement).getPropertyValue('--c-bg').trim();

export function embedUrl(demo, theme) {
  const url = new URL(demo, location.href);
  url.searchParams.set('embed', 'ui');
  url.searchParams.set('theme', theme);
  if (url.hash) {
    // 使用查询参数选择控件，避免 iframe 内的锚点滚动外层页面。
    url.searchParams.set('sample', url.hash.slice(1));
    url.hash = '';
  }
  return url;
}
