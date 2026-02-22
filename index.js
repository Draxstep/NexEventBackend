import dotenv from "dotenv";
import app from "./app.js";
import sequelize from "./config/database.js"; 

dotenv.config();

const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Conectado a la base de datos.");

        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("❌ Error crítico al arrancar la aplicación:", error);
        process.exit(1); 
    }
};

iniciarServidor();