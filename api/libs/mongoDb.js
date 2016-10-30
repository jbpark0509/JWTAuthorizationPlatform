'use strict';

import mongoose from 'mongoose';

export default {
	connect: () => {
		mongoose.connect('mongodb://localhost:27017/agape');

		let db = mongoose.connection;

		db.on('error', (err) => {
			console.log("Problem connecting to MongoDb");
			process.exit(1);
		});

		db.once('open', () => {
			console.log("MongoDb Connected.");
		});
	}
}
