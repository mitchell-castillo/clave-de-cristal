// Six original fixed puzzles. Counts are aggregate, never tied to individual slots.
export const STAGES = [
  {
    "id": 0,
    "name": "Umbral de cuarzo",
    "subtitle": "Aprende a leer la luz.",
    "palette": 4,
    "length": 3,
    "secret": [
      1,
      3,
      0
    ],
    "limit": 6,
    "clues": [
      {
        "code": [
          0,
          3,
          2
        ],
        "exact": 1,
        "misplaced": 1
      },
      {
        "code": [
          0,
          1,
          3
        ],
        "exact": 0,
        "misplaced": 3
      }
    ]
  },
  {
    "id": 1,
    "name": "Jardín de amatista",
    "subtitle": "Un símbolo puede faltar.",
    "palette": 5,
    "length": 3,
    "secret": [
      4,
      1,
      3
    ],
    "limit": 6,
    "clues": [
      {
        "code": [
          0,
          3,
          1
        ],
        "exact": 0,
        "misplaced": 2
      },
      {
        "code": [
          0,
          2,
          4
        ],
        "exact": 0,
        "misplaced": 1
      },
      {
        "code": [
          0,
          4,
          1
        ],
        "exact": 0,
        "misplaced": 2
      }
    ]
  },
  {
    "id": 2,
    "name": "Bóveda de ámbar",
    "subtitle": "Cuatro lugares, una sola clave.",
    "palette": 5,
    "length": 4,
    "secret": [
      2,
      4,
      0,
      3
    ],
    "limit": 7,
    "clues": [
      {
        "code": [
          0,
          1,
          2,
          3
        ],
        "exact": 1,
        "misplaced": 2
      },
      {
        "code": [
          1,
          2,
          0,
          4
        ],
        "exact": 1,
        "misplaced": 2
      },
      {
        "code": [
          0,
          3,
          1,
          4
        ],
        "exact": 0,
        "misplaced": 3
      }
    ]
  },
  {
    "id": 3,
    "name": "Prisma de jade",
    "subtitle": "Seis símbolos cruzan sus pistas.",
    "palette": 6,
    "length": 4,
    "secret": [
      5,
      2,
      4,
      1
    ],
    "limit": 7,
    "clues": [
      {
        "code": [
          0,
          1,
          2,
          3
        ],
        "exact": 0,
        "misplaced": 2
      },
      {
        "code": [
          0,
          4,
          1,
          2
        ],
        "exact": 0,
        "misplaced": 3
      },
      {
        "code": [
          0,
          4,
          3,
          5
        ],
        "exact": 0,
        "misplaced": 2
      },
      {
        "code": [
          2,
          0,
          5,
          3
        ],
        "exact": 0,
        "misplaced": 2
      }
    ]
  },
  {
    "id": 4,
    "name": "Cámara de zafiro",
    "subtitle": "Cinco destellos cambian de lugar.",
    "palette": 6,
    "length": 5,
    "secret": [
      3,
      0,
      5,
      2,
      4
    ],
    "limit": 8,
    "clues": [
      {
        "code": [
          0,
          1,
          3,
          2,
          4
        ],
        "exact": 2,
        "misplaced": 2
      },
      {
        "code": [
          0,
          2,
          5,
          1,
          4
        ],
        "exact": 2,
        "misplaced": 2
      },
      {
        "code": [
          0,
          1,
          4,
          5,
          3
        ],
        "exact": 0,
        "misplaced": 4
      },
      {
        "code": [
          1,
          2,
          3,
          0,
          5
        ],
        "exact": 0,
        "misplaced": 4
      }
    ]
  },
  {
    "id": 5,
    "name": "Corazón de cristal",
    "subtitle": "La última cerradura reúne todo.",
    "palette": 7,
    "length": 5,
    "secret": [
      6,
      2,
      0,
      5,
      3
    ],
    "limit": 8,
    "clues": [
      {
        "code": [
          0,
          1,
          2,
          3,
          5
        ],
        "exact": 0,
        "misplaced": 4
      },
      {
        "code": [
          0,
          4,
          1,
          5,
          6
        ],
        "exact": 1,
        "misplaced": 2
      },
      {
        "code": [
          0,
          6,
          3,
          4,
          5
        ],
        "exact": 0,
        "misplaced": 4
      },
      {
        "code": [
          0,
          3,
          1,
          2,
          4
        ],
        "exact": 0,
        "misplaced": 3
      },
      {
        "code": [
          1,
          3,
          6,
          0,
          2
        ],
        "exact": 0,
        "misplaced": 4
      }
    ]
  }
];
