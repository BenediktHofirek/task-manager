import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'http://localhost:8000/api/openapi.json',
  output: {
    format: 'prettier',
    lint: 'eslint',
    path: './src/api',
  },
  plugins: [
    { 
      name: '@hey-api/client-fetch',
      runtimeConfigPath: './src/app/api-client-config.ts' 
    },
    '@hey-api/schemas',
    {
      dates: false,
      name: '@hey-api/transformers',
    },
    {
      enums: 'javascript',
      name: '@hey-api/typescript',
    },
    {
      name: '@hey-api/sdk',
      transformer: false,
    },
  ],
});
