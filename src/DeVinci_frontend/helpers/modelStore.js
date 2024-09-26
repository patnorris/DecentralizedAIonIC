import { writable } from 'svelte/store';
import { getLocalFlag } from './localStorage';

export const downloadedModels = writable(getLocalFlag("downloadedAiModels") || []);

export function addDownloadedModel(modelId) {
    downloadedModels.update(models => [...models, modelId]);
}