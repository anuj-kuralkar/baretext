DEFINE ACCESS users
  ON DATABASE TYPE RECORD
    WITH JWT
      URL 'https://baretext.app/api/auth/jwks'
  AUTHENTICATE {
    RETURN type::record($token.sub);
  }
  DURATION 
    FOR TOKEN 15m,
    FOR SESSION 12h;
