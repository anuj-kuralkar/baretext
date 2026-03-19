DEFINE ACCESS users
  ON DATABASE TYPE RECORD
    WITH JWT
      URL 'http://baretext.app/api/auth/jwks'
  AUTHENTICATE {
    RETURN type::record($token.id);
  }
  DURATION 
    FOR TOKEN 15m,
    FOR SESSION 12h;
