export type SystemId = 'drive' | 'battery';

export interface SystemCallout {
  id: string;
  label: string;
  text: string;
  x: number;
  y: number;
}

export interface SystemDefinition {
  id: SystemId;
  label: string;
  shortLabel: string;
  category: string;
  title: string;
  description: string;
  benefit: string;
  image: string;
  anchor: { x: number; y: number };
  points: SystemCallout[];
}

export const SYSTEM_IDS: SystemId[] = ['drive', 'battery'];

export const SYSTEMS: Record<SystemId, SystemDefinition> = {
  drive: {
    id: 'drive',
    label: 'Electric Drive',
    shortLabel: 'Drive',
    category: 'Power delivery',
    title: 'Electricity, into motion.',
    description:
      'The front drive unit converts stored direct-current energy into smooth rotational force at the wheels through a compact motor, power inverter, and single-speed gearing.',
    benefit:
      'Direct torque control delivers immediate, quiet acceleration with fewer moving drivetrain parts.',
    image: '/media/drive-cutout.png',
    anchor: { x: 25, y: 48 },
    points: [
      {
        id: 'motor',
        label: 'Motor',
        text: 'Stationary stator windings generate a rotating magnetic field that turns the rotor shaft cleanly.',
        x: 24,
        y: 49,
      },
      {
        id: 'inverter',
        label: 'Inverter',
        text: 'Power electronics convert direct current from the battery pack into controlled alternating current for the motor.',
        x: 34,
        y: 45,
      },
      {
        id: 'reduction-gear',
        label: 'Reduction gear',
        text: 'Fixed-ratio gearing steps down motor speed to multiply rotational torque at the axle.',
        x: 48,
        y: 51,
      },
    ],
  },
  battery: {
    id: 'battery',
    label: 'Battery',
    shortLabel: 'Battery',
    category: 'Energy storage',
    title: 'The energy beneath you.',
    description:
      'A structural high-voltage battery pack sits low beneath the cabin floor, pairing modular cells with integrated thermal regulation and electronic monitoring.',
    benefit:
      'Underfloor packaging lowers the vehicle center of gravity while preserving open interior space.',
    image: '/media/battery-cutout.png',
    anchor: { x: 64, y: 72 },
    points: [
      {
        id: 'cell-pack',
        label: 'Cell pack',
        text: 'Lithium cells are grouped into sealed modules inside a protective underfloor enclosure.',
        x: 31,
        y: 42,
      },
      {
        id: 'cooling',
        label: 'Cooling',
        text: 'Thermal channels circulate coolant beneath the modules to keep operating temperatures even.',
        x: 49,
        y: 49,
      },
      {
        id: 'management-system',
        label: 'Management system',
        text: 'Control electronics monitor cell balance, temperature, and high-voltage isolation continuously.',
        x: 27,
        y: 55,
      },
    ],
  },
};
