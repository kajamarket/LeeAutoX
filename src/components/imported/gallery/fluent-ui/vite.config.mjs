import {defineConfig} from 'vite';

export default defineConfig({
  base: './',
  build: {
    license: {fileName: 'THIRD_PARTY_LICENSES.md'},
    rolldownOptions: {
      onLog(level, log, handler) {
        // React Server Components directives have no effect on this static client entry.
        if (log.code === 'MODULE_LEVEL_DIRECTIVE' && log.message.includes('"use client"')) return;
        handler(level, log);
      },
    },
  },
  server: {fs: {allow: ['../..']}},
});
