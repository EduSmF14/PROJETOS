// LOGIN FUNCTION
var loginCliente = require('../../config/auth').loginCliente,
    loginProdutor = require('../../config/auth').loginProdutor,
    // DATABASE POOL
    pool = require('../../config/database')(),
    // NODEMAILER TRANSPORTER
    transporter = require('../../config/mailer')(),
    // API FORMATAÇÃO DE QUERY
    format = require('pg-format');

module.exports = () => {
    // CONTROLLER
    let controller = {
        // LOGIN
        clienteLogin(req, res) {
            // USER DATA
            let jsonData = req.body;
            loginCliente(jsonData.name, jsonData.password, result => {
                // CHECK RESULT
                if (result) {
                    res.send(result);
                    // ATUALIZAR O STATUS PARA TRUE
                    // VERIFICAR SE O USUÁRIO JÁ ESTA LOGADO
                }
                // ON ERROR => RESPONSE UNAUTHORIZED 401
                else {
                    res.status(401).json({ message: 'Erro de Autenticação' });
                }
            });
        },
        produtorLogin(req, res) {
            // USER DATA
            let jsonData = req.body;
            loginProdutor(jsonData.name, jsonData.password, result => {
                // CHECK RESULT
                if (result) {
                    res.send(result);
                    // ATUALIZAR O STATUS PARA TRUE
                    // VERIFICAR SE O USUÁRIO JÁ ESTA LOGADO
                }
                // ON ERROR => RESPONSE UNAUTHORIZED 401
                else {
                    res.status(401).json({ message: 'Erro de Autenticação' });
                }
            });
        },
        // GET USERS FUNCTION => /available = post
        isAvailableCliente(req, res) {
            // USER DATA
            let jsonData = req.body,
                // RESPONSE TEMPLATE
                respTemplate = [];
            // CONNECTING TO THE DATABASE
            pool.connect()
                // ON SUCCESS => CONNECTED
                .then(client => {
                    // SELECT QUERY => CHECK IF user_name IS UNIQUE
                    client.query("SELECT * FROM tbCliente WHERE nomeUser = $1", [jsonData.user_name])
                        // ON SUCCESS
                        .then(result => {
                            // IF NOT UNIQUE respTemplate PUSH A MESSAGE
                            if (result.rowCount > 0) {
                                respTemplate.push('O nome de usuário já está em uso');
                            }
                            // SELECT QUERY => CHECK IF user_email IS UNIQUE
                            client.query("SELECT * FROM tbCliente WHERE emailCliente = $1", [jsonData.email])
                                // ON SUCCESS
                                .then(result => {
                                    // IF NOT UNIQUE respTemplate PUSH A MESSAGE
                                    if (result.rowCount > 0) {
                                        respTemplate.push('O e-mail já está em uso');
                                    }
                                    // RESPONSE OK 200
                                    res.status(200).json({ respTemplate });
                                })
                                // ON ERROR => RESPONSE BAD REQUEST 400
                                .catch(err => res.status(400).json({ message: err.message }))
                            // DISCONNECTING TO THE DATABASE
                            client.release();
                        })
                        // ON ERROR => RESPONSE BAD REQUEST 400
                        .catch(err => {
                            res.status(400).json({ message: "err.message" });
                            // DISCONNECTING TO THE DATABASE
                            client.release();
                        })
                })
                // ON ERROR => RESPONSE BAD REQUEST 400
                .catch(err => res.status(400).json({ message: err.message }));
        },
        isAvailableProdutor(req, res) {
            // USER DATA
            let jsonData = req.body,
                // RESPONSE TEMPLATE
                respTemplate = [];
            // CONNECTING TO THE DATABASE
            pool.connect()
                // ON SUCCESS => CONNECTED
                .then(client => {
                    // SELECT QUERY => CHECK IF user_name IS UNIQUE
                    client.query("SELECT * FROM tbProdutor WHERE nomeUserProdutor = $1", [jsonData.user_name])
                        // ON SUCCESS
                        .then(result => {
                            // IF NOT UNIQUE respTemplate PUSH A MESSAGE
                            if (result.rowCount > 0) {
                                respTemplate.push('O nome de usuário já está em uso');
                            }
                            // SELECT QUERY => CHECK IF user_email IS UNIQUE
                            client.query("SELECT * FROM tbProdutor WHERE emailProdutor = $1", [jsonData.email])
                                // ON SUCCESS
                                .then(result => {
                                    // IF NOT UNIQUE respTemplate PUSH A MESSAGE
                                    if (result.rowCount > 0) {
                                        respTemplate.push('O e-mail já está em uso');
                                    }
                                    // RESPONSE OK 200
                                    res.status(200).json({ respTemplate });
                                })
                                // ON ERROR => RESPONSE BAD REQUEST 400
                                .catch(err => res.status(400).json({ message: err.message }))
                            // DISCONNECTING TO THE DATABASE
                            client.release();
                        })
                        // ON ERROR => RESPONSE BAD REQUEST 400
                        .catch(err => {
                            res.status(400).json({ message: err.message });
                            // DISCONNECTING TO THE DATABASE
                            client.release();
                        })
                })
                // ON ERROR => RESPONSE BAD REQUEST 400
                .catch(err => res.status(400).json({ message: err.message }));
        },
        isAvailableProduct(req, res) {
            // USER DATA
            let jsonData = req.body,
                // RESPONSE TEMPLATE
                respTemplate = [];
            // CONNECTING TO THE DATABASE
            pool.connect()
                // ON SUCCESS => CONNECTED
                .then(client => {
                    // SELECT QUERY => CHECK IF user_name IS UNIQUE
                    client.query("SELECT * FROM vProdutoPorProdutor WHERE nomeUserProdutor = $1", [jsonData.user_name])
                        // ON SUCCESS
                        .then(result => {
                            result.rows.map(item => {
                                respTemplate.push({
                                    id: item.idproduto,
                                    name: item.nomeproduto.trim(),
                                });
                            });
                            // RESPONSE OK 200
                            res.status(200).json({ respTemplate });
                        })
                        // ON ERROR => RESPONSE BAD REQUEST 400
                        .catch(err => res.status(400).json({ message: err.message }))
                    // DISCONNECTING TO THE DATABASE
                    client.release();
                })
                // ON ERROR => RESPONSE BAD REQUEST 400
                .catch(err => res.status(400).json({ message: err.message }));
        },
        // CREATE A NEW USER FUNCTION => /register => post
        createUserCliente(req, res) {
            // USER DATA
            let jsonData = req.body;
            // CONNECTING TO THE DATABASE
            pool.connect()
                // ON SUCCESS => CONNECTED
                .then(client => {
                    // INSERT QUERY => CREATE A NEW USER
                    client.query("INSERT INTO tbCliente (nomeUser, nomeCliente, emailCliente, dataNascimento, senha, enderecoDoCliente, latCliente, lngCliente, telefoneCliente, dataCadastro) VALUES($1, $2, $3, $4, MD5($5), $6, $7, $8, $9, now())", [jsonData.user_name, jsonData.name, jsonData.email, jsonData.dataNascimento, jsonData.senha, jsonData.address, jsonData.lat, jsonData.lng, jsonData.telefone])
                        // ON SUCCESS => RESPONSE OK 200
                        .then(() => res.status(200).json({ title: 'Obrigado por se cadastrar', message: 'Seus dados foram cadastrados com sucesso.' }))
                        // ON ERROR => RESPONSE BAD REQUEST 400
                        .catch(err => res.status(400).json({ message: err.message }))
                    // DISCONNECTING TO THE DATABASE
                    client.release();
                })
                // ON ERROR => RESPONSE BAD REQUEST 400
                .catch(err => res.status(400).json({ message: err.message }));
        },
        createUserProdutor(req, res) {
            // USER DATA
            let jsonData = req.body;
            // CONNECTING TO THE DATABASE
            pool.connect()
                // ON SUCCESS => CONNECTED
                .then(client => {
                    // INSERT QUERY => CREATE A NEW USER
                    client.query("INSERT INTO tbProdutor (nomeUserProdutor,nomeProdutor, emailProdutor, dataNascimento, tipoDeProdutor, senha, enderecoDoProdutor, lat, lng, telefone, SituacaoProdutor, dataCadastro) VALUES($1, $2, $3, $4, $5, MD5($6), $7, $8, $9, $10, 'A', now())", [jsonData.user_name, jsonData.name, jsonData.email, jsonData.dataNascimento, jsonData.tipoDeProdutor, jsonData.senha, jsonData.address, jsonData.lat, jsonData.lng, jsonData.telefone])
                        // ON SUCCESS => RESPONSE OK 200
                        .then(() => res.status(200).json({ title: 'Obrigado por se cadastrar', message: 'Seus dados foram cadastrados com sucesso.' }))
                        // ON ERROR => RESPONSE BAD REQUEST 400
                        .catch(err => res.status(400).json({ message: err.message }))
                    // DISCONNECTING TO THE DATABASE
                    client.release();
                })
                // ON ERROR => RESPONSE BAD REQUEST 400
                .catch(err => res.status(400).json({ message: err.message }));
        },
        // CHECK IF THE user_email EXISTS => /registered => post
        isRegisteredCliente(req, res) {
            // USER DATA
            let jsonData = req.body,
                // RESPONSE TEMPLATE
                respTemplate = [];
            // CONNECTING TO THE DATABASE
            pool.connect()
                // ON SUCCESS => CONNECTED
                .then(client => {
                    // SELECT QUERY => CHECK IF THE user_email EXISTS
                    client.query("SELECT * FROM tbCliente WHERE emailCliente = $1", [jsonData.email])
                        // ON SUCCESS
                        .then(result => {
                            // IF THE user_email NOT EXISTS
                            if (result.rowCount === 0) {
                                respTemplate.push('O e-mail informado não está cadastrado');
                            }
                            // RESPONSE OK 200
                            res.status(200).json({ respTemplate });
                        })
                        // ON ERROR => RESPONSE BAD REQUEST 400
                        .catch(err => res.status(400).json({ message: err.message }))
                    // DISCONNECTING TO THE DATABASE
                    client.release();
                })
                // ON ERROR => RESPONSE BAD REQUEST 400
                .catch(err => res.status(400).json({ message: err.message }));
        },
        isRegisteredProdutor(req, res) {
            // USER DATA
            let jsonData = req.body,
                // RESPONSE TEMPLATE
                respTemplate = [];
            // CONNECTING TO THE DATABASE
            pool.connect()
                // ON SUCCESS => CONNECTED
                .then(client => {
                    // SELECT QUERY => CHECK IF THE user_email EXISTS
                    client.query("SELECT * FROM tbProdutor WHERE emailProdutor = $1", [jsonData.email])
                        // ON SUCCESS
                        .then(result => {
                            // IF THE user_email NOT EXISTS
                            if (result.rowCount === 0) {
                                respTemplate.push('O e-mail informado não está cadastrado');
                            }
                            // RESPONSE OK 200
                            res.status(200).json({ respTemplate });
                        })
                        // ON ERROR => RESPONSE BAD REQUEST 400
                        .catch(err => res.status(400).json({ message: err.message }))
                    // DISCONNECTING TO THE DATABASE
                    client.release();
                })
                // ON ERROR => RESPONSE BAD REQUEST 400
                .catch(err => res.status(400).json({ message: err.message }));
        },
        // RECOVER USER => /recover => post
        recoverUserCliente(req, res) {
            // USER DATA
            let jsonData = req.body,
                // RANDOM PASSWORD
                new_password = Math.random().toString(36).substring(2, 10);
            // CONNECTING TO THE DATABASE
            pool.connect()
                // ON SUCCESS => CONNECTED
                .then(client => {
                    // UPDATE QUERY => UPDATE USER PASSWORD
                    client.query("UPDATE tbCliente SET senha = MD5($1) WHERE emailCliente = $2", [new_password, jsonData.email])
                        // ON SUCCESS
                        .then(() => {
                            client.query("SELECT nomeUser FROM tbCliente WHERE emailCliente = $1", [jsonData.email])
                                .then(result => {
                                    // E-MAIL OPTIONS
                                    let mailOptions = {
                                        from: 'app_agroprodutor@hotmail.com',
                                        to: jsonData.email,
                                        subject: 'AGROPRODUTOR - Recuperação de Cadastro',
                                        text: `Esta é uma mensagem automática por favor não responda.\n\nVocê solicitou uma recuperação de cadastro para o app AgroProdutor. Sugerimos que você altere a está senha acessando a tela de munu do Cliente e clicar no itém "Perfil". Os dados cadastrados para este e-mail são:\n\nNome de usuário: ${result.rows[0].nomeUser}\nSenha: ${new_password}\n\nAtenciosamente,\nAGROPRODUTOR`
                                    };
                                    // E-MAIL FUNCTION
                                    transporter.sendMail(mailOptions, error => {
                                        if (error) {
                                            // ON ERROR => RESPONSE BAD REQUEST 400
                                            res.status(400).json({ message: error });
                                        } else {
                                            // RESPONSE OK 200
                                            res.status(200).json({ title: 'Por favor verifique seu e-mail', message: 'Os seus dados de cadastro foram atualizados e enviados para o seu e-mail.' });
                                        }
                                    });
                                })
                                // ON ERROR => RESPONSE BAD REQUEST 400
                                .catch(err => res.status(400).json({ message: err.message }))
                            // DISCONNECTING TO THE DATABASE
                            client.release();
                        })
                        // ON ERROR => RESPONSE BAD REQUEST 400
                        .catch(err => {
                            res.status(400).json({ message: err.message })
                            // DISCONNECTING TO THE DATABASE
                            client.release();
                        })
                })
                // ON ERROR => RESPONSE BAD REQUEST 400
                .catch(err => res.status(400).json({ message: err.message }))
        },
        recoverUserProdutor(req, res) {
            // USER DATA
            let jsonData = req.body,
                // RANDOM PASSWORD
                new_password = Math.random().toString(36).substring(2, 10);
            // CONNECTING TO THE DATABASE
            pool.connect()
                // ON SUCCESS => CONNECTED
                .then(client => {
                    // UPDATE QUERY => UPDATE USER PASSWORD
                    client.query("UPDATE tbProdutor SET senha = MD5($1) WHERE emailProdutor = $2", [new_password, jsonData.email])
                        // ON SUCCESS
                        .then(() => {
                            client.query("SELECT nomeUserProdutor FROM tbProdutor WHERE emailProdutor = $1", [jsonData.email])
                                .then(result => {
                                    // E-MAIL OPTIONS
                                    let mailOptions = {
                                        from: 'app_agroprodutor@hotmail.com',
                                        to: jsonData.email,
                                        subject: 'AGROPRODUTOR - Recuperação de Cadastro',
                                        text: `Esta é uma mensagem automática por favor não responda.\n\nVocê solicitou uma recuperação de cadastro para o app AgroProdutor. Sugerimos que você altere a está senha acessando a tela de munu do Produtor e clicar no itém "Perfil". Os dados cadastrados para este e-mail são:\n\nNome de usuário: ${result.rows[0].nomeuserprodutor}\nSenha: ${new_password}\n\nAtenciosamente,\nAGROPRODUTOR`
                                    };
                                    // E-MAIL FUNCTION
                                    transporter.sendMail(mailOptions, error => {
                                        if (error) {
                                            // ON ERROR => RESPONSE BAD REQUEST 400
                                            res.status(400).json({ message: error });
                                        } else {
                                            // RESPONSE OK 200
                                            res.status(200).json({ title: 'Por favor verifique seu e-mail', message: 'Os seus dados de cadastro foram atualizados e enviados para o seu e-mail.' });
                                        }
                                    });
                                })
                                // ON ERROR => RESPONSE BAD REQUEST 400
                                .catch(err => res.status(400).json({ message: err.message }))
                            // DISCONNECTING TO THE DATABASE
                            client.release();
                        })
                        // ON ERROR => RESPONSE BAD REQUEST 400
                        .catch(err => {
                            res.status(400).json({ message: err.message })
                            // DISCONNECTING TO THE DATABASE
                            client.release();
                        })
                })
                // ON ERROR => RESPONSE BAD REQUEST 400
                .catch(err => res.status(400).json({ message: err.message }))
        },
        // CHECK IF THE TOKEN IS VALID => /authenticated => get
        isAuthenticatedCliente(req, res) {
            // CONNECTING TO THE DATABASE
            pool.connect()
                // ON SUCCESS => CONNECTED
                .then(client => {
                    // SELECT QUERY
                    client.query("SELECT NOW()")
                        // ON SUCCESS
                        .then(() => res.status(200).json({ authenticated: true }))
                        // ON ERROR => RESPONSE BAD REQUEST 400
                        .catch(err => res.status(400).json({ message: err.message }))
                    // DISCONNECTING TO THE DATABASE
                    client.release();
                })
                // ON ERROR => RESPONSE BAD REQUEST 400
                .catch(err => res.status(400).json({ message: err.message }));
        },
        isAuthenticatedProdutor(req, res) {
            // CONNECTING TO THE DATABASE
            pool.connect()
                // ON SUCCESS => CONNECTED
                .then(client => {
                    // SELECT QUERY
                    client.query("SELECT NOW()")
                        // ON SUCCESS
                        .then(() => res.status(200).json({ authenticated: true }))
                        // ON ERROR => RESPONSE BAD REQUEST 400
                        .catch(err => res.status(400).json({ message: err.message }))
                    // DISCONNECTING TO THE DATABASE
                    client.release();
                })
                // ON ERROR => RESPONSE BAD REQUEST 400
                .catch(err => res.status(400).json({ message: err.message }));
        },
        // GET PROCUCES DATA
        getProduces(req, res) {
            // RESPONSE TEMPLATE
            respTemplate = [];
            // CONNECTING TO THE DATABASE
            pool.connect()
                // ON SUCCESS => CONNECTED
                .then(client => {
                    // SELECT QUERY
                    client.query("SELECT * FROM vProdutor")
                        // ON SUCCESS
                        .then(result => {
                            result.rows.map(item => {
                                respTemplate.push({
                                    idProdutor: item.idprodutor,
                                    user_name: item.nomeuserprodutor.trim(),
                                    name: item.nomeprodutor.trim(),
                                    tipoDeProdutor: item.tipodeprodutor.trim(),
                                    address: item.enderecodoprodutor.trim(),
                                    telefone: item.telefone.trim(),
                                    lat: item.lat,
                                    lng: item.lng,
                                    geom: item.geom
                                });
                            });
                            // RESPONSE OK 200
                            res.status(200).json({ respTemplate });
                        })
                        // ON ERROR => RESPONSE BAD REQUEST 400
                        .catch(err => res.status(400).json({ message: err.message }))
                    // DISCONNECTING TO THE DATABASE
                    client.release();
                })
                // ON ERROR => RESPONSE BAD REQUEST 400
                .catch(err => res.status(400).json({ message: err.message }));
        },
        // GET USER DATA
        getUserCliente(req, res) {
            // USER NAME
            let id = req.params.id,
                // RESPONSE TEMPLATE
                respTemplate = {};
            // CONNECTING TO THE DATABASE
            pool.connect()
                // ON SUCCESS => CONNECTED
                .then(client => {
                    // SELECT QUERY
                    client.query("SELECT * FROM tbCliente WHERE idCliente = $1", [id])
                        // ON SUCCESS
                        .then(result => {
                            respTemplate = {
                                user_name: result.rows[0].nomeuser.trim(),
                                name: result.rows[0].nomecliente.trim(),
                                email: result.rows[0].emailcliente.trim(),
                                dataNascimento: result.rows[0].datanascimento.trim(),
                                address: result.rows[0].enderecodocliente.trim(),
                                lat: result.rows[0].latcliente,
                                lng: result.rows[0].lngcliente,
                                telefone: result.rows[0].telefonecliente.trim()
                            };
                            // RESPONSE OK 200
                            res.status(200).json({ respTemplate });
                        })
                        // ON ERROR => RESPONSE BAD REQUEST 400
                        .catch(err => res.status(400).json({ message: err.message }))
                    // DISCONNECTING TO THE DATABASE
                    client.release();
                })
                // ON ERROR => RESPONSE BAD REQUEST 400
                .catch(err => res.status(400).json({ message: err.message }));
        },
        getUserProdutor(req, res) {
            // USER NAME
            let id = req.params.id,
                // RESPONSE TEMPLATE
                respTemplate = {};
            // CONNECTING TO THE DATABASE
            pool.connect()
                // ON SUCCESS => CONNECTED
                .then(client => {
                    // SELECT QUERY
                    client.query("SELECT * FROM tbProdutor WHERE idProdutor = $1", [id])
                        // ON SUCCESS
                        .then(result => {
                            respTemplate = {
                                user_name: result.rows[0].nomeuserprodutor.trim(),
                                name: result.rows[0].nomeprodutor.trim(),
                                email: result.rows[0].emailprodutor.trim(),
                                dataNascimento: result.rows[0].datanascimento.trim(),
                                tipoDeProdutor: result.rows[0].tipodeprodutor.trim(),
                                address: result.rows[0].enderecodoprodutor.trim(),
                                lat: result.rows[0].lat,
                                lng: result.rows[0].lng,
                                telefone: result.rows[0].telefone.trim(),
                                status: result.rows[0].situacaoprodutor.trim()
                            };
                            // RESPONSE OK 200
                            res.status(200).json({ respTemplate });
                        })
                        // ON ERROR => RESPONSE BAD REQUEST 400
                        .catch(err => res.status(400).json({ message: err.message }))
                    // DISCONNECTING TO THE DATABASE
                    client.release();
                })
                // ON ERROR => RESPONSE BAD REQUEST 400
                .catch(err => res.status(400).json({ message: err.message }));
        },
        // UPDATE USER PASSWORD => /password => put
        setUserClientePassword(req, res) {
            // PASSWORD DATA
            let jsonData = req.body;
            // CONNECTING TO THE DATABASE
            pool.connect()
                // ON SUCCESS => CONNECTED
                .then(client => {
                    // UPDATE QUERY
                    client.query("UPDATE tbCliente SET senha = MD5($1) WHERE idCliente = $2", [jsonData.new, jsonData.id])
                        // ON SUCCESS
                        .then(() => {
                            // RESPONSE OK 200
                            res.status(200).json({ title: 'Senha atualizada', message: 'Sua senha foi atualizada com sucesso.' })
                        })
                        // ON ERROR => RESPONSE BAD REQUEST 400
                        .catch(err => res.status(400).json({ message: err.message }))
                    // DISCONNECTING TO THE DATABASE
                    client.release();
                })
                // ON ERROR => RESPONSE BAD REQUEST 400
                .catch(err => res.status(400).json({ message: err.message }));
        },
        setUserProdutorPassword(req, res) {
            // PASSWORD DATA
            let jsonData = req.body;
            // CONNECTING TO THE DATABASE
            pool.connect()
                // ON SUCCESS => CONNECTED
                .then(client => {
                    // UPDATE QUERY
                    client.query("UPDATE tbProdutor SET senha = MD5($1) WHERE idProdutor = $2", [jsonData.new, jsonData.id])
                        // ON SUCCESS
                        .then(() => {
                            // RESPONSE OK 200
                            res.status(200).json({ title: 'Senha atualizada', message: 'Sua senha foi atualizada com sucesso.' })
                        })
                        // ON ERROR => RESPONSE BAD REQUEST 400
                        .catch(err => res.status(400).json({ message: err.message }))
                    // DISCONNECTING TO THE DATABASE
                    client.release();
                })
                // ON ERROR => RESPONSE BAD REQUEST 400
                .catch(err => res.status(400).json({ message: err.message }));
        },
        // GET USER DATA => /data:user => get
        setUserClienteData(req, res) {
            // PASSWORD DATA
            let jsonData = req.body;
            // CONNECTING TO THE DATABASE
            pool.connect()
                // ON SUCCESS => CONNECTED
                .then(client => {
                    // UPDATE QUERY
                    client.query("UPDATE tbCliente SET nomeUser = $1, nomeCliente = $2, emailCliente = $3, dataNascimento = $4, enderecoDoCliente = $5, latCliente = $6, lngCliente = $7, telefoneCliente = $8 WHERE idCliente = $9", [jsonData.user_name, jsonData.name, jsonData.email, jsonData.dataNascimento, jsonData.address, jsonData.lat, jsonData.lng, jsonData.telefone, jsonData.id])
                        // ON SUCCESS
                        .then(() => {
                            // RESPONSE OK 200
                            res.status(200).json({ title: 'Dados atualizados', message: 'Seus dados foram atualizados com sucesso.' })
                        })
                        // ON ERROR => RESPONSE BAD REQUEST 400
                        .catch(err => res.status(400).json({ message: err.message }))
                    // DISCONNECTING TO THE DATABASE
                    client.release();
                })
                // ON ERROR => RESPONSE BAD REQUEST 400
                .catch(err => res.status(400).json({ message: err.message }));
        },
        setUserProdutorData(req, res) {
            // PASSWORD DATA
            let jsonData = req.body;
            // CONNECTING TO THE DATABASE
            pool.connect()
                // ON SUCCESS => CONNECTED
                .then(client => {
                    // UPDATE QUERY
                    client.query("UPDATE tbProdutor SET nomeUserProdutor = $1, nomeProdutor = $2, emailProdutor = $3, dataNascimento = $4, tipoDeProdutor = $5, enderecoDoProdutor = $6, lat = $7, lng = $8, telefone = $9 WHERE idProdutor = $10", [jsonData.user_name, jsonData.name, jsonData.email, jsonData.dataNascimento, jsonData.tipoDeProdutor, jsonData.address, jsonData.lat, jsonData.lng, jsonData.telefone, jsonData.id])
                        // ON SUCCESS
                        .then(() => {
                            // RESPONSE OK 200
                            res.status(200).json({ title: 'Dados atualizados', message: 'Seus dados foram atualizados com sucesso.' })
                        })
                        // ON ERROR => RESPONSE BAD REQUEST 400
                        .catch(err => res.status(400).json({ message: err.message }))
                    // DISCONNECTING TO THE DATABASE
                    client.release();
                })
                // ON ERROR => RESPONSE BAD REQUEST 400
                .catch(err => res.status(400).json({ message: err.message }));
        },
        getProdutos(req, res) {
            // CONNECTING TO THE DATABASE
            pool.connect()
                // ON SUCCESS => CONNECTED
                .then(client => {
                    // SELECT QUERY
                    client.query("SELECT * FROM tbProduto")
                        // ON SUCCESS
                        .then(result => {
                            // RESPONSE OK 200
                            res.status(200).json(result.rows);
                        })
                        // ON ERROR => RESPONSE BAD REQUEST 400
                        .catch(err => res.status(400).json({ message: err.message }))
                    // DISCONNECTING TO THE DATABASE
                    client.release();
                })
                // ON ERROR => RESPONSE BAD REQUEST 400
                .catch(err => res.status(400).json({ message: err.message }));
        },
        getProdutoId(req, res) {
            // USER NAME
            let id = req.params.id,
                // RESPONSE TEMPLATE
                respTemplate = {};
            // CONNECTING TO THE DATABASE
            pool.connect()
                // ON SUCCESS => CONNECTED
                .then(client => {
                    // SELECT QUERY
                    client.query("SELECT * FROM tbProduto WHERE idProduto = $1", [id])
                        // ON SUCCESS
                        .then(result => {
                            respTemplate = {
                                id: result.rows[0].idproduto,
                                name: result.rows[0].nomeproduto.trim(),
                            };
                            // RESPONSE OK 200
                            res.status(200).json({ respTemplate });
                        })
                        // ON ERROR => RESPONSE BAD REQUEST 400
                        .catch(err => res.status(400).json({ message: err.message }))
                    // DISCONNECTING TO THE DATABASE
                    client.release();
                })
                // ON ERROR => RESPONSE BAD REQUEST 400
                .catch(err => res.status(400).json({ message: err.message }));
        },
        createProductByProduces(req, res) {
            // USER DATA
            let jsonData = req.body;
            // CONNECTING TO THE DATABASE
            pool.connect()
                // ON SUCCESS => CONNECTED
                .then(client => {
                    // INSERT QUERY => CREATE A NEW USER
                    client.query(format('INSERT INTO tbProdutoPorProdutor (idProdutor, idProduto, disponibilidade) VALUES %L', jsonData.produtos))
                        // ON SUCCESS => RESPONSE OK 200
                        .then(() => res.status(200).json({ title: 'Obrigado por cadastrar seus produtos', message: 'Seus produtos foram cadastrados com sucesso.' }))
                        // ON ERROR => RESPONSE BAD REQUEST 400
                        .catch(err => res.status(400).json({ message: err.message }))
                    // DISCONNECTING TO THE DATABASE
                    client.release();
                })
                // ON ERROR => RESPONSE BAD REQUEST 400
                .catch(err => res.status(400).json({ message: err.message }));
        },
        getProductByProduces(req, res) {
            // USER DATA
            let id = req.params.id,
                // RESPONSE TEMPLATE
                respTemplate = [];
            // CONNECTING TO THE DATABASE
            pool.connect()
                // ON SUCCESS => CONNECTED
                .then(client => {
                    // SELECT QUERY => CHECK IF user_name IS UNIQUE
                    client.query("SELECT * FROM vProdutoPorProdutor WHERE idProdutor = $1", [id])
                        // ON SUCCESS
                        .then(result => {
                            result.rows.map(item => {
                                respTemplate.push({
                                    id_Produto_Por_Produtor: item.idprodutoporprodutor,
                                    id_produtor: item.idprodutor,
                                    nome_user_produtor: item.nomeuserprodutor.trim(),
                                    nome_produtor: item.nomeproduto.trim(),
                                    id_produto: item.idproduto,
                                    nome_produto: item.nomeproduto.trim(),
                                    type: item.tipo_de_produto.trim(),
                                    disponibilidade: item.disponibilidade.trim()
                                });
                            });
                            // RESPONSE OK 200
                            res.status(200).json({ respTemplate });
                        })
                        // ON ERROR => RESPONSE BAD REQUEST 400
                        .catch(err => res.status(400).json({ message: err.message }))
                    // DISCONNECTING TO THE DATABASE
                    client.release();
                })
                // ON ERROR => RESPONSE BAD REQUEST 400
                .catch(err => res.status(400).json({ message: err.message }));
        },
        // RECOVER PRODUCT BY PRODUCES => /data => post
        recoverProductByProduces1(req, res) {
            // USER DATA
            let id = req.params.id;
            // CONNECTING TO THE DATABASE
            pool.connect()
                // ON SUCCESS => CONNECTED
                .then(client => {
                    // UPDATE QUERY => UPDATE tbProdutoPorProdutor disponibilidade
                    client.query("UPDATE tbProdutoPorProdutor SET disponibilidade = 'Indisponível' WHERE idProdutoPorProdutor = $1", [id])
                        // ON SUCCESS => RESPONSE OK 200
                        .then(() => res.status(200).json({ title: 'Obrigado por atualizar seus produtos', message: 'Seus dados foram atualizados com sucesso.' }))
                        // ON ERROR => RESPONSE BAD REQUEST 400
                        .catch(err => res.status(400).json({ message: err.message }))
                    // DISCONNECTING TO THE DATABASE
                    client.release();
                })
                // ON ERROR => RESPONSE BAD REQUEST 400
                .catch(err => res.status(400).json({ message: err.message }));
        },
        recoverProductByProduces2(req, res) {
            // USER DATA
            let id = req.params.id;
            // CONNECTING TO THE DATABASE
            pool.connect()
                // ON SUCCESS => CONNECTED
                .then(client => {
                    // UPDATE QUERY => UPDATE tbProdutoPorProdutor disponibilidade
                    client.query("UPDATE tbProdutoPorProdutor SET disponibilidade = 'Disponível' WHERE idProdutoPorProdutor = $1", [id])
                        // ON SUCCESS => RESPONSE OK 200
                        .then(() => res.status(200).json({ title: 'Obrigado por atualizar seus produtos', message: 'Seus dados foram atualizados com sucesso.' }))
                        // ON ERROR => RESPONSE BAD REQUEST 400
                        .catch(err => res.status(400).json({ message: err.message }))
                    // DISCONNECTING TO THE DATABASE
                    client.release();
                })
                // ON ERROR => RESPONSE BAD REQUEST 400
                .catch(err => res.status(400).json({ message: err.message }));
        },
        // FILTER PETS => /filter => post
        filter(req, res) {
            // USER DATA
            let jsonData = req.body,
                consullta,
                // RESPONSE TEMPLATE
                respTemplate = [];

            if (jsonData.typeProduct != '') {
                consullta = `SELECT a.idProdutor, a.nomeUserProdutor, a.nomeProdutor, a.tipoDeProdutor, a.enderecoDoProdutor, a.lat, a.lng, a.telefone, a.SituacaoProdutor, a.geom FROM vProdutor a, vProdutoPorProdutor b WHERE a.tipoDeProdutor = '${jsonData.type}' AND ST_Intersects(a.geom,ST_Buffer(ST_GeomFromText('Point(${jsonData.coordinates})',4326),${jsonData.distance})) AND b.tipo_de_produto = '${jsonData.typeProduct}' GROUP BY a.idProdutor, a.nomeUserProdutor, a.nomeProdutor, a.tipoDeProdutor, a.enderecoDoProdutor, a.lat, a.lng, a.telefone, a.SituacaoProdutor, a.geom`;
            }
            else {
                consullta = `SELECT * FROM vProdutor WHERE tipoDeProdutor = '${jsonData.type}' AND ST_Intersects(geom,ST_Buffer(ST_GeomFromText('Point(${jsonData.coordinates})',4326),${jsonData.distance}))`;
            }

            // CONNECTING TO THE DATABASE
            pool.connect()
                // ON SUCCESS => CONNECTED
                .then(client => {
                    // INSERT QUERY => CREATE A NEW USER
                    client.query(consullta)
                        // ON SUCCESS
                        .then(result => {
                            result.rows.map(item => {
                                respTemplate.push({
                                    idProdutor: item.idprodutor,
                                    user_name: item.nomeuserprodutor.trim(),
                                    name: item.nomeprodutor.trim(),
                                    tipoDeProdutor: item.tipodeprodutor.trim(),
                                    address: item.enderecodoprodutor.trim(),
                                    telefone: item.telefone.trim(),
                                    lat: item.lat,
                                    lng: item.lng,
                                    geom: item.geom
                                });
                            });
                            // RESPONSE OK 200
                            res.status(200).json({ respTemplate });
                        })
                        // ON ERROR => RESPONSE BAD REQUEST 400
                        .catch(err => res.status(400).json({ message: err.message }))
                    // DISCONNECTING TO THE DATABASE
                    client.release();
                })
                // ON ERROR => RESPONSE BAD REQUEST 400
                .catch(err => res.status(400).json({ message: err.message }));
        },
        // FILTER PETS => /filter => post
        CreateVisualizao(req, res) {
            // USER DATA
            let jsonData = req.body,
                // RESPONSE TEMPLATE
                respTemplate = [];
            // CONNECTING TO THE DATABASE
            pool.connect()
                // ON SUCCESS => CONNECTED
                .then(client => {
                    // INSERT QUERY => CREATE A NEW USER
                    client.query("INSERT INTO tb_visualizacao (idCliente, nomeUser, nomeCliente, emailCliente, telefoneCliente, idProdutor, data_visualizacao) VALUES($1, $2, $3, $4, $5, $6, now())", [jsonData.id, jsonData.user_name, jsonData.name, jsonData.email, jsonData.telefone, jsonData.idProdutor])
                        // ON SUCCESS
                        .then(() => res.status(200).json({ title: 'Obrigado por visualizar', message: 'Seus dados foram cadastrados com sucesso.' }))
                        // ON ERROR => RESPONSE BAD REQUEST 400
                        .catch(err => res.status(400).json({ message: err.message }))
                    // DISCONNECTING TO THE DATABASE
                    client.release();
                })
                // ON ERROR => RESPONSE BAD REQUEST 400
                .catch(err => res.status(400).json({ message: err.message }));
        },
        // GET PROCUCES DATA
        getVisualizadores(req, res) {
            // USER DATA
            let id = req.params.id,
                // RESPONSE TEMPLATE 
                respTemplate = [];
            // CONNECTING TO THE DATABASE
            pool.connect()
                // ON SUCCESS => CONNECTED
                .then(client => {
                    // SELECT QUERY
                    client.query(`select idCliente, nomeUser, emailCliente from tb_visualizacao WHERE idProdutor = $1 AND data_visualizacao::date >= CURRENT_DATE group by idCliente, nomeUser, emailCliente`, [id])
                        // ON SUCCESS
                        .then(result => {
                            result.rows.map(item => {
                                respTemplate.push({
                                    idCliente: item.idcliente,
                                    user_name: item.nomeuser.trim(),
                                    email: item.emailcliente.trim()
                                });
                            });
                            // RESPONSE OK 200
                            res.status(200).json({ respTemplate });
                            cosole.log
                        })
                        // ON ERROR => RESPONSE BAD REQUEST 400
                        .catch(err => res.status(400).json({ message: err.message }))
                    // DISCONNECTING TO THE DATABASE
                    client.release();
                })
                // ON ERROR => RESPONSE BAD REQUEST 400
                .catch(err => res.status(400).json({ message: err.message }));
        }
    };
    return controller;
};