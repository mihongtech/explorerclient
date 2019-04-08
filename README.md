# linkchain-browser

## Installation

Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git "Git installation") if you haven't already

Clone the repo

`git clone https://github.com/mihongtech/linkchain-browser.git`

Download [Nodejs and npm](https://docs.npmjs.com/getting-started/installing-node "Nodejs install") if you don't have them

Install dependencies

`npm install`

Build the program

`npm run build`

Copy all files in the `dist` directory to [nginx](http://nginx.org/) root directory

Start your [linkchain-explorer](https://github.com/mihongtech/linkchain-explorer) server

Add proxy configuration of nginx

```
...
server {
    ...
    location /rpc {
      ...
      proxy_pass  http://127.0.0.1:9100/rpc;
      ...
   }
   ...
}
...
```

