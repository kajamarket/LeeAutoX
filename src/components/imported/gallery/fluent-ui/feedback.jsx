import React, {useState} from 'react';
import {
  Button, Card, CardHeader, CompoundButton, InfoButton, InlineDrawer, DrawerBody,
  InteractionTag, InteractionTagPrimary, InteractionTagSecondary, MessageBar, MessageBarActions,
  MessageBarBody, MessageBarTitle, Popover, PopoverSurface, PopoverTrigger, Skeleton, SkeletonItem,
  Spinner, Switch, Tag, TagGroup, ToggleButton, Tooltip, useId,
} from '@fluentui/react-components';
import {Alert} from '@fluentui/react-components/unstable';

function ButtonDemo() {
  const [saved, setSaved] = useState(false);
  return <Button appearance="primary" onClick={() => setSaved(!saved)}>{saved ? 'Save again' : 'Save draft'}</Button>;
}

function CompoundButtonDemo() {
  const [ready, setReady] = useState(false);
  return (
    <CompoundButton size="small" onClick={() => setReady(!ready)} secondaryContent={ready ? 'Review the file' : 'Generate a file'}>
      {ready ? 'Draft ready' : 'Export draft'}
    </CompoundButton>
  );
}

function ToggleButtonDemo() {
  const [pinned, setPinned] = useState(false);
  return <ToggleButton checked={pinned} onClick={() => setPinned(!pinned)}>{pinned ? 'Pinned' : 'Pin item'}</ToggleButton>;
}

function CardDemo() {
  const title = useId('card-title');
  const [selected, setSelected] = useState(false);
  return (
    <Card className="control-sample selectable-sample" size="small" aria-labelledby={title}
      selected={selected} onSelectionChange={(_, data) => setSelected(data.selected)}>
      <CardHeader header={<span id={title}>Color study</span>} description={selected ? 'Selected' : 'Ready to select'} />
    </Card>
  );
}

function InfoButtonDemo() {
  return (
    <div className="popup-trigger inline-control">
      <span>File size</span>
      <InfoButton aria-label="About file size" info={{children: 'Up to 10 MB', className: 'small-surface'}} />
    </div>
  );
}

function MessageBarDemo() {
  const [visible, setVisible] = useState(true);
  return visible ? (
    <MessageBar className="control-sample message-sample" layout="multiline">
      <MessageBarBody><MessageBarTitle>Draft saved</MessageBarTitle></MessageBarBody>
      <MessageBarActions containerAction={{
        children: <Button appearance="subtle" size="small" onClick={() => setVisible(false)}>Dismiss</Button>,
      }} />
    </MessageBar>
  ) : <Button size="small" onClick={() => setVisible(true)}>Show message</Button>;
}

function AlertDemo() {
  const [visible, setVisible] = useState(true);
  return visible ? (
    <Alert className="control-sample alert-sample" intent="info"
      action={{children: 'Dismiss', appearance: 'subtle', size: 'small', onClick: () => setVisible(false)}}>
      Export paused
    </Alert>
  ) : <Button size="small" onClick={() => setVisible(true)}>Show alert</Button>;
}

function PopoverDemo() {
  return (
    <Popover positioning={{position: 'below', align: 'center', offset: 5}}>
      <PopoverTrigger disableButtonEnhancement><Button className="popup-trigger">Display</Button></PopoverTrigger>
      <PopoverSurface className="small-surface" aria-label="Display options">
        <Switch label="Grid lines" />
      </PopoverSurface>
    </Popover>
  );
}

function SkeletonDemo() {
  const [loading, setLoading] = useState(true);
  return (
    <div className="control-sample labeled-control">
      {loading ? (
        <Skeleton aria-label="Loading file" className="skeleton-sample">
          <SkeletonItem size={16} />
          <SkeletonItem size={12} />
        </Skeleton>
      ) : <span>Draft available</span>}
      <Button size="small" onClick={() => setLoading(!loading)}>{loading ? 'Show result' : 'Load again'}</Button>
    </div>
  );
}

function SpinnerDemo() {
  const [busy, setBusy] = useState(true);
  return (
    <div className="control-sample centered-control">
      {busy ? <Spinner size="tiny" label="Exporting" /> : <output>Export ready</output>}
      <Button size="small" onClick={() => setBusy(!busy)}>{busy ? 'Complete' : 'Restart'}</Button>
    </div>
  );
}

function TagDemo() {
  const [tags, setTags] = useState(['UI', 'Type']);
  return (
    <div className="centered-control">
      {tags.length ? (
        <TagGroup aria-label="Topics" onDismiss={(_, data) => setTags(tags.filter(tag => tag !== data.value))}>
          {tags.map(tag => <Tag key={tag} size="small" value={tag} dismissible dismissIcon={{'aria-label': `Remove ${tag}`}}>{tag}</Tag>)}
        </TagGroup>
      ) : <Button size="small" onClick={() => setTags(['UI', 'Type'])}>Restore topics</Button>}
    </div>
  );
}

function InteractionTagDemo() {
  const [selected, setSelected] = useState(false);
  const [removed, setRemoved] = useState(false);
  return removed ? (
    <Button size="small" onClick={() => {setRemoved(false); setSelected(false);}}>Restore tag</Button>
  ) : (
    <InteractionTag size="small" selected={selected}>
      <InteractionTagPrimary aria-pressed={selected} onClick={() => setSelected(!selected)}>Motion</InteractionTagPrimary>
      <InteractionTagSecondary aria-label="Remove Motion" onClick={() => setRemoved(true)} />
    </InteractionTag>
  );
}

function TooltipDemo() {
  return (
    <Tooltip content="Export as SVG" relationship="description" positioning="above">
      <Button appearance="subtle">Export</Button>
    </Tooltip>
  );
}

function InlineDrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="control-sample inline-drawer-sample">
      <Button aria-expanded={open} size="small" onClick={() => setOpen(!open)}>{open ? 'Hide' : 'Show'}</Button>
      <InlineDrawer open={open} position="end" className="inline-drawer">
        <DrawerBody><span>Drafts</span></DrawerBody>
      </InlineDrawer>
    </div>
  );
}

export default {
  button: ButtonDemo,
  'compound-button': CompoundButtonDemo,
  'toggle-button': ToggleButtonDemo,
  card: CardDemo,
  'info-button': InfoButtonDemo,
  'message-bar': MessageBarDemo,
  alert: AlertDemo,
  popover: PopoverDemo,
  skeleton: SkeletonDemo,
  spinner: SpinnerDemo,
  tag: TagDemo,
  'interaction-tag': InteractionTagDemo,
  tooltip: TooltipDemo,
  'inline-drawer': InlineDrawerDemo,
};
