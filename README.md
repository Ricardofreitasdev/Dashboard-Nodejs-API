# Backend - Dashboard com ReactJs

Confira o projeto em produção: https://reactjs-dashboard.herokuapp.com/login

## Como rodar a aplicação


1. Clone o repositório
```sh
git clone https://github.com/Ricardofreitasdev/Dashboard-Nodejs-API.git
```


2. Entre na pasta do projeto
```sh
cd Dashboard-Nodejs-API
```

3. Instale as dependencias 
```sh
npm install
```

4. Banco de dados local (descomente o banco sqlite no arquivo `src/database/db.js` e comente o banco de produção)
```sh
# production
# const sequelize = new Sequelize(process.env.DATABASE_URL,{
#     dialect: 'postgres',
#     dialectOptions: {
#       ssl: {
#        rejectUnauthorized: false
#       },
#     },
#    }
)


# dev
 const sequelize = new Sequelize({
     dialect: 'sqlite',
     storage: './database.sqlite'
 })
```



5. Execute a aplicação 
```sh
npm start
```


## Repositório do Front-end desenvolvido em Node.js

https://github.com/Ricardofreitasdev/Dashboard-ReactJs