export function validatePhoneNumber(mobile) {

    if (!mobile) return 'Le numéro de téléphone est manquant'

    // Remove spaces, dashes, dots, and parentheses for validation
    const cleanedPhone = mobile.replace(/[\s\-().]/g, '')

    // Check if it contains only digits
    if (!/^\d+$/.test(cleanedPhone)) {
        return 'Le numéro de téléphone ne doit contenir que des chiffres'
    }

    if (cleanedPhone.length !== 10) {
        return 'Le numéro de téléphone doit contenir 10 chiffres'
    }

    if (
        !cleanedPhone.startsWith('06') &&
        !cleanedPhone.startsWith('07')
    ) {
        return 'Le numéro mobile doit commencer par 06 ou 07'
    }

    return null
}

export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@][^\s@]+$/
    return emailRegex.test(email)
}


export function msisdn2mobile(msisdn) {
    let msisdnAsStr = ''+msisdn;
    if(msisdnAsStr.length>2) return "0"+msisdnAsStr.substring(2);
    else return msisdnAsStr;
}

export function mobile2msisdn(mobile) {
    // Remove spaces, dashes, dots, and parentheses for validation
    const cleanedPhone = mobile.replace(/[\s\-().]/g, '')
    if (cleanedPhone.length !== 10)
    {
        console.log("Le numéro mobile "+mobile+" n'a pas 10 chiffres")
        return Number(mobile)
    }

    return +("33"+cleanedPhone.substring(1));

}

export function isoToLocalDate(iso){
    return iso.substring(8, 10)+'/'+iso.substring(5, 7)+'/'+iso.substring(0, 4)
}


export function localeToIsoDate(locale){
    return locale.substring(6, 10)+'-'+locale.substring(3, 5)+'-'+locale.substring(0,2)
}


export function formatDate(event,targetObj,key){
    // 1. Si l'utilisateur appuie sur Retour arrière (Backspace), on ne fait rien
    // pour lui permettre d'effacer le slash normalement.
    if (event.key === 'Backspace') {
        return;
    }

    // On récupère la valeur actuelle
    const input = event.target.value
    // et on enlève tout ce qui n'est pas un chiffre
    let value = input.replace(/\D/g, '');
    let formattedInput = '';

    // On reconstruit la chaîne avec les slashs aux bons endroits
    if (value.length > 0) {
        formattedInput += value.substring(0, 2);
    }
    if (value.length >= 2) {
        formattedInput += '/' + value.substring(2, 4);
    }
    if (value.length >= 4) {
        formattedInput += '/' + value.substring(4, 8);
    }

    // 4. On met à jour la variable réactive
    targetObj[key] = formattedInput;
};

export function capitalizeFirstLetter(val) {
    if( !val) return val;
    val = val.trim()
    let capitalized =  String(val).charAt(0).toUpperCase() + String(val).slice(1);
    return capitalized
}
