/*********************************************************************************
 * 
 * Ce fichier contient toutes les fonctions nécessaires au fonctionnement du jeu. 
 * 
 *********************************************************************************/

/**
 * Cette fonction permet d'activer ou de désactiver les boutons pour commencer à taper les propositions
 * @param {Object} DictZonesActives : dictionnaire contenant tous les boutons activables
 * @returns {array} : le dictionnaire des zones activables actualisées
 */
function passerBtnModeJeu(DictZonesActives) {
    DictZonesActives.listeBtnRadioSource.forEach(btn => btn.disabled = true);  // Désactiver tous les boutons radio
    DictZonesActives.listeBtnRadioChrono.forEach(btn => btn.disabled = true);
    DictZonesActives.btnValiderOptions.disabled = true;
    DictZonesActives.btnModifierJoueur.disabled = true;
    DictZonesActives.btnClassement.disabled = true;
    DictZonesActives.btnProgression.disabled = true;
    DictZonesActives.btnShare.disabled = true;
    DictZonesActives.inputEcriture.disabled = false;
    inputEcriture.focus(); //sélectionne automatiquement la fenêtre de saisie pour améliorer l'expérience utilisateur
    return DictZonesActives;
}

/**
 * Cette fonction permet d'activer ou de désactiver les boutons pour choisir ses options de jeu et démarrer une partie
 * @param {Object} DictZonesActives : dictionnaire contenant tous les boutons activables
 * @returns {array} : le dictionnaire des zones activables actualisées
 */
function passerBtnModeChoix(DictZonesActives) {
    DictZonesActives.listeBtnRadioSource.forEach(btn => btn.disabled = false);  // activer tous les boutons radio
    DictZonesActives.listeBtnRadioChrono.forEach(btn => btn.disabled = false);
    DictZonesActives.btnValiderOptions.disabled = false;
    DictZonesActives.btnModifierJoueur.disabled = false;
    DictZonesActives.btnClassement.disabled = false;
    DictZonesActives.btnProgression.disabled = false;
    DictZonesActives.btnShare.disabled = false;
    DictZonesActives.inputEcriture.disabled = true; //on désactive la zone de saisie
    return DictZonesActives;
}

/**
 * Cette fonction permet de générer un nombre au hasard compris entre 0 et la longueur de la liste
 * @param {number} longueurListe : longueur de la liste de mots correspondant au chiffre max qui pourra être choisi
 * @returns {number} : la position dans la liste du mot choisi
 */
function creerNombreAleatoire(longueurListe) {
    let nombreAleatoire = Math.floor(Math.random() * longueurListe);
    return nombreAleatoire;
}

/**
 * Cette fonction vérifie si la proposition entrée par l'utilisateur est la bonne, 
 * et augmente le score de 1 le cas échéant
 * @param {number} scoreEnCours : le score de l'utilisateur
 * @param {number} nbAlea : la position dans la liste du mot choisie au hasard
 * @param {array[string]} listeProp : le tableau contenant les touches ou mots à recopier
 * @param {HTMLInputElement} fenetreEcriture : élément input du DOM, proposition écrite par l'utilisateur
 * @returns {number} : le score actualisé
 */
function validerAugmentationScore(scoreEnCours, nbAlea, listeProp, fenetreEcriture) {
    if (fenetreEcriture.value === listeProp[nbAlea]) {
        scoreEnCours++;
    }
    return scoreEnCours;
}

/**
 * Cette fonction affiche le score de l'utilisateur
 * @param {number} scoreEnCours : le score de l'utilisateur
 * @param {number} nbMotsProposes : le nombre de mots proposés à l'utilisateur
 */
function afficherResultat(scoreEnCours, nbMotsProposes) {
    // Récupération de la zone dans laquelle on va écrire le score
    let spanScore = document.querySelector(".zoneScore span");
    //Actualisation du score
    let affichageScore = `${scoreEnCours} / ${nbMotsProposes}`;
    // Mise à jour du span
    spanScore.innerText = affichageScore;
}

/**
 * Cette fonction affiche une barre représentant le score de l'utilisateur
 * elle permet la représentation de 3 barres superposées qui évoluent au fur et à mesure du jeu:
 * une barre "vide" fixe représentant 100% des questions
 * une barre représentant le nombre de questions déjà posées à l'utilisateur représentée en % du total des questions
 * une barre représentant le score représentée en % du total des questions
 * @param {number} scoreEnCours : le score de l'utilisateur
 * @param {number} nbMotsProposes : le nombre de mots proposés à l'utilisateur
 * @param {number} nbItemsVictoire : nombre de mots validés pour gagner
 */
