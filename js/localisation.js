var localisationUtils = {

    defaultLanguage: 'en',

    translations: {
       'en': {
           'Horse Power': 'Horse Power'
        }
    },

    getBrowserLanguage: function (trimRegional) {
        if (trimRegional) {
           // TODO just get the main language
        }
        return navigator.language;
    },

};
