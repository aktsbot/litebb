# reference: 
# https://github.com/NodeBB/NodeBB/blob/master/Dockerfile

FROM node:lts 

ENV NODE_ENV=production \
    USER=litebb \
    UID=1001 \
    GID=1001


RUN mkdir -p /opt/litebb

RUN groupadd --gid ${GID} ${USER} \
    && useradd --uid ${UID} --gid ${GID} --home-dir /opt/app/ --shell /bin/bash ${USER} \
    && chown -R ${USER}:${USER} /opt/litebb/

WORKDIR /opt/litebb

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "./start.sh" ]

