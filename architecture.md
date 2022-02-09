## Arquitetura

**Sujeito a mudanças**
src
  ├── /api			     controller layer: api routes
  ├── /config			   config settings, env variables
  ├── /services		   service layer: business logic
  ├── /models			   data access layer: database models	
  ├── /subscribers	 async event handlers
  └── /test          test suites