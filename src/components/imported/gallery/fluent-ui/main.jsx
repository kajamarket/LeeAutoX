import React, {lazy, Suspense, useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {
  Button, DrawerBody, DrawerHeader, DrawerHeaderTitle, FluentProvider, OverlayDrawer, Switch,
  TeachingPopover, TeachingPopoverBody, TeachingPopoverSurface, TeachingPopoverTitle, TeachingPopoverTrigger,
  Toast, ToastTitle, Toaster, useId, useRestoreFocusSource, useRestoreFocusTarget, useToastController, webDarkTheme, webLightTheme,
} from '@fluentui/react-components';
import {MotionBehaviourProvider} from '@fluentui/react-motion';
import {fluentWorks} from './catalog.mjs';
import '../../assets/embed.js';
import './style.css';

function DrawerDemo() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const heading = useId('drawer-title');
  const focusTarget = useRestoreFocusTarget();
  const focusSource = useRestoreFocusSource();
  return (
    <>
      <Button {...focusTarget} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>Open settings</Button>
      <OverlayDrawer {...focusSource} aria-labelledby={heading} position="end" open={open}
        onOpenChange={(_, data) => setOpen(data.open)} className="demo-drawer">
        <DrawerHeader>
          <DrawerHeaderTitle id={heading} action={
            <Button appearance="subtle" size="small" onClick={() => setOpen(false)}>Close</Button>
          }>Settings</DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody>
          <Switch label="Receive reminders" checked={notifications} onChange={(_, data) => setNotifications(data.checked)} />
        </DrawerBody>
      </OverlayDrawer>
    </>
  );
}

function TeachingPopoverDemo() {
  const heading = useId('teaching-popover-title');
  return (
    <TeachingPopover positioning={{position: 'below', align: 'center', offset: 6}}>
      <TeachingPopoverTrigger>
        <Button className="popover-trigger">Show tip</Button>
      </TeachingPopoverTrigger>
      <TeachingPopoverSurface className="demo-popover" aria-labelledby={heading}>
        <TeachingPopoverBody>
          <TeachingPopoverTitle id={heading}>Quick search</TeachingPopoverTitle>
          <div>Press <kbd>/</kbd> to search.</div>
        </TeachingPopoverBody>
      </TeachingPopoverSurface>
    </TeachingPopover>
  );
}

function ToastDemo() {
  const toasterId = useId('toaster');
  const {dispatchToast} = useToastController(toasterId);
  const [count, setCount] = useState(0);

  function notify() {
    const next = count + 1;
    setCount(next);
    dispatchToast(<Toast className="demo-toast"><ToastTitle>Saved · {next}</ToastTitle></Toast>);
  }

  return (
    <>
      <Button className="toast-trigger" onClick={notify}>Save project</Button>
      <Toaster className="demo-toaster" toasterId={toasterId} position="top" offset={{vertical: 6}}
        limit={2} timeout={2200} pauseOnHover={false} />
    </>
  );
}

const demos = {drawer: DrawerDemo, 'teaching-popover': TeachingPopoverDemo, toast: ToastDemo};
const cardPreviews = new Map([
  ['dialog', <>
    <h2>Archive project?</h2>
    <p>Move this project out of the active list.</p>
    <div className="card-preview-actions"><Button size="small">Cancel</Button><Button size="small" appearance="primary">Confirm</Button></div>
  </>],
  ['teaching-popover', <>
    <h2>Quick search</h2>
    <p>Press <kbd>/</kbd> to search.</p>
    <div className="card-preview-actions"><Button size="small" appearance="primary">Got it</Button></div>
  </>],
  ['toast', <>
    <article><h2>Saved · 2</h2><p>Your project has been saved.</p></article>
    <article><h2>Saved · 1</h2></article>
  </>],
]);
const groups = {
  controls: () => import('./controls.jsx'),
  forms: () => import('./forms.jsx'),
  navigation: () => import('./navigation.jsx'),
  feedback: () => import('./feedback.jsx'),
};
const params = new URLSearchParams(location.search);
const sample = params.get('sample') ?? 'drawer';
const cardPreview = params.get('embed') === 'ui' && params.get('preview') === 'card' && cardPreviews.get(sample);
const entry = fluentWorks.find(work => work.id === `fluent-${sample}`);
const Demo = Object.hasOwn(demos, sample) ? demos[sample] : entry ? lazy(async () => {
  const {default: examples} = await groups[entry.group]();
  return {default: examples[sample]};
}) : DrawerDemo;
const root = document.documentElement;
const systemTheme = matchMedia('(prefers-color-scheme: dark)');

function readSettings() {
  return {
    theme: root.dataset.theme || (systemTheme.matches ? 'dark' : 'light'),
    animate: root.dataset.galleryActive !== 'false',
  };
}

function App() {
  const [settings, setSettings] = useState(readSettings);
  useEffect(() => {
    const update = () => setSettings(readSettings());
    const observer = new MutationObserver(update);
    observer.observe(root, {attributes: true, attributeFilter: ['data-theme', 'data-gallery-active']});
    systemTheme.addEventListener('change', update);
    update();
    return () => {
      observer.disconnect();
      systemTheme.removeEventListener('change', update);
    };
  }, []);
  const theme = settings.theme === 'light' ? webLightTheme : webDarkTheme;
  return (
    <FluentProvider className="demo-stage" theme={{...theme, fontFamilyBase: 'system-ui, sans-serif'}}>
      <MotionBehaviourProvider value={settings.animate ? undefined : 'skip'}>
        {cardPreview
          ? <section className={`card-preview-snapshot card-preview-${sample}`} data-preview-snapshot={sample} inert>{cardPreview}</section>
          : <Suspense><Demo /></Suspense>}
      </MotionBehaviourProvider>
    </FluentProvider>
  );
}

createRoot(document.getElementById('demo')).render(<App />);
