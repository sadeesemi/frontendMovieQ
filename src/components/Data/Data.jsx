import action from '../../Images/Genrepic/Action.png';
import comedy from '../../Images/Genrepic/Comedy.png';
import adventure from '../../Images/Genrepic/Adventure.png';
import horror from '../../Images/Genrepic/Horror.png';
import mystery from '../../Images/Genrepic/Mystery.png';
import drama from '../../Images/Genrepic/Drama.png';
import romance from '../../Images/Genrepic/Romance.png';
import thriller from '../../Images/Genrepic/Thriller.png';
import historical from '../../Images/Genrepic/History.png';
import GuyRitchie from '../../Images/Moviepic/GuyRitchie.jpg';
import MysticRiver from '../../Images/Moviepic/MysticRiver.jpg';
import Megan from '../../Images/Moviepic/Megan.jpg';
import EnterTheWiLd from '../../Images/Moviepic/EnterTheWild.jpg';
import Jumanji from '../../Images/Moviepic/Jumanji.jpg';
import TheJungleCruise from '../../Images/Moviepic/TheJungleCruise.jpg';
import CallmeByyourName from '../../Images/Moviepic/CallmeByyourName.jpg';
import AQuietPlace from '../../Images/Moviepic/AQuietPlace.jpg';
import YourFalt from '../../Images/Moviepic/YourFalt.jpg';
import Charlie from '../../Images/Moviepic/Charlie.jpg';
import InTheHeartofSea from '../../Images/Moviepic/InTheHeartofSea.jpg';
import EnolaHolmes from '../../Images/Moviepic/EnolaHolmes.jpg';
import ArmyofThieves from '../../Images/Moviepic/ArmyofThieves.jpg';
import TheNorthman from '../../Images/Moviepic/TheNorthman.jpg';
import Dora from '../../Images/Moviepic/Dora.jpg';
import Avatar from '../../Images/Moviepic/Avatar.jpg';
import IntoTheWoods from '../../Images/Moviepic/IntoTheWoods.jpg';
import Maleficent from '../../Images/Moviepic/Maleficent.jpg';
import Cinderella from '../../Images/Moviepic/Cinderella.jpg';
import TheNun from '../../Images/Moviepic/TheNun.jpg';


export const genres = [
  { id: 'action', name: 'Action', image: action },
  { id: 'comedy', name: 'Comedy', image: comedy },
  { id: 'adventure', name: 'Adventure', image: adventure },
  { id: 'horror', name: 'Horror', image: horror },
  { id: 'mystery', name: 'Mystery', image: mystery },
  { id: 'drama', name: 'Drama', image: drama },
  { id: 'romance', name: 'Romance', image: romance },
  { id: 'thriller', name: 'Thriller', image: thriller },
  { id: 'historical', name: 'Historical', image: historical }
];
  