function afficherBarreScore(scoreEnCours, nbMotsProposes, nbItemsVictoire) {
    //Récupération des 2 barres évolutives
    let barreNbProposition = document.querySelector(".barreNbProposition");
    let barreScore = document.querySelector(".barreScore");
    //Calcul de la progression des barres vers la droite en % : la position absolue des barres 
    // se rapproche du bord droit de la barre fixe
    let progressionProposition = 100 - (nbMotsProposes / nbItemsVictoire * 100);
    let progressionScore = 100 - (scoreEnCours / nbItemsVictoire * 100);
    // Application de la progression au style des barres en %
    // Math.min et Math.max permettent de s'assurer que la barre de progression est toujours entre 0 et 100%
    barreNbProposition.style.right = Math.max(0, Math.min(100, progressionProposition)) + "%";
    barreScore.style.right = Math.max(0, Math.min(100, progressionScore)) + "%";
}

/**
 * Cette fonction permet d'afficher une touche ou un mot dans la zone de modèle
 * @param {string} motAAfficher : la proposition à recopier
 * */
function afficherProposition(motAAfficher) {
    let zoneProposition = document.querySelector(".zoneProposition");
    zoneProposition.innerText = motAAfficher;
}

/**
 * Cette fonction permet de choisir la proposition à recopier en fonction de si le jeu est fini ou pas dans la version 
 * où le nombre de propositions à valider est défini
 * @param {number} nbTours : nb de mots ayant été proposés
 * @param {array[string]} listeProp : le tableau contenant les touches ou mots à recopier
 * @param {number} nbAlea : nombre aléatoire correspondant à la position dans la liste du mot proposé
 * @param {number} nbItemsVictoire : nombre défini de propositions à valider
 */
function proposerMotProchainItems(nbTours, listeProp, nbAlea, nbItemsVictoire) {
    if (nbTours < nbItemsVictoire) {
        afficherProposition(listeProp[nbAlea]); //on affiche un nouveau mot
    } else { //si on a atteind le nombre de bonnes réponses :
        afficherProposition("Objectif atteint!"); //on indique la fin du jeu
    }
}

/**
 * Cette fonction permet de choisir la proposition à recopier en fonction de si le jeu est fini ou pas dans la version 
 * où le temps imparti est défini
 * @param {number} tempsIntermediaire : nb de secondes écoulées lors de la validation d'un mot
 * @param {array[string]} listeProp : le tableau contenant les touches ou mots à recopier
 * @param {number} nbAlea : nombre aléatoire correspondant à la position dans la liste du mot proposé
 * @param {number} tempsImparti : nombre défini de secondes après lesquelles le jeu s'arrête
 */
function proposerMotProchainMinute(tempsIntermediaire, listeProp, nbAlea, tempsImparti) {
    if (tempsIntermediaire < tempsImparti) {
        afficherProposition(listeProp[nbAlea]); //on affiche un nouveau mot
    } else { //on a dépassé le temps imparti:
        afficherProposition("Le temps est écoulé"); //on indique la fin du jeu
    }
}

/**
 * Cette fonction affiche le temps total mis par l'utilisateur pour taper les propositions correctes
 * @param {number} totalTimeInSeconds : le temps total en secondes
 */
function afficherTempsTotal(totalTimeInSeconds) {
    let spanTemps = document.querySelector(".zoneTemps span");
    spanTemps.innerText = `Temps : ${totalTimeInSeconds} s`;
}

/**
 * Cette fonction met à jour l'affichage du chronomètre toutes les secondes
 * @param {Date} time :
 */
function mettreAJourChrono(time) {
    let currentTime = new Date();
    let elapsedTime = currentTime - time; // Temps écoulé en millisecondes
    let elapsedTimeInSeconds = Math.floor(elapsedTime / 1000); // Convertir en secondes
    afficherTempsTotal(elapsedTimeInSeconds); // Afficher le temps écoulé
    return elapsedTimeInSeconds;
}

/**
 * Cette fonction permet de rassembler dans un objet javascript les propriétés d'une partie
 * @param {string} nomJoueur : le nom du joueur
 * @param {number} tempsFinal : le temps en secondes mis pour finir la partie
 * @param {string} nomListeProp : nom désignant la liste utilisée pour la partie (touches ou mots)
 * @param {string} optionChrono : nom désignant l'option de jeu choisie (nb de bonnes réponses ou tps imparti)
 * @param {number} scoreEnCours : le nombre de bonnes réponses à la fin de la partie
 * @param {number} compteur : le nombre de tours = propositions faites pour gagner la partie 
 * on ajoute dans l'array créé une date afin de pouvoir représenter l'évolution des résultats d'un joueur dans le temps
 * @returns {array} objet JS contenant les propriétés de la partie
 */
