/**
 * Vehicle 360 Viewer Data Types
 * Used for defining interactive 360 exterior spin sequences and 360 interior virtual tours.
 */

export interface View360Exterior {
  /**
   * Path to the folder containing image frames.
   * e.g. "/cars/10/exterior/" or external URL "https://scaleflex.airstore.io/demo/360-car/"
   */
  folder: string;

  /**
   * Filename pattern for sequence frames. Defaults to "{index}.jpg" or "{index}.{ext}".
   * e.g. "iris-{index}.jpeg" or "{index}.png"
   */
  filename?: string;

  /**
   * Total number of sequence frames (typically 24 to 36 frames). Defaults to 36.
   */
  amount?: number;

  /**
   * Alias for amount (for compatibility with @cloudimage/360-view amountX).
   */
  amountX?: number;

  /**
   * Image file extension (e.g. "jpg", "jpeg", "webp", "png"). Used when filename pattern is omitted.
   */
  ext?: string;

  /**
   * If true, displays a prominent "Demo 360° Preview" indicator on the viewer.
   */
  demo?: boolean;

  /**
   * Optional override for autoplay on initial load. Defaults to false.
   */
  autoplay?: boolean;

  /**
   * Rotation speed in ms per frame (lower = faster). Defaults to 80.
   */
  speed?: number;

  /**
   * Drag sensitivity factor. Defaults to 60.
   */
  dragSpeed?: number;

  /**
   * Maximum zoom multiplier for dent/scratch inspection. Defaults to 3.
   */
  zoomMax?: number;
}

export interface View360Interior {
  /**
   * Panoee virtual tour embed HTML snippet (e.g. <iframe src="..."></iframe>) or direct URL.
   */
  embed?: string;
  html?: string;
  panoeeEmbed?: string;
  panoeeUrl?: string;
}

export interface View360Config {
  /** Exterior image sequence spin configuration */
  exterior?: View360Exterior;
  /** Interior Panoee 360° panorama tour configuration (embed HTML object or raw embed HTML string) */
  interior?: View360Interior | string;
}

export interface NormalizedView360 {
  exterior?: {
    folder: string;
    filename: string;
    amount: number;
    demo: boolean;
    autoplay: boolean;
    speed: number;
    dragSpeed: number;
    zoomMax: number;
  };
  interior?: {
    panoeeUrl: string;
  };
}
