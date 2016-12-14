#!/bin/sh
#
## this script is the git live repository post-receive hook
## store the arguments given to the script
read prevCommitSHA latestCommitSHA fullbranchName

branch=${fullbranchName##*/}

WEBROOT="/home/ec2-user/www"
PROJECT="sltweeter"
LOGFILE="$WEBROOT/$PROJECT/post-receive.log"
DEPLOYDIR=null
PORT=null

echo "log: $LOGFILE"

##  Record the fact that the push has been received
echo "Received Push Request at $( date +"%F %T" ) for #branch $branch"  >> $LOGFILE

echo "Checking deployment rules for project:$PROJECT, branch: $branch"

# Log the branch name
echo "---------------------------Deploy Start-------------------------------------" >> $LOGFILE

if [ $branch = "master" ] 
    then
    DEPLOYDIR="$WEBROOT/$PROJECT"
    PORT=1234
fi

if [ $DEPLOYDIR = null ] 
    then
    echo "Received branch $branch, not deploying."
    exit
fi

pm2 stop "${PROJECT}_${branch}" >>null
echo "Stopped server at $( date +"%F %T" )" >> $LOGFILE

echo "Deploying to $DEPLOYDIR" >> $LOGFILE

echo " - Starting code checkout"  >> $LOGFILE
GIT_WORK_TREE="$DEPLOYDIR" git checkout -f "$branch"
echo " - Finished code checkout"  >> $LOGFILE

echo " - Starting npm install" >> $LOGFILE
cd "$DEPLOYDIR"
rm -rf node_modules
npm install  >> $LOGFILE
echo " - Finished npm install"  >> $LOGFILE

echo "Restarting server using pm2 at $( date +"%F %T" )" >> $LOGFILE

PORT="$PORT" pm2 start app.js --name "${PROJECT}_${branch}" >> $LOGFILE
echo "Restart completed at $( date +"%F %T" )"  >> $LOGFILE
cd - 1>>/dev/null
echo "---------------------------Deploy Complete---------------------------------" >> $LOGFILE

echo "Done. Run 'pm2 ls' on the server to see the process status."