function creerDernierResultat(nomJoueur, tempsFinal, nomListeProp, optionChrono, scoreEnCours, compteur) {
    let dernierResultat = {
        nom: nomJoueur,
        temps: tempsFinal,
        nomListeProposition: nomListeProp,
        optionChronometrage: optionChrono,
        score: scoreEnCours,
        compteur: compteur,
        date: new Date().toISOString().split("T")[0] // Format YYYY-MM-DD
    }
    return dernierResultat;
}

/**
 * Cette fonction permet d'ajouter le résultat de la dernière partie dans le localStorage
 * @param {array} dernierResultat : objet JS contenant les caractéristiques d'une partie
 * @returns {array} les résultats actualisés
 */
function enregistrerResultat(dernierResultat) {
    let resultats = JSON.parse(localStorage.getItem("resultats")) || []; // Récupérer les résultats existants ou initialiser un tableau vide
    resultats.push(dernierResultat); // Ajouter le nouveau résultat
    localStorage.setItem("resultats", JSON.stringify(resultats)); // Sauvegarder dans le localStorage (max ~5Mo)
    return resultats;
}

/**
 * Cette fonction permet de créer un tableau des meilleurs résultats
 * @param {array} resultatsAClasser : array contenant tous les résultats déjà filtrés pour une liste et une option de chronométrage
 * @param {string} choixChrono : nom désignant l'option de jeu choisie (nb de bonnes réponses ou tps imparti). 
 * Le tableau affiché est différent selon l'option choisie
 * @returns tableau : un élément HTML contenant le tableau à afficher
 */
function actualiserClassement(resultatsAClasser, choixChrono) {
    let tableau = document.createElement("table");
    if (choixChrono === "chronometreMinute") {
        tableau.innerHTML = `<tr>
<th>🥇</th>
<th>Nom</th>
<th>Score</th>
<th>Total</th>
</tr>`;

        // Ajouter les lignes du tableau
        resultatsAClasser.forEach((resultat, index) => {
            let ligne = document.createElement('tr');
            ligne.innerHTML = `
        <td>${index + 1}</td>
        <td>${resultat.nom}</td>
        <td>${resultat.score}</td>
        <td>${resultat.compteur}</td>
    `;
            tableau.appendChild(ligne);
        })
        return tableau;
    } else { //choixChronometrage === "chronometreItems"
        tableau.innerHTML = `<tr>
<th>🥇</th>
<th>Nom</th>
<th>⏱️</th>
<th>Total</th>
</tr>`;

        // Ajouter les lignes du tableau
        resultatsAClasser.forEach((resultat, index) => {
            let ligne = document.createElement('tr');
            ligne.innerHTML = `
        <td>${index + 1}</td>
        <td>${resultat.nom}</td>
        <td>${resultat.temps}</td>
        <td>${resultat.compteur}</td>
    `;
            tableau.appendChild(ligne);
        })
        return tableau;
    }
}

/**
 * Cette fonction réalise un premier filtre des résultats en fonction des options de jeu de départ
 * @param {array} resultatsData : objet JS contenant tous les résultats stockés dans le localStorage
 * @param {string} choixListeCaracteres : chaîne de caractères caractérisant la liste utilisée
 * @param {string} choixChrono : chaîne de caractères correspondant à l'option de chronométrage choisie
 * @returns {array} : un objet JS contenant seulement les résultats concernés par les choix de départ
 */
function filtrerSelonOptions(resultatsData, choixListeCaracteres, choixChrono) {
    let resultatsFiltres = resultatsData.filter(resultat =>
        resultat.nomListeProposition === choixListeCaracteres &&
        resultat.optionChronometrage === choixChrono);
    return resultatsFiltres;
}

/**
 * Cette fonction permet de filtrer les nb meilleurs résultats correspondant à une option de liste et une option de chronométrage.
 * Le nombre nb est indiqué dans les paramètres de départ
 * @param {array} resultatsData : objet JS contenant l'ensemble des résultats
 * @param {string} choixListeCaracteres : chaîne de caractères caractérisant la liste utilisée
 * @param {string} choixChrono : chaîne de caractères correspondant à l'option de chronométrage choisie
 * @param {number} affichageMaxTableauScore : indique le nombre de lignes max dans le tableau des meilleurs scores
 * @returns {array} : un objet JS contenant les 10 meilleurs résultats classés
 */
