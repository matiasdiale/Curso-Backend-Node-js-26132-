import fetch from 'node-fetch'; // No es necesario si usas Node.js 18+

const API_URL = "https://fakestoreapi.com/products";

// 1. Extraemos los argumentos de forma limpia
const [metodo, recurso, ...resto] = process.argv.slice(2);

// 2. Funciones de acción para cada requerimiento
const acciones = {
    GET: async (path) => {
        // Verificamos si es un producto específico (ej: products/15) o todos
        const url = path.includes('/') ? `${API_URL}/${path.split('/')[1]}` : API_URL;
        const res = await fetch(url);
        const data = await res.json();
        console.table(data); // .table queda mucho más profesional para listas
    },

    POST: async (path, args) => {
        if (path !== 'products' || args.length < 3) {
            return console.error("Uso: POST products <title> <price> <category>");
        }
        
        // Uso de destructuring para capturar los datos (Tip de desarrollo)
        const [title, price, category] = args;
        
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, price, category, description: 'Nuevo producto', image: 'https://i.pravatar.cc' })
        });
        
        const data = await res.json();
        console.log("Producto creado:", data);
    },

    DELETE: async (path) => {
        if (!path.includes('/')) return console.error("Debes indicar un ID (ej: products/7)");
        
        const id = path.split('/')[1];
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        const data = await res.json();
        console.log(`Producto ${id} eliminado:`, data);
    }
};

// 3. Función principal de ejecución
async function ejecutar() {
    try {
        if (acciones[metodo]) {
            await acciones[metodo](recurso, resto);
        } else {
            console.error("Comando no reconocido. Usa: GET, POST o DELETE.");
        }
    } catch (error) {
        console.error("Error en la operación:", error.message);
    }
}

ejecutar();
