```bash
# install
npm -i -g pm2

# 3 instances
pm2 start app.js -i 3
# Automatically set number of instances
pm2 start app.js -i -1

# Monitoring
pm2 list
pm2 logs
pm2 monit

# canary deployment on workers
pm2 reload

# lifecycle
pm2 stop app
pm2 delete app
```