function filtrerMeilleursResultats(resultatsData, choixListeCaracteres, choixChrono, affichageMaxTableauScore) {
    let resultatsFiltres = filtrerSelonOptions(resultatsData, choixListeCaracteres, choixChrono);
    // Trier les résultats (meilleur score d'abord, puis ratio score/compteur, puis temps)
    resultatsFiltres.sort((a, b) => {
        // D'abord par score décroissant
        if (b.score !== a.score)
            return b.score - a.score;
        // Puis par ratio score/compteur décroissant
        if ((b.score / b.compteur) !== (a.score / a.compteur))
            return (b.score / b.compteur) - (a.score / a.compteur);
        // Enfin par temps croissant
        return a.temps - b.temps;
    });
    resultatsFiltres = resultatsFiltres.slice(0, affichageMaxTableauScore); // Limiter aux 10 meilleurs
    return resultatsFiltres;
}

/**
 * Fonction pour afficher le classement les meilleurs résultats. Ce tableau est actualisé à chaque nouvelle fin de partie 
 * ou à chaque changement sur les boutons radio. les résultats sont filtrés pour créer 4 tableaux différents 
 * en fonction des boutons radio sélectionnés
 * @param {array} resultatsDataFiltres : objet JS contenant les meilleurs résultats après choix de la liste et du chronométrage
 * @param {string} choixChrono : nom désignant l'option de jeu choisie (nb de bonnes réponses ou tps imparti)
 */
function afficherClassement(resultatsDataFiltres, choixChrono) {
    let classement = document.getElementById("tableauClassement");
    classement.innerText = "";
    tableau = actualiserClassement(resultatsDataFiltres, choixChrono);
    classement.appendChild(tableau);
}

/**
 * cette fonction déclenche l'affichage d'une fenêtre popup pour féliciter le joueur lorsque son résultat est dans les 10 meilleurs
 * @param {array} dernierResultat : objet JS rassemblant les caractéristiques de la dernière partie
 * @param {array} resultatsDataFiltres : objet JS contenant les 10 meilleurs résultats après choix de la liste et du chronométrage
 */
function feliciterClassement(dernierResultat, resultatsDataFiltres) {
    if (resultatsDataFiltres.includes(dernierResultat)) {
        afficherPopup(".popupEntreeClassement");
    }
}

/**
 * Cette fonction permet d'afficher l'évolution du score d'un joueur en fonction du temps et des options choisies
 * @param {string} nomJoueur : le nom du joueur utilisé comme filtre
 * @param {string} choixListeCaracteres : chaîne de caractères caractérisant la liste utilisée
 * @param {string} choixChrono : chaîne de caractères correspondant à l'option de chronométrage choisie
 */
function construireProgression(nomJoueur, choixListeCaracteres, choixChrono) {
    let resultats = JSON.parse(localStorage.getItem("resultats")) || [];
    let resultatsFiltres = filtrerSelonOptions(resultats, choixListeCaracteres, choixChrono);
    resultatsFiltres = resultatsFiltres.filter(resultat => resultat.nom === nomJoueur); //récupération des résultats du joueur filtrés
    let dataScores;
    if (choixChrono === "chronometreMinute") {
        dataScores = resultatsFiltres.map(resultat => resultat.score);
    } else { //choixChronometrage === "chronometreItems"
        dataScores = resultatsFiltres.map(resultat => resultat.temps);
    }
    let dataDates = resultatsFiltres.map(resultat => resultat.date);
    const dataProgression = {
        labels: dataDates,
        datasets: [{
            label: nomJoueur,
            data: dataScores,
            fill: false,
            borderColor: "#2596BE",
            backgroundColor: "#2596BE",
            tension: 0.1
        }]
    };
    // Objet de configuration final
    const configProgression = {
        type: "line",
        data: dataProgression,
        options: {
            scales: {
                y: {
                    title: {
                        display: true,
                        text: choixChrono === "chronometreMinute" ? "Score" : "Temps (s)"
                    }
                }
            }
        }
    };
    // Vérifier si un graphique existe déjà et le détruire
    const existingChart = Chart.getChart("graphiqueProgression");
    if (existingChart) {
        existingChart.destroy();
    }
    // Rendu du graphique dans l'élément canvas
    new Chart(
        document.querySelector("#graphiqueProgression"),
        configProgression,
    );
}

/**
 * Cette fonction permet d'actualiser les affichages visuels (tableau des scores et graphique de progression)
 * @param {string} nomJoueur : le nom du joueur de la partie
 * @param {array} resultatsData : objet JS contenant l'ensemble des résultats de toutes les parties
 * @param {string} choixListeCaracteres : chaîne de caractères caractérisant la liste utilisée
 * @param {string} choixChrono : chaîne de caractères correspondant à l'option de chronométrage choisie
 * @param {number} maxLignesTableau : nombre max de résultats affichés dans le tableau des meilleurs scores
 * @returns {array} : objet JS contenant les résultats filtrés selon les options de départ
 */
