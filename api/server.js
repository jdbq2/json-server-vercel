// See https://github.com/typicode/json-server#module
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
    setTimeout(next, 1000);
});

/* server.use(
    jsonServer.rewriter({
        "/api/*": "/$1",
        "/blog/:resource/:id/show": "/:resource/:id",
    })
); */

server.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const users = await router.db.get("users").value();
        const user = users.find(
            (u) => u.email === email && u.password === password
        );
        if (user) {
            res.status(200).json({ message: "Inicio de sesión exitoso", user });
        } else {
            res.status(401).json({ error: "Credenciales incorrectas" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Error interno en el servidor",
        });
    }
});
server.use(router);
server.listen(3000, () => {
    console.log("JSON Server is running");
});

// Export the Server API
module.exports = server;
