// Page Swagger UI pour documenter et tester l'API
'use client'

import type { ComponentType } from 'react'
import SwaggerUIRaw from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

// swagger-ui-react est typé pour React 18 ; dans ce monorepo, @types/react (v19)
// est hoisté à la racine et rend son type FunctionComponent invalide en JSX.
// On le re-caste en composant acceptant des props libres pour débloquer le build.
const SwaggerUI = SwaggerUIRaw as unknown as ComponentType<Record<string, unknown>>

// Configuration Swagger inline (même contenu que lib/swagger.js)
const swaggerSpec = {
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
  paths: {
    '/api/ai/analyze': {
      post: {
        summary: 'Analyse un commentaire avec l\'IA',
        description: 'Utilise Llama 3.1 via Groq pour analyser le sentiment, la note et la pertinence d\'un commentaire',
        tags: ['IA'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['commentaire'],
                properties: {
                  commentaire: {
                    type: 'string',
                    description: 'Commentaire à analyser',
                    example: 'Ce mécanicien est excellent, il a réparé ma moto en 2h'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Analyse réussie',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    pertinent: { type: 'boolean', description: 'Si le commentaire est pertinent' },
                    note: { type: 'integer', description: 'Note de 1 à 5', example: 5 },
                    sentiment: { type: 'string', enum: ['positif', 'neutre', 'negatif'], example: 'positif' },
                    criteres: {
                      type: 'object',
                      properties: {
                        qualite: { type: 'integer' },
                        professionnalisme: { type: 'integer' },
                        rapidite: { type: 'integer' },
                        prix: { type: 'integer' }
                      }
                    },
                    points_forts: { type: 'array', items: { type: 'string' }, example: ['qualité du travail', 'rapidité'] },
                    points_faibles: { type: 'array', items: { type: 'string' } },
                    raison: { type: 'string', description: 'Justification de l\'analyse' }
                  }
                }
              }
            }
          },
          '500': {
            description: 'Erreur interne du serveur',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string', example: 'Erreur interne du serveur' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/ai/summarize': {
      post: {
        summary: 'Résume plusieurs commentaires',
        description: 'Utilise l\'IA pour générer un résumé synthétique de plusieurs avis',
        tags: ['IA'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['commentaires'],
                properties: {
                  commentaires: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['bon travail', 'trop cher', 'je recommande', 'accueil sympa']
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Résumé généré avec succès',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    resume: { type: 'string', example: 'Le commerce a reçu des commentaires positifs sur la qualité du travail' },
                    points_forts: { type: 'array', items: { type: 'string' }, example: ['Travail de qualité', 'Accueil sympathique'] },
                    points_faibles: { type: 'array', items: { type: 'string' }, example: ['Prix élevé'] }
                  }
                }
              }
            }
          },
          '500': {
            description: 'Erreur interne du serveur'
          }
        }
      }
    },
    '/api/ai/speech-to-text': {
      post: {
        summary: 'Transcrit l\'audio en texte',
        description: 'Utilise Whisper Large v3 via Groq pour transcrire l\'audio en texte français',
        tags: ['IA'],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  audio: {
                    type: 'string',
                    format: 'binary',
                    description: 'Fichier audio (MP3, WAV, M4A)'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Transcription réussie',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    text: { type: 'string', example: 'Je cherche un mécanicien près du marché' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Aucun fichier audio fourni'
          }
        }
      }
    },
    '/api/ai/voice-search': {
      post: {
        summary: 'Recherche vocale d\'artisans',
        description: 'Transcrit l\'audio et extrait l\'intention, la catégorie et le quartier recherchés',
        tags: ['IA'],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  audio: {
                    type: 'string',
                    format: 'binary',
                    description: 'Fichier audio de la recherche vocale'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Recherche vocale analysée',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    texte: { type: 'string', example: 'Je cherche un coiffeur à Ouara 2000' },
                    intention: { type: 'string', enum: ['recherche', 'commentaire', 'incomprehensible'] },
                    categorie: { type: 'string', example: 'Coiffeur' },
                    quartier: { type: 'string', example: 'Ouara 2000' },
                    urgence: { type: 'boolean' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Aucun fichier audio fourni'
          }
        }
      }
    }
  },
  components: {
    schemas: {}
  }
}

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white p-6">
        <h1 className="text-3xl font-bold">ArtisanBF API Documentation</h1>
        <p className="mt-2 text-blue-100">
          Documentation interactive de l'API ArtisanBF avec Swagger UI
        </p>
        <div className="mt-4 flex gap-4">
          <div className="bg-blue-700 px-4 py-2 rounded">
            <span className="font-semibold">Serveur:</span> http://localhost:3000
          </div>
          <div className="bg-blue-700 px-4 py-2 rounded">
            <span className="font-semibold">Version:</span> 1.0.0
          </div>
        </div>
      </div>
      
      <SwaggerUI 
        spec={swaggerSpec}
        docExpansion="list"
        filter={true}
        showExtensions={true}
        showCommonExtensions={true}
      />
    </div>
  )
}
