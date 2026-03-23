export default function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next(); // Continua para o próximo middleware ou controlador
}  