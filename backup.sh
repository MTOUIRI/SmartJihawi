#!/bin/bash
docker exec examens-mysql mysqldump -uroot -pCPhqn2UH.root exams_db > exams_db.sql
echo "Backup completed: exams_db.sql updated with latest data"
