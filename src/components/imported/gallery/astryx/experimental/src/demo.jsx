import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Theme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral/built';
import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
import '@astryxdesign/lab/lab.css';
import '@astryxdesign/charts/charts.css';
import '@astryxdesign/theme-neutral/theme.css';
import '../../src/demo.css';
import {fitCardPreview} from '../../src/card-fit.mjs';
import {canaryStories} from '../stories.mjs';
import stories from './canary-stories';

const root = document.documentElement;
const params = new URLSearchParams(location.search);
const embedded = params.get('embed') === 'ui';
if (!embedded) addEventListener('hashchange', () => location.reload());
const sample = embedded ? params.get('sample') : location.hash.slice(1);
const compact = params.get('preview') === 'card';
const selected = canaryStories.find(([id]) => id === sample) || canaryStories[0];
const systemTheme = matchMedia('(prefers-color-scheme: light)');
const modeForPage = () => embedded ? root.dataset.theme : (systemTheme.matches ? 'light' : 'dark');
if (compact) root.dataset.fitPreview = '';

function Story({render, Component, args, mode}) {
  return render ? render(args, {args, globals: {colorMode: mode}}) : <Component {...args} />;
}

function App({render, Component, args}) {
  const [mode, setMode] = useState(modeForPage);
  const ref = useRef(null);

  useEffect(() => {
    const update = () => setMode(modeForPage());
    const observer = new MutationObserver(update);
    observer.observe(root, {attributes: true, attributeFilter: ['data-theme']});
    systemTheme.addEventListener('change', update);
    update();
    return () => {
      observer.disconnect();
      systemTheme.removeEventListener('change', update);
    };
  }, []);

  useLayoutEffect(() => {
    if (compact) return fitCardPreview(ref.current, {waitForGraphic: selected[4] === 'chart'});
  }, []);

  return <Theme theme={neutralTheme} mode={mode}>
    <div className="stage" data-sample={sample}>
      <div className="showcase" ref={ref} onClickCapture={event => {
        const link = event.target.closest('a[href]');
        if (link?.origin === location.origin) event.preventDefault();
      }}><Story render={render} Component={Component} args={args} mode={mode} /></div>
    </div>
  </Theme>;
}

document.title = `${selected[1]} · UI Moments`;
const reactRoot = createRoot(document.getElementById('sample'));
stories.get(selected[0])().then(({meta, story}) => {
  const render = story.render || meta.render;
  if (!render && !meta.component) throw new Error(`Missing Astryx story render: ${selected[0]}`);
  reactRoot.render(<App render={render} Component={meta.component} args={{...meta.args, ...story.args}} />);
}).catch(error => {
  console.error(error);
  reactRoot.render(<p role="alert">The preview could not load. Reload to retry.</p>);
});
