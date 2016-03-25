#!/bin/bash
rsync -avz --exclude 'soundtrack' --exclude 'videos' ./* appdocu:/usr/local/src/appdocumentary.com
ssh appdocu 'chmod -R 755 /usr/local/src/appdocumentary.com'
curl https://www.cloudflare.com/api_json.html -d 'a=fpurge_ts' -d "tkn=$CLOUDFLARE_API_KEY" -d "email=$CLOUDFLARE_EMAIL" -d 'z=appdocumentary.com' -d 'v=1'
