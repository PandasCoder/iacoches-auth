import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserTemp } from "../domain/interfaces";
import { GeneralEndpoints } from "../api/general.endpoints";
import { LOGIN_PROVIDERS } from '../domain/login-providers.enum';

export function configurePassportGoogle(passport: any) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: `${process.env.GOOGLE_CLIENT_ID}`,
        clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
        callbackURL: `${process.env.AUTH_URL}/google/callback`
      },
      async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        const userGoogle: UserTemp = {
          accessToken: accessToken,
          refreshToken: refreshToken,
          providerId: profile.id,
          name: profile._json.given_name,
          lastname: profile._json.family_name,
          email: profile._json.email,
          verify: profile._json.email_verified,
          loginProvider: 'google'
        };

        const userData = await GeneralEndpoints.getUserByProvider({ loginProviderId: LOGIN_PROVIDERS.GOOGLE, providerId: profile.id});
        // if user is not registered, will return google user data and pre save it
        if (!userData) {
          // check if email is already used
          const userWithEmail = await GeneralEndpoints.getUserLoginByEmail(profile._json.email);

          // if email is already used, will redirect to link account page
          if (userWithEmail) {
            const newUserLogin = await GeneralEndpoints.createUserLogin({ 
              userId: userWithEmail.userId,
              email: userWithEmail.email,
              providerId: userGoogle.providerId,
              loginProviderId: LOGIN_PROVIDERS.GOOGLE,
              accessToken,
              refreshToken
            });
      
            if (!newUserLogin) {
              return done(null, { 
                error: true,
                code: 5000,
                message: 'Error while signing up'
              });
            }

            return done(null, { id: userWithEmail.userId });
          }

          const newUser = await GeneralEndpoints.createUser({ 
            name: userGoogle.name,
            lastname: userGoogle.lastname,
            email: userGoogle.email
          });

          const newUserLogin = await GeneralEndpoints.createUserLogin({ 
            userId: newUser.id,
            email: newUser.email,
            providerId: userGoogle.providerId,
            loginProviderId: LOGIN_PROVIDERS.GOOGLE,
            accessToken,
            refreshToken
          });
          
          if (!newUserLogin) {
            return done(null, { 
              error: true,
              code: 5000,
              message: 'Error while signing up'
            });
          }

          return done(null, { id: newUserLogin.userId });
        }

        return done(null, { id: userData.userId });
      }
    )
  );
}
