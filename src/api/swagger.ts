import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'KSEF PDF Generator API',
      version: '0.0.30',
      description: 'API do generowania faktur PDF z danych w formacie XML (KSeF)',
      contact: {
        name: 'Dawid Jurczyk',
        url: 'https://github.com/dawjur91/ksef-pdf-generator'
      },
      license: {
        name: 'ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development Server'
      },
      {
        url: 'http://localhost:5051',
        description: 'Production Server'
      }
    ],
    components: {
      schemas: {
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'ok'
            },
            message: {
              type: 'string',
              example: 'API is running'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2025-11-27T10:30:45.123Z'
            }
          },
          required: ['status', 'message', 'timestamp']
        },
        LogResponse: {
          type: 'object',
          properties: {
            timestamp: {
              type: 'string',
              format: 'date-time'
            },
            logFile: {
              type: 'string',
              example: './logs/api-2025-11-27.log'
            },
            totalLines: {
              type: 'integer',
              example: 245
            },
            displayedLines: {
              type: 'integer',
              example: 50
            },
            logs: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: [
                '[2025-11-27T10:30:45.123Z] [INFO] [REQ] GET /health',
                '[2025-11-27T10:30:45.124Z] [INFO] [RES] 200 GET /health (1ms)'
              ]
            }
          },
          required: ['timestamp', 'logFile', 'totalLines', 'displayedLines', 'logs']
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'file is required'
            },
            requestId: {
              type: 'string',
              example: '1732686645123-a1b2c3d4e'
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            }
          },
          required: ['error']
        }
      }
    },
    paths: {
      '/health': {
        get: {
          summary: 'Health check',
          description: 'Sprawdzenie, czy API jest aktywne',
          tags: ['System'],
          responses: {
            '200': {
              description: 'API jest uruchomiony',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/HealthResponse'
                  }
                }
              }
            }
          }
        }
      },
      '/logs': {
        get: {
          summary: 'Pobierz ostatnie logi',
          description: 'Zwraca ostatnie logi API w formacie JSON',
          tags: ['Logging'],
          parameters: [
            {
              name: 'lines',
              in: 'query',
              description: 'Liczba ostatnich linii do zwrócenia (default 50)',
              required: false,
              schema: {
                type: 'integer',
                default: 50,
                example: 100
              }
            }
          ],
          responses: {
            '200': {
              description: 'Ostatnie logi API',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/LogResponse'
                  }
                }
              }
            },
            '404': {
              description: 'Plik logów nie istnieje',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        example: 'No logs found'
                      }
                    }
                  }
                }
              }
            },
            '500': {
              description: 'Błąd podczas czytania logów'
            }
          }
        }
      },
      '/generate-invoice': {
        post: {
          summary: 'Generuj fakturę PDF',
          description: 'Generuje plik PDF z faktury na podstawie danych XML',
          tags: ['Invoice'],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    file: {
                      type: 'string',
                      format: 'binary',
                      description: 'Plik XML z danymi faktury'
                    },
                    additionalData: {
                      type: 'string',
                      description: [
                        'Dodatkowe dane w formacie JSON przekazywane jako string.',
                        'Struktura obiektu:',
                        '- nrKSeF (string, wymagane): Numer identyfikacyjny dokumentu w KSeF.',
                        '- qrCode (string, opcjonalne): Gotowy do wydruku tekst QR kodu.',
                        '- qrCode2 (string, opcjonalne): Drugi kod QR wymagany w trybie offline (KOD II – certyfikat) opisany w dokumentacji KSeF.',
                        '- isMobile (boolean, opcjonalne): Flaga wymuszająca layout mobilny.',
                        'Przykład: {"nrKSeF":"123456789012345678","qrCode":"...","qrCode2":"...","isMobile":true}'
                      ].join('\n'),
                      example: '{"nrKSeF":"123456789012345678","qrCode":"https://ksef-test.mf.gov.pl/client-app/invoice/...","qrCode2":"https://ksef-test.mf.gov.pl/client-app/certificate/..."}'
                    }
                  },
                  required: ['file', 'additionalData']
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Plik PDF faktury',
              content: {
                'application/pdf': {}
              }
            },
            '400': {
              description: 'Błąd w parametrach żądania',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse'
                  }
                }
              }
            },
            '500': {
              description: 'Błąd podczas generowania faktury',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: []
};

export const specs = swaggerJsdoc(options);
