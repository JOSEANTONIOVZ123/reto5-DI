const API_KEY = "21c0bcfe-4bb8-491f-af02-439d6eeb5fc1";
const API_URL = "https://api4.thetvdb.com/v4";

async function obtenerToken() {
    try {
        const respuesta = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ apikey: API_KEY })
        });

        const datos = await respuesta.json();

        if (datos.status === "success") {
            console.log("Token correcto:", datos.data.token);
            return datos.data.token; 
        } else {
            console.error("Error de token:", datos);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}

async function buscarSeriesDragonBall(token) {
    try {
        const respuesta = await fetch(`${API_URL}/search?query=Dragon%20Ball&type=series`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        const datos = await respuesta.json();
        console.log("Series encontradas:", datos);
    } catch (error) {
        console.error("Error al buscar:", error);
    }
}

(async () => {
    const token = await obtenerToken();
    if (token) {
        await buscarSeriesDragonBall(token);
    } else {
        console.log("No se pudo obtener el token, revisa la API Key.");
    }
})();
