export interface userDiscord {	
	accesstoken: string, 
	avatar?: string | null, 
	discordid?: string, 
	discriminator: string, 
	display_name?: string, 
	email?: string, 
	locale: string, 
	refreshtoken: string, 
	username: string, 
	verified: boolean
}

export interface UserTemp {	
	accessToken: string, 
	refreshToken?: string, 
	providerId?: string, 
	name: string,
	lastname?: string,  
	email?: string, 
	verify: boolean,
	loginProvider: string,
}

export interface UserLoggedProvider {
	userId: number,
	loginProviderId: number,
	email: string,
	password?: string,
	providerId?: string;
  loginProvider?: string;
}
