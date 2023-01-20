## The flaplive app

flaplive Backend Service

## Requirements

- Node 14
- Git
- Docker (optional)

## Common setup

Clone the repo and install the dependencies.

```bash
git clone https://<ACCESS_TOKEN>@github.com/<user>/flaplive.git
cd flaplive
```

```bash
npm install
```

open test.env and inject your credentials so it looks like this

```
DEV_DB_URL=<DEV_DB_URL>
PROD_DB_URL=<PROD_DB_URL>
NODE_ENV=<dev or productions>
JWT_DEV_KEY=<JWT_DEV_KEY>
JWT_PROD_KEY=<JWT_PROD_KEY>
AWS_ACCESS_KEY=<AWS_ACCESS_KEY>
AWS_SECRET_KEY=<AWS_SECRET_KEY>
AWS_BUCKET_BLOCK_PUBLIC_ACCESS= false
AWS_REGION=<AWS_REGION>
```

create .env file in root folder and copy paste in to the file.

## Steps for start app

To start the express server, run the following

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and take a look around.

## Use Docker

You can also run this app as a Docker container:

Step 1: Clone the repo

```bash
git clone https://github.com/<user>/flaplive.git
```

Step 2: Build the Docker image

```bash
docker build -t flaplive .
```

Step 3: Run the Docker container locally:

```bash
docker run -p 3000:3000 -d flaplive
```

Author : Ajay Singh
