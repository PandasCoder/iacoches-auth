import AppleStrategy  from 'passport-apple';
import { UserTemp } from "../domain/interfaces";
import { GeneralEndpoints } from "../api/general.endpoints";
import { LOGIN_PROVIDERS } from '../domain/login-providers.enum';
import fs from 'fs'
import path from 'path';

export function configurePassportApple(passport: any) {
  passport.use(
    new AppleStrategy({
				clientID: `${process.env.APPLE_CLIENT_ID}`,
				teamID: `${process.env.APPLE_TEAM_ID}`,
				callbackURL: `${process.env.AUTH_URL}/apple/callback`,
				keyID: `${process.env.APPLE_KEY_ID}`,
				scope: ['name', 'email'],
				privateKeyString: `${process.env.APPLE_PRIVATE_KEY_STRING}`,
				passReqToCallback: true
      },
      async (req, accessToken, refreshToken, idToken, profile, done) => {

        // const userApple: UserTemp = {
        //   accessToken: accessToken,
        //   refreshToken: refreshToken,
        //   providerId: req.body.id,
        //   name: req.body.name,
        //   lastname: profile._json.family_name,
        //   email: profile._json.email,
        //   verify: profile._json.email_verified,
        //   loginProvider: 'apple'
        // };

        

        return done(null, { id: idToken, accessToken: accessToken, refreshToken: refreshToken });
      }
    )
  );
}

export async function CallbackExecution(userApple:any, accessToken:any, refreshToken:any) {

	// const userData = await GeneralEndpoints.getUserByProvider({ loginProviderId: LOGIN_PROVIDERS.APPLE, providerId: profile.id});
  //       // if user is not registered, will return google user data and pre save it
	// if (!userData) {
	// 	// check if email is already used
	// 	const userWithEmail = await GeneralEndpoints.getUserLoginByEmail(userApple._json.email);

	// 	// if email is already used, will redirect to link account page
	// 	if (userWithEmail) {
	// 		const newUserLogin = await GeneralEndpoints.createUserLogin({ 
	// 			userId: userWithEmail.userId,
	// 			email: userWithEmail.email,
	// 			providerId: userApple.providerId,
	// 			loginProviderId: LOGIN_PROVIDERS.APPLE,
	// 			accessToken,
	// 			refreshToken
	// 		});

	// 		if (!newUserLogin) {
	// 			return { 
	// 				error: true,
	// 				code: 5000,
	// 				message: 'Error while signing up'
	// 			};
	// 		}

	// 		return { id: userWithEmail.userId };
	// 	}

	// 	const newUser = await GeneralEndpoints.createUser({ 
	// 		name: userApple.name,
	// 		lastname: userApple.lastname,
	// 		email: userApple.email
	// 	});

	// 	const newUserLogin = await GeneralEndpoints.createUserLogin({ 
	// 		userId: newUser.id,
	// 		email: newUser.email,
	// 		providerId: userApple.providerId,
	// 		loginProviderId: LOGIN_PROVIDERS.APPLE,
	// 		accessToken,
	// 		refreshToken
	// 	});
		
	// 	if (!newUserLogin) {
	// 		return { 
	// 			error: true,
	// 			code: 5000,
	// 			message: 'Error while signing up'
	// 		};
	// 	}
	// }
}
