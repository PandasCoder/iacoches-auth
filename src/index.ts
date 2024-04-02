import express from 'express';
import session from 'express-session';
import * as dotenv from 'dotenv';
import passport from 'passport';
import bodyParser from 'body-parser';
import { generateToken } from './utils/generate-token';
import { configurePassportGoogle } from './config/passport-google';
import { configurePassportApple } from './config/passport-apple';
import { GeneralEndpoints, GetByProvider } from './api/general.endpoints';
import { LOGIN_PROVIDERS } from './domain/login-providers.enum';

dotenv.config();

const app = express();

const expirationTime = new Date();
expirationTime.setDate(expirationTime.getDate() + 30);

app.use(session({
  secret: `${process.env.COOKIE_SECRET}`,
  resave: false,
	saveUninitialized: true,
	cookie: {
		sameSite: 'none'
	}
}));

configurePassportGoogle(passport);
configurePassportApple(passport);

passport.serializeUser(function (user: any, done: any) {
	done(null, user);
});

passport.deserializeUser(function (user: any, done: any) {
	done(null, user);
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// app.use(cors({
//   origin: `${process.env.DOMAIN_URL}`, // Especifica el origen permitido
// 	credentials: true,
//   exposedHeaders: ['iacoches_auth_token']
// }));

app.get('/apple', passport.authenticate('apple'));

app.head('/apple/callback', passport.authenticate('apple', {failureRedirect: `${process.env.DOMAIN_URL}/auth/login` }),
	async (req: any, res: any) => {
		const user = req.user;

		const token = generateToken({
			id: user.id
		});

		res.redirect(`${process.env.DOMAIN_URL}#access_token=`+token);
	}
);

app.post('/apple/callback', passport.authenticate('apple', {failureRedirect: `${process.env.DOMAIN_URL}/auth/login` }),
	async (req: any, res: any) => {
		const user = req.user;


		const token = generateToken({
			id: user.id
		});

		res.redirect(`${process.env.DOMAIN_URL}#access_token=`+token);
	}
);

app.get('/google', passport.authenticate('google', { scope: ['email','profile'], accessType: 'offline', includeGrantedScopes: true, prompt: 'select_account' }));

app.head('/google/callback', passport.authenticate('google', {failureRedirect: `${process.env.DOMAIN_URL}/auth/login` }),
	async (req: any, res: any) => {
		const user = req.user;

		const token = generateToken({
			id: user.id
		});

		res.redirect(`${process.env.DOMAIN_URL}#access_token=`+token);
	}
);

app.get('/google/callback', passport.authenticate('google', {failureRedirect: `${process.env.DOMAIN_URL}/auth/login` }),
  async (req: any, res: any) => {
		const user = req.user;

		const token = generateToken({
			id: user.id
		});

    res.redirect(`${process.env.DOMAIN_URL}#access_token=`+token);
  }
);

app.post('/apple/getToken',
	async(req: any, res: any) => {

		const userId = req.body.userId;
		
		const appleObject: GetByProvider = {
			loginProviderId: LOGIN_PROVIDERS.APPLE,
			providerId: userId
		}
		
		const user = await GeneralEndpoints.getUserByProvider(appleObject);
		
		const token = generateToken({
			id: user.userId
		})

		res.send(token);
	}
)

app.get('/ping', (req, res) => {
	res.send('pong');
});

app.get('/', (req, res) => {
	res.send({
		message: 'Qué mirás, bobo, andá pa allá'
	});
});

app.listen(process.env.DEFAULT_PORT, () => {});