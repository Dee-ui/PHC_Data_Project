// api.ts
export type PredictResponse = {
  preds: number[];
  labels?: number[];
  threshold?: number;
  model_version: string;
  n_features: number;
  used_scaler: boolean;
};

export async function getModelMeta(base = "http://localhost:8000") {
  const res = await fetch(`${base}/api/v1/model_meta`);
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ features: string[]; uses_scaler: boolean }>;
}

export async function predict(record: Record<string, number>, base = "http://localhost:8000") {
  const res = await fetch(`${base}/api/v1/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ records: [record] })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<PredictResponse>;
}
