export interface IJwtPayload {
  sub: string;
  role: string;
  jti: string;
  iat?: number;
  exp?: number;
}
