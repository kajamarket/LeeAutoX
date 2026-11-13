/**
 * Vehicle 360 Viewer Data Types
 * Used for defining interactive 360 exterior spin sequences and 360 interior virtual tours.
 */

export interface View360Exterior {
  /**
   * Path to the folder containing image frames.
   * e.g. "https://scaleflex.cloudimg.io/v7/demo/earbuds/"
   * Optional when `slug` is provided (defaults to `${EXTERIOR_BASE_URL}${slug}/exterior/`).
   */
  folder?: string;

  /**
   * Vehicle slug for self-hosted frames under EXTERIOR_BASE_URL.
   * Builds folder = `https://images.leeautox.com/cars/${slug}/exterior/`.
   */
  slug?: string;

  /**
   * Filename pattern for sequence frames. Defaults to "{index}.{ext}" (e.g. "{index}.jpg").
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
   * Image file extension (e.g. "jpg", "jpeg", "webp", "png"). Defaults to "jpg".
   */
  ext?: string;

  /**
   * If true, marks viewer as demo preview.
   */
  demo?: boolean;

  /**
   * Enable automatic rotation after load. Defaults to true for exterior 360 config.
   */
  autoplay?: boolean;

  /**
   * Autoplay pattern: 'spin-x', 'spin-y', 'spin-xy', 'spin-yx'. Defaults to 'spin-x'.
   */
  autoplayBehavior?: string;

  /**
   * Reverse autoplay direction. Defaults to false.
   */
  autoplayReverse?: boolean;

  /**
   * Rotation speed in ms per frame (lower = faster). Defaults to 100.
   */
  speed?: number;

  /**
   * Drag sensitivity factor. Defaults to 100.
   */
  dragSpeed?: number;

  /**
   * Enable mouse drag rotation. Defaults to true.
   */
  draggable?: boolean;

  /**
   * Enable touch swipe rotation. Defaults to true.
   */
  swipeable?: boolean;

  /**
   * Enable arrow key navigation. Defaults to true.
   */
  keys?: boolean;

  /**
   * Enable built-in fullscreen button. Defaults to true.
   */
  fullscreen?: boolean;

  /**
   * Maximum zoom multiplier for dent/scratch inspection. Defaults to 5.
   */
  zoomMax?: number;

  /**
   * Show built-in zoom controls. Defaults to true.
   */
  zoomControls?: boolean;

  /**
   * Enable pinch-to-zoom on touch devices. Defaults to true.
   */
  pinchZoom?: boolean;
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
    demo?: boolean;
    autoplay?: boolean;
    speed?: number;
    dragSpeed?: number;
    zoomMax?: number;
    draggable?: boolean;
    swipeable?: boolean;
    keys?: boolean;
    autoplayBehavior?: string;
    autoplayReverse?: boolean;
    fullscreen?: boolean;
    zoomControls?: boolean;
    pinchZoom?: boolean;
    elementId?: string;
    className?: string;
    attributes?: Record<string, string>;
    rawSnippet?: string;
  };
  interior?: {
    panoeeUrl: string;
  };
}
