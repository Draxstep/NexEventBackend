class ImgDbService {
    async subirImagen(fileBuffer) {
        try {
            const imagenBase64 = fileBuffer.toString('base64');
            
            const formData = new FormData();
            formData.append('image', imagenBase64);

            const url = `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`;
            
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error("Error al subir la imagen a ImgBB");
            }

            return data.data.url; 
            
        } catch (error) {
            console.error("Error en ImgbbService:", error);
            throw new Error("No se pudo procesar la imagen externa.", { cause: error });
        }
    }
}

export default new ImgDbService();