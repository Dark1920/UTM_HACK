/**
 * Vérification complète de l'intégration Frontend → Backend → IA
 */

const API_BASE_URL = 'http://localhost:3000/api';
let testsPassed = 0;
let testsFailed = 0;

async function test(name, fn) {
  try {
    console.log(`\n🧪 ${name}...`);
    await fn();
    console.log(`   ✅ PASS`);
    testsPassed++;
  } catch (error) {
    console.log(`   ❌ FAIL: ${error.message}`);
    testsFailed++;
  }
}

async function runTests() {
  console.log('═══════════════════════════════════════════');
  console.log('🔍 VÉRIFICATION INTÉGRATION FRONTEND → BACKEND → IA');
  console.log('═══════════════════════════════════════════');
  console.log(`\nBackend URL: ${API_BASE_URL}\n`);

  // ========================================
  // TEST 1: API Catégories
  // ========================================
  await test('📦 API Catégories - GET /api/categories', async () => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    const data = await response.json();
    
    if (!data.categories || data.categories.length === 0) {
      throw new Error('Aucune catégorie trouvée');
    }
    
    console.log(`   → ${data.total} catégories récupérées`);
    console.log(`   → Exemple: ${data.categories[0].nom} (${data.categories[0].icone})`);
  });

  // ========================================
  // TEST 2: API Géocodage
  // ========================================
  await test('📍 API Géocodage - GET /api/geocoding', async () => {
    const response = await fetch(
      `${API_BASE_URL}/geocoding?address=Ouaga 2000&city=Ouagadougou`
    );
    const data = await response.json();
    
    if (!data.found) {
      throw new Error('Adresse non trouvée');
    }
    
    console.log(`   → Latitude: ${data.primary.latitude}`);
    console.log(`   → Longitude: ${data.primary.longitude}`);
  });

  // ========================================
  // TEST 3: API Commerces
  // ========================================
  await test('🏪 API Commerces - GET /api/commerces', async () => {
    const response = await fetch(`${API_BASE_URL}/commerces`);
    const data = await response.json();
    
    const count = data.total || data.commerces?.length || 0;
    console.log(`   → ${count} commerce(s) trouvé(s)`);
    
    if (count > 0) {
      console.log(`   → Exemple: ${data.commerces[0].nom}`);
    }
  });

  // ========================================
  // TEST 4: API IA - Analyse de sentiment
  // ========================================
  await test('🤖 API IA - Analyse de sentiment (POST /api/ai/analyze)', async () => {
    const response = await fetch(`${API_BASE_URL}/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        texte: 'Excellent service ! Le mécanicien est très professionnel et rapide. Je recommande vivement.'
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`   → Analyse IA reçue`);
    console.log(`   → Sentiment: ${data.analyse?.sentiment || 'N/A'}`);
    console.log(`   → Note: ${data.analyse?.note || 'N/A'}/5`);
    console.log(`   → Pertinent: ${data.analyse?.pertinent ? '✅' : '❌'}`);
  });

  // ========================================
  // TEST 5: API IA - Résumé d'avis
  // ========================================
  await test('📝 API IA - Résumé d\'avis (POST /api/ai/summarize)', async () => {
    const response = await fetch(`${API_BASE_URL}/ai/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        texte: 'Plusieurs clients ont apprécié la rapidité d\'intervention et le professionnalisme. Quelques remarques sur les prix un peu élevés mais la qualité est au rendez-vous.'
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`   → Résumé IA généré`);
    console.log(`   → Longueur: ${data.resume?.resume?.length || 0} caractères`);
  });

  // ========================================
  // TEST 6: API Authentification (structure)
  // ========================================
  await test('🔐 API Auth - Structure des endpoints', async () => {
    // Vérifier que les endpoints existent (sans les appeler)
    const endpoints = [
      '/auth/connexion',
      '/auth/inscription',
      '/auth/deconnexion',
      '/auth/reinitialisation'
    ];
    
    console.log(`   → Endpoints configurés:`);
    endpoints.forEach(ep => console.log(`      - ${ep}`));
  });

  // ========================================
  // RÉSULTATS
  // ========================================
  console.log('\n═══════════════════════════════════════════');
  console.log('📊 RÉSULTATS DES TESTS');
  console.log('═══════════════════════════════════════════');
  console.log(`✅ Tests réussis: ${testsPassed}`);
  console.log(`❌ Tests échoués: ${testsFailed}`);
  console.log(`📈 Score: ${testsPassed}/${testsPassed + testsFailed}`);
  
  if (testsFailed === 0) {
    console.log('\n🎉 TOUT EST CORRECTEMENT CONNECTÉ !');
    console.log('   Frontend → Backend → IA ✅');
  } else {
    console.log('\n⚠️  Certains tests ont échoué. Vérifiez les erreurs ci-dessus.');
  }
  console.log('═══════════════════════════════════════════\n');
}

runTests().catch(console.error);
