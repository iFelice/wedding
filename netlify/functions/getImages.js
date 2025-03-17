// netlify/functions/getImages.js
const axios = require('axios');

exports.handler = async function(event, context) {
  try {
    // Recupero variabili d'ambiente
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    // Controllo per CORS
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
        },
        body: ''
      };
    }
    
    // Chiamata API a Cloudinary
    const response = await axios.get(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/image`,
      {
        params: {
          type: 'upload',
          prefix: 'wedding_', // prefisso per filtrare le immagini
          max_results: 500
        },
        auth: {
          username: apiKey,
          password: apiSecret
        }
      }
    );
    
    // Formatta i dati delle immagini
    const images = response.data.resources.map(resource => ({
      id: resource.public_id,
      url: resource.secure_url,
      created_at: resource.created_at,
      author: resource.context?.author || 'Anonimo',
      caption: resource.context?.caption || ''
    }));
    
    // Ritorna le immagini in ordine cronologico inverso (più recenti prima)
    images.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(images)
    };
  } catch (error) {
    console.log('Errore nella funzione serverless:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Errore nel recupero delle immagini' })
    };
  }
};