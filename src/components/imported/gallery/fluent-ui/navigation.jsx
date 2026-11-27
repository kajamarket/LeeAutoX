import React, {useState} from 'react';
import {
  AvatarGroup, AvatarGroupItem, AvatarGroupPopover, Breadcrumb, BreadcrumbButton, BreadcrumbDivider,
  BreadcrumbItem, Button, DataGrid, DataGridBody, DataGridCell, DataGridHeader, DataGridHeaderCell,
  DataGridRow, Link, List, ListItem, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger,
  Nav, NavItem, Overflow, OverflowItem, SplitButton, Toolbar, ToolbarToggleButton,
  createTableColumn, useIsOverflowItemVisible, useOverflowMenu,
} from '@fluentui/react-components';
import {VirtualizerScrollView} from '@fluentui/react-components/unstable';

function AvatarGroupDemo() {
  return (
    <AvatarGroup size={24} layout="stack" className="popup-trigger">
      <AvatarGroupItem name="Ari" />
      <AvatarGroupItem name="Kit" />
      <AvatarGroupPopover positioning={{position: 'below', offset: 4, autoSize: true, overflowBoundary: 'window'}}
        triggerButton={{'aria-label': 'Show team'}}
        popoverSurface={{className: 'small-surface avatar-surface'}} content={{className: 'avatar-list'}}>
        <AvatarGroupItem name="Leo" />
        <AvatarGroupItem name="Mia" />
      </AvatarGroupPopover>
    </AvatarGroup>
  );
}

function BreadcrumbDemo() {
  const [inDraft, setInDraft] = useState(true);
  return (
    <div className="labeled-control">
      <Breadcrumb aria-label="Project path" size="small">
        <BreadcrumbItem>
          <BreadcrumbButton current={!inDraft} onClick={() => setInDraft(false)}>Files</BreadcrumbButton>
        </BreadcrumbItem>
        {inDraft && <BreadcrumbDivider />}
        {inDraft && <BreadcrumbItem><BreadcrumbButton current>Draft</BreadcrumbButton></BreadcrumbItem>}
      </Breadcrumb>
      {!inDraft && <Button appearance="subtle" size="small" onClick={() => setInDraft(true)}>Open draft</Button>}
    </div>
  );
}

function SplitButtonDemo() {
  const [format, setFormat] = useState('');
  return (
    <div className="control-sample centered-control">
      <Menu positioning="below">
        <MenuTrigger disableButtonEnhancement>
          {triggerProps => (
            <SplitButton size="small" menuButton={{...triggerProps, 'aria-label': 'Export formats'}}
              primaryActionButton={{onClick: () => setFormat('SVG')}}>Export</SplitButton>
          )}
        </MenuTrigger>
        <MenuPopover className="control-menu">
          <MenuList>
            {['PNG', 'PDF'].map(name => <MenuItem key={name} onClick={() => setFormat(name)}>{name}</MenuItem>)}
          </MenuList>
        </MenuPopover>
      </Menu>
      {format && <output aria-label="Export format">{format} ready</output>}
    </div>
  );
}

function LinkDemo() {
  const [opened, setOpened] = useState(false);
  return (
    <div className="centered-control">
      <Link href="#shortcut" onClick={() => setOpened(true)}>Show shortcut</Link>
      <div id="shortcut" tabIndex={-1} hidden={!opened}><kbd>Esc</kbd> closes a panel.</div>
    </div>
  );
}

function ListDemo() {
  return (
    <List aria-label="Items to include" selectionMode="multiselect" className="control-sample sample-list">
      <ListItem value="colors" checkmark={{'aria-label': 'Select colors'}}>Colors</ListItem>
      <ListItem value="type" checkmark={{'aria-label': 'Select type'}}>Type</ListItem>
      <ListItem value="spacings" checkmark={{'aria-label': 'Select spacing'}}>Spacing</ListItem>
    </List>
  );
}

function NavDemo() {
  return (
    <Nav aria-label="Project navigation" defaultSelectedValue="drafts" className="control-sample sample-nav">
      <NavItem value="drafts">Drafts</NavItem>
      <NavItem value="archive">Archive</NavItem>
    </Nav>
  );
}

