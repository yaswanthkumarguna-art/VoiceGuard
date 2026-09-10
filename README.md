# VoiceGuard

VoiceGuard is the separated React + TypeScript frontend for the voice-cloning / voice-detection prototype.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Optional backend API

The detection service can POST the uploaded audio as multipart form data to an API URL. Configure that URL in the app when connecting a real FastAPI inference service.
