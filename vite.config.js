import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    coverage: {
      include: ['src/**/*'],
      reporter: ['lcovonly', 'text']
    }
  }
})
