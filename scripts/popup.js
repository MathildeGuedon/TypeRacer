/*********************************************************************************
 * 
 * Ce fichier contient toutes les fonctions nécessaires à l'affichage et à la 
 * fermeture de la popup de partage. 
 * 
 *********************************************************************************/


/**
 * Cette fonction affiche la popup pour partager son score. 
 */
function afficherPopup(zonePopup) {
    let popupBackground = document.querySelector(zonePopup);
    // La popup est masquée par défaut (display:none), ajouter la classe "active"
    // va changer son display et la rendre visible. 
    popupBackground.classList.add("active");
}

/**
 * Cette fonction cache la popup pour partager son score. 
 */
function cacherPopup(zonePopup) {
    let popupBackground = document.querySelector(zonePopup);
    // La popup est masquée par défaut (display:none), supprimer la classe "active"
    // va rétablir cet affichage par défaut. 
    popupBackground.classList.remove("active");
}


/**
 * Cette fonction initialise les écouteurs d'événements qui concernent 
 * l'affichage de la popup. 
 */
function initAddEventListenerPopup(btnPopup, zonePopup, PopupAFermer) {
    // On écoute le click sur le bouton "partager" ou autre
    btnPartage = document.querySelector(btnPopup);
    let popupBackground = document.querySelector(zonePopup);
    btnPartage.addEventListener("click", () => {
        // Quand on a cliqué sur le bouton partager, on affiche la popup
        cacherPopup(PopupAFermer);
        afficherPopup(zonePopup);
    })

    // On écoute le click sur la div "popupBackground" ou autre arrière-plan
    popupBackground.addEventListener("click", (event) => {
        // Si on a cliqué précisément sur la popupBackground 
        // (qui prend tout l'écran en presque transparent,
        // et pas un autre élément qui se trouve dedans)
        if (event.target === popupBackground) {
            // Alors on cache la popup
            cacherPopup(zonePopup);
        }
    })
}