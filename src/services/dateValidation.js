// src/services/dateValidation.js

/**
 * Calcule la date minimale autorisée (5 ans en arrière depuis aujourd'hui)
 * @returns {string} Date au format YYYY-MM-DD
 */
export const getMinBirthDate = () => {
  const today = new Date();
  const minDate = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());
  return minDate.toISOString().split('T')[0];
};

/**
 * Calcule la date maximale autorisée (par exemple, 100 ans en arrière)
 * @returns {string} Date au format YYYY-MM-DD
 */
export const getMaxBirthDate = () => {
  const today = new Date();
  const maxDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
  return maxDate.toISOString().split('T')[0];
};

/**
 * Valide si une date de naissance est valide
 * @param {string} dateStr - Date au format YYYY-MM-DD
 * @returns {object} {isValid: boolean, message: string}
 */
export const validateBirthDate = (dateStr) => {
  if (!dateStr) {
    return {
      isValid: false,
      message: "La date de naissance est requise"
    };
  }

  const selectedDate = new Date(dateStr);
  const today = new Date();
  const minDate = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());
  const maxDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());

  // Vérifier si la date est dans le futur
  if (selectedDate > today) {
    return {
      isValid: false,
      message: "La date de naissance ne peut pas être dans le futur"
    };
  }

  // Vérifier si la personne a au moins 5 ans
  if (selectedDate > minDate) {
    return {
      isValid: false,
      message: "L'utilisateur doit avoir au moins 5 ans"
    };
  }

  // Vérifier si la date n'est pas trop ancienne (plus de 100 ans)
  if (selectedDate < maxDate) {
    return {
      isValid: false,
      message: "La date de naissance semble incorrecte (plus de 100 ans)"
    };
  }

  return {
    isValid: true,
    message: ""
  };
};

/**
 * Calcule l'âge à partir d'une date de naissance
 * @param {string} dateStr - Date au format YYYY-MM-DD
 * @returns {number} Âge en années
 */
export const calculateAge = (dateStr) => {
  const birthDate = new Date(dateStr);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};