function actualiserLesVisuels(nomJoueur, resultatsData, choixListeCaracteres, choixChrono, maxLignesTableau) {
    let resultatsFiltres = filtrerMeilleursResultats(resultatsData, choixListeCaracteres, choixChrono, maxLignesTableau);
    afficherClassement(resultatsFiltres, choixChrono);
    construireProgression(nomJoueur, choixListeCaracteres, choixChrono);
    return resultatsFiltres;
}

/**
 * Cette fonction permet de rassembler en une fonction les différentes actions à réaliser à la fin d'une partie:
 * enregistrer le résultat, mettre le tableau et le graphique à jour, activer/désactiver les boutons
 * @param {array} DictButton : dictionnaire contenant tous les boutons activables
 * @param {string} nomJoueur : le nom du joueur de la partie
 * @param {number} tempsFinal : temps en secondes réalisé pour finir la partie
 * @param {string} choixListe : chaîne de caractères caractérisant la liste utilisée
 * @param {string} choixChronometrage : chaîne de caractères correspondant à l'option de chronométrage choisie 
 * @param {number} scoreEnCours : score final de la partie
 * @param {number} compteur : nombre de tours effectués pour terminer la partie
 * @param {number} maxLignesTableau : nombre max de résultats affichés dans le tableau des meilleurs scores
 * @returns {array} : DictButton mis à jour
 */
function terminerUnePartie(DictButton, nomJoueur, tempsFinal, choixListe, choixChronometrage, scoreEnCours, compteur, maxLignesTableau) {
    DictButton = passerBtnModeChoix(DictButton);
    let dernierePartie = creerDernierResultat(nomJoueur, tempsFinal, choixListe, choixChronometrage, scoreEnCours, compteur);
    resultats = enregistrerResultat(dernierePartie);
    resultatsFiltres = actualiserLesVisuels(nomJoueur, resultats, choixListe, choixChronometrage, maxLignesTableau);
    feliciterClassement(dernierePartie, resultatsFiltres);
    return DictButton
}

/**
 * Cette fonction construit et affiche l'email. 
 * @param {string} nomJoueur : le nom du joueur
 * @param {string} adresseEmail : l'email de la personne avec qui il veut partager son score
 * @param {string} scoreEnCours : le score. 
 */
function afficherEmail(nomJoueur, adresseEmail, scoreEnCours) {
    let mailto = `mailto:${adresseEmail}?subject=Partage de mon score TypeRacer&body=Salut, je suis ${nomJoueur} et je viens de réaliser le score de ${scoreEnCours} sur le site de TypeRacer ! 😎`;
    location.href = mailto;
}

/**
 * Cette fonction vérifie que le contenu d'un champ est au bon format, ici qu'il contient au moins deux caractères. 
 * @param {string} nomATester 
 * @throws {Error}
 */
function validerNom(nomATester) {
    if (nomATester.length < 2) {
        throw new Error(`le nom ${nomATester} est trop court`);
    }
}

/**
 * Cette fonction vérifie que le contenu d'un champ est au bon format, ici que c'est une adresse mail valide. 
 * @param {string} emailATester
 * @throws {Error}
 */
function validerEmail(emailATester) {
    let regex = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+");
    if (regex.test(emailATester) === false) { //si l'email ne passe pas le test, une erreur est lancée
        throw new Error("Ceci n'est pas un format d'email valide");
    }
}

/**
 * Cette fonction permet d'afficher un message expliquant le champ incorrect en bas de la fenêtre pop-up.
 * Si le span existe déjà, il est réutilisé afin qu'un seul message ne s'affiche
 * @param {string} messageErreur 
 */
function afficherMessageErreur(messageErreur, popupParent) {
    let spanErreur = document.getElementById(`spanErreur${popupParent}`);
    if (!spanErreur) { // si le span n'existe pas, on le crée, sinon on change juste son contenu interne

        let popup = document.querySelector(popupParent); //récupération de l'élément parent
        spanErreur = document.createElement("span"); //création du span dans lequel s'affichera le message
        spanErreur.id = `spanErreur${popupParent}`; //identification du span pour pouvoir le réutiliser si plusieurs essais erronés s'enchaînent
        popup.appendChild(spanErreur); //ajout du span à la fin de l'élément parent
    }
    spanErreur.innerText = messageErreur; // dans tous les cas, on change le contenu du message
}

/**
 * Cette fonction permet de gérer l'envoi d'un email avec les champs de formulaire correctement remplis 
 * à partir de la pop-up de partage
 * @param {string} scoreEnvoiEmail : format de score indiquant le nb de bonnes réponses sur le nb de propositions
 */
