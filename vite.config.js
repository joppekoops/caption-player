import { resolve } from 'path'
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, "src/CaptionPlayer.ts"),
            name: 'caption-player',
            formats: ["es", "umd"],
            fileName: (format) => `caption-player.${format}.js`,
        }
    },
});