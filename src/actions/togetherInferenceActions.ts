'use server';

import { apiClientJson, buildApiUrl, ApiClientOptions } from '@/lib/api-client';

export async function chatCompletion(data: any, options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl('/v1/chat/completions'), {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
}

export async function textCompletion(data: any, options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl('/v1/completions'), {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
}

export async function generateImage(data: any, options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl('/v1/images/generations'), {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
}

export async function generateSpeech(data: any, options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl('/v1/audio/speech'), {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
}

export async function listVoices(options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl('/v1/audio/voices'), {
    method: 'GET',
    ...options,
  });
}

export async function createTranscription(formData: FormData, options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl('/v1/audio/transcriptions'), {
    method: 'POST',
    body: formData,
    ...options,
  });
}

export async function createTranslation(formData: FormData, options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl('/v1/audio/translations'), {
    method: 'POST',
    body: formData,
    ...options,
  });
}

export async function generateVideo(data: any, options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl('/v1/videos'), {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
}

export async function getVideo(id: string, options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl(`/v1/videos/${id}`), {
    method: 'GET',
    ...options,
  });
}

export async function createEmbeddings(data: any, options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl('/v1/embeddings'), {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
}

export async function rerank(data: any, options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl('/v1/rerank'), {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
}

export async function uploadFile(formData: FormData, options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl('/v1/files'), {
    method: 'POST',
    body: formData,
    ...options,
  });
}

export async function listFiles(options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl('/v1/files'), {
    method: 'GET',
    ...options,
  });
}

export async function getFile(id: string, options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl(`/v1/files/${id}`), {
    method: 'GET',
    ...options,
  });
}

export async function deleteFile(id: string, options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl(`/v1/files/${id}`), {
    method: 'DELETE',
    ...options,
  });
}

export async function createFineTune(data: any, options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl('/v1/fine-tunes'), {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
}

export async function listFineTunes(options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl('/v1/fine-tunes'), {
    method: 'GET',
    ...options,
  });
}

export async function getFineTune(id: string, options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl(`/v1/fine-tunes/${id}`), {
    method: 'GET',
    ...options,
  });
}

export async function cancelFineTune(id: string, options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl(`/v1/fine-tunes/${id}/cancel`), {
    method: 'POST',
    ...options,
  });
}

export async function createBatchJob(data: any, options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl('/v1/batches'), {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
}

export async function listBatchJobs(options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl('/v1/batches'), {
    method: 'GET',
    ...options,
  });
}

export async function getBatchJob(id: string, options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl(`/v1/batches/${id}`), {
    method: 'GET',
    ...options,
  });
}

export async function cancelBatchJob(id: string, options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl(`/v1/batches/${id}/cancel`), {
    method: 'POST',
    ...options,
  });
}

export async function listModels(options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl('/v1/models'), {
    method: 'GET',
    ...options,
  });
}

export async function createEndpoint(data: any, options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl('/v1/endpoints'), {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
}

export async function listEndpoints(options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl('/v1/endpoints'), {
    method: 'GET',
    ...options,
  });
}

export async function createCluster(data: any, options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl('/v1/compute/clusters'), {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
}

export async function listClusters(options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl('/v1/compute/clusters'), {
    method: 'GET',
    ...options,
  });
}

export async function createEvaluation(data: any, options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl('/v1/evaluations'), {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
}

export async function listEvaluations(options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl('/v1/evaluations'), {
    method: 'GET',
    ...options,
  });
}

export async function executeCodeInterpreter(data: any, options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl('/v1/tci/execute'), {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
}

export async function listCodeSessions(options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl('/v1/tci/sessions'), {
    method: 'GET',
    ...options,
  });
}

export async function executeFrameworkAgent(data: any, options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl('/v1/frameworks/execute'), {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
}

export async function executeSkill(data: any, options?: ApiClientOptions) {
  return apiClientJson(buildApiUrl('/v1/skills/execute'), {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
}
