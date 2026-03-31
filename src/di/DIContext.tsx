'use client';

// DIContext is no longer needed — submitApplicationUseCase is a module-level singleton.
// This file is kept as a re-export shim; callers should import directly from container.client.
export { submitApplicationUseCase } from './container.client';
