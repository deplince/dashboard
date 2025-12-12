export interface ICachePayload {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: string; // may not be used if ttl is set up in redis store or jwt exp time
}
