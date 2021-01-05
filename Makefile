start:
	pm2 start bin/www --watch --ignore-watch="node_modules" --name ebay-bot

monit:
	pm2 monit

restart:
	pm2 restart ebay-bot

stop:
	pm2 stop ebay-bot

dev: start
	make monit