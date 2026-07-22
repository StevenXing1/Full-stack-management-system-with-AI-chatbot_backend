### Backend Project Bootstrap
1. initialize node js project
```bash
mkdir backend
cd backend
npm init -y
```

1.1 
```bash
# intilaize git repository
git init
```

1.2 
After Clone

```bash
npm install
```


2. Install initial dependencies
```bash
# install express
npm install express
# install typescript
npm install typescript tsx @types/node @types/express nodemon --save-dev

# install prisma
npm install prisma @types/node @types/pg --save-dev 

# install prisma client
npm install @prisma/client @prisma/adapter-pg pg dotenv
```

3. Initialize typescript
```bash
npx tsc --init
```
update tsconfig.json to
```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "node",
    "target": "ES2023",
    "strict": true,
    "esModuleInterop": true
  }
}
```
add type field to `package.json`
```json
{
  "type": "module",
}
```

4. Setup Docker

Docker install
https://www.docker.com/get-started/


```bash
# pull postgresSQL image
docker pull postgres
```

Create `docker-compose.yml` file in root directory

```yml
version: '3.8'
services:
  postgres:
    image: postgres:16
    ports:
      - "5432:5432"
    restart: always
    environment:
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: mypassword
      POSTGRES_DB: postgres
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

```bash
# start docker in root directory
docker-compose up -d

# (Optinoal )Start docker without yml file
docker run --name postgres-container -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=mydb -p 5432:5432 -d postgres

# connect to db with Dbeaver
```

5. Setup Prisma

```bash
# Initialize prisma
npx prisma init --datasource-provider postgresql --output ../src/generated/prisma

```

6. Update Prisma configuration

```bash
#update .env file with your PostgreSQL connection string

DATABASE_URL="postgresql://username:password@localhost:5432/mydb?schema=public"
```

7. Prisma Migration
```bash
# initial migration (change name for future migrations)
npx prisma migrate dev --name init

#generate prisma client after migration
npx prisma generate
```

8. After src/index file is created
update package.json to
```json
{
    "start": " nodemon --exec tsx src/index.ts",
    "test": "echo \"Error: no test specified\" && exit 1",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev"
}
```






