/**
 * Configuration Swagger pour l'API ArtisanBF
 * Documente toutes les routes API avec exemples
 */

const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ArtisanBF API Documentation',
      version: '1.0.0',
      description: 'API complète pour la plateforme ArtisanBF - Connection citoyens et artisans au Burkina Faso',
      contact: {
        name: 'ArtisanBF Team',
        email: 'contact@artisanbf.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement'
      }
    ],
    components: {
      schemas: {
        // Schémas pour l'IA
        AnalyseRequest: {
          type: 'object',
          required: ['commentaire'],
          properties: {
            commentaire: {
              type: 'string',
              description: 'Commentaire à analyser',
              example: 'Ce mécanicien est excellent, il a réparé ma moto en 2h'
            }
          }
        },
        AnalyseResponse: {
          type: 'object',
          properties: {
            pertinent: {
              type: 'boolean',
              description: 'Si le commentaire est pertinent'
            },
            note: {
              type: 'integer',
              description: 'Note de 1 à 5',
              example: 5
            },
            sentiment: {
              type: 'string',
              enum: ['positif', 'neutre', 'negatif'],
              example: 'positif'
            },
            criteres: {
              type: 'object',
              properties: {
                qualite: { type: 'integer' },
                professionnalisme: { type: 'integer' },
                rapidite: { type: 'integer' },
                prix: { type: 'integer' }
              }
            },
            points_forts: {
              type: 'array',
              items: { type: 'string' },
              example: ['qualité du travail', 'rapidité']
            },
            points_faibles: {
              type: 'array',
              items: { type: 'string' }
            },
            raison: {
              type: 'string',
              description: 'Justification de l\'analyse'
            }
          }
        },
        SummarizeRequest: {
          type: 'object',
          required: ['commentaires'],
          properties: {
            commentaires: {
              type: 'array',
              items: { type: 'string' },
              example: ['bon travail', 'trop cher', 'je recommande', 'accueil sympa']
            }
          }
        },
        SummarizeResponse: {
          type: 'object',
          properties: {
            resume: {
              type: 'string',
              example: 'Le commerce a reçu des commentaires positifs sur la qualité du travail'
            },
            points_forts: {
              type: 'array',
              items: { type: 'string' },
              example: ['Travail de qualité', 'Accueil sympathique']
            },
            points_faibles: {
              type: 'array',
              items: { type: 'string' },
              example: ['Prix élevé']
            }
          }
        },
        SpeechToTextResponse: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              example: 'Je cherche un mécanicien près du marché'
            }
          }
        },
        VoiceSearchResult: {
          type: 'object',
          properties: {
            texte: {
              type: 'string',
              example: 'Je cherche un coiffeur à Ouara 2000'
            },
            intention: {
              type: 'string',
              enum: ['recherche', 'commentaire', 'incomprehensible']
            },
            categorie: {
              type: 'string',
              example: 'Coiffeur'
            },
            quartier: {
              type: 'string',
              example: 'Ouara 2000'
            },
            urgence: {
              type: 'boolean'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Erreur interne du serveur'
            }
          }
        }
      }
    }
  },
  apis: ['./src/app/api/**/*.ts']
}

const specs = swaggerJsdoc(options)

module.exports = specs
