#!/bin/bash

# Zoek alle volumes behalve 'prod_pg_data'
VOLUMES=$(docker volume ls -f dangling=true -q | grep -v "^prod_pg_data$")

# Verwijder alleen de ongebruikte volumes, behalve 'prod_pg_data'
if [ -n "$VOLUMES" ]; then
  echo "Verwijderen van ongebruikte volumes behalve prod_pg_data..."
  docker volume rm $VOLUMES
  echo "Ongebruikte volumes succesvol verwijderd."
else
  echo "Geen ongebruikte volumes om te verwijderen."
fi