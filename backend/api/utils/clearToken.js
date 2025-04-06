const clearToken = (res) => {
    res.cookie('auth_token', '', {
      maxAge: 0,
      httpOnly: true,
      sameSite: 'none',
      secure: process.env.NODE_ENV == 'production',
    });
};

export default clearToken;