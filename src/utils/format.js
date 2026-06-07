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