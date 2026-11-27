import React, {useState} from 'react';
import {
  ColorArea, ColorPicker, ColorSlider, ColorSwatch, Field, InfoLabel, Input, Radio, RadioGroup,
  SearchBox, Select, SwatchPicker, Tag, TagPicker, TagPickerControl, TagPickerGroup,
  TagPickerInput, TagPickerList, TagPickerOption, Textarea,
} from '@fluentui/react-components';

const placeBelow = {position: 'below', align: 'start', offset: 4};
const formats = ['SVG', 'PNG', 'PDF'];
const colors = {Ink: '#303044', Lilac: '#a98ace', Smoke: '#9a9da9'};

function FieldDemo() {
  const [value, setValue] = useState('12');
  const valid = /^\d{3}$/.test(value);
  return (
    <Field className="control-sample" label="3-digit code" validationState={valid ? 'success' : 'error'}
      validationMessage={valid ? 'Valid code' : 'Use three digits'}>
      <Input size="small" value={value} onChange={(_, data) => setValue(data.value)} />
    </Field>
  );
}

function InputDemo() {
  const [value, setValue] = useState('New draft');
  return (
    <div className="control-sample labeled-control">
      <Input aria-label="Draft title" size="small" value={value} onChange={(_, data) => setValue(data.value)} />
      <output aria-label="Title preview" className="single-line">{value || 'Untitled'}</output>
    </div>
  );
}

function TextareaDemo() {
  const [value, setValue] = useState('');
  return (
    <div className="control-sample labeled-control">
      <Textarea aria-label="Note" placeholder="Add a note" size="small" rows={2} resize="none"
        value={value} maxLength={80} onChange={(_, data) => setValue(data.value)} />
      <output aria-label="Character count">{value.length} / 80</output>
    </div>
  );
}

function InfoLabelDemo() {
  return (
    <InfoLabel info={{children: 'Names can be edited later.', className: 'small-surface'}}
      infoButton={{'aria-label': 'About names'}} className="popup-trigger">
      Display name
    </InfoLabel>
  );
}

function RadioDemo() {
  return (
    <RadioGroup aria-label="Export quality" className="control-sample" defaultValue="standard">
      <Radio value="standard" label="Standard" />
      <Radio value="high" label="High quality" />
    </RadioGroup>
  );
}

function SearchDemo() {
  const [query, setQuery] = useState('');
  const match = formats.filter(format => format.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <div className="control-sample labeled-control">
      <SearchBox aria-label="Find format" placeholder="Find format" size="small" value={query}
        onChange={(_, data) => setQuery(data.value)} />
      <output aria-label="Matching formats">{match.join(' · ') || 'No matches'}</output>
    </div>
  );
}

function SelectDemo() {
  return (
    <Select className="control-sample" aria-label="File type" size="small" defaultValue="SVG">
      {formats.map(format => <option key={format}>{format}</option>)}
    </Select>
  );
}

function ColorPickerDemo() {
  const [color, setColor] = useState({h: 265, s: 0.48, v: 0.7});
  return (
    <ColorPicker className="control-sample swatch-area" color={color} onColorChange={(_, data) => setColor(data.color)}>
      <ColorArea inputX={{'aria-label': 'Saturation'}} inputY={{'aria-label': 'Brightness'}} />
      <ColorSlider aria-label="Hue" />
    </ColorPicker>
  );
}

function SwatchDemo() {
  return (
    <SwatchPicker aria-label="Theme color" size="small" layout="row" defaultSelectedValue="Ink">
      {Object.entries(colors).map(([name, color]) => <ColorSwatch key={name} aria-label={name} value={name} color={color} />)}
    </SwatchPicker>
  );
}

function TagPickerDemo() {
  const [selected, setSelected] = useState([]);
  const [query, setQuery] = useState('');
  const tags = ['UI', 'Motion', 'Type'].filter(tag => !selected.includes(tag) && tag.toLowerCase().includes(query.toLowerCase()));
  return (
    <TagPicker selectedOptions={selected} size="small" positioning={placeBelow}
      onOptionSelect={(_, data) => {
        setSelected(data.selectedOptions);
        setQuery('');
      }}>
      <TagPickerControl className="control-sample popup-trigger compact-tags">
        <TagPickerGroup aria-label="Selected topics">
          {selected.map(tag => (
            <Tag key={tag} value={tag} shape="rounded" dismissible dismissIcon={{'aria-label': `Remove ${tag}`}}>
              {tag}
            </Tag>
          ))}
        </TagPickerGroup>
        <TagPickerInput aria-label="Add topic" placeholder={selected.length ? undefined : 'Add topic'}
          value={query} onChange={event => setQuery(event.target.value)} />
      </TagPickerControl>
      <TagPickerList className="picker-list">
        {tags.map(tag => <TagPickerOption key={tag} value={tag}>{tag}</TagPickerOption>)}
        {!tags.length && <TagPickerOption disabled value="none">No topics</TagPickerOption>}
      </TagPickerList>
    </TagPicker>
  );
}

export default {
  field: FieldDemo,
  input: InputDemo,
  textarea: TextareaDemo,
  'info-label': InfoLabelDemo,
  'radio-group': RadioDemo,
  searchbox: SearchDemo,
  select: SelectDemo,
  'color-picker': ColorPickerDemo,
  'swatch-picker': SwatchDemo,
  'tag-picker': TagPickerDemo,
};
