<script setup lang="ts">


const options = [{
        value: 'email',
        label: 'Email'
        }, {
        value: 'sms',
        label: 'Phone (SMS)'
        }, {
        value: 'push',
        label: 'Push notification'
        }]

const selected = ref('sms');

const data = [
  {
    "id": 44,
    "created_at": "2024-06-26T10:50:59.283567+00:00",
    "type": "mcq",
    "quiz_id": 32,
    "content": {
      "stem": "Wer hat das Kunstwerk \"Andromeda\" geschaffen?",
      "image_url": "https://www.artic.edu/iiif/2/2acf7c4c-d3a9-e4f6-0343-4dcb75ec8b34/full/843,/0/default.jpg",
      "answers_options": [
        {
          "id": "54a4c15d-4921-4c34-b976-7fff99524f93",
          "value": "Pierre-Auguste Renoir"
        },
        {
          "id": "807ffb94-2295-4e78-87de-7cd05526ea8d",
          "value": "Edvard Munch"
        },
        {
          "id": "1d8b56c8-6d62-438f-a724-c6b15b95bf85",
          "value": "Odilon Redon"
        },
        {
          "id": "b2bcf3cf-1b24-440c-a46a-15bb214828dd",
          "value": "Odilon Redon"
        }
      ],
      "correct_answers": [
        {
          "id": "b2bcf3cf-1b24-440c-a46a-15bb214828dd",
          "value": "Odilon Redon"
        }
      ]
    },
    "user_answers": null,
    "answered": null,
    "points": null
  },
  {
    "id": 45,
    "created_at": "2024-06-26T10:50:59.283567+00:00",
    "type": "mcq",
    "quiz_id": 32,
    "content": {
      "stem": "Wer hat das Kunstwerk \"The Laundress\" geschaffen?",
      "image_url": "https://www.artic.edu/iiif/2/98d3c331-a4ef-f4a5-53a4-b9632a0b727c/full/843,/0/default.jpg",
      "answers_options": [
        {
          "id": "60d44c2f-30bd-43f9-9434-5239b920e98f",
          "value": "Pierre-Auguste Renoir"
        },
        {
          "id": "363b15d3-37cc-4010-9850-ff8eef17b459",
          "value": "John Singer Sargent"
        },
        {
          "id": "59998deb-c890-4b61-a76a-f30c32efa944",
          "value": "Pierre-Auguste Renoir"
        },
        {
          "id": "dcd413ec-834f-478a-81a1-6f0cc5c81a8c",
          "value": "Odilon Redon"
        }
      ],
      "correct_answers": [
        {
          "id": "60d44c2f-30bd-43f9-9434-5239b920e98f",
          "value": "Pierre-Auguste Renoir"
        }
      ]
    },
    "user_answers": null,
    "answered": null,
    "points": null
  },
  {
    "id": 46,
    "created_at": "2024-06-26T10:50:59.283567+00:00",
    "type": "mcq",
    "quiz_id": 32,
    "content": {
      "stem": "Wer hat das Kunstwerk \"The Scream\" geschaffen?",
      "image_url": "https://www.artic.edu/iiif/2/3b374643-5328-3e00-c02b-5ab56e5ae8f8/full/843,/0/default.jpg",
      "answers_options": [
        {
          "id": "bb81820b-11b2-4bb7-8e36-e456c21feccd",
          "value": "John Singer Sargent"
        },
        {
          "id": "548462d0-4b8e-464a-9648-47023af51171",
          "value": "Pierre-Auguste Renoir"
        },
        {
          "id": "f5b8e58d-3a55-49d1-bf9e-d64eed82fa8a",
          "value": "Edvard Munch"
        },
        {
          "id": "4f30b3d0-9181-47ec-8397-947d1e61c520",
          "value": "Edvard Munch"
        }
      ],
      "correct_answers": [
        {
          "id": "f5b8e58d-3a55-49d1-bf9e-d64eed82fa8a",
          "value": "Edvard Munch"
        }
      ]
    },
    "user_answers": null,
    "answered": null,
    "points": null
  },
  {
    "id": 47,
    "created_at": "2024-06-26T10:50:59.283567+00:00",
    "type": "mcq",
    "quiz_id": 32,
    "content": {
      "stem": "Wer hat das Kunstwerk \"Madame Léon Clapisson\" geschaffen?",
      "image_url": "https://www.artic.edu/iiif/2/a7af09dc-5743-062e-4802-b6435e67eaa5/full/843,/0/default.jpg",
      "answers_options": [
        {
          "id": "da1c737a-b638-461d-bf3b-36bfbf6b12b4",
          "value": "John Singer Sargent"
        },
        {
          "id": "c70493a9-4b16-40ce-9399-a7b8b850b0c7",
          "value": "Pierre-Auguste Renoir"
        },
        {
          "id": "f27285a8-90f4-42e4-a750-c9a48baa5582",
          "value": "Pierre-Auguste Renoir"
        },
        {
          "id": "9c156e18-69c5-409c-87d2-46a08a684608",
          "value": "Odilon Redon"
        }
      ],
      "correct_answers": [
        {
          "id": "f27285a8-90f4-42e4-a750-c9a48baa5582",
          "value": "Pierre-Auguste Renoir"
        }
      ]
    },
    "user_answers": null,
    "answered": null,
    "points": null
  },
  {
    "id": 48,
    "created_at": "2024-06-26T10:50:59.283567+00:00",
    "type": "mcq",
    "quiz_id": 32,
    "content": {
      "stem": "Wer hat das Kunstwerk \"Thistles\" geschaffen?",
      "image_url": "https://www.artic.edu/iiif/2/79b94ddd-e208-1993-01ab-98f75174fe88/full/843,/0/default.jpg",
      "answers_options": [
        {
          "id": "03351407-83b5-401c-a551-a46f4d13306d",
          "value": "John Singer Sargent"
        },
        {
          "id": "2991759d-2b96-4cbc-862f-c30fb99ea9d3",
          "value": "Pierre-Auguste Renoir"
        },
        {
          "id": "d2f1f0fb-365c-4bfe-9488-b04f6548d679",
          "value": "Odilon Redon"
        },
        {
          "id": "73b23a9f-a1b7-479a-ac91-3dafde4686de",
          "value": "John Singer Sargent"
        }
      ],
      "correct_answers": [
        {
          "id": "73b23a9f-a1b7-479a-ac91-3dafde4686de",
          "value": "John Singer Sargent"
        }
      ]
    },
    "user_answers": null,
    "answered": null,
    "points": null
  }
]

</script>

<template>
  <URadioGroup v-model="selected" legend="Which Artist ..." :options="options" />
</template>