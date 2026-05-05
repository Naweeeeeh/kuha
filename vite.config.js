import { defineConfig, createLogger } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import { nodePolyfills } from 'vite-plugin-node-polyfills';

const logger = createLogger();
const originalWarning = logger.warn;
logger.warn = (msg, options) => {
    if (msg.includes('esbuild` option was specified')) return;
    originalWarning(msg, options);
};

export default defineConfig({
    customLogger: logger,
    plugins: [
        react(),
        wasm(),
        topLevelAwait(),
        nodePolyfills()
    ],
})