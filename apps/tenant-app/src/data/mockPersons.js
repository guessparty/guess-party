// Données de test pour le jeu
// Plus tard, ces données viendront de Firebase
export const mockPersons = [
  {
    id: 1,
    name: 'Sophie Martin',
    photo: 'https://i.pravatar.cc/300?img=1',
    characteristics: {
      age: '28 ans',
      city: 'Paris',
      job: 'Designer',
      hobby: 'Photographie',
      favoriteColor: 'Bleu',
      relationship: 'Amie du lycée'
    }
  },
  {
    id: 2,
    name: 'Thomas Dubois',
    photo: 'https://i.pravatar.cc/300?img=12',
    characteristics: {
      age: '32 ans',
      city: 'Lyon',
      job: 'Développeur',
      hobby: 'Gaming',
      favoriteColor: 'Vert',
      relationship: 'Collègue de bureau'
    }
  },
  {
    id: 3,
    name: 'Julie Petit',
    photo: 'https://i.pravatar.cc/300?img=5',
    characteristics: {
      age: '25 ans',
      city: 'Marseille',
      job: 'Infirmière',
      hobby: 'Yoga',
      favoriteColor: 'Rose',
      relationship: 'Cousine'
    }
  },
  {
    id: 4,
    name: 'Marc Leroux',
    photo: 'https://i.pravatar.cc/300?img=15',
    characteristics: {
      age: '35 ans',
      city: 'Bordeaux',
      job: 'Chef cuisinier',
      hobby: 'Cuisine',
      favoriteColor: 'Rouge',
      relationship: 'Ami d\'enfance'
    }
  },
  {
    id: 5,
    name: 'Emma Moreau',
    photo: 'https://i.pravatar.cc/300?img=9',
    characteristics: {
      age: '30 ans',
      city: 'Toulouse',
      job: 'Professeure',
      hobby: 'Lecture',
      favoriteColor: 'Violet',
      relationship: 'Voisine'
    }
  }
]

// Fonction pour obtenir la personne du jour
// En fonction de la date, on sélectionne toujours la même personne
export const getDailyPerson = () => {
  // Obtenir la date du jour (sans l'heure)
  const today = new Date()
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24)
  
  // Sélectionner une personne en fonction du jour de l'année
  // Le % (modulo) permet de boucler sur le tableau
  const index = dayOfYear % mockPersons.length
  return mockPersons[index]
}

// Fonction pour obtenir la date du jour au format texte
export const getTodayDate = () => {
  return new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
