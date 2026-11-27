import {foreground,background} from '../../assets/site.mjs';
import {localizedText,onLanguageChange,translate as t} from '../../assets/locale.mjs';
import {previewProps} from './catalog.mjs';
import {escapeHtml as esc,htmlExample,reactExample} from './snippets.mjs';
import {loaderPrompt,mountPrompt} from '../../assets/prompt.mjs';
import {originalMarkup} from './originals.mjs';

export function createLoaderPreview(item, values) {
  const element = document.createElement('span');
  element.attachShadow({mode: 'open'}).innerHTML = originalMarkup(item, values);
  element.setAttribute('aria-hidden', 'true');
  return element;
}

export function setPreviewPlaying(preview,playing){
  for(const animation of preview?.shadowRoot?.getAnimations()||[])playing?animation.play():animation.pause();
}

export function createLoaderEditor({isPlaying=()=>true,restoreFocus=button=>button?.focus({preventScroll:true})}){
const $=selector=>document.querySelector(selector);
const root=document.documentElement,detail=$('#detail'),toast=$('#toast');
let selected=null,props={},format='html',trigger=null,toastTimer,itemLicense;
let previewFrame=0,exportTimer=0;
const defaults=()=>previewProps(selected,foreground());
function syncMotion(){setPreviewPlaying($('#selected-preview').firstElementChild,isPlaying()&&detail.open);}
const ranges={
  size:{label:'Size',min:16,max:160,step:1,suffix:' px'},
  speed:{label:'Duration',min:.2,max:5,step:.05,suffix:' s'},
  stroke:{label:'Stroke width',min:.5,max:12,step:.5,suffix:' px'},
  'stroke-length':{label:'Arc length',min:.05,max:.9,step:.01,suffix:''},
  'bg-opacity':{label:'Track opacity',min:0,max:1,step:.05,suffix:''},
};
function controls(){
  $('#controls').innerHTML=Object.entries(props).map(([key,value])=>{
    if(key==='color')return `<div class="control"><label for="prop-color"><span data-parameter="Color">${t('Color')}</span> <input class="color-input" id="prop-color" type="color" data-prop="color" value="${esc(value)}"></label></div>`;
    const range=ranges[key];if(!range)return '';
    return `<div class="control"><label for="prop-${key}"><span data-parameter="${range.label}">${t(range.label)}</span><output for="prop-${key}">${value}${range.suffix}</output></label><input id="prop-${key}" data-prop="${key}" type="range" min="${range.min}" max="${range.max}" step="${range.step}" value="${value}"></div>`;
  }).join('');
}
function currentCode(){
  flushPreview();
  return format==='react'?reactExample(selected,props,itemLicense):htmlExample(selected,props,$('#selected-preview').firstElementChild.shadowRoot.innerHTML,itemLicense,background());
}
function localizeCode(){
  $('#code-help').textContent=t(format==='html'
    ?'Save as an .html file and open it in a browser.'
    :'Use this JSX in a React project.');
  $('#download').textContent=t(format==='html'?'Download HTML':'Download JSX');
}
function paintCode(){
  localizeCode();
  $('#code').value=currentCode();
  $('#code-panel').setAttribute('aria-labelledby','tab-'+format);
  for(const tab of document.querySelectorAll('[data-format]')){const active=tab.dataset.format===format;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;}
}
function paintPreview(){
  const stage=$('#selected-preview');
  stage.replaceChildren(createLoaderPreview(selected,props));
  requestAnimationFrame(syncMotion);
}
function flushPreview(){
  if(!previewFrame)return;
  cancelAnimationFrame(previewFrame);
  previewFrame=0;
  paintPreview();
}
function updateExports(){
  clearTimeout(exportTimer);
  exportTimer=0;
  paintCode();
  refreshPrompt();
}
function paintSelected(){
  cancelAnimationFrame(previewFrame);
  previewFrame=0;
  paintPreview();
  updateExports();
}
const credit=detail.querySelector('.code-credit');
function localizeDetail(){
  const item=selected;
  $('#detail-group').textContent=`${t('Loading')} / ${t(item.group)}`;
  const title=localizedText(item.name,item.nameZh);
  $('#detail-title').lang=title.lang;
  $('#detail-title').textContent=title.text;
  const description=localizedText(item.description,item.descriptionZh);
  $('#detail-description').lang=description.lang;
  $('#detail-description').textContent=description.text;
  credit.querySelector('span').textContent=t('MIT license.');
}
function open(item,button,sourceLicense){
  itemLicense=sourceLicense;
  selected=item;props=defaults();format='html';trigger=button;
  localizeDetail();
  controls();paintSelected();detail.showModal();document.body.style.overflow='hidden';
  history.replaceState(null,'','#'+item.key);
}
function clearDetailHash(){
  if(location.hash==='#'+selected?.key)history.replaceState(null,'',location.pathname+location.search);
}
function closeDetail(){clearDetailHash();detail.close();}
$('#close').addEventListener('click',closeDetail);
detail.addEventListener('cancel',clearDetailHash);
detail.addEventListener('click',event=>{if(event.target===detail){const r=detail.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeDetail();}});
detail.addEventListener('close',()=>{
  cancelAnimationFrame(previewFrame);
  clearTimeout(exportTimer);
  previewFrame=exportTimer=0;
  $('#selected-preview').replaceChildren();document.body.style.overflow='';
  clearDetailHash();clearFeedback();restoreFocus(trigger);
});
$('#controls').addEventListener('input',event=>{
  const input=event.target,key=input.dataset.prop;if(!key)return;
  props[key]=key==='color'?input.value:Number(input.value);
  const output=input.parentElement.querySelector('output');if(output)output.textContent=props[key]+ranges[key].suffix;
  if(!previewFrame)previewFrame=requestAnimationFrame(()=>{
    previewFrame=0;
    paintPreview();
  });
  clearTimeout(exportTimer);
  exportTimer=setTimeout(updateExports,120);
});
$('#controls').addEventListener('change',event=>{if(event.target.dataset.prop)updateExports();});
$('#reset').addEventListener('click',()=>{props=defaults();controls();paintSelected();});
for(const tab of document.querySelectorAll('[data-format]')){
  tab.addEventListener('click',()=>{format=tab.dataset.format;updateExports();});
  tab.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();format=event.key==='Home'?'html':event.key==='End'?'react':format==='html'?'react':'html';updateExports();$('#tab-'+format).focus();}});
}
function notify(message){
  clearTimeout(toastTimer);(document.querySelector('dialog[open]')||document.body).append(toast);toast.textContent=message;toast.hidden=false;toastTimer=setTimeout(()=>{toast.hidden=true;},3200);
}
function clearFeedback(){clearTimeout(toastTimer);toast.hidden=true;document.body.append(toast);}
async function copy(text,isCurrent){
  if(isCurrent&&!isCurrent())return false;
  try{await navigator.clipboard.writeText(text);return true;}catch{
    if(isCurrent&&!isCurrent())return false;
    const field=document.createElement('textarea');field.value=text;field.style.cssText='position:fixed;opacity:0;top:0;left:0';
    (document.querySelector('dialog[open]')||document.body).append(field);field.select();let copied=false;
    try{copied=document.execCommand('copy');}catch{}field.remove();return copied;
  }
}
async function copyWithFeedback(text,{success='Copied with attribution and license',failure='Select and copy the code manually',isCurrent}={}){
  const ok=await copy(text,isCurrent);
  if(!isCurrent||isCurrent())notify(t(ok?success:failure));
  return ok;
}
for(const button of document.querySelectorAll('[data-copy-link]')){
  button.addEventListener('click',()=>{
    const url=new URL(location.href);
    url.search='';
    void copyWithFeedback(url.href,{success:'Link copied',failure:'Copy the link from the address bar'});
  });
}
const refreshPrompt=mountPrompt(detail,()=>{
  flushPreview();
  return loaderPrompt(selected,props,$('#selected-preview').firstElementChild.shadowRoot.innerHTML,itemLicense,background());
},copyWithFeedback);
$('#copy').addEventListener('click',()=>copyWithFeedback(currentCode()));
$('#download').addEventListener('click',()=>{
  const url=URL.createObjectURL(new Blob([currentCode()],{type:format==='html'?'text/html;charset=utf-8':'text/plain;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download=`ui-moments-${selected.key}.${format==='html'?'html':'jsx'}`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
root.addEventListener('ui-moments:theme',event=>{
  if(!detail.open)return;
  if(props.color===event.detail.previousForeground){
    props.color=defaults().color;controls();paintSelected();
  }
});
onLanguageChange(()=>{
  if(!detail.open)return;
  localizeDetail();
  localizeCode();
  for(const label of detail.querySelectorAll('[data-parameter]'))label.textContent=t(label.dataset.parameter);
});
return {open,syncMotion,copy:copyWithFeedback,notify,clearFeedback,isOpen:()=>detail.open};
}
