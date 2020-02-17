#!/bin/bash
SYSTEMNAME=penalidades
GITREPO=penalidade_des
LOCAL=/root/projects
DIR=$LOCAL/$GITREPO
################################################################################
SERVER=10.32.28.197
SERVERPATH=/var/www
SYSTEMPATH=$SERVERPATH/$SYSTEMNAME
BUNDLE=$SYSTEMPATH/bundle
NODE=$BUNDLE/programs/server
METEOR=$SYSTEMPATH/meteor
TARBALL=$SYSTEMPATH/tarball

echo "git pull em "$DIR
echo "........................................................................."
cd $DIR
git checkout master
git pull origin master
echo "removendo tarball em "$TARBALL/$SYSTEMNAME".tar.gz"
echo "........................................................................."
rm $TARBALL/$SYSTEMNAME".tar.gz"
echo "criando tarball em "$TARBALL/$SYSTEMNAME".tar.gz"
echo "........................................................................."
meteor bundle $TARBALL/$SYSTEMNAME.tar.gz
echo "mudando para "$TARBALL
echo "........................................................................."
cd $TARBALL
echo "descompactando "$SYSTEMNAME".tar.gz"
echo "........................................................................."
tar xzf $SYSTEMNAME.tar.gz
echo "removendo "$BUNDLE" antigo"
echo "........................................................................."
rm -rf $BUNDLE
echo "movendo bundle novo"
echo "........................................................................."
mv $TARBALL/bundle $SYSTEMPATH
echo "mudando para "$NODE
echo "........................................................................."
cd $NODE
echo "instalando dependências node.js"
echo "........................................................................."
npm install
# echo "reiniciando apache2"
# echo "........................................................................."
# service apache2 restart
echo "reiniciando passenger"
echo "........................................................................."
passenger-config restart-app $SYSTEMPATH
