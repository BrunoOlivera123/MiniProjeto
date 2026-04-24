const express = require('express');

const app = express();

app.use(express.json());

const itensRoutes = require("./Routes/itensRoutes");
app.use("/itens", itensRoutes);

app.listen(3000, () => {
  console.log('API rodando na porta 3000 ✅');
});

//novo