function gererFormulaire(scoreEnvoiEmail) {
    //récupération des données du formulaire
    let nomPartage = document.getElementById("nom");
    let email = document.getElementById("email");
    //envoi de l'email si les champs vérifient les conditions de remplissage
    try {
        validerNom(nomPartage.value);
        validerEmail(email.value);
        afficherEmail(nomPartage.value, email.value, scoreEnvoiEmail);
        afficherMessageErreur("", ".popupBackground .popup"); // s'il n'y a pas d'erreur, on efface l'éventuel message précédent
    }
    // affichage d'un message personnalisé en cas de détection d'une erreur
    catch (error) {
        afficherMessageErreur(error.message, ".popupBackground .popup");
    }
}

/**
 * Cette fonction permet de modifier automatiquement le nom du formulaire de partage lorsqu'on modifie le nom du joueur.
 * ceci permet une meilleure UX
 * @param {string} ide : nom de la propriété id de l'élément dont on souhaite modifier l'affichage
 * @param {string} nomModifie : nouveau nom du joueur
 */
function modifierAutomatiquementNom(ide, nomModifie) {
    const champNomPartage = document.getElementById(ide);
    if (champNomPartage) {
        champNomPartage.value = nomModifie;
        champNomPartage.placeholder = ""; // Supprimer le placeholder
    }
}

/**
 * Cette fonction permet d'indiquer dès le début du jeu le dernier joueur ayant fini une partie pour une meilleure UX
 * @param {array} resultatsData : objet JS contenant l'ensemble des résultats enregistrés dans le localStorage
 * @returns {string} : le nom du dernier joueur ayant fini une partie ou "joueur" par défaut
 */
function recupererJoueurActif(resultatsData) {
    // Vérifier si le tableau n'est pas vide
    if (resultatsData.length === 0) {
        return "Joueur"; // Valeur par défaut
    }
    // Récupérer le dernier résultat (index = length - 1) et retourner le nom du joueur ou "Joueur" si non défini
    let nomJoueur = resultatsData[resultatsData.length - 1].nom;
    // Affichage du dernier nom ayant jouer une partie
    let modificationJoueur = document.getElementById("btnModifierJoueur");
    modificationJoueur.innerHTML = `<abbr title="Changer de joueur">${nomJoueur}</abbr>`;
    modifierAutomatiquementNom("nom", nomJoueur);
    return nomJoueur;
}

/**
 * Cette fonction lance le jeu. 
 * L'utilisateur choisit entre "touches" et "mots", puis entre "1 minute" et "10 items" et commence
 */