export const movies = [
  {
      "id": "1",
      "title": "Guy Ritchie's The Covenant",
      "genre": "action",
      "genres": ["Action", "Thriller"],
      "image": GuyRitchie,
      "rating": 4.5,
      "year": 2023,
      "synopsis": "Guy Ritchie's The Covenant follows the story of a U.S. Army sergeant who forms an unexpected bond with an Afghan interpreter while on a dangerous mission. After the interpreter saves the sergeant's life, the sergeant must return the favor by rescuing him and his family from the Taliban's deadly pursuit. This action-packed thriller dives into the themes of loyalty, sacrifice, and friendship amidst a high-stakes war zone.",
      "cast": ["Jake Gyllenhaal", "Dar Salim", "Antony Starr", "Alexander Ludwig"],
      "director": "Guy Ritchie",
      "country": "United States",
      "duration": "2h 3m",
    "releaseDate": "2023-03-10",
      "reviews": [
          {
              "id": "1",
              "userName": "Emily S.",
              "rating": 4.5,
              "comment": "Absolutely stunning cinematography and a beautiful story!",
              "date": "2024-03-15"
          },
          {
              "id": "2",
              "userName": "Alex M.",
              "rating": 5,
              "comment": "One of the best action films I've seen this year!",
              "date": "2024-03-14"
          },
          {
              "id": "3",
              "userName": "Jordan P.",
              "rating": 4,
              "comment": "Great character development and world-building.",
              "date": "2024-03-13"
          }
      ]
  },
    {
      "id": "2",
      "title": "Mystic River",
      "genre": "thriller",
      "genres": ["Thriller", "Mystery", "Drama"],
      "image": MysticRiver,
      "rating": 4.2,
      "year": 2003,
      "synopsis": "Three childhood friends—Jimmy, Sean, and Dave—are reunited by a tragic event that forces them to confront their past and the dark secrets they’ve buried. When Jimmy’s daughter is murdered, Sean, now a detective, investigates the case while Dave, a troubled man with a mysterious past, becomes the prime suspect. As the investigation unfolds, hidden wounds resurface, leading to devastating consequences. *Mystic River* is a gripping tale of crime, loss, and the haunting power of unresolved trauma, set against the gritty backdrop of Boston.",
      "cast": ["Sean Penn", "Tim Robbins", "Kevin Bacon", "Laura Linney", "Marcia Gay Harden", "Laurence Fishburne"],
      "director": "Clint Eastwood",
      "country": "United States",
      "duration": "2h 18min",
      "releaseDate": "2003-03-10",
      "reviews": [
          {
              "id": "1",
              "userName": "Chris D.",
              "rating": 4,
              "comment": "A gripping mystery with plenty of twists.",
              "date": "2023-11-10"
          },
          {
              "id": "2",
              "userName": "Sam K.",
              "rating": 4.5,
              "comment": "Intense and unpredictable from start to finish.",
              "date": "2023-11-09"
          },
          {
              "id": "3",
              "userName": "Dana F.",
              "rating": 4,
              "comment": "The plot was engaging but the ending left me wanting more.",
              "date": "2023-11-08"
          },
          {
              "id": "4",
              "userName": "Michael R.",
              "rating": 5,
              "comment": "Phenomenal performances, especially by Sean Penn and Tim Robbins!",
              "date": "2023-11-07"
          },
          {
              "id": "5",
              "userName": "Jessica T.",
              "rating": 4.5,
              "comment": "A haunting and powerful crime drama that stays with you.",
              "date": "2023-11-06"
          }
      ]
  },
  {
    "id": "3",
    "title": "M3GAN",
    "genre": "horror",
    "genres": ["Horror", "Thriller", "Mystery"],
    "image": Megan,
    "rating": 6.4,
    "year": 2022,
    "synopsis": "M3GAN is a life-like AI doll designed to be a child's greatest companion and a parent's best ally. Created by a brilliant roboticist, Gemma, at a cutting-edge toy company, M3GAN is programmed to learn and evolve. However, when Gemma gains custody of her orphaned niece, she decides to test M3GAN as a caregiver—leading to horrifying consequences as the doll becomes self-aware and stops at nothing to protect her new friend, no matter the cost.",
    "cast": ["Allison Williams", "Violet McGraw", "Amie Donald", "Jenna Davis", "Ronny Chieng"],
    "director": "Gerard Johnstone",
    "country": "United States",
    "duration": "1h 42min",
    "releaseDate": "2022-03-10",
    "reviews": [
        {
            "id": "1",
            "userName": "Tina R.",
            "rating": 4,
            "comment": "Creepy and entertaining! The perfect blend of horror and dark humor.",
            "date": "2023-01-10"
        },
        {
            "id": "2",
            "userName": "Mark L.",
            "rating": 4.5,
            "comment": "M3GAN is a modern horror icon in the making. Loved the tension!",
            "date": "2023-01-09"
        },
        {
            "id": "3",
            "userName": "Rick M.",
            "rating": 3.5,
            "comment": "Some parts felt predictable, but overall a fun horror flick!",
            "date": "2023-01-08"
        },
        {
            "id": "4",
            "userName": "Sophia W.",
            "rating": 5,
            "comment": "An absolute must-watch for horror and sci-fi fans!",
            "date": "2023-01-07"
        }
    ]
},

{
  id: '4',
  title: 'Enter the Wild',
  genre: 'horror',
  genres: ['Horror', 'Thriller', 'Adventure'],
  image: EnterTheWiLd,
  rating: 3.9,
  year: 2018,
  synopsis: 'A group of friends embark on a hiking adventure into the wilderness, only to discover that the forest holds terrifying secrets. What begins as an exciting escape turns into a nightmare as they realize they are not alone.',
  cast: ['Ben Geurens', 'Ryan Johnson', 'Ella Scott Lynch', 'Socratis Otto'],
  director: 'Mark Forstmann',
  country: 'Australia',
  duration: '1h 36min',
  releaseDate: "2018-03-10",
  reviews: [
      {
          id: '1',
          userName: 'James R.',
          rating: 4,
          comment: 'A thrilling and eerie take on survival horror!',
          date: '2019-02-15'
      },
      {
          id: '2',
          userName: 'Sophia L.',
          rating: 3.5,
          comment: 'The suspense was great, but the ending felt rushed.',
          date: '2019-02-14'
      },
      {
          id: '3',
          userName: 'Daniel W.',
          rating: 4,
          comment: 'Creepy atmosphere and solid performances.',
          date: '2019-02-13'
      }
  ]
}
,
{
  id: '5',
  title: 'Jumanji: The Next Level',
  genre: 'adventure',
  genres: ['Adventure', 'Comedy', 'Drama'],
  image: Jumanji,
  rating: 4.2,
  year: 2019,
  synopsis: 'The gang returns to Jumanji, but the game has changed. As they re-enter the world to rescue one of their own, they must navigate unknown dangers, new levels, and a game that’s more unpredictable than ever.',
  cast: ['Dwayne Johnson', 'Kevin Hart', 'Jack Black', 'Karen Gillan', 'Awkwafina', 'Nick Jonas', 'Danny DeVito', 'Danny Glover'],
  director: 'Jake Kasdan',
  country: 'United States',
  duration: '2h 3min',
  releaseDate: "2019-03-10",
  reviews: [
      {
          id: '1',
          userName: 'Emily R.',
          rating: 4.5,
          comment: 'A fantastic sequel with even more laughs and action!',
          date: '2019-12-15'
      },
      {
          id: '2',
          userName: 'Jason M.',
          rating: 4,
          comment: 'Great performances and hilarious moments. A fun ride!',
          date: '2019-12-14'
      },
      {
          id: '3',
          userName: 'Sophia T.',
          rating: 4,
          comment: 'The new characters added a fresh twist to the adventure!',
          date: '2019-12-13'
      }
  ]
}
,
{
  id: '6',
  title: 'Jungle Cruise',
  genre: 'adventure',
  genres: ['Adventure', 'Action', 'Drama'],
  image: TheJungleCruise,
  rating: 4.2,
  year: 2021,
  synopsis: 'A daring riverboat captain and a fearless scientist embark on a thrilling expedition through the Amazon jungle in search of an ancient tree with unparalleled healing properties.',
  cast: ['Dwayne Johnson', 'Emily Blunt', 'Jack Whitehall'],
  director: 'Jaume Collet-Serra',
  country: 'United States',
  duration: '2h 7min',
  releaseDate: "2021-03-10",
  reviews: [
      {
          id: '1',
          userName: 'Chris B.',
          rating: 4.0,
          comment: 'A fun and adventurous ride!',
          date: '2021-08-01'
      },
      {
          id: '2',
          userName: 'Megan S.',
          rating: 4.5,
          comment: 'Great action sequences and chemistry between the leads!',
          date: '2021-07-30'
      },
      {
          id: '3',
          userName: 'Alex R.',
          rating: 4.2,
          comment: 'A classic adventure with a touch of magic.',
          date: '2021-07-29'
      }
  ]
}
,
{
  id: '7',
  title: 'Call Me by Your Name',
  genre: 'romance',
  genres: ['Romance', 'Drama'],
  image: CallmeByyourName,
  rating: 4.8,
  year: 2017,
  synopsis: 'In the summer of 1983, a young man experiences the complexities of love and desire as he forms a passionate relationship with an older graduate student.',
  cast: ['Timothée Chalamet', 'Armie Hammer', 'Michael Stuhlbarg'],
  director: 'Luca Guadagnino',
  country: 'Italy',
  duration: '2h 12min',
  releaseDate: "2017-03-10",
  reviews: [
      {
          id: '1',
          userName: 'Sophie L.',
          rating: 5,
          comment: 'A beautifully poignant and heart-wrenching love story.',
          date: '2017-11-21'
      },
      {
          id: '2',
          userName: 'James T.',
          rating: 4.7,
          comment: 'A visually stunning film with incredible performances.',
          date: '2017-11-20'
      },
      {
          id: '3',
          userName: 'Olivia G.',
          rating: 4.8,
          comment: 'A masterpiece that captures the essence of fleeting love.',
          date: '2017-11-19'
      }
  ]
}
,
{
  id: '8',
  title: 'A Quiet Place: Day One',
  genre: 'horror',
  genres: ['Horror', 'Thriller', 'Mystery'],
  image: AQuietPlace,
  rating: 4.2,
  year: 2023,
  synopsis: 'A prequel to *A Quiet Place*, this film explores the origins of the mysterious creatures that hunt by sound, focusing on a family’s fight for survival in a world where silence is their only weapon.',
  cast: ['Emily Blunt', 'Cillian Murphy', 'Djimon Hounsou'],
  director: 'Michael Sarnoski',
  country: 'United States',
  duration: '1h 38min',
  releaseDate: "2023-03-10",
  reviews: [
      {
          id: '1',
          userName: 'Sarah M.',
          rating: 4.3,
          comment: 'A thrilling prequel that intensifies the tension and fear of the original.',
          date: '2023-10-12'
      },
      {
          id: '2',
          userName: 'John R.',
          rating: 4.0,
          comment: 'The suspense is high, though the pacing could have been a bit better.',
          date: '2023-10-11'
      },
      {
          id: '3',
          userName: 'Anna T.',
          rating: 4.1,
          comment: 'A chilling experience that builds on the terrifying world established in the first film.',
          date: '2023-10-10'
      }
  ]
},

{
  id: '9',
  title: 'Your Fault',
  genre: 'romance',
  genres: ['Romance', 'Drama'],
  image:YourFalt,
  rating: 4.3,
  year: 2024,
  synopsis:
    'Noah and Nick’s love is tested as new secrets, college life, and family pressures threaten to tear them apart.',
  cast: ['Nicole Wallace', 'Gabriel Guevara', 'Marta Hazas'],
  director: 'Domingo González',
  country: 'Spain',
  duration: '1h 47min',
  releaseDate: "2024-03-10",
  reviews: [
    {
      id: '1',
      userName: 'Sara L.',
      rating: 4.5,
      comment:
        'An emotional rollercoaster with amazing chemistry!',
      date: '2024-12-28'
    },
    {
      id: '2',
      userName: 'Daniel P.',
      rating: 4.2,
      comment:
        'A worthy sequel that keeps you hooked.',
      date: '2024-12-29'
    },
    {
      id: '3',
      userName: 'Emma R.',
      rating: 4.3,
      comment:
        'Loved the drama and romance!',
      date: '2024-12-30'
    }
  ]
}
,
{
  id: '10',
  title: 'Charlie and the Chocolate Factory',
  genre: 'comedy',
  genres: ['Comedy', 'Adventure'],
  image:Charlie,
  rating: 4.2,
  year: 2005,
  synopsis:
    'Charlie Bucket, a kind-hearted boy from a poor family, wins a golden ticket to visit the magical Wonka Chocolate Factory, owned by the eccentric Willy Wonka. '
    + 'Inside, he embarks on an unforgettable adventure filled with wonders, mischievous Oompa Loompas, and a series of moral tests that determine who is truly deserving of Wonka’s ultimate prize. '
    + 'With fantastical candy inventions, lessons in humility, and a heartwarming conclusion, this timeless tale explores the power of imagination, kindness, and family values.',
  cast: ['Johnny Depp', 'Freddie Highmore', 'Helena Bonham Carter', 'David Kelly', 'Deep Roy'],
  director: 'Tim Burton',
  country: 'United States',
  duration: '1h 55min',
  releaseDate: "2005-03-10",
  reviews: [
    {
      id: '1',
      userName: 'Sophia W.',
      rating: 4.5,
      comment:
        'A magical and visually stunning adaptation!',
      date: '2005-07-16'
    },
    {
      id: '2',
      userName: 'James R.',
      rating: 4.0,
      comment:
        'Johnny Depp’s take on Wonka is unique and intriguing.',
      date: '2005-07-15'
    },
    {
      id: '3',
      userName: 'Emma T.',
      rating: 4.2,
      comment:
        'A fun, whimsical journey that stays true to the book’s heart!',
      date: '2005-07-14'
    },
    {
      id: '4',
      userName: 'Liam D.',
      rating: 4.3,
      comment:
        'The Oompa Loompa songs were fantastic!',
      date: '2005-07-13'
    }
  ]
}
,
{
  id: '11',
  title: 'In the Heart of the Sea',
  genre: 'historical',
  genres: ['Historical', 'Drama', 'Adventure'],
  image:InTheHeartofSea,
  rating: 4.3,
  year: 2015,
  synopsis:
    'Based on the true story that inspired Moby-Dick, this gripping tale follows the crew of the whaling ship Essex, which was attacked by a massive sperm whale in 1820. '
    + 'Stranded in the Pacific Ocean, the surviving crew must battle starvation, storms, and despair while struggling to return home. '
    + 'As they confront the limits of their endurance and morality, their harrowing journey becomes a legendary tale of survival and the cost of human ambition.',
  cast: ['Chris Hemsworth', 'Benjamin Walker', 'Cillian Murphy', 'Tom Holland', 'Brendan Gleeson'],
  director: 'Ron Howard',
  country: 'United States',
  duration: '2h 2min',
  releaseDate: "2015-03-10",
  reviews: [
    {
      id: '1',
      userName: 'David G.',
      rating: 4.5,
      comment:
        'A breathtaking survival story with powerful performances.',
      date: '2015-12-12'
    },
    {
      id: '2',
      userName: 'Lisa M.',
      rating: 4.2,
      comment:
        'Visually stunning and emotionally intense.',
      date: '2015-12-11'
    },
    {
      id: '3',
      userName: 'James T.',
      rating: 4.0,
      comment:
        'A gripping retelling of a tragic yet fascinating event.',
      date: '2015-12-10'
    },
    {
      id: '4',
      userName: 'Emily R.',
      rating: 4.4,
      comment:
        'Hemsworth delivers a fantastic performance in this epic survival tale!',
      date: '2015-12-09'
    }
  ]
},
{
  id: '12',
  title: 'The Northman',
  genre: 'action',
  genres: ['Action', 'Adventure', 'Drama','Historical'],
  image:TheNorthman,
  rating: 4.4,
  year: 2022,
  synopsis:
    'A Viking prince embarks on a relentless quest to avenge his father’s murder and reclaim his rightful throne. '
    + 'Set in the brutal and mystical world of 10th-century Scandinavia, this epic tale follows Amleth as he battles fate, betrayal, and his own inner demons.',
  cast: ['Alexander Skarsgård', 'Nicole Kidman', 'Anya Taylor-Joy', 'Ethan Hawke', 'Willem Dafoe'],
  director: 'Robert Eggers',
  country: 'United States',
  duration: '2h 17min',
  releaseDate: "2022-03-10",
  reviews: [
    {
      id: '1',
      userName: 'Liam K.',
      rating: 4.7,
      comment:
        'A visually stunning and brutally immersive Viking epic!',
      date: '2022-04-23'
    },
    {
      id: '2',
      userName: 'Emma J.',
      rating: 4.3,
      comment:
        'Incredible cinematography and a gripping revenge story.',
      date: '2022-04-22'
    },
    {
      id: '3',
      userName: 'Noah B.',
      rating: 4.2,
      comment:
        'Intense and atmospheric, with a powerful lead performance.',
      date: '2022-04-21'
    },
    {
      id: '4',
      userName: 'Sophia R.',
      rating: 4.5,
      comment:
        'A masterpiece of historical storytelling and action.',
      date: '2022-04-20'
    }
  ]
}
,
{
  id: '13',
  title: 'Army of Thieves',
  genre: 'action',
  genres: ['Action', 'Romance', 'Thriller'],
  image:ArmyofThieves,
  rating: 6.4,
  year: 2021,
  synopsis:
    'In this prequel to "Army of the Dead," a small-town bank teller is recruited by a mysterious woman to join a team of criminals attempting to pull off a legendary heist of Europe’s most secure safes.',
  cast: ['Matthias Schweighöfer', 'Nathalie Emmanuel', 'Ruby O. Fee', 'Stuart Martin'],
  director: 'Matthias Schweighöfer',
  country: 'United States',
  duration: '2h 7min',
  releaseDate: "2021-03-10",
  reviews: [
    {
      id: '1',
      userName: 'Jack T.',
      rating: 6.5,
      comment: 'A fun and stylish heist film with great humor.',
      date: '2021-10-29'
    },
    {
      id: '2',
      userName: 'Sarah W.',
      rating: 6.3,
      comment: 'A unique take on the heist genre with engaging characters.',
      date: '2021-10-28'
    },
    {
      id: '3',
      userName: 'Lucas M.',
      rating: 6.4,
      comment: 'Entertaining and fast-paced, but lacks deep character development.',
      date: '2021-10-27'
    }
  ]
}
,
{
  id: '14',
  title: 'Enola Holmes',
  genre: 'mystery',
  genres: ['Mystery', 'Adventure', 'Drama'],
  image:EnolaHolmes,
  rating: 6.6,
  year: 2020,
  synopsis:
    'When her mother mysteriously disappears, young Enola Holmes, the sister of Sherlock Holmes, sets out on a thrilling adventure to uncover the truth while outsmarting her famous brother.',
  cast: ['Millie Bobby Brown', 'Henry Cavill', 'Sam Claflin', 'Helena Bonham Carter'],
  director: 'Harry Bradbeer',
  country: 'United States',
  duration: '2h 3min',
  releaseDate: "2020-03-10",
  reviews: [
    {
      id: '1',
      userName: 'Alice D.',
      rating: 6.8,
      comment: 'A fun and engaging take on the Sherlock Holmes universe.',
      date: '2020-09-23'
    },
    {
      id: '2',
      userName: 'James H.',
      rating: 6.5,
      comment: 'Millie Bobby Brown shines as the lead in this adventurous mystery.',
      date: '2020-09-22'
    },
    {
      id: '3',
      userName: 'Sophia L.',
      rating: 6.6,
      comment: 'Charming and entertaining, though a bit predictable at times.',
      date: '2020-09-21'
    }
  ]
}
,
{
  id: '15',
  title: 'Dora and the Lost City of Gold',
  genre: 'adventure',
  genres: ['Adventure', 'Drama', 'Comedy','Mystery'],
  image:Dora ,
  rating: 6.1,
  year: 2019,
  synopsis:
    'Dora, a teenage explorer, embarks on a thrilling adventure to rescue her parents and solve the mystery of the Lost City of Gold.',
  cast: ['Isabela Moner', 'Eugenio Derbez', 'Michael Peña', 'Eva Longoria'],
  director: 'James Bobin',
  country: 'United States',
  duration: '1h 42min',
  releaseDate: "2019-03-10",
  reviews: [
    {
      id: '1',
      userName: 'Liam K.',
      rating: 6.5,
      comment: 'A fun and energetic adaptation of the beloved animated series.',
      date: '2019-08-11'
    },
    {
      id: '2',
      userName: 'Sophia W.',
      rating: 6.0,
      comment: 'Great family entertainment with humor and action.',
      date: '2019-08-10'
    },
    {
      id: '3',
      userName: 'Noah J.',
      rating: 5.8,
      comment: 'Surprisingly enjoyable with a good mix of adventure and comedy.',
      date: '2019-08-09'
    }
  ]
}
,{
  id: '16',
  title: 'Avatar',
  genre: 'Adventure',
  genres: ['Drama', 'Action', 'Adventure'],
  image: Avatar,
  rating: 7.8,
  year: 2009,
  synopsis:
    'A paraplegic former Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following his orders and protecting the world he feels is his home.',
  cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver', 'Stephen Lang'],
  director: 'James Cameron',
  country: 'United States',
  duration: '2h 42min',
  releaseDate: "2009-03-10",
  reviews: [
    {
      id: '1',
      userName: 'Ethan T.',
      rating: 8.0,
      comment: 'An epic visual experience that changed cinema forever.',
      date: '2009-12-18'
    },
    {
      id: '2',
      userName: 'Grace P.',
      rating: 7.5,
      comment: 'A groundbreaking film with incredible world-building and stunning visuals.',
      date: '2009-12-17'
    },
    {
      id: '3',
      userName: 'Lucas R.',
      rating: 8.2,
      comment: 'An immersive and captivating story with breathtaking CGI.',
      date: '2009-12-16'
    }
  ]
}
,
{
  id: '17',
  title: 'Into the Woods',
  genre: '  Adventure',
  genres: ['Drama', 'Mystery', 'Adventure'],
  image: IntoTheWoods,
  rating: 7.6,
  year: 2024,
  synopsis:
    'A modern twist on the classic fairy tales, where characters like Cinderella, Little Red Riding Hood, and Jack interact in a magical forest.',
  cast: ['Meryl Streep', 'Emily Blunt', 'James Corden'],
  director: 'Rob Marshall',
  country: 'United States',
  duration: '2h 5min',
  releaseDate: "2024-03-10",
  reviews: [
    {
      id: '1',
      userName: 'Lucy K.',
      rating: 8.0,
      comment: 'A spellbinding and enchanting musical with memorable performances!',
      date: '2024-01-20'
    },
    {
      id: '2',
      userName: 'Matthew J.',
      rating: 7.5,
      comment: 'A fantastic journey through fairy tales, with an engaging twist on each character.',
      date: '2024-01-19'
    },
    {
      id: '3',
      userName: 'Sophia R.',
      rating: 7.8,
      comment: 'A beautifully crafted film full of adventure, music, and emotional depth.',
      date: '2024-01-18'
    }
  ]
}
,
{
  id: '18',
  title: 'Maleficent',
  genre: 'drama',
  genres: ['Drama', 'Adventure', 'Action'],
  image:Maleficent,
  rating: 7.0,
  year: 2014,
  synopsis:
    'The untold story of Disney’s iconic villain, Maleficent, and how she became the dark fairy who cursed Princess Aurora.',
  cast: ['Angelina Jolie', 'Elle Fanning', 'Sharlto Copley'],
  director: 'Robert Stromberg',
  country: 'United States',
  duration: '1h 37min',
  releaseDate: "2014-03-10",
  reviews: [
    {
      id: '1',
      userName: 'Mia P.',
      rating: 8.2,
      comment: 'A visually stunning reimagining of a classic fairy tale with a powerful performance by Angelina Jolie.',
      date: '2014-05-30'
    },
    {
      id: '2',
      userName: 'Liam S.',
      rating: 7.5,
      comment: 'A dark, yet captivating tale of love, betrayal, and redemption.',
      date: '2014-05-29'
    },
    {
      id: '3',
      userName: 'Sophie M.',
      rating: 7.0,
      comment: 'A beautifully crafted movie with excellent visuals and a compelling backstory.',
      date: '2014-05-28'
    }
  ]
}
,
{
  id: '19',
  title: 'Cinderella ',
  genre: 'romance',
  genres: ['Romance', 'Drama'],
  image: Cinderella,
  rating: 4.2,
  year: 2021,
  synopsis:
    'Cinderella, an ambitious young woman, is determined to leave her stepmother’s home and pursue her dream of becoming a designer, with the help of her fairy godmother.',
  cast: ['Camila Cabello', 'Idina Menzel', 'Nicholas Galitzine'],
  director: 'Kay Cannon',
  country: 'United States',
  duration: '1h 53min',
  releaseDate: "2021-03-10",
  reviews: [
    {
      id: '1',
      userName: 'Olivia M.',
      rating: 4.3,
      comment: 'A fresh take on the classic fairy tale with fun music and vibrant performances.',
      date: '2021-09-03'
    },
    {
      id: '2',
      userName: 'Ava C.',
      rating: 4.0,
      comment: 'A charming and modernized version of Cinderella with catchy songs.',
      date: '2021-09-02'
    },
    {
      id: '3',
      userName: 'Ben P.',
      rating: 4.4,
      comment: 'The music was fantastic, and the performances were delightful. A must-watch for musical fans!',
      date: '2021-09-01'
    }
  ]
}
,
{
  id: '20',
  title: 'The Nun',
  genre: 'horror',
  genres: ['Horror', 'Mystery', 'Thriller'],
  image: TheNun,
  rating: 4.2,
  year: 2023,
  synopsis: 'A young nun faces a malevolent force in a remote convent, uncovering dark secrets of an ancient evil.',
  cast: ['Taissa Farmiga', 'Demián Bichir', 'Jonny L.'],
  director: 'Corin Hardy',
  country: 'United States',
  duration: '1h 36min',
  releaseDate: "2023-03-10",
  reviews: [
    {
      id: '1',
      userName: 'Ashley T.',
      rating: 4.3,
      comment: 'A creepy and atmospheric horror film that will leave you questioning everything.',
      date: '2023-09-10'
    },
    {
      id: '2',
      userName: 'George R.',
      rating: 4.0,
      comment: 'Chilling, with an eerie sense of dread throughout. Some great scares!',
      date: '2023-09-12'
    },
    {
      id: '3',
      userName: 'Sarah P.',
      rating: 4.2,
      comment: 'A dark and suspenseful journey into terror. Definitely worth a watch for horror lovers.',
      date: '2023-09-11'
    }
  ]
}

  
];
  
  export const getMoviesByGenre = (genreId) => {
    return movies.filter(movie => movie.genre === genreId);
  };
  
  export const getMovieById = (id) => {
    return movies.find(movie => movie.id === id);
  };
  
  export const addReview = (movieId, review) => {
    const movie = movies.find(m => m.id === movieId);
    if (movie) {
      const newReview = {
        ...review,
        id: `${movie.reviews.length + 1}`,
        date: new Date().toISOString().split('T')[0]
      };
      movie.reviews.unshift(newReview);
      
      // Update movie rating
      const totalRating = movie.reviews.reduce((sum, r) => sum + r.rating, 0);
      movie.rating = Number((totalRating / movie.reviews.length).toFixed(1));
    }
  };
  
  export const updateReview = (movieId, reviewId, updatedReviewData) => {
    const movie = movies.find(m => m.id === movieId);
    if (movie) {
      const reviewIndex = movie.reviews.findIndex(r => r.id === reviewId);
      if (reviewIndex !== -1) {
        movie.reviews[reviewIndex] = {
          ...movie.reviews[reviewIndex],
          ...updatedReviewData,
          // Update the review date to the current date
          date: new Date().toISOString().split('T')[0],
        };
        // Recalculate movie rating
        const totalRating = movie.reviews.reduce((sum, r) => sum + r.rating, 0);
        movie.rating = Number((totalRating / movie.reviews.length).toFixed(1));
      }
    }
  };

  export const getMoviesWithReviews = () => {
    return movies.filter(movie => movie.reviews && movie.reviews.length > 0);
  };

  export function updateMovie(movieId, updatedMovie) {
  const movies = JSON.parse(localStorage.getItem('movies')) || [];
  const index = movies.findIndex(m => m.id === movieId);
  if (index !== -1) {
    movies[index] = updatedMovie;
    localStorage.setItem('movies', JSON.stringify(movies));
  }
}
