import React, { useEffect, useRef } from 'react';
import type { SystemId } from './systems';

export type HoverPhase = 'overview' | 'entering' | 'detail' | 'returning';

const VIDEO_SOURCES: Record<SystemId, [string, string]> = {
  drive: ['/media/hood-hover-forward.mp4', '/media/hood-hover-reverse.mp4'],
  battery: ['/media/battery-hover-forward.mp4', '/media/battery-hover-reverse.mp4'],
};

const MASK_SRC = '/media/exterior-polished.png';
const PLAYBACK_WATCHDOG_MS = 15000;

export function nextPreviewClip(current: SystemId | null, desired: SystemId | null) {
  if (current === desired) return null;
  if (current) return { id: current, reverse: true as const };
  if (desired) return { id: desired, reverse: false as const };
  return null;
}

function parseCssColorToUnitRgb(raw: string): [number, number, number] | null {
  const value = raw.trim();
  if (!value || value === 'transparent' || value === 'rgba(0, 0, 0, 0)') return null;

  if (value.startsWith('#')) {
    const hex = value.slice(1);
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return [r / 255, g / 255, b / 255];
    }
    if (hex.length >= 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return [r / 255, g / 255, b / 255];
    }
  }

  const rgbMatch = value.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
  if (rgbMatch) {
    return [
      Number(rgbMatch[1]) / 255,
      Number(rgbMatch[2]) / 255,
      Number(rgbMatch[3]) / 255,
    ];
  }
  return null;
}

function readStageTargetBg(surface: HTMLCanvasElement): [number, number, number] {
  const cssVar = getComputedStyle(surface).getPropertyValue('--veyra-stage-bg');
  const parsedVar = parseCssColorToUnitRgb(cssVar);
  if (parsedVar) return parsedVar;

  const band = surface.closest('.lx-band-dark') ?? document.body;
  const bandBg = getComputedStyle(band).backgroundColor;
  return parseCssColorToUnitRgb(bandBg) ?? [9 / 255, 9 / 255, 11 / 255];
}

const VERT_SHADER = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = vec2(a_pos.x * 0.5 + 0.5, 0.5 - a_pos.y * 0.5);
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG_SHADER = `
precision mediump float;
uniform sampler2D u_video;
uniform sampler2D u_extMask;
uniform vec3 u_targetBg;
varying vec2 v_uv;

void main() {
  vec4 c = texture2D(u_video, v_uv);
  float extAlpha = texture2D(u_extMask, v_uv).a;

  float br = c.b - c.r;
  float bg = c.b - c.g;
  float blueRatio = br / max(c.b, 0.12);

  // Ordered slate-blue studio ramp (b > g > r) with bright cyan glow protection
  float isOrderedBlue = step(c.r, c.g) * step(c.g, c.b);
  float protectCyanGlow = 1.0 - smoothstep(0.56, 0.72, c.g);

  float blueAmt = smoothstep(0.11, 0.21, br)
                * smoothstep(0.025, 0.08, bg)
                * smoothstep(0.24, 0.36, blueRatio)
                * isOrderedBlue
                * protectCyanGlow;

  // Preserve closed car body, tinted glass, and contact shadow inside exterior-polished.png
  float outsideCar = 1.0 - smoothstep(0.20, 0.70, extAlpha);
  float keyStrength = blueAmt * outsideCar;

  // Dissolve darker blue studio floor shadow cleanly into transparent targetBg
  float darkBlueShadow = smoothstep(0.03, 0.12, br)
                       * smoothstep(0.28, 0.44, blueRatio)
                       * (1.0 - smoothstep(0.14, 0.32, c.b))
                       * isOrderedBlue
                       * protectCyanGlow
                       * outsideCar;

  float alpha = clamp(1.0 - max(keyStrength, darkBlueShadow * 0.85), 0.0, 1.0);

  // Feather extreme 1.5% frame edges cleanly into stage
  float edgeX = smoothstep(0.0, 0.015, v_uv.x) * smoothstep(1.0, 0.985, v_uv.x);
  float edgeY = smoothstep(0.0, 0.015, v_uv.y) * smoothstep(1.0, 0.985, v_uv.y);
  alpha *= (edgeX * edgeY);

  // Strip blue spill halo on rim pixels & lifted silver hood edge
  vec3 rgb = c.rgb;
  float spillMask = smoothstep(0.08, 0.22, br)
                  * smoothstep(0.20, 0.35, blueRatio)
                  * protectCyanGlow
                  * outsideCar;
  if (spillMask > 0.001) {
    float neutralB = mix(c.g + max(0.0, (c.g - c.r) * 0.2), u_targetBg.b, 0.15);
    rgb.b = mix(rgb.b, min(rgb.b, neutralB), spillMask * 0.85);
    rgb.g = mix(rgb.g, min(rgb.g, max(c.r + 0.02, c.g * 0.92)), spillMask * 0.35);
    rgb = mix(rgb, u_targetBg, (1.0 - alpha) * 0.45);
  }

  rgb = mix(rgb, u_targetBg, darkBlueShadow * 0.85);

  gl_FragColor = vec4(rgb * alpha, alpha);
}
`;

