module.exports = {
	ERRORS: {
		//local auth
		fill_out_fields: 'Please fill out all fields',
		not_found: 'Not found',
	    no_rights: 'No rights',
		user_not_found: 'User not found',
		pass_or_token_not_match: 'Passwords or tokens does\'t match',
		pass_not_match: 'Passwords does\'t match',
		same_pass: 'Please enter new password',
		pass_incorrect: 'Entered password is incorrect',
		user_exist: 'That user already exists',
		invalid_data: 'Invalid email or password',
		invalid_pass: 'Invalid password',
		email_not_found: 'User with this email not found',
		not_local_user: 'User with this email not a local created',
		email_verification: 'First you have to approve you email. We are send verification link to your email',
		not_verifyed: 'This email have not approved yet',
		email_taken_or_not_approved: 'Email is already taken or not approved yet',
		check_your_email: 'Please check your email to continue registration',
		email_taken: 'Email is already taken',
		//social auth
		facebook_account_belongs: 'There is already a Facebook account that belongs to you',
		twitter_account_belongs: 'There is already a Twitter account that belongs to you',
		google_account_belongs: 'There is already a Google account that belongs to you',
		linkedin_account_belongs: 'There is already a Linkedin account that belongs to you',
		//articles ctrl
		choose_cat: 'Choose category',
		fav_article_already_added: 'You have already added this article to favourites',
		article_not_found: 'Article not found',
		enter_article_url: 'Enter article link',
		cant_delete_article_no_such_cat: "Cant delete such article, no such category found within your account",
		cant_delete_article_no_such_article: "Cant delete such article, no such article found within your account",
		//feeds ctrl
		cant_find_user: 'Can\'t find user',
		category_not_found: 'Category not found',
		feed_already_added: 'You have already added this feed',
		feed_already_added_to_popular: 'You have already added this feed to popular',
		feed_not_found: 'Feed not found',
		enter_feed_url: 'Enter feed url',
		server_error: 'Server error',
		internal_error: 'Internal error(%d): %s',
		invalid_feed: 'Invalid feed',
		cant_delete_feed_no_such_cat: "Cant delete such feed, no such category found within your account",
		cant_delete_feed_no_such_feed: "Cant delete such feed, no such feed found within your account",
		//profile ctrl
		file_not_found: 'Files not found',
		unknown_oauth_provider: 'Unknown OAuth Provider'
	},
}