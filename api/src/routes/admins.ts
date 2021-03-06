import bcrypt from 'bcrypt';
import { Request, Response, Router } from 'express';
import db from '../db';
// Type assertion because TypeScript somehow doesn't want me to instanciate a Router.
const router = new (<any>Router)();

/**
 * /admins/add - Adds an admin to the database.
 * Body:
 *  - username: The admin's username
 *  - password: The admin's password.
 * Returns:
 *  Object:
 *   - success: boolean, whether the admin has sucessfully been added.
 *   - error: optional string, the reason why the admin has not sucessfully been added.
 */
router.put('/add', async (req: Request, res: Response) => {
	let { username, password }: Record<string, string> = req.body;
	res.status(400);
	if (!username)
		return res.send({ success: false, error: 'Must provide a \'username\'.' });
	username = username.trim();
	if (username.length < 3)
		return res.send({ success: false, error: '\'username\' must be at least 3 characters long.' });
	if (!password)
		return res.send({ success: false, error: 'Must provide a \'password\'.' });
	if (password.length < 8)
		return res.send({ success: false, error: '\'password\' must be at least 8 characters long.' });
	if (await db.admins.exists(username))
		return res.send({ success: false, error: `The username '${username}' is already taken.` });
	bcrypt.genSalt((err, salt) => {
		res.status(500);
		if (err)
			return res.send({ success: false, error: `bcrypt error: [${err.name}] ${err.message}` });
		bcrypt.hash(password, salt, async (err, hash) => {
			if (err)
				return res.send({ success: false, error: `bcrypt error: [${err.name}] ${err.message}` });
			await db.admins.add({ username, password: hash });
			res.status(201);
			res.send({ success: true });
		});
	});
});

/**
 * /admin/delete - Deletes an admin.
 * Parameters:
 *  - username: The username of the admin.
 */
router.delete('/delete/:username', async (req: Request, res: Response) => {
	res.status(400);
	if (!req.params.username)
		return res.send({ success: false, error: 'Please provide a correct admin username to edit.' });
	const toDelete = req.params.username;
	const deleter = req.headers.authorization.substring(0, req.headers.authorization.indexOf(':'));
	if (toDelete === deleter)
		return res.send({ success: false, error: 'You can\'t delete your own account.' });
	const success = await db.admins.delete(req.params.username);
	res.status(success ? 200 : 400);
	return res.send(success ? { success } : { success, error: 'Couldn\'t delete this admin. You most probably provided an unexistent username.' });

});

export default router;