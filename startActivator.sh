#!/bin/bash
workdir="/home/azureuser/web"
activator_log="$workdir/activator.log"

cd $workdir/DemocracIT-Web

. /etc/profile;
echo "Pass is `set | grep democracit`";
JAVA_OPTS="-Xms128m -Xmx256m" ./activator "run 9000" -Dconfig.file=/home/azureuser/web/DemocracIT-Web/conf/application.prod.conf
# &>> $activator_log
#JAVA_OPTS="-Xms128m -Xmx256m" ./activator "run 80 " &>> $activator_log
