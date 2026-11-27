import React, {useState} from 'react';
import {
  Accordion, AccordionHeader, AccordionItem, AccordionPanel,
  Button, Carousel, CarouselButton, CarouselCard, CarouselNav, CarouselNavButton, CarouselSlider, CarouselViewport,
  Checkbox, Combobox, Dropdown, Option,
  Dialog, DialogActions, DialogBody, DialogSurface, DialogTitle, DialogTrigger,
  Menu, MenuItemRadio, MenuList, MenuPopover, MenuTrigger, ProgressBar, Rating,
  Slider, SpinButton, Switch, Tab, TabList, Tree, TreeItem, TreeItemLayout, useId,
} from '@fluentui/react-components';

const compactPopup = {position: 'below', align: 'start', offset: 4};

function AccordionDemo() {
  return (
    <Accordion className="control-sample" collapsible>
      <AccordionItem value="layout">
        <AccordionHeader size="small">Layout</AccordionHeader>
        <AccordionPanel>12-column grid</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="spacing">
        <AccordionHeader size="small">Spacing</AccordionHeader>
        <AccordionPanel>8 px base unit</AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

function CheckboxDemo() {
  const [layout, setLayout] = useState(true);
  const [type, setType] = useState(false);
  const all = layout === type ? layout : 'mixed';

  return (
    <div role="group" aria-label="Export options" className="control-sample checkbox-sample">
      <Checkbox size="medium" label="Select all" checked={all} onChange={(_, {checked}) => {
        setLayout(checked === true);
        setType(checked === true);
      }} />
      <Checkbox label="Layout" checked={layout} onChange={(_, {checked}) => setLayout(checked === true)} />
      <Checkbox label="Typography" checked={type} onChange={(_, {checked}) => setType(checked === true)} />
    </div>
  );
}

const colorOptions = ['Ink', 'Lilac', 'Smoke'];

function ComboboxDemo() {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const options = colorOptions.filter(option => option.toLowerCase().includes(value.toLowerCase()));

  return (
    <Combobox className="control-sample popup-trigger" aria-label="Search colors" placeholder="Search colors"
      value={value} open={open} onOpenChange={(_, data) => setOpen(data.open)}
      onChange={event => {
        setValue(event.target.value);
        setOpen(true);
      }}
      onOptionSelect={(_, {optionText}) => setValue(optionText ?? '')}
      positioning={compactPopup} listbox={{className: 'control-listbox'}}>
      {options.map(option => <Option key={option}>{option}</Option>)}
      {options.length === 0 && <Option disabled>No results</Option>}
    </Combobox>
  );
}

function DropdownDemo() {
  return (
    <Dropdown className="control-sample popup-trigger" aria-label="Choose formats" placeholder="Choose formats"
      multiselect positioning={compactPopup} listbox={{className: 'control-listbox'}}>
      <Option>PNG</Option>
      <Option>SVG</Option>
      <Option>PDF</Option>
    </Dropdown>
  );
}

function MenuDemo() {
  const [view, setView] = useState('Grid');
  return (
    <Menu checkedValues={{view: [view]}} onCheckedValueChange={(_, {checkedItems}) => setView(checkedItems[0])}
      positioning={compactPopup}>
      <MenuTrigger disableButtonEnhancement><Button className="popup-trigger">View: {view}</Button></MenuTrigger>
      <MenuPopover className="control-menu"><MenuList aria-label="View options">
        <MenuItemRadio name="view" value="Grid">Grid</MenuItemRadio>
        <MenuItemRadio name="view" value="List">List</MenuItemRadio>
      </MenuList></MenuPopover>
    </Menu>
  );
}

function DialogDemo() {
  const [archived, setArchived] = useState(false);
  return (
    <Dialog>
      <DialogTrigger disableButtonEnhancement><Button>{archived ? 'Restore' : 'Archive'}</Button></DialogTrigger>
      <DialogSurface className="control-dialog">
        <DialogBody>
          <DialogTitle>{archived ? 'Restore project?' : 'Archive project?'}</DialogTitle>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement><Button size="small">Cancel</Button></DialogTrigger>
            <DialogTrigger disableButtonEnhancement>
              <Button size="small" appearance="primary" onClick={() => setArchived(!archived)}>Confirm</Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

function SwitchDemo() {
  const [enabled, setEnabled] = useState(false);
  return <Switch label={enabled ? 'Preview on' : 'Preview off'} aria-label="Preview mode"
    checked={enabled} onChange={(_, {checked}) => setEnabled(checked)} />;
}

function SliderDemo() {
  const [zoom, setZoom] = useState(50);
  return (
    <div className="control-sample labeled-control">
      <span className="control-label" aria-hidden="true">Zoom <output>{zoom}%</output></span>
      <Slider aria-label="Zoom" min={10} max={100} step={5} value={zoom} onChange={(_, {value}) => setZoom(value)} />
    </div>
  );
}

function SpinButtonDemo() {
  const label = useId('copies');
  return (
    <div className="control-sample labeled-control">
      <span className="control-label" id={label}>Copies</span>
      <SpinButton aria-labelledby={label} defaultValue={2} min={1} max={20} size="small" />
    </div>
  );
}

const panels = {Design: '3 drafts', Review: '2 comments', Ship: '1 release'};

function TabsDemo() {
  const [tab, setTab] = useState('Design');
  const id = useId('phase');
  return (
    <div className="control-sample">
      <TabList size="small" aria-label="Project phase" selectedValue={tab} onTabSelect={(_, {value}) => setTab(value)}>
        {Object.keys(panels).map(name => <Tab key={name} value={name} id={`${id}-${name}`} aria-controls={`${id}-panel`}>{name}</Tab>)}
      </TabList>
      <div className="tab-panel" role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-${tab}`}>{panels[tab]}</div>
    </div>
  );
}

function RatingDemo() {
  return <Rating aria-label="Rate the component" size="medium" defaultValue={3} itemLabel={value => `${value} of 5 stars`} />;
}

function TreeDemo() {
  return (
    <Tree size="small" aria-label="Project files" className="control-sample">
      <TreeItem itemType="branch"><TreeItemLayout>Assets</TreeItemLayout>
        <Tree>
          <TreeItem itemType="leaf"><TreeItemLayout>Icons</TreeItemLayout></TreeItem>
          <TreeItem itemType="leaf"><TreeItemLayout>Type</TreeItemLayout></TreeItem>
        </Tree>
      </TreeItem>
    </Tree>
  );
}

const slides = ['Ink', 'Lilac', 'Smoke'];

function CarouselDemo() {
  return (
    <Carousel className="control-sample" aria-label="Swatches" groupSize={1} draggable circular>
      <CarouselViewport>
        <CarouselSlider>
          {slides.map(color => (
            <CarouselCard key={color}><div className="carousel-swatch" data-color={color.toLowerCase()}>{color}</div></CarouselCard>
          ))}
        </CarouselSlider>
      </CarouselViewport>
      <div className="carousel-nav">
        <CarouselButton navType="prev" size="small" appearance="subtle" aria-label="Previous swatch" />
        <CarouselNav aria-label="Swatch pages">
          {index => <CarouselNavButton aria-label={`Show ${slides[index]}`} />}
        </CarouselNav>
        <CarouselButton navType="next" size="small" appearance="subtle" aria-label="Next swatch" />
      </div>
    </Carousel>
  );
}

function ProgressDemo() {
  const [value, setValue] = useState(0);
  return (
    <div className="control-sample labeled-control">
      <ProgressBar aria-label="Export progress" value={value} />
      <Button size="small" onClick={() => setValue(value === 1 ? 0 : value + 0.25)}>
        {value === 1 ? 'Reset' : `Advance · ${value * 100}%`}
      </Button>
    </div>
  );
}

export default {
  accordion: AccordionDemo,
  checkbox: CheckboxDemo,
  combobox: ComboboxDemo,
  dropdown: DropdownDemo,
  menu: MenuDemo,
  dialog: DialogDemo,
  switch: SwitchDemo,
  slider: SliderDemo,
  spinbutton: SpinButtonDemo,
  tabs: TabsDemo,
  rating: RatingDemo,
  tree: TreeDemo,
  carousel: CarouselDemo,
  progress: ProgressDemo,
};
