# TaskFlow — Gerenciador de Tarefas

Aplicação web de gerenciamento de tarefas desenvolvida com **HTML, CSS e JavaScript**, integrada a uma **API REST construída com Java e Spring Boot**.

O projeto tem como objetivo aplicar conceitos de desenvolvimento Front-end, manipulação do DOM, requisições HTTP e integração entre aplicações independentes.

## Funcionalidades

- **Cadastrar tarefas:** adicionar tarefas com título e descrição.
- **Listar tarefas:** consultar as tarefas armazenadas no banco de dados.
- **Concluir tarefas:** atualizar o status de uma tarefa para concluída.
- **Excluir tarefas:** remover tarefas cadastradas.
- **Pesquisar tarefas:** filtrar pelo título ou descrição.
- **Filtrar por status:** visualizar tarefas pendentes, concluídas ou todas.
- **Dashboard:** acompanhar o total de tarefas, pendências e percentual de conclusão.
- **Design responsivo:** interface adaptada para computadores, tablets e dispositivos móveis.

## Tecnologias utilizadas

### Front-end
- HTML5
- CSS3
- JavaScript
- DOM (Document Object Model)
- Fetch API
- Async/Await
- JSON

### Back-end
- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate
- Lombok
- API REST

## Arquitetura do projeto

O sistema utiliza uma arquitetura com Front-end e Back-end separados, comunicando-se por requisições HTTP.

```text
Front-end (HTML, CSS e JavaScript)
             |
             | Fetch API / JSON
             v
       API REST Spring Boot
             |
             v
        TaskController
             |
             v
         TaskService
             |
             v
        TaskRepository
             |
             v
        Banco de Dados
```

O **Controller** recebe as requisições HTTP, o **Service** executa as regras de negócio e o **Repository** realiza as operações de persistência.

## Endpoints da API

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/tasks` | Lista todas as tarefas |
| POST | `/tasks` | Cadastra uma nova tarefa |
| PATCH | `/tasks/{id}/complete` | Marca uma tarefa como concluída |
| DELETE | `/tasks/{id}` | Exclui uma tarefa |

### Exemplo de requisição POST

```http
POST http://localhost:8080/tasks
Content-Type: application/json
```

```json
{
  "title": "Estudar JavaScript",
  "description": "Praticar DOM e Fetch API",
  "completed": false
}
```

### Exemplo de resposta

```json
{
  "id": 1,
  "title": "Estudar JavaScript",
  "description": "Praticar DOM e Fetch API",
  "completed": false
}
```

## Regras de negócio

- Toda tarefa cadastrada recebe inicialmente o status `completed = false`.
- Uma tarefa pode ser marcada como concluída pelo endpoint PATCH.
- A conclusão é persistida no banco de dados.
- A exclusão verifica se a tarefa existe antes de removê-la.
- Tarefas inexistentes geram uma exceção personalizada.
- O endpoint GET retorna todas as tarefas cadastradas.

## Estrutura do Front-end

```text
task-frontend/
├── index.html
├── style.css
└── script.js
```

**index.html:** estrutura semântica da interface, formulários, dashboard e listagem.

**style.css:** estilização, layout, componentes visuais e responsividade.

**script.js:** manipulação do DOM, eventos, filtros, requisições HTTP e atualização dinâmica da interface.

## Como executar

### 1. Iniciar o Back-end

Configure o banco de dados da aplicação Spring Boot e execute o projeto.

A API deverá estar disponível em:

```text
http://localhost:8080/tasks
```

### 2. Iniciar o Front-end

Abra o projeto Front-end no Visual Studio Code e execute o arquivo `index.html` utilizando a extensão **Live Server**.

Exemplo de endereço:

```text
http://127.0.0.1:5500/index.html
```

### 3. Configurar a integração

No arquivo `script.js`, configure a URL da API:

```javascript
const API_URL = "http://localhost:8080/tasks";
```

Como os projetos são executados em origens diferentes, configure o CORS no Spring Boot para permitir o endereço utilizado pelo Front-end.

## Conceitos aplicados

Durante o desenvolvimento, foram utilizados:

- Manipulação dinâmica de elementos HTML com JavaScript.
- Eventos com `addEventListener`.
- Requisições assíncronas utilizando `fetch()` e `async/await`.
- Comunicação entre Front-end e Back-end com JSON.
- Tratamento de erros em requisições HTTP.
- Separação de responsabilidades.
- Persistência de dados com JPA.
- Implementação de regras de negócio na camada Service.
- Desenvolvimento de interfaces responsivas com CSS Grid, Flexbox e Media Queries.

---

**Projeto desenvolvido para praticar desenvolvimento Full Stack, integração de APIs REST e boas práticas de organização de código.**
