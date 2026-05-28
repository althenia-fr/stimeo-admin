#!/bin/bash
 #npm run build
 gcloud auth login  admin@althenia.fr
 gcloud config set project admin-stimeo-20260526
 gcloud app deploy ./app.yaml -v 1
