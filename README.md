# nginx-monitor
Some times you need to store your server log like this:

```plain
Connections | Cpu Usage | Date
113 | 0% | Wed Feb 06 2019 15:41:59 GMT
116 | 34% | Wed Feb 06 2019 15:42:59 GMT
128 | 77% | Wed Feb 06 2019 15:43:59 GMT
106 | 0% | Wed Feb 06 2019 15:44:59 GMT
112 | 0% | Wed Feb 06 2019 15:45:59 GMT
108 | 85% | Wed Feb 06 2019 15:46:59 GMT
110 | 0% | Wed Feb 06 2019 15:47:59 GMT
108 | 95% | Wed Feb 06 2019 15:48:59 GMT
99 | 34% | Wed Feb 06 2019 15:49:59 GMT
100 | 34% | Wed Feb 06 2019 15:50:59 GMT
107 | 0% | Wed Feb 06 2019 15:51:59 GMT
118 | 43% | Wed Feb 06 2019 15:52:59 GMT
```
column Connections is Nginx Active connections  
column Cpu Usage is Cpu Usage of our server  
column Date is log date time  

## Why need this?
To log your nginx active connections and cpu usage for benchmarking or performanceing purpose.  

## Usage
```bash
git clone https://github.com/devlifeX/nginx-monitor.git
cd nginx-monitor
nodejs app.js --url "localhost/nginx_status" --i 60000 # Log your changes in server.log file every 60 seconds
```
