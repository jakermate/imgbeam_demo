pixigi.com / serves home app


// account information
*/account  - root account directory, shows basic stats
*/account/settings  - root of settings application
*/account/settings/password  - password change
*/account/settings/notifications - preferences for mailing list


// user view
*/user/:username
*/user/:username/pix
*/user/:username/likes
*/user/:username/comments

// self user view
*/u/user/:username
*/u/user/:username/pix
*/u/user/:username/likes
*/u/user/:username/comments

// searches and views
*/tag/:tagstring  - displays a list of galleries where tagged term tagstring
*/search?q=  - displays search results for string in query

// edit gallery
*/p/pix/:galleryHash  - o for owner is authenticated client owns that gallery

// view gallery
*/pix/:galleryHash

// comments (for a gallery)
*/:gallery_id/api/comment?comment=thisisacomment?reply_id=309fdsk
<!-- the browser will need to encode the comment query, and the commentservice decode it -->

// follows (user to user)
*/user/:username/api/follow