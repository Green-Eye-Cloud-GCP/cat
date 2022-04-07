```
gcloud iam service-accounts create cat-cloud-run `
  --display-name "cat_cloud_run"
```

```
gcloud secrets add-iam-policy-binding JWT_PRIVATE `
  --member=serviceAccount:cat-cloud-run@green-eye-cloud.iam.gserviceaccount.com `
  --role=roles/secretmanager.secretAccessor
```

```
gcloud secrets add-iam-policy-binding MONGODB_URI `
  --member=serviceAccount:cat-cloud-run@green-eye-cloud.iam.gserviceaccount.com `
  --role=roles/secretmanager.secretAccessor
```

### ALLOW SERVICE TO SAVE ON GCS

```
gsutil iam ch serviceAccount:cat-cloud-run@green-eye-cloud.iam.gserviceaccount.com:objectCreator,objectViewer gs://cloud-temp
```

```
gcloud builds submit --tag gcr.io/green-eye-cloud/cat
```

```
gcloud run deploy cat `
  --image gcr.io/green-eye-cloud/cat `
  --allow-unauthenticated `
  --service-account=cat-cloud-run@green-eye-cloud.iam.gserviceaccount.com `
  --platform=managed `
  --region=us-central1
```
