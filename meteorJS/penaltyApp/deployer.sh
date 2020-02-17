#!/bin/bash
SYSTEMNAME=penalidades
GITREPO=penalidade_des
LOCAL=/home/gusw/Documents/study/meteor
DIR=$LOCAL/$GITREPO
################################################################################
SERVER=10.32.28.197
SERVERPATH=/var/www
SYSTEMPATH=$SERVERPATH/$SYSTEMNAME
BUNDLE=$SYSTEMPATH/bundle
NODE=$BUNDLE/programs/server
METEOR=$SYSTEMPATH/meteor
GIT=$METEOR/$GITREPO

# ssh root@$SERVER
# cd $GIT
# git pull origin master
echo "removendo tarball em "$LOCAL/$SYSTEMNAME".tar.gz"
echo "........................................................................."
rm $LOCAL/$SYSTEMNAME".tar.gz"
echo "mudando para "$DIR
echo "........................................................................."
cd $DIR
echo "criando tarball em "$LOCAL/$SYSTEMNAME".tar.gz"
echo "........................................................................."
meteor bundle $LOCAL/$SYSTEMNAME.tar.gz
echo "copiando tarball para "$SERVER
echo "........................................................................."
scp $LOCAL/$SYSTEMNAME.tar.gz root@$SERVER:$METEOR
echo "conectando em "$SERVER
echo "........................................................................."
ssh root@$SERVER bash -c "'
echo "mudando para "$METEOR
echo "........................................................................."
cd $METEOR
echo "descompactando "$SYSTEMNAME".tar.gz"
echo "........................................................................."
tar xzf $SYSTEMNAME.tar.gz
echo "removendo "$BUNDLE" antigo"
echo "........................................................................."
rm -rf $BUNDLE
echo "movendo bundle novo"
echo "........................................................................."
mv $METEOR/bundle $SYSTEMPATH
echo "mudando para "$NODE
echo "........................................................................."
cd $NODE
echo "instalando dependências node.js"
echo "........................................................................."
'"
# npm install --production
# echo "reiniciando apache2"
# echo "........................................................................."
# service apache2 restart
# echo "reiniciando passenger"
# echo "........................................................................."
# passenger-config restart-app $SYSTEMPATH