interface FrameRenderer {
  paintFrame: (video: HTMLVideoElement, targetBg: [number, number, number]) => void;
  dispose: () => void;
}

function createWebGlRenderer(
  surface: HTMLCanvasElement,
  onMaskReady: () => void
): FrameRenderer | null {
  const glOpts: WebGLContextAttributes = {
    alpha: true,
    premultipliedAlpha: true,
    preserveDrawingBuffer: true,
    antialias: false,
    depth: false,
    stencil: false,
  };
  const gl = (surface.getContext('webgl', glOpts) ||
    surface.getContext('experimental-webgl', glOpts)) as WebGLRenderingContext | null;
  if (!gl) return null;

  function compileShader(type: number, source: string) {
    if (!gl) return null;
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vert = compileShader(gl.VERTEX_SHADER, VERT_SHADER);
  const frag = compileShader(gl.FRAGMENT_SHADER, FRAG_SHADER);
  if (!vert || !frag) {
    if (vert) gl.deleteShader(vert);
    if (frag) gl.deleteShader(frag);
    return null;
  }

  const program = gl.createProgram();
  if (!program) {
    gl.deleteShader(vert);
    gl.deleteShader(frag);
    return null;
  }
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    gl.deleteShader(vert);
    gl.deleteShader(frag);
    return null;
  }

  const quadBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW
  );

  const posLoc = gl.getAttribLocation(program, 'a_pos');
  const videoLoc = gl.getUniformLocation(program, 'u_video');
  const maskLoc = gl.getUniformLocation(program, 'u_extMask');
  const targetBgLoc = gl.getUniformLocation(program, 'u_targetBg');

  function createClampTexture() {
    if (!gl) return null;
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return tex;
  }

  const videoTex = createClampTexture();
  const maskTex = createClampTexture();
  if (!videoTex || !maskTex) return null;

  // Placeholder 1x1 transparent mask until exterior-polished.png finishes loading
  gl.bindTexture(gl.TEXTURE_2D, maskTex);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 0, 0])
  );

  let disposed = false;
  const maskImg = new Image();
  maskImg.onload = () => {
    if (disposed || !gl) return;
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, maskTex);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, maskImg);
    onMaskReady();
  };
  maskImg.src = MASK_SRC;

  return {
    paintFrame(video: HTMLVideoElement, targetBg: [number, number, number]) {
      gl.viewport(0, 0, surface.width, surface.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, videoTex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
      gl.uniform1i(videoLoc, 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, maskTex);
      gl.uniform1i(maskLoc, 1);

      gl.uniform3f(targetBgLoc, targetBg[0], targetBg[1], targetBg[2]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    dispose() {
      disposed = true;
      maskImg.onload = null;
      gl.deleteTexture(videoTex);
      gl.deleteTexture(maskTex);
      gl.deleteBuffer(quadBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
    },
  };
}

function create2dKeyedRenderer(surface: HTMLCanvasElement): FrameRenderer | null {
  const ctx = surface.getContext('2d', { alpha: true, willReadFrequently: true });
  if (!ctx) return null;

  const smoothstep = (e0: number, e1: number, x: number) => {
    const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
    return t * t * (3 - 2 * t);
  };

  let maskData: Uint8ClampedArray | null = null;
  let maskW = 0;
  let maskH = 0;
  const maskImg = new Image();
  let disposed = false;

  maskImg.onload = () => {
    if (disposed) return;
    const mc = document.createElement('canvas');
    mc.width = maskImg.naturalWidth || 1670;
    mc.height = maskImg.naturalHeight || 941;
    const mctx = mc.getContext('2d');
    if (mctx) {
      mctx.drawImage(maskImg, 0, 0, mc.width, mc.height);
      maskData = mctx.getImageData(0, 0, mc.width, mc.height).data;
      maskW = mc.width;
      maskH = mc.height;
    }
  };
  maskImg.src = MASK_SRC;

  return {
    paintFrame(video: HTMLVideoElement, targetBg: [number, number, number]) {
      const w = surface.width;
      const h = surface.height;
      ctx.drawImage(video, 0, 0, w, h);
      const img = ctx.getImageData(0, 0, w, h);
      const data = img.data;
      const tr = Math.round(targetBg[0] * 255);
      const tg = Math.round(targetBg[1] * 255);
      const tb = Math.round(targetBg[2] * 255);

      for (let y = 0; y < h; y++) {
        const my = maskData ? Math.min(maskH - 1, Math.floor((y / h) * maskH)) : 0;
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const extAlpha = maskData
            ? maskData[(my * maskW + Math.min(maskW - 1, Math.floor((x / w) * maskW))) * 4 + 3] / 255
            : 0;
          const outsideCar = 1 - smoothstep(0.2, 0.7, extAlpha);
          if (outsideCar <= 0.001) continue;

          const br = b - r;
          const bg = b - g;
          const blueRatio = br / Math.max(b, 30);
          if (b >= g && g >= r && g < 184 && br >= 24 && bg >= 6 && blueRatio >= 0.24) {
            const keyStrength =
              smoothstep(28, 54, br) *
              smoothstep(6, 20, bg) *
              smoothstep(0.24, 0.36, blueRatio) *
              outsideCar;
            const alpha = Math.max(0, 1 - keyStrength);
            if (alpha < 0.99) {
              data[i] = Math.round(r * alpha + tr * (1 - alpha));
              data[i + 1] = Math.round(g * alpha + tg * (1 - alpha));
              data[i + 2] = Math.round(b * alpha + tb * (1 - alpha));
              data[i + 3] = Math.round(alpha * 255);
            }
          }
        }
      }
      ctx.putImageData(img, 0, 0);
    },
    dispose() {
      disposed = true;
      maskImg.onload = null;
      maskData = null;
    },
  };
}

interface HoverVideoProps {
  desired: SystemId | null;
  mode: HoverPhase;
  reduced: boolean;
  onNeutral?: (neutral: boolean) => void;
  onFallbackChange?: (failed: boolean) => void;
}

export default function HoverVideo({
  desired,
  mode,
  reduced,
  onNeutral,
  onFallbackChange,
}: HoverVideoProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({ desired, mode, reduced, onNeutral, onFallbackChange });
  const reconcileRef = useRef<() => void>(() => {});

  stateRef.current = { desired, mode, reduced, onNeutral, onFallbackChange };

  useEffect(() => {
    const surface = canvasRef.current;
    if (!surface) return;

    let targetBg = readStageTargetBg(surface);
    let lastVisibleVideo: HTMLVideoElement | null = null;
    let renderer: FrameRenderer | null = null;

    const refreshTargetAndRepaint = () => {
      if (!surface || !renderer) return;
      targetBg = readStageTargetBg(surface);
      if (lastVisibleVideo && Number(surface.style.opacity || '0') > 0) {
        draw(lastVisibleVideo);
      }
    };

    renderer =
      createWebGlRenderer(surface, refreshTargetAndRepaint) ?? create2dKeyedRenderer(surface);

    if (!renderer) {
      console.error('[HoverVideo] Canvas rendering context unavailable; falling back to stills.');
      stateRef.current.onFallbackChange?.(true);
      return;
    }

    const themeObserver = new MutationObserver(refreshTargetAndRepaint);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style', 'data-theme'],
    });

    const videos = new Map<string, HTMLVideoElement>();
    let disposed = false;
    let settled: SystemId | null = null;
    let active: HTMLVideoElement | null = null;
    let running = false;
    let frozen = false;
    let failed = false;
    let generation = 0;
    let raf = 0;
    let watchdog = 0;
    let cancelFrame: (() => void) | undefined;

    for (const [id, pair] of Object.entries(VIDEO_SOURCES)) {
      pair.forEach((src, direction) => {
        const video = document.createElement('video');
        video.muted = true;
        video.playsInline = true;
        video.preload = 'auto';
        video.src = src;
        videos.set(`${id}-${direction}`, video);
      });
    }

    function draw(video: HTMLVideoElement) {
      if (!surface || !renderer) return;
      if (video.readyState < 2 || video.seeking || !video.videoWidth || !video.videoHeight) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = surface.getBoundingClientRect();
      const targetWidth =
        rect.width > 0
          ? Math.min(video.videoWidth, Math.max(1, Math.round(rect.width * dpr)))
          : video.videoWidth;
      const targetHeight =
        rect.height > 0
          ? Math.min(video.videoHeight, Math.max(1, Math.round(rect.height * dpr)))
          : video.videoHeight;

      if (surface.width !== targetWidth || surface.height !== targetHeight) {
        surface.width = targetWidth;
        surface.height = targetHeight;
      }

      lastVisibleVideo = video;
      renderer.paintFrame(video, targetBg);
      surface.style.opacity = '1';
    }

    function stop() {
      generation += 1;
      active?.pause();
      if (active) {
        active.onended = null;
        active.onerror = null;
        active.onloadeddata = null;
        active.onseeked = null;
      }
      cancelFrame?.();
      cancelFrame = undefined;
      window.cancelAnimationFrame(raf);
      window.clearTimeout(watchdog);
      running = false;
      active = null;
    }

    function update() {
      if (disposed || !surface) return;
      const props = stateRef.current;

      // Freeze exact visible hover frame while detail zoom/crossfade covers it
      if (props.mode === 'entering') {
        if (!frozen) {
          stop();
          frozen = true;
        }
        return;
      }

      if (props.mode === 'detail' || props.reduced) {
        stop();
        settled = null;
        frozen = false;
        lastVisibleVideo = null;
        surface.style.opacity = '0';
        props.onNeutral?.(true);
        return;
      }

      if (props.mode !== 'overview' || running || failed) return;
      frozen = false;

      const next = nextPreviewClip(settled, props.desired);
      if (!next) return;

      const video = videos.get(`${next.id}-${next.reverse ? 1 : 0}`);
      if (!video) return;

      active = video;
      running = true;
      props.onNeutral?.(false);

      const token = ++generation;
      const valid = () => !disposed && generation === token;

      function fail(reason?: unknown) {
        if (!valid()) return;
        console.error('[HoverVideo] Video playback failed; falling back to still crossfade.', reason);
        stop();
        failed = true;
        lastVisibleVideo = null;
        if (surface) surface.style.opacity = '0';
        stateRef.current.onFallbackChange?.(true);
        stateRef.current.onNeutral?.(true);
      }

      function complete() {
        if (!valid()) return;
        draw(video);
        stop();
        settled = next!.reverse ? null : next!.id;
        if (settled === null && surface) {
          lastVisibleVideo = null;
          surface.style.opacity = '0';
        }
        stateRef.current.onNeutral?.(settled === null);
        update();
      }

      function paint() {
        if (!valid()) return;
        draw(video);
        if ('requestVideoFrameCallback' in video) {
          const handle = video.requestVideoFrameCallback(paint);
          cancelFrame = () => video.cancelVideoFrameCallback(handle);
        } else {
          raf = window.requestAnimationFrame(paint);
        }
      }

      function start() {
        if (!valid()) return;
        video.onseeked = null;
        video.onloadeddata = null;
        if ('requestVideoFrameCallback' in video) {
          const handle = video.requestVideoFrameCallback(paint);
          cancelFrame = () => video.cancelVideoFrameCallback(handle);
        } else {
          raf = window.requestAnimationFrame(paint);
        }
        video.play().catch(fail);
      }

      function prepare() {
        if (!valid()) return;
        video.onloadeddata = null;
        if (video.currentTime > 0.001) {
          video.onseeked = start;
          video.currentTime = 0;
        } else {
          start();
        }
      }

      video.onended = complete;
      video.onerror = () => fail(video.error);
      watchdog = window.setTimeout(() => fail('Playback watchdog timeout'), PLAYBACK_WATCHDOG_MS);

      if (video.readyState >= 2) {
        prepare();
      } else {
        video.onloadeddata = prepare;
        video.load();
      }
    }

    reconcileRef.current = update;
    update();

    return () => {
      disposed = true;
      themeObserver.disconnect();
      stop();
      renderer?.dispose();
      renderer = null;
      lastVisibleVideo = null;
      reconcileRef.current = () => {};
      for (const video of videos.values()) {
        video.removeAttribute('src');
        video.load();
      }
      videos.clear();
    };
  }, []);

  useEffect(() => {
    reconcileRef.current();
  }, [desired, mode, reduced]);

  return <canvas ref={canvasRef} className="hover-video" aria-hidden="true" />;
}
