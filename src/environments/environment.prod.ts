export const environment = {
  production: false,
  backendBaseUrl: 'http://localhost:8081/api/',
  frontendBaseUrl: 'http://localhost:4200',
  keycloak: {
    url: 'http://localhost:8080',
    realm: 'onlineshop',           
    clientId: 'onlineshop-client'
  }
};