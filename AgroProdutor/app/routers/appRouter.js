// GET AUTHENTICATION
var authCliente = require('../../config/auth').authCliente;
var authProdutor = require('../../config/auth').authProdutor;

module.exports = app => {
    // CONTROLLER
    let controller = app.controllers.appController;
    // APP ROUTERS
    app
        // CHECK IF THE nomeUser OR nomeUserProdutor AND THE senha EXISTS ? {'message', 'token'} : {'message'}
        .post('/login/cliente', controller.clienteLogin)
        .post('/login/produtor', controller.produtorLogin)
        // CHECK IF THE nomeUser OR nomeUserProdutor AND THE emailCliente OR emailProdutor AND PRODUCTS IS AVAILABLE ? {[respTemplate]} : {'message'}
        .post('/available/cliente', controller.isAvailableCliente)
        .post('/available/produtor', controller.isAvailableProdutor)
        .post('/available/produtor/produto', controller.isAvailableProduct)
        // CREATE A NEW USER cliente OR Produtor ? {'title', 'message'} : {'message'}
        .post('/register/cliente', controller.createUserCliente)
        .post('/register/produtor', controller.createUserProdutor)
        // CHECK IF THE emailCliente OR emailProdutor EXISTS ? {[respTemplate]} : {'message'}
        .post('/registered/cliente', controller.isRegisteredCliente)
        .post('/registered/produtor', controller.isRegisteredProdutor)
        // UPDATE THE senha  AND SEND AN EMAIL WITH THE nomeUser OR nomeUserProdutor AND THE senha ? {'title', 'message'} : {'message'}
        .post('/recover/cliente', controller.recoverUserCliente)
        .post('/recover/produtor', controller.recoverUserProdutor)
        // CHECK IF THE TOKEN IS VALID ? {bool} : {'message'}
        .get('/authenticated/cliente', authCliente.authenticate, controller.isAuthenticatedCliente)
        .get('/authenticated/produtor', authProdutor.authenticate, controller.isAuthenticatedProdutor)
        // UPDATE THE user_password ? {'title', 'message'} : {'message'}
        .put('/password/cliente', controller.setUserClientePassword)
        .put('/password/produtor', controller.setUserProdutorPassword)
        // GET ALL PRODUCES IN THE VIEW vProdutor ? {{respTemplate}} : {'message'}
        .get('/produtores', controller.getProduces)
        // GET ALL SPECIFIC INFO THE USER IN THE TABLE ? {{respTemplate}} : {'message'}
        .get('/data/user/cliente/:id', controller.getUserCliente)
        .get('/data/user/produtor/:id', controller.getUserProdutor)
        // UPDATE THE user_name, user_email AND user_address ? {'title', 'message'} : {'message'}
        .put('/data/cliente', controller.setUserClienteData)
        .put('/data/produtor', controller.setUserProdutorData)
        // GET ALL PRODUCTS IN THE TABLE tbProduto AND GET SPECIFIC PRODUCT IN tbProduto ? {{respTemplate}} : {'message'}
        .get('/data/produtos', controller.getProdutos)
        .get('/data/produtos/:id', controller.getProdutoId)
        // INSERT ONE OR MORE PRODUCTS IN THE TABLE tbProdutoPorProdutor ? {'title', 'message'} : {'message'}
        .post('/data/produtor/produtos', controller.createProductByProduces)
        // GET ALL PRODUCTS IN THE VIEW vProdutoPorProdutor BY A SPECIFIC USER ID ? {{respTemplate}} : {'message'}
        .get('/data/produtos/produtor/:id', controller.getProductByProduces)
        // UPDATE THE disponibilidade FOR Disponível OR Indisponível ? {'title', 'message'} : {'message'}
        .put('/data/recover/indisponivel/produtos/produtor/:id', controller.recoverProductByProduces1)
        .put('/data/recover/disponivel/produtos/produtor/:id', controller.recoverProductByProduces2)
        // GET ALL FILTERED PETS ? {{respTemplate}} : {'message'}
        .post('/filter', controller.filter)
        // CREATE A NEW Visualizador ? {'title', 'message'} : {'message'}
        .post('/visualizador', controller.CreateVisualizao)
        // GET ALL Visualizador IN THE tb_visualizacao ? {{respTemplate}} : {'message'}
        .get('/visualizador/data/:id', controller.getVisualizadores)

};