export const environment = {
    hasRefresh: false,
    refreshTime: 30,
    baseUrl: 'http://localhost:3000/api',  // http://localhost:3000/api  //  https://cloudinary-backend-iota.vercel.app/api
    formUlr: '/images/send-mail',
    imagesUrl:`/images`,
    icons: {
      logo: `assets/logo/logo.gif`,
      nameGif: 'assets/home/name.gif',
      lNameGif: 'assets/home/surname.gif',
      contactImg: 'assets/contacts/contactImg.png',
    },
    user: {
      nick: 'Isatis',
      firstName: 'Isabella',
      lastName: 'Laurenzi',
      imageUrl: 'assets/personal/artist.gif',
      
      instagram: {
          nick: '@isatis.illustration',
          icon: 'instagram',
          link: 'https://www.instagram.com/isatis.illustration'
      },
      email: {
          email: 'laurenzi.isabella@gmail.com',
          icon: 'contacts',
          subject: `Richiesta Informazioni Portfolio`,
          body: `Ciao, ho dato un’occhiata alle tue illustrazioni.
            
Vorrei sapere di più su come lavori e magari parlare di un’idea che ho in mente.`,
      },
      telegram:{
          nick: 'isatis.illustration',
          icon: 'telegram',
          link: 'https://t.me/isatis_illustration',
      },
      
      description:{
          it: `<b>Chi sono:</b>
            
          Ciao! Sono Isabella, mio nome artistico è Isatis, un piccolo fiore da cui si estrae un colorante blu, a cui sono affezionata sin da piccola. Dopo la laurea in Scienze della Formazione, con indirizzo per l’educazione dell’infanzia, ho deciso di seguire la mia vera vocazione: raccontare storie attraverso le immagini.

Attualmente studio animazione alla Scuola Internazionale di Comics a Roma, un percorso che mi sta aiutando a rendere il mio stile più dinamico e narrativo.
Lavoro con passione su personaggi, ambienti e narrazioni visive, sperimentando tecniche e linguaggi diversi.

Il mio obiettivo è lavorare nell’ambito dell’illustrazione editoriale, con particolare interesse per l’editoria per l’infanzia, poiché credo fermamente che le immagini abbiano un ruolo educativo potente e possano contribuire alla crescita emotiva e cognitiva dei più piccoli.Ad oggi sono aperta a progetti destinati a pubblici e contesti differenti, alla ricerca di opportunità per crescere, collaborare e dare forma a mondi visivi autentici e coinvolgenti.


<b>Pubblicazioni:</b><ul><li>
    &bull; Copertina illustrata | <i>Benvenuti a Trenta Capre, il paese dell'Amilcare e della Pinuccia</i>  
    &emsp;&emsp;di Cinzia Montagna, Navarra Editore, 2023
  </li><li>
    &bull; Copertina illustrata | <i>Bentornati a Trenta Capre</i>  
    &emsp;&emsp;di Cinzia Montagna, Navarra Editore, in pubblicazione
  </li>
</ul>
`,
            
          en: `<b>About Me:</b>
          
          Hi! I’m Isabella, and my artist name is Isatis, inspired by a small flower that produces a blue dye, which I’ve loved since childhood. After graduating in Educational Sciences with a focus on early childhood, I decided to follow my true passion: telling stories through images.

I’m currently studying animation at the Scuola Internazionale di Comics in Rome, which is helping me make my style more dynamic and narrative. 
I work with enthusiasm on characters, environments, and visual storytelling, experimenting with different techniques and approaches.

My goal is to work in editorial illustration, especially children’s publishing, as I believe images play a powerful educational role and support emotional and cognitive growth. I am open to projects for various audiences and contexts, seeking opportunities to grow, collaborate, and create authentic and engaging visual worlds.


<b>Pubblications:</b><ul><li>
    &bull; Illustrated Cover | <i>Benvenuti a Trenta Capre, il paese dell'Amilcare e della Pinuccia</i>  
    &emsp;&emsp;di Cinzia Montagna, Navarra Editore, 2023
  </li><li>
    &bull; Illustrated Cover | <i>Bentornati a Trenta Capre</i>  
    &emsp;&emsp;di Cinzia Montagna, Navarra Editore, in pubblication
  </li>
</ul>`
      }
    },

}