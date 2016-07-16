FROM node:5

MAINTAINER zypeh <zypeh.geek@gmail.com>

ADD . /app

# Install dependencies
RUN cd /app;
    npm install
    
EXPOSE 3000

# Run
RUN npm run production
