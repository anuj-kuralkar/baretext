DEFINE TABLE IF NOT EXISTS user SCHEMAFULL
  PERMISSIONS
    FOR create, select
      FULL
    FOR update, delete
      WHERE id = $auth.id;

DEFINE FIELD IF NOT EXISTS name ON user TYPE string;
DEFINE FIELD IF NOT EXISTS email ON user TYPE string ASSERT string::is_email($value);
DEFINE INDEX IF NOT EXISTS user_email_unique ON user FIELDS email UNIQUE;
DEFINE FIELD IF NOT EXISTS emailVerified ON user TYPE bool;
DEFINE FIELD IF NOT EXISTS image ON user TYPE option<string>;
DEFINE FIELD IF NOT EXISTS createdAt ON user TYPE datetime;
DEFINE FIELD IF NOT EXISTS updatedAt ON user TYPE datetime;

DEFINE TABLE IF NOT EXISTS account SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS accountId ON account TYPE string;
DEFINE FIELD IF NOT EXISTS providerId ON account TYPE string;
DEFINE FIELD IF NOT EXISTS userId ON account TYPE record<user>;
DEFINE INDEX IF NOT EXISTS account_userId_index ON account FIELDS userId;
DEFINE FIELD IF NOT EXISTS accessToken ON account TYPE option<string>;
DEFINE FIELD IF NOT EXISTS refreshToken ON account TYPE option<string>;
DEFINE FIELD IF NOT EXISTS idToken ON account TYPE option<string>;
DEFINE FIELD IF NOT EXISTS accessTokenExpiresAt ON account TYPE option<datetime>;
DEFINE FIELD IF NOT EXISTS refreshTokenExpiresAt ON account TYPE option<datetime>;
DEFINE FIELD IF NOT EXISTS scope ON account TYPE option<string>;
DEFINE FIELD IF NOT EXISTS password ON account TYPE option<string>;
DEFINE FIELD IF NOT EXISTS createdAt ON account TYPE datetime;
DEFINE FIELD IF NOT EXISTS updatedAt ON account TYPE datetime;

DEFINE TABLE IF NOT EXISTS jwks SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS publicKey ON jwks TYPE string;
DEFINE FIELD IF NOT EXISTS privateKey ON jwks TYPE string;
DEFINE FIELD IF NOT EXISTS createdAt ON jwks TYPE datetime;
DEFINE FIELD IF NOT EXISTS expiresAt ON jwks TYPE option<datetime>;
