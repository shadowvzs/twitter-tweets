# twitter-tweets


### Used Techs:
* CSS3/HTML5/VanillaJS (es7) :)
* Docker CE (18.9.1)
    * Ubuntu image (latest)
        * nodeJS
             * express (4.16.4)
             * twitter (1.7.1)

### How to run (on debian/ubuntu) ?

1. load docker image for **nodeJS** *([download image](https://drive.google.com/open?id=1opSxTmjus0P1TX-GFKeIdzchDMlBVII3))*
2. edit path in **start_server.sh** *([start_server.sh](https://github.com/shadowvzs/twitter-tweets/blob/master/start_server.sh))*
3. start server with **start_server.sh**
4. edit host address in **/frontend/js/Service.js** *(check your container ip, ex. **ip addr show**)*

