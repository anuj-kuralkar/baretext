DEFINE TABLE IF NOT EXISTS user SCHEMAFULL
  PERMISSIONS
    FOR select, update
      WHERE id = $auth.id;
DEFINE FIELD IF NOT EXISTS name ON user TYPE string;
DEFINE FIELD IF NOT EXISTS email ON user TYPE string ASSERT string::is_email($value);
DEFINE INDEX IF NOT EXISTS user_email_unique ON user FIELDS email UNIQUE;
DEFINE FIELD IF NOT EXISTS emailVerified ON user TYPE bool;
DEFINE FIELD IF NOT EXISTS image ON user TYPE option<string>;
DEFINE FIELD IF NOT EXISTS createdAt ON user TYPE datetime;
DEFINE FIELD IF NOT EXISTS updatedAt ON user TYPE datetime;

DEFINE TABLE IF NOT EXISTS session SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS expiresAt ON session TYPE datetime;
DEFINE FIELD IF NOT EXISTS token ON session TYPE string;
DEFINE INDEX IF NOT EXISTS session_token_unique ON session FIELDS token UNIQUE;
DEFINE FIELD IF NOT EXISTS createdAt ON session TYPE datetime;
DEFINE FIELD IF NOT EXISTS updatedAt ON session TYPE datetime;
DEFINE FIELD IF NOT EXISTS ipAddress ON session TYPE option<string>;
DEFINE FIELD IF NOT EXISTS userAgent ON session TYPE option<string>;
DEFINE FIELD IF NOT EXISTS userId ON session TYPE record<user>;
DEFINE INDEX IF NOT EXISTS session_userId_index ON session FIELDS userId;

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

DEFINE TABLE IF NOT EXISTS verification SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS identifier ON verification TYPE string;
DEFINE INDEX IF NOT EXISTS verification_identifier_index ON verification FIELDS identifier;
DEFINE FIELD IF NOT EXISTS value ON verification TYPE string;
DEFINE FIELD IF NOT EXISTS expiresAt ON verification TYPE datetime;
DEFINE FIELD IF NOT EXISTS createdAt ON verification TYPE datetime;
DEFINE FIELD IF NOT EXISTS updatedAt ON verification TYPE datetime;
