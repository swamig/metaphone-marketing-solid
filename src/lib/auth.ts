const BUTTRBASE_AUTH = 'https://stagingapi.buttrbase.com';
const ORG_UUID = 'ab8db11a-c766-552a-8654-a82ec73e34d4';

export interface SendPinResult {
  sent: boolean;
  dev_token?: string;
  expires_in_seconds: number;
}

export async function sendPin(email: string): Promise<SendPinResult> {
  const resp = await fetch(`${BUTTRBASE_AUTH}/api/auth/magic-link/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, org_uuid: ORG_UUID }),
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error((data as { error?: string }).error || `HTTP ${resp.status}`);
  return data as SendPinResult;
}

export async function verifyPin(token: string): Promise<string> {
  const resp = await fetch(`${BUTTRBASE_AUTH}/api/auth/magic-link/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  const data = await resp.json() as { access_token?: string; error?: string };
  if (!resp.ok) throw new Error(data.error || `HTTP ${resp.status}`);
  return data.access_token!;
}
