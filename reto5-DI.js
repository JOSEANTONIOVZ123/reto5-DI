
const API_KEY = "21c0bcfe-4bb8-491f-af02-439d6eeb5fc1"; // Sustituye por tu clave API
const API_URL = "https://api4.thetvdb.com/v4";

// Función para obtener el Token de acceso
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
            console.log("Token obtenido:", datos.data.token);
            return datos.data.token;
        } else {
            console.error(" Error al obtener el token:", datos);
        }
    } catch (error) {
        console.error("Error en la autenticación:", error);
    }
}

// cuántas series de "Dragon Ball" hay registradas
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
        console.log("Series encontradas:", datos.data);
        return datos.data;
    } catch (error) {
        console.error("Error al buscar series:", error);
    }
}

// Obtener el póster de la serie más antigua (1986)
async function obtenerPoster(token, serieId) {
    try {
        const respuesta = await fetch(`${API_URL}/series/${serieId}/images`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        const datos = await respuesta.json();
        const poster = datos.data.find(img => img.type === "poster");
        console.log("URL del póster:", poster.image);
    } catch (error) {
        console.error("Error al obtener el póster:", error);
    }
}

// Obtener información del primer episodio de la 3ª temporada
async function obtenerPrimerEpisodioTemporada3(token, serieId) {
    try {
        const respuesta = await fetch(`${API_URL}/series/${serieId}/episodes/default?page=1`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        const datos = await respuesta.json();
        const episodio = datos.data.find(ep => ep.seasonNumber === 3 && ep.number === 1);

        console.log("Primer episodio de la 3ª temporada:");
        console.log("Fecha de emisión:", episodio.airDate);
        console.log("Nombre:", episodio.name);
        console.log("Descripción:", episodio.overview);
    } catch (error) {
        console.error(" Error al obtener el episodio:", error);
    }
}

// Buscar al actor de Goku en "Dragonball Evolution" y su filmografía
async function obtenerActorGoku(token) {
    try {
        const respuesta = await fetch(`${API_URL}/search?query=Dragonball%20Evolution&type=movie`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        const datos = await respuesta.json();
        const pelicula = datos.data[0]; 
        const peliculaId = pelicula.id;

        const respuestaActores = await fetch(`${API_URL}/movies/${peliculaId}/actors`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        const datosActores = await respuestaActores.json();
        const actorGoku = datosActores.data.find(actor => actor.name.includes("Chatwin")); // Buscamos a Justin Chatwin (Goku)
        console.log("🎭 Actor de Goku:", actorGoku.name);
        console.log("🎬 Número de películas/series en las que ha participado:", actorGoku.knownFor.length);
    } catch (error) {
        console.error("Error al obtener el actor de Goku:", error);
    }
}

// Buscar la mejor película de USA en 2005
async function obtenerMejorPelicula2005(token) {
    try {
        const respuesta = await fetch(`${API_URL}/search?query=year=2005&country=USA&type=movie`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        const datos = await respuesta.json();
        const mejorPelicula = datos.data.sort((a, b) => b.score - a.score)[0]; // Ordenamos por mejor puntuación
        console.log("🎬 Mejor película de 2005 en USA:", mejorPelicula.name);
    } catch (error) {
        console.error("Error al obtener la mejor película de 2005:", error);
    }
}

//  EJECUTAMOS TODO PASO A PASO
(async () => {
    const token = await obtenerToken();

    if (token) {
        const series = await buscarSeriesDragonBall(token);
        if (series.length > 0) {
            const serieId = series.find(serie => serie.year === 1986)?.id; // Buscar la serie de 1986
            if (serieId) {
                await obtenerPoster(token, serieId);
                await obtenerPrimerEpisodioTemporada3(token, serieId);
            } else {
                console.log("No se encontró una serie de 1986.");
            }
        }

        await obtenerActorGoku(token);
        await obtenerMejorPelicula2005(token);
    } else {
        console.log(" No se pudo obtener el token.");
    }
})();
