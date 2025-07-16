#!/bin/bash

# Script pour automatiser le processus de push sur Git

echo "
\[_] Ajout de tous les fichiers..."
git add .

# Création du message de commit avec la date et l'heure actuelles
COMMIT_MESSAGE="Auto-commit du $(date +'%Y-%m-%d à %H:%M:%S')"
echo "
\[_] Création du commit avec le message : $COMMIT_MESSAGE"
git commit -m "$COMMIT_MESSAGE"

echo "
\[_] Push vers le dépôt distant..."
git push

echo "
\[_] Opération terminée.
"