const commands = ['A', 'B', 'C', 'D', 'E'];

function HiddenCommand({id, onSelect}) {
  const visible = useIsOverflowItemVisible(id);
  return visible ? null : <MenuItem onClick={() => onSelect(id)}>{id}</MenuItem>;
}

function MoreCommands({onSelect}) {
  const {ref, isOverflowing, overflowCount} = useOverflowMenu();
  if (!isOverflowing) return null;
  return (
    <Menu positioning="below">
      <MenuTrigger disableButtonEnhancement>
        <Button ref={ref} appearance="subtle" size="small" aria-label="More actions">+{overflowCount}</Button>
      </MenuTrigger>
      <MenuPopover className="control-menu"><MenuList>
        {commands.map(id => <HiddenCommand key={id} id={id} onSelect={onSelect} />)}
      </MenuList></MenuPopover>
    </Menu>
  );
}

function OverflowDemo() {
  const [last, setLast] = useState('');
  return (
    <div className="control-sample centered-control">
      <Overflow>
        <div className="overflow-actions" aria-label="Actions">
          {commands.map(id => (
            <OverflowItem key={id} id={id}>
              <Button size="small" onClick={() => setLast(id)}>{id}</Button>
            </OverflowItem>
          ))}
          <MoreCommands onSelect={setLast} />
        </div>
      </Overflow>
      {last && <output aria-label="Last action">Ran {last}</output>}
    </div>
  );
}

const files = [{name: 'Grid', version: 2}, {name: 'Color', version: 1}];
const columns = [
  createTableColumn({columnId: 'name', compare: (a, b) => a.name.localeCompare(b.name),
    renderHeaderCell: () => 'Name', renderCell: item => item.name}),
  createTableColumn({columnId: 'version', compare: (a, b) => a.version - b.version,
    renderHeaderCell: () => 'Version', renderCell: item => item.version}),
];

function DataGridDemo() {
  return (
    <DataGrid className="control-sample small-grid" aria-label="Files" items={files} columns={columns}
      getRowId={item => item.name} sortable size="small" focusMode="composite">
      <DataGridHeader>
        <DataGridRow>{({renderHeaderCell}) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}</DataGridRow>
      </DataGridHeader>
      <DataGridBody>
        {({item, rowId}) => (
          <DataGridRow key={rowId}>{({renderCell}) => <DataGridCell>{renderCell(item)}</DataGridCell>}</DataGridRow>
        )}
      </DataGridBody>
    </DataGrid>
  );
}

function ToolbarDemo() {
  const [marks, setMarks] = useState([]);
  return (
    <div className="centered-control">
      <Toolbar aria-label="Format text" size="small" checkedValues={{marks}}
        onCheckedValueChange={(_, data) => setMarks(data.checkedItems)}>
        <ToolbarToggleButton name="marks" value="bold" aria-label="Bold"><strong>B</strong></ToolbarToggleButton>
        <ToolbarToggleButton name="marks" value="italic" aria-label="Italic"><em>I</em></ToolbarToggleButton>
      </Toolbar>
      <span style={{fontWeight: marks.includes('bold') ? 700 : 400, fontStyle: marks.includes('italic') ? 'italic' : 'normal'}}>
        Sample text
      </span>
    </div>
  );
}

function VirtualizerDemo() {
  return (
    <VirtualizerScrollView numItems={200} itemSize={24}
      container={{className: 'virtual-viewport', tabIndex: 0, 'aria-label': 'Virtual rows'}}>
      {(index) => <div key={index} className="virtual-row">Row {index + 1}</div>}
    </VirtualizerScrollView>
  );
}

export default {
  'avatar-group': AvatarGroupDemo,
  breadcrumb: BreadcrumbDemo,
  'split-button': SplitButtonDemo,
  link: LinkDemo,
  list: ListDemo,
  nav: NavDemo,
  overflow: OverflowDemo,
  'data-grid': DataGridDemo,
  toolbar: ToolbarDemo,
  virtualizer: VirtualizerDemo,
};
