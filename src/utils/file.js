export const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        // On lit le fichier comme un Data URL (contient le type MIME + le contenu en base64)
        reader.readAsDataURL(file);

        reader.onload = () => {
            // Le résultat ressemble à : "data:text/csv;base64,V29ya2luZyBhdCBTdGltZW8..."
            // On sépare au niveau de la virgule pour ne récupérer QUE la chaîne Base64 pure
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
        };

        reader.onerror = (error) => reject(error);
    });
};