function lancerJeu() {
    // Initialisations : les popups ne s'affichent pas au départ
    initAddEventListenerPopup(".zoneJoueur button", ".popupNomDuJoueur", ".popupEntreeClassement");
    initAddEventListenerPopup(".zonePartage button", ".popupBackground", ".popupEntreeClassement");
    initAddEventListenerPopup(".zoneClassement button", ".popupClassement", ".popupEntreeClassement");
    initAddEventListenerPopup(".zoneVoirClassement button", ".popupClassement", ".popupEntreeClassement");
    initAddEventListenerPopup(".zoneProgression button", ".popupProgression", ".popupEntreeClassement");
    let resultats = JSON.parse(localStorage.getItem('resultats')) || [];
    let nbMaxTableauScore = 10; //le tableau d'affichage des meilleurs scores contient 10 lignes maximum
    let nom = recupererJoueurActif(resultats);
    let score = 0;
    let i = 0; //compteur pour avancer dans la liste de mots
    let nombreAleatoire = 0;
    let nbItemsMax = 10;
    let inputEcriture = document.getElementById("inputEcriture");
    let listeProposition = listeTouches; //la liste par défaut est celle des touches
    let nomListeProposition = "touches";
    let optionChronometrage = "chronometreMinute";
    let listeBtnRadioSource = document.querySelectorAll(".optionSource input");
    let listeBtnRadioChrono = document.querySelectorAll(".optionChrono input");
    let btnValiderOptions = document.getElementById("btnValiderOptions");
    let btnModifierJoueur = document.getElementById("btnModifierJoueur");
    let btnClassement = document.getElementById("btnClassement");
    let btnProgression = document.getElementById("btnProgression");
    let btnShare = document.getElementById("btnShare");
    let DictZonesActives = { //objet comprenant les boutons cliquables et les zones de saisie
        listeBtnRadioSource,
        listeBtnRadioChrono,
        btnValiderOptions,
        inputEcriture,
        btnModifierJoueur,
        btnClassement,
        btnProgression,
        btnShare,
    };
    let startTime; // Variable pour stocker l'heure de début
    let chronoInterval = 0; // Variable pour stocker l'intervalle du chronomètre
    let limitedTime = 60; //Variable pour stocker le temps en secondes que dure le mode "1 minute" (60 secondes logiquement)
    let endTime = 0;
    let formPartage = document.getElementById("formPartage");
    inputEcriture.disabled = true; //on désactive la zone de saisie au départ
    resultatsFiltres = actualiserLesVisuels(nom, resultats, nomListeProposition, optionChronometrage, nbMaxTableauScore);
    afficherProposition("⭐"); //affichage premier mot

    //Gestion de l'évènement Change sur les boutons radio Source
    //Chaque clic entraîne une mise à jour du tableau des meilleurs scores et du graphique de progression du joueur
    for (let index = 0; index < listeBtnRadioSource.length; index++) {
        listeBtnRadioSource[index].addEventListener("change", (event) => {
            if (event.target.value === "1") {
                listeProposition = listeTouches;
                nomListeProposition = "touches";
            } else {
                listeProposition = listeMots;
                nomListeProposition = "mots";
            }
            resultatsFiltres = actualiserLesVisuels(nom, resultats, nomListeProposition, optionChronometrage, nbMaxTableauScore);
        })
    }

    //Gestion de l'évènement Change sur les boutons radio Chrono
    //Chaque clic entraîne une mise à jour du tableau des meilleurs scores et du graphique de progression du joueur
    for (let index = 0; index < listeBtnRadioChrono.length; index++) {
        listeBtnRadioChrono[index].addEventListener("change", (event) => {
            if (event.target.value === "1") {
                optionChronometrage = "chronometreMinute";
            } else {
                optionChronometrage = "chronometreItems";
            }
            resultatsFiltres = actualiserLesVisuels(nom, resultats, nomListeProposition, optionChronometrage, nbMaxTableauScore);
        })
    }

    //Gestion de l'évènement Clic sur le bouton commencer
    btnValiderOptions.addEventListener("click", () => {//lorsqu'on valide les options: le jeu commence
        DictZonesActives = passerBtnModeJeu(DictZonesActives);
        score = 0;
        i = 0;
        afficherResultat(score, i); //Mise à jour de l'affichage du score
        afficherBarreScore(score, i, (nbItemsMax + i - score));
        afficherTempsTotal(0);
        nombreAleatoire = creerNombreAleatoire(listeProposition.length);
        afficherProposition(listeProposition[nombreAleatoire]); //on affiche la 1e proposition
        startTime = new Date(); // Enregistrer l'heure de début
        chronoInterval = setInterval(() => mettreAJourChrono(startTime), 1000); // Démarrer le chronomètre, affichage des secondes
    })

    //Gestion de l'évènement "Entrée" sur l'élément inputEcriture
    inputEcriture.addEventListener("keydown", (Event) => {
        if (Event.key === "Enter") { //à chaque pression du bonton "Entrée":
            if (optionChronometrage === "chronometreItems") {
                score = validerAugmentationScore(score, nombreAleatoire, listeProposition, inputEcriture); //mise à jour du score
                i++; //le compteur avance
                afficherResultat(score, i); //Mise à jour de l'affichage du score
                afficherBarreScore(score, i, (nbItemsMax + i - score)); //Actualisation de la barre de score
                inputEcriture.value = ""; //on remet à blanc la zone de texte
                nombreAleatoire = creerNombreAleatoire(listeProposition.length);
                proposerMotProchainItems(score, listeProposition, nombreAleatoire, nbItemsMax);
                if (score === nbItemsMax) {
                    clearInterval(chronoInterval); // Arrêter le chronomètre
                    endTime = mettreAJourChrono(startTime);
                    DictZonesActives = terminerUnePartie(DictZonesActives, nom, endTime, nomListeProposition, optionChronometrage, score, i, nbMaxTableauScore);
                }
            } else { //optionChronometrage === "chronometreMinute"
                score = validerAugmentationScore(score, nombreAleatoire, listeProposition, inputEcriture); //mise à jour du score
                i++; //le compteur avance
                afficherResultat(score, i); //Mise à jour de l'affichage du score
                afficherBarreScore(score, i, i); //Actualisation de la barre de score
                inputEcriture.value = ""; //on remet à blanc la zone de texte
                nombreAleatoire = creerNombreAleatoire(listeProposition.length);
                endTime = mettreAJourChrono(startTime);
                proposerMotProchainMinute(endTime, listeProposition, nombreAleatoire, limitedTime);
                if (endTime >= limitedTime) {
                    clearInterval(chronoInterval); // Arrêter le chronomètre
                    DictZonesActives = terminerUnePartie(DictZonesActives, nom, endTime, nomListeProposition, optionChronometrage, score, i, nbMaxTableauScore);
                }
            }
        }
    })

    //Gestion de l'évènement submit sur le bouton de partage
    formPartage.addEventListener("submit", (Event) => {
        Event.preventDefault();
        // Récupérer le nom du dernier joueur pour une meilleure UX
        let scoreEmail = `${score} / ${i}`;
        gererFormulaire(scoreEmail);
    })

    // Gestion de l'événement click sur le bouton de modification du joueur
    btnModifierJoueur.addEventListener("click", (event) => {
        event.preventDefault();
        // Récupérer les noms des joueurs depuis le localStorage
        let nomsDesJoueurs = JSON.parse(localStorage.getItem("nomsDesJoueurs")) || [];
        // Récupérer la popup
        const popupNomDuJoueur = document.querySelector(".popupNomDuJoueur .popup");
        popupNomDuJoueur.innerHTML = ""; // Efface le contenu existant
        // Créer le formulaire
        const formJoueur = document.createElement("form");
        formJoueur.innerHTML = `
        <div>🙋‍♂️ Entre ton nom</div>
        <input type="text" list="names" id="name" name="name" autocomplete="off">
        <datalist id="names"></datalist>
        <button type="submit">Valider</button>
    `;

        // Ajouter les options de noms existants
        const datalist = formJoueur.querySelector("#names");
        nomsDesJoueurs.forEach(joueur => {
            const option = document.createElement("option");
            option.value = joueur;
            datalist.appendChild(option);
        });

        // Ajouter le formulaire à la popup
        popupNomDuJoueur.appendChild(formJoueur);

        // Gestion de la soumission du formulaire
        formJoueur.addEventListener("submit", (e) => {
            e.preventDefault();
            const nomSelectionne = formJoueur.querySelector("#name").value.trim(); //retrait des potentiels espaces
            try {
                validerNom(nomSelectionne);
                afficherMessageErreur("", ".popupNomDuJoueur .popup"); // s'il n'y a pas d'erreur, on efface l'éventuel message précédent
                // Mettre à jour le nom du joueur dans le bouton
                const spanNomJoueur = document.querySelector("#btnModifierJoueur");
                spanNomJoueur.innerHTML = `<abbr title="Changer de joueur">${nomSelectionne}</abbr>`;
                // Mettre à jour le localStorage si nécessaire : ajout du nom à la liste s'il n'est pas déjà dedans
                if (!nomsDesJoueurs.includes(nomSelectionne)) {
                    nomsDesJoueurs.push(nomSelectionne);
                    localStorage.setItem("nomsDesJoueurs", JSON.stringify(nomsDesJoueurs));
                }
                nom = nomSelectionne; //actualisation du nom du joueur pour l'enregistrement des résultats
                construireProgression(nom, nomListeProposition, optionChronometrage); //actualisation des graphiques avec le nouveau joueur
                cacherPopup(".popupNomDuJoueur");
            } catch (error) { // affichage d'un message personnalisé en cas de détection d'une erreur
                afficherMessageErreur(error.message, ".popupNomDuJoueur .popup");
            }
            modifierAutomatiquementNom("nom", nomSelectionne);
            //modifierAutomatiquementNom("nomClassement", nomSelectionne);
        });
    });

    // Gestion de l'événement click sur le bouton de réinitialisation des données
    // On demande une confirmation à l'utilisateur car un clic par inadvertance pourrait avoir de grosses conséquences
    btnSuppressionDonnees.addEventListener("click", (event) => {
        event.preventDefault();
        btnSuppressionDonnees.disabled = true;
        let divReinitialisation = document.querySelector(".zoneReinitialisation");
        let zoneConfirmation = document.createElement("div");
        zoneConfirmation.innerHTML = `
        <p style="text-align: center;">😱 Suppression totale des données ?<p>
        <div style="text-align: center;">
        <button id="confirmationSuppression">Oui</button>
        <button id="annulationSuppression">Non</button>
        </div>
        `;
        divReinitialisation.appendChild(zoneConfirmation);

        //Gestion annulation de la réinitialisation
        const annulationSuppression = document.getElementById("annulationSuppression");
        annulationSuppression.addEventListener("click", (e) => {
            e.preventDefault();
            divReinitialisation.removeChild(zoneConfirmation);
            btnSuppressionDonnees.disabled = false;
        })

        //Gestion confirmation de la suppression des données
        const confirmationSuppression = document.getElementById("confirmationSuppression");
        confirmationSuppression.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.clear();
            resultats = JSON.parse(localStorage.getItem('resultats')) || [];
            nom = recupererJoueurActif(resultats);
            resultatsFiltres = actualiserLesVisuels(nom, resultats, nomListeProposition, optionChronometrage, nbMaxTableauScore);
            zoneConfirmation.innerHTML = `<p style="text-align: center">Données supprimées</p>`
            setTimeout(() => {
                divReinitialisation.removeChild(zoneConfirmation);
                btnSuppressionDonnees.disabled = false;
            }, 2000); //la mention "Données supprimées" disparaît après 2s

        })

    })

}
