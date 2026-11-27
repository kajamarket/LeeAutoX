import {htmlExample,reactExample} from '../gallery/loaders/snippets.mjs';
import {standaloneExamplePath,workHeading} from './catalog.mjs';
import {localizedText,onLanguageChange,translate as t} from './locale.mjs';

const site = 'https://guanmo-ai.github.io/ui-moments/';
const repository = 'https://github.com/guanmo-ai/ui-moments';

function previewUrl(id) {
  const url = new URL(globalThis.location?.href ?? site);
  url.search = '';
  url.hash = id;
  return url;
}

function sourceUrl(path, kind = 'blob') {
  const meta = name => globalThis.document?.querySelector(`meta[name="ui-moments:${name}"]`)?.content.trim();
  const repo = (meta('repository') || repository).replace(/\/+$/, '');
  const ref = meta('ref') || 'main';
  return `${repo}/${kind}/${ref}${path ? `/${path}` : ''}`;
}

export function componentSourceHref(item) {
  if (item.sourceHref) return item.sourceHref;
  if (item.sourcePath) return sourceUrl(item.sourcePath);
  if (item.multiFile || item.demo.includes('/dist/')) return sourceUrl(item.source, 'tree');
  return sourceUrl(item.demo.split(/[?#]/, 1)[0]);
}

export function loaderPrompt(item, props, markup, license, background, examples = {htmlExample, reactExample}) {
  const settings = Object.entries(props).map(([key, value]) => `${key}: ${value}`).join(', ');
  const name = localizedText(item.name,item.nameZh).text;
  const description = localizedText(item.description,item.descriptionZh).text;
  return `Implement the ${name} loader in the current workspace and run a local demo.

Preview: ${previewUrl(item.key)}
Motion: ${description} Use a continuous loop to indicate an indeterminate wait.
Settings: ${settings}. Preview background: ${background}.

Check the project layout, stack, and style conventions first. The HTML below is self-contained and can be saved as index.html and opened offline. The JSX needs an existing React project. Both examples use the selected preview settings.

Expose the size, color, and duration when supported. Put the component where users are waiting and give it an accessible loading label. Respect prefers-reduced-motion and verify contrast on both light and dark backgrounds. Keep the original attribution and full MIT license below.

Open the local example and verify the animation, settings, and reduced motion. Report the changed files and launch command.

Standalone HTML
\`\`\`html
${examples.htmlExample(item, props, markup, license, background).trim()}
\`\`\`

React usage
\`\`\`jsx
${examples.reactExample(item, props, license).trim()}
\`\`\``;
}

export function componentPrompt(item) {
  const built = item.demo.includes('/dist/');
  const file = item.demo.split(/[?#]/, 1)[0];
  const preview = previewUrl(item.id);
  const standalone = standaloneExamplePath(item);
  const code = componentSourceHref(item);
  const name = workHeading(item).name;
  const summary = localizedText(item.summary,item.summaryZh).text;
  const {text: notes} = localizedText(item.notes || [],item.notesZh);
  const resources = (item.sourceFiles || []).map(path => sourceUrl(path));
  const notices = [sourceUrl('LICENSE')];
  if (item.credit?.licensePath) notices.push(sourceUrl(item.credit.licensePath));
  const attribution = item.credit
    ? `${item.library ? 'Upstream' : 'Inspiration'}: ${item.credit.name}${item.credit.url === code ? '' : `, ${item.credit.url}`}. ${item.credit.note || ''}`
    : 'Source: UI Moments.';
  const sourceDetails = [
    `Code: ${code}`,
    item.sourcePath ? `Local file: ${item.sourcePath}` : `Local ${item.multiFile ? 'directory' : 'file'}: ${item.multiFile ? item.source : file}`,
    `Example: ${item.sourceEntry ? `${item.sourceEntry} (${item.id})` : item.id}`,
    item.sourceAdapter && `Build adaptations: ${sourceUrl(item.sourceAdapter)}`,
    ...resources.map(resource => `Shared resource: ${resource}`),
  ].filter(Boolean).join('\n');

  let setup;
  if (built) {
    setup = `This example needs the locked repository dependencies. Use the full UI Moments checkout from ${sourceUrl('', 'tree')} with Node.js 22.12+ or 24+ and Python 3. From its root run:

npm run setup
npm run build
npm run package:site
python3 -m http.server 5173 --bind 127.0.0.1 --directory _site

Open http://127.0.0.1:5173/${item.demo}. Use the source entry and its dependencies in your integration. Keep the bundled dependency notices.`;
  } else if (standalone) {
    setup = `Use Copy HTML or Download standalone HTML: ${new URL(standalone, preview)}. The same single-control file includes its HTML, CSS, JavaScript, and MIT license. Save it as an .html file and open it directly in a browser, even offline.`;
  } else {
    const reuse = item.multiFile
      ? 'Keep the files and shared assets at their repository-relative paths.'
      : 'Copy HTML gives a complete demo page focused on this example. Extract the matching control and its CSS, JavaScript, and assets when integrating it into another project.';
    setup = `${reuse} To verify the original source, run python3 -m http.server 5173 --bind 127.0.0.1 from the checkout root and open http://127.0.0.1:5173/${item.demo}.`;
  }

  return `Implement ${name} in the current workspace and run a local interactive demo.

Preview: ${preview}
${sourceDetails}
${attribution}

Design and behavior
${summary}
${notes.map(note => `- ${note}`).join('\n')}
Local implementation
Check the project stack and file structure first. ${setup}
Keep a visible keyboard focus state, touch support, and a layout that fits mobile screens. Respect reduced motion. Preserve the copyright and license notices in any reused code and assets: ${notices.join(', ')}.

Try the demo and verify the listed state changes. Report the changed files, local URL, and launch command.`;
}

export function mountPrompt(dialog, getPrompt, copy) {
  const close = dialog.querySelector('.close');
  const actions = document.createElement('div');
  actions.className = 'dialog-actions';
  actions.innerHTML = '<button type="button" class="primary">Copy prompt</button>';
  const save = dialog.querySelector('[data-save-work]');
  close.before(actions);
  if (save) actions.append(save);
  actions.append(close);

  const preview = document.createElement('details');
  preview.className = 'prompt-preview';
  preview.innerHTML = `
    <summary>View prompt</summary>
    <div class="prompt-toolbar">
      <p>Paste into your coding tool.</p>
      <button type="button" class="prompt-copy">Copy prompt</button>
    </div>
    <textarea lang="en" aria-label="Component prompt" readonly spellcheck="false" rows="8"></textarea>`;
  const code = dialog.querySelector('.code-section');
  if (code) code.before(preview);
  else dialog.append(preview);

  const field = preview.querySelector('textarea');
  const refresh = () => { if (preview.open) field.value = getPrompt(); };
  preview.addEventListener('toggle', refresh);
  const inlineCopy = preview.querySelector('.prompt-copy');
  const dialogCopy = actions.querySelector('button');
  let inlineCopied = false;
  let feedbackTimer;
  function localize(){
    dialogCopy.textContent=t('Copy prompt');
    preview.querySelector('summary').textContent=t('View prompt');
    preview.querySelector('.prompt-toolbar p').textContent=t('Paste into your coding tool.');
    field.setAttribute('aria-label',t('Component prompt'));
    inlineCopy.textContent=t(inlineCopied?'Copied':'Copy prompt');
  }
  localize();
  onLanguageChange(() => {
    localize();
    if (dialog.open) refresh();
  });
  const resetFeedback = () => {
    clearTimeout(feedbackTimer);
    inlineCopied = false;
    inlineCopy.textContent = t('Copy prompt');
  };
  const copyPrompt = async (event) => {
    const inline = event.currentTarget === inlineCopy;
    const prompt = getPrompt();
    const copied = await copy(prompt, {
      success: 'Prompt copied',
      failure: 'Select and copy the prompt manually',
    });
    if (!dialog.open) return;
    if (copied && inline) {
      resetFeedback();
      inlineCopied = true;
      inlineCopy.textContent = t('Copied');
      feedbackTimer = setTimeout(resetFeedback, 2400);
    } else if (!copied) {
      preview.open = true;
      field.value = prompt;
      field.focus();
      field.select();
    }
  };
  dialogCopy.addEventListener('click', copyPrompt);
  inlineCopy.addEventListener('click', copyPrompt);
  dialog.addEventListener('close', () => {
    preview.open = false;
    field.value = '';
    resetFeedback();
  });
  return refresh;
}
