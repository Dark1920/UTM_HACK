/**
 * Test de connexion entre le frontend et le backend
 * Exécuter avec: node test-api-connection.js
 */

const API_BASE_URL = 'http://localhost:3000/api';

async function testConnection() {
  console.log('🧪 Test de connexion Frontend → Backend\n');
  console.log(`URL du backend: ${API_BASE_URL}\n`);

  // Test 1: Catégories
  console.log('📦 Test 1: Récupération des catégories...');
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    const data = await response.json();
    console.log(`✅ Succès: ${data.total} catégories trouvées`);
    console.log(`   Exemple: ${data.categories[0]?.nom}\n`);
  } catch (error) {
    console.log(`❌ Échec: ${error.message}\n`);
  }

  // Test 2: Géocodage
  console.log('📍 Test 2: Géocodage d\'une adresse...');
  try {
    const response = await fetch(`${API_BASE_URL}/geocoding?address=Ouaga 2000&city=Ouagadougou`);
    const data = await response.json();
    if (data.found) {
      console.log(`✅ Succès: Adresse trouvée`);
      console.log(`   Latitude: ${data.primary.latitude}`);
      console.log(`   Longitude: ${data.primary.longitude}\n`);
    } else {
      console.log(`⚠️  Adresse non trouvée\n`);
    }
  } catch (error) {
    console.log(`❌ Échec: ${error.message}\n`);
  }

  // Test 3: Liste des commerces
  console.log('🏪 Test 3: Récupération des commerces...');
  try {
    const response = await fetch(`${API_BASE_URL}/commerces`);
    const data = await response.json();
    console.log(`✅ Succès: ${data.total || data.commerces?.length || 0} commerces trouvés\n`);
  } catch (error) {
    console.log(`❌ Échec: ${error.message}\n`);
  }

  console.log('✨ Tests terminés!');
}

testConnection();
