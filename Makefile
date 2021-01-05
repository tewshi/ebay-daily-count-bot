pm2:
	pm2 start bin/www --watch --ignore-watch="node_modules" --name ebay-bot
monit:
	pm2 monit